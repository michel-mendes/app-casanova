import { produtos } from "@/database/models";
import { itensVenda } from "@/database/models";
import { Op } from "sequelize";
import moment from "moment";
import fs from "fs"

export {
    listaProdutosSemVenda
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