import { useState } from "react"
import { IRomaneioEntrega } from "@/database/models-mongoose/romaneioEntrega/IRomaneioEntrega"
import { sortArrayOfObjects } from "@/app/helpers"

interface IAtualizaListaRomaniosArgs {
    filtraData?: {
        dataInicial: Date;
        dataFinal: Date;
    }
    organiza?: {
        nomeProp: keyof IRomaneioEntrega;
        crescente: boolean
    }
}

export function useRomaneioEntrega() {
    const [listaRomaneios, setListaRomaneios] = useState<Array<IRomaneioEntrega>>([])
    const [loadingRomaneios, setLoadingRomaneios] = useState<boolean>(false)
    const [aguardandoApi, setAguardandoApi] = useState(false)

    async function atualizaListaRomaneios(options?: IAtualizaListaRomaniosArgs) {

        const { organiza, filtraData } = options!
        
        try {
            setLoadingRomaneios(true)

            const query = (filtraData)
                            ? `?start=${new Date(filtraData.dataInicial).toJSON().slice(0, 10)}&end=${new Date(filtraData.dataFinal).toJSON().slice(0, 10)}`
                            : ""

            const novaLista: Array<IRomaneioEntrega> =  await (await fetch(`/api/romaneioEntrega${query}`)).json()

            if (organiza) {
                const listaOrganizada = sortArrayOfObjects<IRomaneioEntrega>(novaLista, organiza.nomeProp, organiza.crescente)

                setListaRomaneios([ ...listaOrganizada ])
            } else {
                setListaRomaneios([ ...novaLista ])
            }

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

    async function imprimeRomaneioNoServidor(romaneio: IRomaneioEntrega) {
        
        try {
            setAguardandoApi(true)

            const romaneioCodificado = encodeURIComponent(JSON.stringify(romaneio))
            const apiResponse = await fetch(`/api/imprime-romaneio-servidor/dados-romaneio/${romaneioCodificado}`)

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