import { Op } from "sequelize"
import { pagar } from "@/database/models"
import { Fornecedor } from "@/database/models/fornecedores/Fornecedor"
import { ContasPagarTotalSemanas } from "./types"
import moment from "moment"


export async function listaContasPagarSemanaAtual() {
    const startDate = moment(Date.now()).startOf("week").toISOString(true).slice(0, 10) + " 00:00:00"
    const endDate = moment(Date.now()).endOf("week").toISOString(true).slice(0, 10) + " 00:00:00"

    const listaContasPagar = await pagar.findAll({
        where: {
            quitado: 0,
            dtVencimento: {
                [Op.gte]: startDate,
                [Op.lte]: endDate
            }
        },
        include: {
            model: Fornecedor,
            attributes: ["razao"],
            as: "dadosFornecedor"
        },
        order: [["dtVencimento", "ASC"]]
    })

    return listaContasPagar
}

export async function listaContasPagarGeralSemanal() {
    
    const listaContasPagar = await pagar.findAll({
        where: {
            quitado: 0,
        },
        include: {
            model: Fornecedor,
            attributes: ["razao"],
            as: "dadosFornecedor"
        },
        order: [["dtVencimento", "ASC"]]
    })


    let listaGeralSemanal: ContasPagarTotalSemanas = []
    let numSemana = 1
    let totalGeral = 0
    let dataAtual = moment(Date.now()).utc(false)
    const dataMaxima = moment(listaContasPagar[listaContasPagar.length - 1].dtVencimento).utc(false)


    while (dataAtual <= dataMaxima) {
        const inicioSemana = moment(dataAtual).utc(false).startOf("week").startOf("day")
        const fimSemana = moment(dataAtual).utc(false).endOf("week").endOf("day")
        let totalSemana = 0

        for (const contaPagar of listaContasPagar) {
            const vencimento = moment(contaPagar.dtVencimento).utc(false).startOf("day")

            if (vencimento >= inicioSemana && vencimento <= fimSemana) {
                totalSemana += (contaPagar.vlrParcela || 0)
            }
        }

        listaGeralSemanal.push({ inicioSemana, fimSemana, totalSemana })
        dataAtual = dataAtual.endOf("week").add(1, "day")
        numSemana++

        totalGeral += totalSemana
    }

    return listaGeralSemanal
}