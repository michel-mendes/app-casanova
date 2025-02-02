import { useState } from "react";
import { IEntregaPendente } from "@/database/models-mongoose/vendaEntregaFutura/IEntregaPendente";

type FiltroStatusEntrega = "todas-entregas" | "somente-finalizadas" | "somente-nao-finalizadas"

export function useEntregasFuturas() {
    const [listaEntregasFuturas, setListaEntregasFuturas] = useState<Array<IEntregaPendente>>([])
    const [loadingEntregasFuturas, setLoadingEntregasFuturas] = useState(false)
    const [aguardandoApi, setAguardandoApi] = useState(false)

    async function atualizaListaDeEntregasFuturas(statusEntrega: FiltroStatusEntrega) {
        
        try {
            setLoadingEntregasFuturas(true)
            
            const novaLista: Array<IEntregaPendente> = await (await fetch(`/api/vendas-entrega-futura?statusEntrega=${statusEntrega}`)).json()

            setListaEntregasFuturas(novaLista)
        } finally {
            setLoadingEntregasFuturas(false)
        }
    }

    async function criaNovaEntregaFutura(dadosEntrega: IEntregaPendente) {
        
        try {
            setAguardandoApi(true)

            const apiResponse = await fetch(`/api/vendas-entrega-futura`, {method: "POST", body: JSON.stringify(dadosEntrega)})
            
            // Erro ---------------------------
            if (!apiResponse.ok) {
                const erroApi = (await (apiResponse.json() as any)).error

                throw new Error(erroApi)
            }
            // --------------------------------
            
            const novaEntregaFutura: IEntregaPendente = await apiResponse.json()

            // Atualiza lista de entregas futuras
            setListaEntregasFuturas(listaAtual => {
                const novaLista = [...listaAtual, novaEntregaFutura]
                return novaLista
            })

            return novaEntregaFutura
        } finally {
            setAguardandoApi(false)
        }
    }

    async function alteraEntregaPendente(idEntrega: string, dados: IEntregaPendente) {
        
        try {
            setAguardandoApi(true)

            const apiResponse = await fetch(`/api/vendas-entrega-futura?id=${idEntrega}`, {method: "PUT", body: JSON.stringify(dados)})

            // Erro ---------------------------
            if (!apiResponse.ok) {
                const erroApi = await (apiResponse.json() as any).error

                throw new Error(erroApi)
            }
            // --------------------------------

            const entregaAlterada: IEntregaPendente = await apiResponse.json()

            setListaEntregasFuturas(listaAtual => {
                const novaLista = listaAtual.map(item => (item.id == entregaAlterada.id) ? entregaAlterada : item)

                return novaLista
            })

            return entregaAlterada
        } finally {
            setAguardandoApi(false)
        }
    }

    async function deletaEntregaPendente(idEntrega: string) {
        
        try {
            setAguardandoApi(true)

            const apiResponse = await fetch(`/api/vendas-entrega-futura/${idEntrega}`, {method: "DELETE"})

            // Erro ---------------------------
            if (!apiResponse.ok) {
                const erroApi = await (apiResponse.json() as any).error

                throw new Error(erroApi)
            }
            // --------------------------------

            const entregaCancelada: IEntregaPendente = await apiResponse.json()

            setListaEntregasFuturas(listaAtual => {
                const novaLista = listaAtual.filter(item => (item.id !== entregaCancelada.id))

                return novaLista
            })

            return entregaCancelada
        } finally {
            setAguardandoApi(false)
        }
    }

    return {
        listaEntregasFuturas,
        setListaEntregasFuturas,
        atualizaListaDeEntregasFuturas,
        criaNovaEntregaFutura,
        alteraEntregaPendente,
        deletaEntregaPendente,
        loadingEntregasFuturas,
        aguardandoApiEntregaFutura: aguardandoApi
    }
}