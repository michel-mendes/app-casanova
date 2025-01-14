import { PagarAttributes } from "@/database/models/pagar/Pagar"
import { ContasPagarTotalSemanas } from "@/service/types"
import { useState } from "react"
import moment from "moment"

function useContasPagar() {

    const [listaContasPagar, setListaContasPagar] = useState<Array<PagarAttributes>>([])

    const [erroApiContasPagar, setErroApiContasPagar] = useState<string | null>(null)
    const [carregandoContasPagar, setCarregandoContasPagar] = useState(false)


    async function getListaContasPagar(startDate: string, endDate: string, search: string) {

        const apiResponse = await fetch(`/api/pagar?start=${startDate}&end=${endDate}&search=${search}`)

        // Erro ---------------------------
        if (!apiResponse.ok) {
            const erroApi: string = (await apiResponse.json() as any).error

            new Error(erroApi)
        }
        // --------------------------------

        const listaPagar: Array<PagarAttributes> = await apiResponse.json()

        return listaPagar
    }

    async function atualizaListaContasPagar(startDate: string, endDate: string, search: string) {
        try {
            setCarregandoContasPagar(true)

            const listaPagar = await getListaContasPagar(startDate, endDate, search)

            setListaContasPagar(listaPagar)
        } catch (error: any) {
            setErroApiContasPagar(error.message)
            setCarregandoContasPagar(false)
        }
    }

    async function listaContasPagarSemanaAtual() {
        try {
            setCarregandoContasPagar(true)

            // const listaPagarTotal = await getListaContasPagar()
            // const listaSemanaAtual = listaPagarTotal.filter(contaPagar => {
            //     const startDate = moment(Date.now()).startOf("week").subtract(1, "day").startOf("day")
            //     const endDate = moment(Date.now()).endOf("week").subtract(1, "day").endOf("day")

            //     return (moment(contaPagar.dtVencimento).isBetween(startDate, endDate))
            // })

            // return listaSemanaAtual
        } catch (error: any) {
            setErroApiContasPagar(error.message)
            setCarregandoContasPagar(false)

            return []
        }
    }

    return { listaContasPagar, atualizaListaContasPagar, listaContasPagarSemanaAtual, erroApiContasPagar, carregandoContasPagar }

    // async function listaTotalSemanal() {
    //     try {
    //         const lista: ContasPagarTotalSemanas = await (await fetch("/api/contasPagarTotal")).json()
    //         return lista
    //     } catch (error) {
    //         return []
    //     }
    // }

    // async function listaSemanaAtual() {
    //     try {
    //         const lista = await (await fetch("/api/contasPagarSemanaAtual")).json()
    //         return lista
    //     } catch (error) {
    //         return []
    //     }
    // }

    // return { listaTotalSemanal, listaSemanaAtual }
}

export { useContasPagar }