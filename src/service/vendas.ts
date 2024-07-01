import { vendas } from "@/database/models"
import { IVenda } from "@/app/interfaces"
import { ItemVenda } from "@/database/models/itensVenda/ItemVenda"
import { Op } from "sequelize"
import moment from "moment"

export async function listarVendas(startDate: string, endDate: string) {
    const start = moment(startDate).utc(true).startOf("day")
    const end = moment(endDate).utc(true).endOf("day")

    const listaVendas = await vendas.findAll({
        where: {
            dataEmissao: {
                [Op.gte]: start,
                [Op.lte]: end
            },
            cancelado: 0
        },
        include: {
            model: ItemVenda,
            attributes: [
                "id",
                "idVenda",
                "idProduto",
                "qtde",
                "unidade",
                "vlrUnitario",
                "vlrTotal",
                "descricao",
                "vlrCustoDia",
                "margemLucro"
            ],
            as: "itensVenda"
        },
        order: [["dataEmissao", "ASC"]]
    })

    return listaVendas
}

export async function alteraVenda(id: number, dadosVenda: IVenda) {
    const venda = await vendas.findOne({ where: {id} })

    if (venda) {
        venda.set(dadosVenda)

        await venda.save()
    }

    return venda
}

export async function buscaVendaPorId(idVenda: number) {
    const venda = await vendas.findByPk(idVenda, {
        include: {
            model: ItemVenda,
            attributes: [
                "id",
                "idVenda",
                "idProduto",
                "qtde",
                "unidade",
                "vlrUnitario",
                "vlrTotal",
                "descricao",
                "vlrCustoDia",
                "margemLucro"
            ],
            as: "itensVenda"
        }
    })

    return venda
}