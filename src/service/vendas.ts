import { vendas } from "@/database/models"
import { IVenda } from "@/app/interfaces"
import { ItemVenda } from "@/database/models/itensVenda/ItemVenda"
import { buscaVendaNuvem, novaVendaNuvem } from "./nuvem/vendas"
import { Op } from "sequelize"
import moment from "moment"
import { AtributosVendaNuvem } from "@/database/models-mongoose/venda/IVendaNuvem"

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

export async function exportaTodasVendasParaNuvem() {
    try {
        const totalVendas = await vendas.count()
        const vendasPorPagina = 100
        const totalPaginas = Math.ceil(totalVendas / vendasPorPagina)


        for (let paginaAtual = 1; paginaAtual <= totalPaginas; paginaAtual++) {

            console.log(`Buscando vendas da página ${paginaAtual}/${totalPaginas}`)

            const listaVendas = await vendas.findAll({
                limit: vendasPorPagina,
                offset: (paginaAtual - 1) * vendasPorPagina,
                include: {
                    model: ItemVenda,
                    as: "itensVenda"
                }
            })

            for (let i = 0; i < vendasPorPagina; i++) {
                const dadosVendaNuvem: AtributosVendaNuvem = listaVendas[i].toJSON()

                try {
                    await novaVendaNuvem({...dadosVendaNuvem, idVenda: listaVendas[i].id})
                    console.log(`Venda ${i + 1} cadastrada com sucesso`)
                } catch (error: any) {
                    console.log(`Erro durande exportação de todas as vendas: ${error.message}`)
                }

            }
        }
    } catch (error: any) {
        throw new Error(`Falha ao exportar todas as vendas para nuvem: ${error.message}`)
    }
}

export async function exportaVendasRecentes() {
    try {
        let quantVendasExportadas = 0
        const totalVendas = await vendas.count()
        const quantVendasRecentes = 200

        const lista200VendasRecentes = await vendas.findAll({
            limit: quantVendasRecentes,
            offset: totalVendas - quantVendasRecentes,
            include: {
                model: ItemVenda,
                as: "itensVenda"
            }
        })

        for (const venda of lista200VendasRecentes) {
            const vendaJaExisteServidorNuvem = await buscaVendaNuvem(venda.id)

            if (vendaJaExisteServidorNuvem) continue
            // ----------------------------------------------------------------


            const dadosVenda: AtributosVendaNuvem = venda.toJSON()

            try {
                await novaVendaNuvem({...dadosVenda, idVenda: venda.id})
                quantVendasExportadas++
            } catch (error: any) {
                console.log(`${new Date(Date.now()).toLocaleTimeString()} - Erro durande exportação de vendas recentes: ${error.message}`)
            }
        }

        if (quantVendasExportadas > 0) {
            console.log(`${new Date(Date.now()).toLocaleTimeString()} - Sincronização de vendas com servidor nuvem: ${quantVendasExportadas} vendas exportadas`)
        }

        return "OK"
    } catch (error: any) {
        throw new Error(`Falha ao exportar vendas recentes para nuvem: ${error.message}`)
    }
}