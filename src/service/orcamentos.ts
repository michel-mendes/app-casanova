import { Where } from "sequelize/lib/utils"
import { where, fn, col, Op } from "sequelize"

import orcamentos from "@/database/models/orcamentos"
import { Funcionario } from "@/database/models/funcionarios/Funcionario"

import moment from "moment"
import { Cliente } from "@/database/models/clientes/Cliente"
import { ItemOrcamento } from "@/database/models/itensOrcamento/ItemOrcamento"
import { Produto } from "@/database/models/produtos/Produto"

export async function listarOrcamentos(startDate: string, endDate: string, searchTerm: string) {
    const start = moment(startDate).utc(true).startOf("day")
    const end = moment(endDate).utc(true).endOf("day")

    const listaOrcamentos = await orcamentos.findAll({
        include: [
            {
                model: Funcionario,
                as: "operador"
            },
            {
                model: Cliente,
                as: "cliente"
            }
        ],
        where: {
            [Op.and]: [geraListaTermosPesquisa(searchTerm)],
            dataEmissao: {
                [Op.gte]: start,
                [Op.lte]: end
            },
            cancelado: 0
        },
        order: [["dataEmissao", "ASC"]]
    })

    return listaOrcamentos
}

export async function localizaOrcamentoPorId(idOrcamento: number) {
    try {
        const orcamento = await orcamentos.findByPk(idOrcamento, {
            include: [
                {
                    model: ItemOrcamento,
                    as: "itensOrcamento",
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

        if (!orcamento) {
            throw new Error("Orçamento inexistente")
        }

        return orcamento
    } catch (error: any) {
        throw new Error(`Falha ao localizar orçamento: ${error.message}`)
    }
}


// Helpers
function geraListaTermosPesquisa(termoPesquisa?: string): Array<Where> {
    if (termoPesquisa) {
        const listaPalavras = termoPesquisa.split(" ")
        const listaCondicoesPalavras: Array<any> = []

        for (const texto of listaPalavras) (
            listaCondicoesPalavras.push(where(fn("upper", col("Orcamentos.clienteNome")), Op.like, fn("upper", `%${texto}%`)))
        )

        return [...listaCondicoesPalavras]
    } else {
        return []
    }
}