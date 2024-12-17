import { AtributosProduto } from "@/database/models/produtos/Produto";
import { produtos } from "@/database/models";
import { itensVenda } from "@/database/models";
import { Op, fn, where, col } from "sequelize";
import { Where } from "sequelize/lib/utils";
import fs from "fs"

import { FilaAtualizacaoProdutos } from "@/database/models-mongoose/filaAtualizacaoProdutos";
import { GenericModelCRUD } from "@/database/classes/GenericModelCRUD";
import { IFilaAtualizacaoProdutos } from "@/database/models-mongoose/filaAtualizacaoProdutos/IFilaAtualizacaoProdutos";

const filaAtualizacaoProdutos = new GenericModelCRUD(FilaAtualizacaoProdutos)

export {
    listaProdutos,
    listaCompletaProdutosSomenteIdeDescricao,
    listaProdutosSemVenda,
    listaTodosProdutos,
    localizaProdutoPorCodigo,
    alteraProduto,
    aplicaAlteracoesPendentesNuvem
}

function geraListaTermosPesquisa(termoPesquisa?: string): Array<Where> {
    if (termoPesquisa) {
        const listaPalavras = termoPesquisa.split(" ")
        const listaCondicoesPalavras: Array<any> = []

        for (const texto of listaPalavras) (
            listaCondicoesPalavras.push( where( fn("upper", col("descricao")), Op.like, fn("upper", `%${texto}%`) ) )
        )

        return [...listaCondicoesPalavras]
    } else {
        return []
    }
}

async function listaProdutos(termoPesquisa?: string) {

    try {
        const pesquisaId = (termoPesquisa && !isNaN(Number(termoPesquisa))) ? { [Op.like]: Number(termoPesquisa) } : null
        
        if (!termoPesquisa) {
            termoPesquisa = ""
        }

        const listaProdutos = await produtos.findAll({
            where: {
                [Op.or]: [
                    // where( fn("upper", col("descricao")), Op.like, fn("upper", `%${termoPesquisa}%`) ),
                    {
                        [Op.and]: geraListaTermosPesquisa(termoPesquisa)
                    },
                    where( fn("upper", col("referencia")), Op.like, fn("upper", `%${termoPesquisa}%`) ),
                    where( fn("upper", col("obs")), Op.like, fn("upper", `%${termoPesquisa}%`) ),
                    where( fn("upper", col("barras")), Op.like, fn("upper", `%${termoPesquisa}%`) ),
                    where( fn("upper", col("id")), Op.like, pesquisaId ),
                ],
                status: 1
            }
        })

        return listaProdutos
    } catch (error: any) {
        throw new Error(`Falha na busca de produtos: ${error.message}`)
    }

}

async function listaCompletaProdutosSomenteIdeDescricao() {
    try {
        const listaProdutos = await produtos.findAll()

        const listaProdutosSomenteId = listaProdutos.map(item => {
            return {
                idProduto: item.id,
                descricao: item.descricao
            }
        })

        return listaProdutosSomenteId
    } catch (error: any) {
        throw new Error(`Falha ao gerar lista completa de Ids de produtos: ${error.message}`)
    }
}

async function listaProdutosSemVenda() {
    const listaProdutos = await produtos.findAll({
        where: {
            status: 1
        }
    })

    let produtosSemVenda = ""

    for (const produto of listaProdutos) {
        const possuiVenda = await itensVenda.findOne({
            where: {
                idProduto: produto.id
            }
        })

        produtosSemVenda += `${produto.id};${produto.barras};${produto.descricao};${(possuiVenda) ? "SIM" : "NAO"}\n`
    }

    fs.writeFileSync("arquivo.csv", produtosSemVenda)

    return listaProdutos
}

async function listaTodosProdutos() {
    try {
        const listaTodosProdutos = await produtos.findAll()

        return listaTodosProdutos
    } catch (error: any) {
        throw new Error(`Falha na busca de todos os produtos: ${error.message}`)
    }   
}

async function localizaProdutoPorCodigo(idProduto: number) {
    try {
        const produto = await produtos.findByPk(idProduto)

        if (!produto) {
            throw new Error("Produto inexistente!")
        }

        return produto
    } catch (error: any) {
        throw new Error(`Falha ao localizar produto: ${error.message}`)
    }
}

async function alteraProduto(idProduto: number, dadosProduto: AtributosProduto) {
    try {
        const {id, ...dadosAlterados} = dadosProduto

        const produto = await produtos.findByPk(idProduto)

        if (!produto) {
            throw new Error("Produto inexistente!")
        }

        produto.set(dadosAlterados)
        await produto.save()

        return produto
    } catch (error: any) {
        throw new Error(`Falha ao alterar dados do produto: ${error.message}`)
    }
}

async function aplicaAlteracoesPendentesNuvem() {
    try {
        const filaAtualizacoes = await filaAtualizacaoProdutos.findDocuments()

        // Se não houver produtos com alterações pendentes, finalizar a função
        if (filaAtualizacoes.length < 1) return
        // ---------------------------------------
        
        for (const produtoFila of filaAtualizacoes) {
            const produtoLocal = await produtos.findByPk(produtoFila.idProduto)
            if (!produtoLocal) continue

            const atributosAlterados = (produtoFila.toJSON() as IFilaAtualizacaoProdutos).atributosAlterados
            
            produtoLocal.set(atributosAlterados)
            await produtoLocal.save()

            // Remove produto da fila de alterações
            await produtoFila.deleteOne()

            console.log(`O produto cód. ${produtoLocal.id} recebeu alterações vindas da nuvem. Atributos alterados: ${JSON.stringify(atributosAlterados)}`)
        }
    } catch (error: any) {
        throw new Error(`Falha aplicar alterações da fila nos produtos do BD local: ${error.message}`)
    }
}