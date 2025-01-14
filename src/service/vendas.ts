import { Op, fn, where, col } from "sequelize";
import { Where } from "sequelize/lib/utils";

import { vendas } from "@/database/models"
import { Funcionario } from "@/database/models/funcionarios/Funcionario";
import { IVenda } from "@/app/interfaces"
import { ItemVenda } from "@/database/models/itensVenda/ItemVenda"
import { buscaVendaNuvem, novaVendaNuvem } from "./nuvem/vendas"
import moment from "moment"
import { AtributosVendaNuvem } from "@/database/models-mongoose/venda/IVendaNuvem"
import { Produto } from "@/database/models/produtos/Produto";

function geraListaTermosPesquisa(termoPesquisa?: string): Array<Where> {
    if (termoPesquisa) {
        const listaPalavras = termoPesquisa.split(" ")
        const listaCondicoesPalavras: Array<any> = []

        for (const texto of listaPalavras) (
            listaCondicoesPalavras.push(where(fn("upper", col("Venda.nome")), Op.like, fn("upper", `%${texto}%`)))
        )

        return [...listaCondicoesPalavras]
    } else {
        return []
    }
}

export async function listarVendas(startDate: string, endDate: string, searchTerm: string) {
    const start = moment(startDate).utc(true).startOf("day")
    const end = moment(endDate).utc(true).endOf("day")

    const listaVendas = await vendas.findAll({
        include: {
            model: Funcionario,
            attributes: ["nomeOperador"],
            as: "operador"
        },
        where: {
            [Op.and]: [geraListaTermosPesquisa(searchTerm)],
            dataEmissao: {
                [Op.gte]: start,
                [Op.lte]: end
            },
            cancelado: 0
        },
        // where: {
        //     dataEmissao: {
        //         [Op.gte]: start,
        //         [Op.lte]: end
        //     },
        //     cancelado: 0
        // },
        // include: {
        //     model: ItemVenda,
        //     attributes: [
        //         "id",
        //         "idVenda",
        //         "idProduto",
        //         "qtde",
        //         "unidade",
        //         "vlrUnitario",
        //         "vlrTotal",
        //         "descricao",
        //         "vlrCustoDia",
        //         "margemLucro"
        //     ],
        //     as: "itensVenda"
        // },
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
            include: [
                {
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
                    as: "itensVenda",
                    include: [{
                        model: Produto,
                        as: "produto"
                    }]
                },
                {
                    model: Funcionario,
                    attributes: ["nomeOperador"],
                    as: "operador"
                }
            ]
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
                const dadosVendaNuvem = listaVendas[i].toJSON() as AtributosVendaNuvem

                try {
                    await novaVendaNuvem({ ...dadosVendaNuvem, idVenda: listaVendas[i].id })
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


            const dadosVenda = venda.toJSON() as AtributosVendaNuvem

            try {
                await novaVendaNuvem({ ...dadosVenda, idVenda: venda.id })
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