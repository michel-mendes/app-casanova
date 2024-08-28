import { useState } from "react";
import { AtributosProduto } from "@/database/models/produtos/Produto";

export function useProdutos() {
    const [listaProdutos, setListaProdutos] = useState<Array<AtributosProduto>>([])
    const [carregandoProdutos, setCarregandoProdutos] = useState<boolean>(false)
    const [aguardandoApi, setAguardandoApi] = useState(false)

    const [erroApi, setErroApi] = useState<string | null>(null)

    async function atualizaListaProdutos(termoPesquisa?: string) {
        const query = (termoPesquisa) ? `?q=${termoPesquisa}` : ""
        
        try {
            setCarregandoProdutos(true)

            const apiResponse = await fetch(`/api/produtos${query}`)

             // Erro ---------------------------
             if (!apiResponse.ok) {
                const erroApi: string = (await apiResponse.json() as any).error
                
                setErroApi( erroApi )
                return
            }
            // --------------------------------

            const produtos: Array<AtributosProduto> = await apiResponse.json()

            setListaProdutos(produtos)
        } finally {
            setCarregandoProdutos(false)
        }
    }

    return {
        listaProdutos,
        atualizaListaProdutos,
        carregandoProdutos,
        aguardandoApiProdutos: aguardandoApi,
        erroApi
    }
}