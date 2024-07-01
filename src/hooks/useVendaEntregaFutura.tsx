import { useState } from "react";
import { IEntregaPendente } from "@/database/models-mongoose/vendaEntregaFutura/IEntregaPendente";

export function useEntregasFuturas() {
    const [listaEntregasFuturas, setListaEntregasFuturas] = useState<Array<IEntregaPendente>>([])
    const [loadingEntregasFuturas, setLoadingEntregasFuturas] = useState(false)

    async function atualizaListaDeEntregasFuturas() {
        setLoadingEntregasFuturas(true)

        try {
            const novaLista: Array<IEntregaPendente> = await (await fetch(`/api/vendasEntregaFutura`)).json()

            setListaEntregasFuturas(novaLista)
        } catch (error) {
            alert(error)
        }

        setLoadingEntregasFuturas(false)
    }

    async function criaNovaEntregaFutura(vefData: IEntregaPendente) {
        try {
            const apiResponse = await fetch(`/api/vendasEntregaFutura`, {method: "POST", body: JSON.stringify(vefData)})
            let novaEntregaFutura: IEntregaPendente

            if (apiResponse.status !== 200) {
                alert(`${await apiResponse.text()}`)
                return
            }

            novaEntregaFutura = await apiResponse.json()
            alert("Nova entrega futura cadastrada com sucesso!")

            setListaEntregasFuturas(listaAtual => {
                const novaLista = [...listaAtual, novaEntregaFutura]
                return novaLista
            })
        } catch (error) {
            alert(`Erro:\n\n-> ${error}`)
        }
    }

    return {
        listaEntregasFuturas,
        atualizaListaDeEntregasFuturas,
        criaNovaEntregaFutura,
        loadingEntregasFuturas,
    }
}