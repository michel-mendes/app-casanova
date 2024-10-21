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

    async function localizaProdutoPorCodigo(idProduto: number) {
        try {
            setAguardandoApi(true)

            const apiResponse = await fetch(`/api/produtos/${idProduto}`)

            // Erro ---------------------------
            if (!apiResponse.ok) {
                const erroApi = await (apiResponse.json() as any).error

                throw new Error(erroApi)
            }
            // --------------------------------

            const produtoEncontrado: AtributosProduto = (await apiResponse.json())

            return produtoEncontrado
        } finally {
            setAguardandoApi(false)
        }
    }

    async function alteraProduto(idProduto: number, dadosProduto: AtributosProduto) {
        try {
            setAguardandoApi(true)

            const apiResponse = await fetch(`/api/produtos/${idProduto}`, { method: "PUT", body: JSON.stringify(dadosProduto) })

            // Erro ---------------------------
            if (!apiResponse.ok) {
                const erroApi = await (apiResponse.json() as any).error

                throw new Error(erroApi)
            }
            // --------------------------------

            const produtoAlterado: AtributosProduto = (await apiResponse.json())

            return produtoAlterado
        } finally {
            setAguardandoApi(false)
        }
    }

    // Utilizado apenas para testes
    async function aplicaAlteracoesFila() {
        try {
            setAguardandoApi(true)

            const apiResponse = await fetch(`/api/produtos/aplica-alteracoes-fila`)

            // Erro ---------------------------
            if (!apiResponse.ok) {
                const erroApi = await (apiResponse.json() as any).error

                throw new Error(erroApi)
            }
            // --------------------------------

            alert("Alterações aplicadas com sucesso!")
        } finally {
            setAguardandoApi(false)
        }
    }
    // -----------------------------------

    return {
        listaProdutos,
        atualizaListaProdutos,
        localizaProdutoPorCodigo,
        alteraProduto,
        aplicaAlteracoesFila,
        carregandoProdutos,
        aguardandoApiProdutos: aguardandoApi,
        erroApi
    }
}