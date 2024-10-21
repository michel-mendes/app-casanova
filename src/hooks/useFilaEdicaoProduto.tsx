import { useState } from "react"
import { IFilaAtualizacaoProdutos } from "@/database/models-mongoose/filaAtualizacaoProdutos/IFilaAtualizacaoProdutos"

export function useFilaEdicaoProdutos() {
    const [listaFilaAtualizacaoProdutos, setListaFilaAtualizacaoProdutos] = useState<Array<IFilaAtualizacaoProdutos>>([])
    const [loadingProdutosFilaEdicao, setLoadingProdutosFilaEdicao] = useState<boolean>(false)
    const [aguardandoApi, setAguardandoApi] = useState(false)

    async function atualizaListaProdutosFilaEdicao() {
        try {
            setLoadingProdutosFilaEdicao(true)

            const apiResponse = await fetch(`/api/fila-atualizacao-produto`, {method: "GET"})
            
            // Erro ---------------------------
            if (!apiResponse.ok) {
                const erroApi = (await apiResponse.json() as any).error
                
                throw new Error(erroApi)
            }
            // --------------------------------

            const lista: Array<IFilaAtualizacaoProdutos> = await apiResponse.json()

            setListaFilaAtualizacaoProdutos(lista)
        } finally {
            setLoadingProdutosFilaEdicao(false)
        }
    }
    
    async function criaNovaFilaAtualizacaoProduto(dadosProdutoFila: IFilaAtualizacaoProdutos) {
        
        try {
            setAguardandoApi(true)

            const apiResponse = await fetch(`/api/fila-atualizacao-produto`, {method: "POST", body: JSON.stringify(dadosProdutoFila)})
            
            // Erro ---------------------------
            if (!apiResponse.ok) {
                const erroApi = (await apiResponse.json() as any).error
                
                throw new Error(erroApi)
            }
            // --------------------------------

            
            const novoProdutoFila: IFilaAtualizacaoProdutos = await apiResponse.json()

            return novoProdutoFila
        } finally {
            setAguardandoApi(false)
        }

    }

    async function deletaFilaAtualizacaoProduto(idProdutoFila: string) {

        try {
            setAguardandoApi(true)

            const apiResponse = await fetch(`/api/fila-atualizacao-produto/${idProdutoFila}`, {method: "DELETE"})

            // Erro ---------------------------
            if (!apiResponse.ok) {
                const erroApi = (await apiResponse.json() as any).error
                
                throw new Error(erroApi)
            }
            // --------------------------------

            const produtoFilaDeletado: IFilaAtualizacaoProdutos = await apiResponse.json()

            return produtoFilaDeletado
        } finally {
            setAguardandoApi(false)
        }

    }

    return {
        listaFilaAtualizacaoProdutos,
        atualizaListaProdutosFilaEdicao,
        criaNovaFilaAtualizacaoProduto,
        deletaFilaAtualizacaoProduto,
        loadingProdutosFilaEdicao,
        aguardandoApiProdutosFilaEdicao: aguardandoApi
    }
}