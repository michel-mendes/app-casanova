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
    listaTodosRomaneios, novoRomaneioEntrega, getRomaneio, imprimeRomaneioNoServidor
}

async function listaTodosRomaneios() {
    try {
        await connectDatabaseMongoDB()

        const listaRomaneios: Array<IRomaneioEntrega> = await romaneioEntregaCRUD.findDocuments()

        return listaRomaneios
    } catch (error) {
        return `Erro ao consultar romaneios >> ${error}`
    }
}

async function getRomaneio(idRomaneio: string) {
    try {
        await connectDatabaseMongoDB()

        const romaneio: IRomaneioEntrega = await romaneioEntregaCRUD.findDocumentById(idRomaneio)

        return romaneio

    } catch (error) {
        return `Erro ao consultar romaneio ID "${idRomaneio}" >> ${error}`
    }
}

async function novoRomaneioEntrega(dadosRomaneio: IRomaneioEntrega) {
    try {
        await connectDatabaseMongoDB()

        const entregaPendente = await buscaEntregaPendenteComListaDeRomaneios(dadosRomaneio)
        dadosRomaneio.numeroEntrega = geraNumeroRomaneio(entregaPendente, dadosRomaneio)

        const romaneioCadastrado: IRomaneioEntrega = await romaneioEntregaCRUD.insertDocument(dadosRomaneio)

        // Se o romaneio for cadastrado com sucesso, subtrair os itens entregues no objeto "EntregaPendente"
        await descontaProdutosDaEntrega(romaneioCadastrado, entregaPendente)

        return romaneioCadastrado
    } catch (error) {
        return `Erro ao criar novo romaneio >> ${error}`
    }
}

// helpers
function removeItensZerados(itens: Array<IItemRestante>) {
    const listaSemItensZerados = itens.filter(item => {
        if (item.qtde > 0) return item
    })

    return [...listaSemItensZerados]
}

async function descontaProdutosDaEntrega(romaneioCadastrado: IRomaneioEntrega, entregaPendente: IEntregaPendente | null) {
    if (entregaPendente && romaneioCadastrado) {

        let listaItensRestantesAtualizada = entregaPendente.itensRestantes.map(itemRestante => {

            const itemAtualizado = { ...itemRestante }

            for (const itemEntregue of romaneioCadastrado.itensEntrega) {

                if (itemRestante.idItemVenda == itemEntregue.idItemVenda) {
                    itemAtualizado.qtde -= itemEntregue.qtde
                    entregaPendente.quantidadeEntregue += itemEntregue.qtde
                }

            }

            return itemAtualizado

        })

        // Exclui produtos que foram totalmente entregues
        listaItensRestantesAtualizada = removeItensZerados(listaItensRestantesAtualizada)
        entregaPendente.itensRestantes = [...listaItensRestantesAtualizada]

        // Calcula em porcentagem o progresso da entrega
        const percentualConcluido = Number((Number(entregaPendente.quantidadeEntregue) * 100) / Number(entregaPendente.quantidadeTotalProdutos)).toFixed(0)
        entregaPendente.status = `${percentualConcluido}% entregue`

        // Exclui a entrega pendente se todos os produtos já foram entregues ou apenas salva as alterações caso haja produtos para entregar...
        if (entregaPendente.itensRestantes.length > 0) {
            await entregaPendente.save()
        } else {
            await entregaPendente.deleteOne()
        }

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
            return `Erro ao imprimir:\n${error.message}`
        } finally {
            fs.rmSync(caminhoPdf, {force: true})
        }
        
        return "Impressão OK!"
    } catch (error: any) {
        throw new Error(`Falha ao imprimir romaneio no servidor: ${error.message}`);
    }
}