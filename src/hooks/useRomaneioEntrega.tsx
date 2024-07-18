import { useState } from "react"
import { IRomaneioEntrega } from "@/database/models-mongoose/romaneioEntrega/IRomaneioEntrega"

export function useRomaneioEntrega() {
    const [listaRomaneios, setListaRomaneios] = useState<Array<IRomaneioEntrega>>([])
    const [loadingRomaneios, setLoadingRomaneios] = useState<boolean>(false)
    const [aguardandoApi, setAguardandoApi] = useState(false)

    async function atualizaListaRomaneios() {
        
        try {
            setLoadingRomaneios(true)

            const novaLista: Array<IRomaneioEntrega> =  await (await fetch(`/api/romaneioEntrega`)).json()

            setListaRomaneios([...novaLista])
        } catch (error) {
            alert(error)
        } finally {
            setLoadingRomaneios(false)
        }

    }

    async function criaNovoRomaneio(dadosRomaneio: IRomaneioEntrega) {
        
        try {
            setAguardandoApi(true)

            const apiResponse = await fetch(`/api/romaneioEntrega`, {method: "POST", body: JSON.stringify(dadosRomaneio)})
            
            // Erro ---------------------------
            if (!apiResponse.ok) {
                const erroApi = await (apiResponse.json() as any).error
                
                throw new Error(erroApi)
            }
            // --------------------------------

            
            const novoRomaneio: IRomaneioEntrega = await apiResponse.json()

            // Atualiza lista de romaneios
            setListaRomaneios(listaAtual => {
                
                const novaLista = [...listaAtual, novoRomaneio]
                return novaLista

            })

            return novoRomaneio
        } finally {
            setAguardandoApi(false)
        }

    }

    async function deletaRomaneio(idRomaneio: string) {

        try {
            setAguardandoApi(true)

            const apiResponse = await fetch(`/api/romaneioEntrega/${idRomaneio}`, {method: "DELETE"})

            // Erro ---------------------------
            if (!apiResponse.ok) {
                const erroApi = await (apiResponse.json() as any).error
                
                throw new Error(erroApi)
            }
            // --------------------------------

            const romaneioDeletado: IRomaneioEntrega = await apiResponse.json()

            // Atualiza lista de romaneios
            setListaRomaneios(listaAtual => {
                
                const novaLista = listaAtual.filter(romaneio => romaneio.id !== romaneioDeletado.id)
                return novaLista

            })

            return romaneioDeletado
        } finally {
            setAguardandoApi(false)
        }

    }

    async function exibeRomaneio(id: string) {
        
        try {
            setAguardandoApi(true)

            const apiResponse = await fetch(`/api/romaneioEntrega/${id}`, {method: "GET"})

            // Erro ---------------------------
            if (!apiResponse.ok) {
                const erroApi = await (apiResponse.json() as any).error
                
                throw new Error(erroApi)
            }
            // --------------------------------

            const romaneio: IRomaneioEntrega = await apiResponse.json()

            return romaneio
        } finally {
            setAguardandoApi(false)
        }

    }

    async function imprimeRomaneioNoServidor(id: string) {
        
        try {
            setAguardandoApi(true)

            const apiResponse = await fetch(`/api/imprime-romaneio-servidor/${id}`)

            // Erro ---------------------------
            if (!apiResponse.ok) {
                const erroApi = await (apiResponse.json() as any).error
                
                throw new Error(erroApi)
            }
            // --------------------------------

            const mensagemSucessoImpressao = await apiResponse.text()

            return mensagemSucessoImpressao
        } finally {
            setAguardandoApi(false)
        }

    }

    return {
        listaRomaneios,
        atualizaListaRomaneios,
        criaNovoRomaneio,
        deletaRomaneio,
        exibeRomaneio,
        imprimeRomaneioNoServidor,
        loadingRomaneios,
        aguardandoApiRomaneio: aguardandoApi
    }
}