import puppeteer from "puppeteer"
import { print } from "pdf-to-printer"
import fs from "fs"

import { connectDatabaseMongoDB } from "@/database/dbConnect-mongoose"
import { GenericModelCRUD } from "@/database/classes/GenericModelCRUD"
import { RomaneioEntrega } from "@/database/models-mongoose/romaneioEntrega"
import { IRomaneioEntrega } from "@/database/models-mongoose/romaneioEntrega/IRomaneioEntrega"
import { EntregaPendente } from "@/database/models-mongoose/vendaEntregaFutura"
import { IEntregaPendente, IItemRestante } from "@/database/models-mongoose/vendaEntregaFutura/IEntregaPendente"

const romaneioEntregaCRUD = new GenericModelCRUD(RomaneioEntrega)
const entregaPendenteCRUD = new GenericModelCRUD(EntregaPendente)

export {
    listaTodosRomaneios, novoRomaneioEntrega, deletaRomaneioEntrega, localizaRomaneioPorId, imprimeRomaneioNoServidor
}

async function listaTodosRomaneios() {
    try {
        await connectDatabaseMongoDB()

        const listaRomaneios: Array<IRomaneioEntrega> = await romaneioEntregaCRUD.findDocuments()

        return listaRomaneios
    } catch (error: any) {
        throw new Error(`Falha ao listar romaneios: ${error.message}`)
    }
}

async function localizaRomaneioPorId(id: string) {
    try {
        await connectDatabaseMongoDB()

        const romaneio: IRomaneioEntrega = await romaneioEntregaCRUD.findDocumentById(id)

        return romaneio

    } catch (error: any) {
        throw new Error(`Falha ao localizar romaneio: ${error.message}`)
    }
}

async function novoRomaneioEntrega(dadosRomaneio: IRomaneioEntrega) {
    try {
        await connectDatabaseMongoDB()

        const entregaPendente = await buscaEntregaPendenteComListaDeRomaneios(dadosRomaneio)
        dadosRomaneio.numeroEntrega = geraNumeroRomaneio(entregaPendente, dadosRomaneio)

        const romaneioCadastrado: IRomaneioEntrega = await romaneioEntregaCRUD.insertDocument(dadosRomaneio)

        // Remove da entrega pendente os produtos que constam no novo romaneio
        await atualizaProdutosDaEntrega(romaneioCadastrado, entregaPendente, "NOVO_ROMANEIO")

        return romaneioCadastrado
    } catch (error: any) {
        throw new Error(`Falha ao criar novo romaneio: ${error.message}`)
    }
}

async function deletaRomaneioEntrega(id: string) {
    try {
        await connectDatabaseMongoDB()
        
        const romaneioDeletado = await romaneioEntregaCRUD.deleteDocument(id)
        const entregaPendente = await entregaPendenteCRUD.findDocumentById(String(romaneioDeletado.idEntregaPendente))

        // Retorna para a entrega pendente os produtos que constam no romaneio cancelado
        await atualizaProdutosDaEntrega(romaneioDeletado, entregaPendente, "ROMANEIO_CANCELADO")
        
        return romaneioDeletado
    } catch (error: any) {
        throw new Error(`Falha ao deletar romaneio: ${error.message}`)
    }
}

async function imprimeRomaneioNoServidor(idRomaneio: string) {
    try {
        const caminhoPdf = `romaneio-${idRomaneio}-${new Date().getTime()}.pdf`
        
        const browser = await puppeteer.launch({ headless: "shell" })
        const paginaRomaneio = await browser.newPage()

        await paginaRomaneio.goto(`http://localhost:1005/imprime-romaneio/${idRomaneio}`, { waitUntil: "networkidle2" })
        await paginaRomaneio.pdf({
            path: caminhoPdf,
            format: "A5",
            printBackground: true
        })

        await browser.close()

        try {
            await print(caminhoPdf, {silent: true, })
        } catch(error: any) {
            throw new Error(error.message)
        } finally {
            fs.rmSync(caminhoPdf, {force: true})
        }
        
        return "Impressão OK!"
    } catch (error: any) {
        throw new Error(`Falha ao imprimir romaneio no servidor: ${error.message}`);
    }
}



// helpers
function removeItensZerados(itens: Array<IItemRestante>) {
    const listaSemItensZerados = itens.filter(item => {
        if (item.qtde > 0) return item
    })

    return [...listaSemItensZerados]
}

async function atualizaProdutosDaEntrega(romaneioEntrega: IRomaneioEntrega, entregaPendente: IEntregaPendente | null, tipoAtualizacao: "NOVO_ROMANEIO" | "ROMANEIO_CANCELADO") {
    if (entregaPendente && romaneioEntrega) {

        // Atualiza produtos restantes descontando as quantidades entregues de acordo com o romaneio
        let listaItensRestantesAtualizada = entregaPendente.itensRestantes.map(itemRestante => {

            const itemAtualizado = { ...itemRestante }

            for (const itemEntregue of romaneioEntrega.itensEntrega) {

                if (itemRestante.idItemVenda == itemEntregue.idItemVenda) {
                    const quantidadeAtualizada = (tipoAtualizacao === "NOVO_ROMANEIO")
                        ? (itemAtualizado.qtde - itemEntregue.qtde)
                        : (itemAtualizado.qtde + itemEntregue.qtde)

                    const totalEntregueAtualizado = (tipoAtualizacao === "NOVO_ROMANEIO")
                        ? (entregaPendente.quantidadeEntregue + itemEntregue.qtde)
                        : (entregaPendente.quantidadeEntregue - itemEntregue.qtde)

                    itemAtualizado.qtde = quantidadeAtualizada
                    entregaPendente.quantidadeEntregue = totalEntregueAtualizado
                }

            }

            return itemAtualizado

        })

        entregaPendente.itensRestantes = [...listaItensRestantesAtualizada]

        // Calcula em porcentagem o progresso da entrega
        const percentualConcluido = Number((Number(entregaPendente.quantidadeEntregue) * 100) / Number(entregaPendente.quantidadeTotalProdutos)).toFixed(0)
        entregaPendente.status = `${percentualConcluido}% entregue`
        
        // Marca entrega finalizada se todos os produtos tiverem sido entregues
        entregaPendente.finalizada = Number(entregaPendente.quantidadeEntregue) == Number(entregaPendente.quantidadeTotalProdutos)

        // Salva entrega pendente
        await entregaPendente.save()

    }
}

async function buscaEntregaPendenteComListaDeRomaneios(dadosRomaneio: IRomaneioEntrega) {
    try {
        const entregaPendente: IEntregaPendente = await entregaPendenteCRUD.findDocumentById(String(dadosRomaneio.idEntregaPendente))
        const listaRomaneios: Array<IRomaneioEntrega> = await romaneioEntregaCRUD.findDocuments({ idEntregaPendente: entregaPendente.id })

        entregaPendente.romaneiosEntrega = listaRomaneios

        return entregaPendente
    } catch (error) {
        return null
    }
}

function geraNumeroRomaneio(entregaPendente: IEntregaPendente | null, dadosRomaneio: IRomaneioEntrega) {
    let totalRomaneios = 0
    let numeroRomaneio = ""

    if (!entregaPendente) {
        numeroRomaneio = `${dadosRomaneio.idVenda}/1`
    } else {
        totalRomaneios = (entregaPendente.romaneiosEntrega) ? entregaPendente.romaneiosEntrega.length + 1 : 1
        numeroRomaneio = `${entregaPendente.idVenda}/${totalRomaneios}`
    }

    return numeroRomaneio
}