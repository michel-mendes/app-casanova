import { useState } from "react";
import { IVenda } from "@/app/interfaces";

export function useVendas() {
    const [listaVendas, setListaVendas] = useState<Array<IVenda>>([])
    const [loadingVendas, setLoadingVendas] = useState<boolean>(false)

    async function atualizaLista(startDate: string, endDate: string) {
        setLoadingVendas(true)
        try {
            const novaLista: Array<IVenda> = await (await fetch(`/api/vendas?start=${startDate}&end=${endDate}`)).json()

            setListaVendas(novaLista)   
        } catch (error) {
            setListaVendas([])
        }
        setLoadingVendas(false)
    }

    async function alteraVenda(id: number, dadosVenda: IVenda) {
        try {
            const venda: IVenda = await (await (fetch(`/api/vendas/${id}`, {method: "PUT", body: JSON.stringify(dadosVenda)}))).json()

            // alert("Venda alterada!!")
        } catch (error) {
            alert("Erro ao alterar venda!")
        }
    }

    async function getVendaById(idVenda: number) {
        try {
            const apiResp = await (fetch(`/api/vendas/${idVenda}`, {method: "GET"}))

            if (apiResp.ok) {
                return ( await apiResp.json() ) as IVenda
            } else {
                return null
            }
        } catch (error) {
            alert(`Não foi possível encontrar a venda nº ${idVenda}`)
            return null
        }
    }

    return {
        listaVendas,
        atualizaLista,
        getVendaById,
        alteraVenda,
        loadingVendas
    }
}