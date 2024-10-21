import { useState } from "react"
import { TipoAtributosProdutoNuvem } from "@/database/models-mongoose/produtosNuvem/IProdutosNuvem"

interface IProdutoNuvemDescricao_ID  {
    idProduto: number,
    descricao: string
}

export function useProdutosNuvem() {
    const [listaProdutosNuvem, setListaProdutosNuvem] = useState<Array<TipoAtributosProdutoNuvem>>([])
    const [loadingProdutosNuvem, setLoadingProdutosNuvem] = useState<boolean>(false)
    const [aguardandoApi, setAguardandoApi] = useState(false)

    const [listaProdutosDescricaoId, setListaProdutosDescricaoId] = useState<Array<IProdutoNuvemDescricao_ID>>([])

    async function atualizaListaProdutosNuvem() {
        try {
            setLoadingProdutosNuvem(true)

            const apiResponse = await fetch(`/api/nuvem/produtos`, {method: "GET"})
            
            // Erro ---------------------------
            if (!apiResponse.ok) {
                const erroApi = (await apiResponse.json() as any).error
                
                throw new Error(erroApi)
            }
            // --------------------------------

            const lista: Array<TipoAtributosProdutoNuvem> = await apiResponse.json()

            setListaProdutosNuvem(lista)
        } finally {
            setLoadingProdutosNuvem(false)
        }
    }

    async function atualizaListaDescricaoId() {
        try {
            setLoadingProdutosNuvem(true)

            const apiResponse = await fetch(`/api/nuvem/produtos/lista-ids`, {method: "GET"})
            
            // Erro ---------------------------
            if (!apiResponse.ok) {
                const erroApi = (await apiResponse.json() as any).error
                
                throw new Error(erroApi)
            }
            // --------------------------------

            const lista: Array<IProdutoNuvemDescricao_ID> = await apiResponse.json()

            setListaProdutosDescricaoId(lista)
        } finally {
            setLoadingProdutosNuvem(false)
        }
    }
    
    async function criaNovoProdutoNuvem(dadosProdutoNuvem: TipoAtributosProdutoNuvem) {
        
        try {
            setAguardandoApi(true)

            const apiResponse = await fetch(`/api/nuvem/produtos`, {method: "POST", body: JSON.stringify(dadosProdutoNuvem)})
            
            // Erro ---------------------------
            if (!apiResponse.ok) {
                const erroApi = (await apiResponse.json() as any).error
                
                throw new Error(erroApi)
            }
            // --------------------------------

            
            const novoProdutoNuvem: TipoAtributosProdutoNuvem = await apiResponse.json()

            return novoProdutoNuvem
        } finally {
            setAguardandoApi(false)
        }

    }

    async function deletaProdutoNuvem(idProdutoNuvem: string) {

        try {
            setAguardandoApi(true)

            const apiResponse = await fetch(`/api/nuvem/produtos/${idProdutoNuvem}`, {method: "DELETE"})

            // Erro ---------------------------
            if (!apiResponse.ok) {
                const erroApi = (await apiResponse.json() as any).error
                
                throw new Error(erroApi)
            }
            // --------------------------------

            const produtoFilaDeletado: TipoAtributosProdutoNuvem = await apiResponse.json()

            return produtoFilaDeletado
        } finally {
            setAguardandoApi(false)
        }

    }

    return {
        listaProdutosNuvem,
        listaProdutosDescricaoId,
        atualizaListaProdutosNuvem,
        atualizaListaDescricaoId,
        criaNovoProdutoNuvem,
        deletaProdutoNuvem,
        loadingProdutosNuvem,
        aguardandoApiProdutosNuvem: aguardandoApi
    }
}