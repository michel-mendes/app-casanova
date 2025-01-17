import { useState } from "react";

import { OrcamentoAttributes } from "@/database/models/orcamentos/Orcamento";

export function useOrcamentos() {
    const [listaOrcamentos, setListaOrcamentos] = useState<Array<OrcamentoAttributes>>([])
    const [loadingOrcamentos, setLoadingOrcamentos] = useState<boolean>(false)
    const [aguardandoApi, setAguardandoApi] = useState(false)

    async function atualizaLista(startDate: string, endDate: string, search: string) {

        try {
            setLoadingOrcamentos(true)

            const novaLista: Array<OrcamentoAttributes> = await (await fetch(`/api/orcamentos?start=${startDate}&end=${endDate}&search=${search}`)).json()

            setListaOrcamentos(novaLista)
        } catch (error) {
            setListaOrcamentos([])
        } finally {
            setLoadingOrcamentos(false)
        }

    }

    async function localizaOrcamento(idOrcamento: number) {

        setAguardandoApi(true)
        const respostaApi = await (fetch(`/api/orcamentos/${idOrcamento}`, { method: "GET" }))

        if (!respostaApi.ok) {
            setAguardandoApi(false)
            return null
            // return alert((await respostaApi.json() as any).error)
        }

        const orcamento = (await respostaApi.json()) as OrcamentoAttributes

        setAguardandoApi(false)
        return orcamento

    }

    return {
        listaOrcamentos,
        loadingOrcamentos,
        aguardandoApiOrcamentos: aguardandoApi,
        atualizaLista, localizaOrcamento
    }
}