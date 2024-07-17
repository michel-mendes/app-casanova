import { useState } from "react"
import { IRomaneioEntrega } from "@/database/models-mongoose/romaneioEntrega/IRomaneioEntrega"

export function useRomaneioEntrega() {
    const [listaRomaneios, setListaRomaneios] = useState<Array<IRomaneioEntrega>>([])
    const [loadingRomaneios, setLoadingRomaneios] = useState<boolean>(false)
    const [aguardandoApi, setAguardandoApi] = useState(false)

    async function atualizaListaRomaneios() {
        setLoadingRomaneios(true)

        try {
            const novaLista: Array<IRomaneioEntrega> =  await (await fetch(`/api/romaneioEntrega`)).json()

            setListaRomaneios([...novaLista])
        } catch (error) {
            alert(error)
        }

        setLoadingRomaneios(false)
    }

    async function criaNovoRomaneio(dadosRomaneio: IRomaneioEntrega) {
        setAguardandoApi(true)

        try {
            const apiResponse = await fetch(`/api/romaneioEntrega`, {method: "POST", body: JSON.stringify(dadosRomaneio)})
            
            // Erro
            if (apiResponse.status !== 200) {
                // alert(`${await apiResponse.text()}`)
                return
            }
            
            const novoRomaneio: IRomaneioEntrega = await apiResponse.json()
            // alert("Novo romaneio cadastrado com sucesso!")

            setListaRomaneios(listaAtual => {
                const novaLista = [...listaAtual, novoRomaneio]
                return novaLista
            })

            return novoRomaneio
        } catch (error) {
            alert(`Erro:\n\n-> ${error}`)
        }

        setAguardandoApi(false)
    }

    async function exibeRomaneio(id: string) {
        setAguardandoApi(true)

        try {
            const apiResponse = await fetch(`/api/romaneioEntrega?id=${id}`, {method: "GET"})

            // Erro
            if (apiResponse.status !== 200) {
                // alert(`${await apiResponse.text()}`)
                return
            }

            const romaneio: IRomaneioEntrega = await apiResponse.json()

            return romaneio
        } catch (error) {
            alert(`Erro:\n\n-> ${error}`)
        }

        setAguardandoApi(false)
    }

    async function imprimeRomaneioNoServidor(id: string) {
        setAguardandoApi(true)

        try {
            const apiRes = await fetch(`/api/imprime-romaneio-servidor/${id}`)

            if (!apiRes.ok) {
                const erro: any = await apiRes.json()
                throw erro
            }

            const sucesso = await apiRes.text()
            return sucesso
        } catch (error) {
            alert(`Erro: \n\n-> ${error}`)
        }

        setAguardandoApi(false)
    }

    return {
        listaRomaneios,
        atualizaListaRomaneios,
        criaNovoRomaneio,
        exibeRomaneio,
        imprimeRomaneioNoServidor,
        loadingRomaneios,
        aguardandoApiRomaneio: aguardandoApi
    }
}