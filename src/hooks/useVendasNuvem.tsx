import { useState } from "react"
import { AtributosVendaNuvem } from "@/database/models-mongoose/venda/IVendaNuvem"

export function useVendasNuvem() {
    const [listaVendasNuvem, setListaVendasNuvem] = useState<Array<AtributosVendaNuvem>>([])
    const [loadingVendasNuvem, setLoadingVendasNuvem] = useState<boolean>(false)
    const [aguardandoApi, setAguardandoApi] = useState(false)

    async function atualizaListaVendasNuvem() {
        try {
            setLoadingVendasNuvem(true)

            const apiResponse = await fetch(`/api/nuvem/vendas`, {method: "GET"})
            
            // Erro ---------------------------
            if (!apiResponse.ok) {
                const erroApi = (await apiResponse.json() as any).error
                
                throw new Error(erroApi)
            }
            // --------------------------------

            const lista: Array<AtributosVendaNuvem> = await apiResponse.json()

            setListaVendasNuvem(lista)
        } finally {
            setLoadingVendasNuvem(false)
        }
    }
    
    async function criaNovaVendaNuvem(dadosVendaNuvem: AtributosVendaNuvem) {
        
        try {
            setAguardandoApi(true)

            const apiResponse = await fetch(`/api/nuvem/vendas`, {method: "POST", body: JSON.stringify(dadosVendaNuvem)})
            
            // Erro ---------------------------
            if (!apiResponse.ok) {
                const erroApi = (await apiResponse.json() as any).error
                
                throw new Error(erroApi)
            }
            // --------------------------------

            
            const novaVendaNuvem: AtributosVendaNuvem = await apiResponse.json()

            return novaVendaNuvem
        } finally {
            setAguardandoApi(false)
        }

    }

    return {
        listaProdutosNuvem: listaVendasNuvem,
        atualizaListaVendasNuvem,
        criaNovaVendaNuvem,
        loadingVendasNuvem,
        aguardandoApiVendasNuvem: aguardandoApi
    }
}