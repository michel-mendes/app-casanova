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
    try {
        const venda = await vendas.findOne({ where: { id } })

        if (!venda) {
            throw new Error("Venda inexistente")
        }

        venda.set(dadosVenda)
        await venda.save()

        return venda
    } catch (error: any) {
        throw new Error(`Falha ao alterar venda: ${error.message}`)
    }
}

export async function localizaVendaPorId(idVenda: number) {
    try {
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

        if (!venda) {
            throw new Error("Venda inexistente")
        }

        return venda
    } catch (error: any) {
        throw new Error(`Falha ao localizar venda: ${error.message}`)
    }
}