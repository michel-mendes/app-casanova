import { useState } from "react";

import { IVenda } from "@/app/interfaces";
import { AtributosVendaNuvem } from "@/database/models-mongoose/venda/IVendaNuvem";

export function useVendas() {
    const [listaVendas, setListaVendas] = useState<Array<IVenda>>([])
    const [loadingVendas, setLoadingVendas] = useState<boolean>(false)
    const [aguardandoApi, setAguardandoApi] = useState(false)

    async function atualizaLista(startDate: string, endDate: string, search: string) {

        try {
            setLoadingVendas(true)

            const novaLista: Array<IVenda> = await (await fetch(`/api/vendas?start=${startDate}&end=${endDate}&search=${search}`)).json()

            setListaVendas(novaLista)
        } catch (error) {
            setListaVendas([])
        } finally {
            setLoadingVendas(false)
        }

    }

    async function alteraVenda(id: number, dadosVenda: IVenda) {

        try {
            setAguardandoApi(true)

            const apiResponse = await fetch(`/api/vendas/${id}`, { method: "PUT", body: JSON.stringify(dadosVenda) })

            // Erro ---------------------------
            if (!apiResponse.ok) {
                const erroApi = await (apiResponse.json() as any).error

                throw new Error(erroApi)
            }
            // --------------------------------

            const vendaAlterada = (await apiResponse.json()) as IVenda

            return vendaAlterada
        } finally {
            setAguardandoApi(false)
        }

    }

    async function localizaVenda(idVenda: number) {

        setAguardandoApi(true)
        const respostaApi = await (fetch(`/api/vendas/${idVenda}`, { method: "GET" }))

        if (!respostaApi.ok) {
            setAguardandoApi(false)
            return alert((await respostaApi.json() as any).error)
        }

        const venda = (await respostaApi.json()) as IVenda

        setAguardandoApi(false)
        return venda

    }

    async function exportaVendaParaNuvem(dadosVenda: AtributosVendaNuvem) {

        try {
            setAguardandoApi(true)

            const apiResponse = await fetch(`/api/nuvem/vendas`, { method: "POST", body: JSON.stringify(dadosVenda) })

            // Erro ---------------------------
            if (!apiResponse.ok) {
                const erroApi = (await apiResponse.json()).error
                
                throw new Error(erroApi)
            }
            // --------------------------------

            const novaVendaNuvem = (await apiResponse.json()) as AtributosVendaNuvem

            return novaVendaNuvem
        } finally {
            setAguardandoApi(false)
        }

    }

    async function exportaTodasParaNuvem() {
        try {
            setAguardandoApi(true)

            const apiResponse = await fetch(`/api/vendas/exporta-todas-para-nuvem`)

            // Erro ---------------------------
            if (!apiResponse.ok) {
                const erroApi = (await apiResponse.json()).error
                
                throw new Error(erroApi)
            }
            // --------------------------------

            const resultadoExportacao = (await apiResponse.text())

            return resultadoExportacao
        } finally {
            setAguardandoApi(false)
        }
    }

    async function exportaVendasRecentes() {
        try {
            setAguardandoApi(true)

            const apiResponse = await fetch(`/api/vendas/exporta-vendas-recentes`)

            // Erro ---------------------------
            if (!apiResponse.ok) {
                const erroApi = (await apiResponse.json()).error
                
                throw new Error(erroApi)
            }
            // --------------------------------

            const resultadoExportacao = (await apiResponse.text())

            return resultadoExportacao
        } finally {
            setAguardandoApi(false)
        }
    }

    return {
        listaVendas,
        atualizaLista,
        localizaVenda,
        alteraVenda,
        exportaVendaParaNuvem,
        exportaTodasParaNuvem,
        exportaVendasRecentes,
        loadingVendas,
        aguardandoApiVendas: aguardandoApi
    }
}