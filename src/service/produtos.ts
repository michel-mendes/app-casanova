import { AtributosProduto } from "@/database/models/produtos/Produto";
import { produtos } from "@/database/models";
import { itensVenda } from "@/database/models";
import { Op, fn, where, col } from "sequelize";
import moment from "moment";
import fs from "fs"

export {
    listaProdutos,
    listaProdutosSemVenda,
    listaTodosProdutos
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
                    where( fn("upper", col("descricao")), Op.like, fn("upper", `%${termoPesquisa}%`) ),
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