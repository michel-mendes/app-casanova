import { useState } from "react";
import { IEntregaPendente } from "@/database/models-mongoose/vendaEntregaFutura/IEntregaPendente";

export function useEntregasFuturas() {
    const [listaEntregasFuturas, setListaEntregasFuturas] = useState<Array<IEntregaPendente>>([])
    const [loadingEntregasFuturas, setLoadingEntregasFuturas] = useState(false)
    const [aguardandoApi, setAguardandoApi] = useState(false)

    async function atualizaListaDeEntregasFuturas() {
        setLoadingEntregasFuturas(true)

        try {
            const novaLista: Array<IEntregaPendente> = await (await fetch(`/api/vendasEntregaFutura`)).json()

            setListaEntregasFuturas(novaLista)
        } catch (error) {
            alert(error)
        } finally {
            setLoadingEntregasFuturas(false)
        }
    }

    async function criaNovaEntregaFutura(vefData: IEntregaPendente) {
        setAguardandoApi(true)

        try {
            const apiResponse = await fetch(`/api/vendasEntregaFutura`, {method: "POST", body: JSON.stringify(vefData)})
            let novaEntregaFutura: IEntregaPendente

            if (apiResponse.status !== 200) {
                alert(`${await apiResponse.text()}`)
                return
            }

            novaEntregaFutura = await apiResponse.json()
            // alert("Nova entrega futura cadastrada com sucesso!")

            setListaEntregasFuturas(listaAtual => {
                const novaLista = [...listaAtual, novaEntregaFutura]
                return novaLista
            })

            return novaEntregaFutura
        } catch (error) {
            alert(`Erro:\n\n-> ${error}`)
        } finally {
            setAguardandoApi(false)
        }
    }

    async function alteraEntregaPendente(idEntrega: string, dados: IEntregaPendente) {
        setAguardandoApi(true)

        try {
            const apiResponse = await fetch(`/api/vendasEntregaFutura?id=${idEntrega}`, {method: "PUT", body: JSON.stringify(dados)})

            if (apiResponse.status !== 200) {
                alert(`${await apiResponse.text()}`)
                return
            }

            const entregaAlterada: IEntregaPendente = await apiResponse.json()

            setListaEntregasFuturas(listaAtual => {
                const novaLista = listaAtual.map(item => (item.id == entregaAlterada.id) ? entregaAlterada : item)

                return novaLista
            })
        } catch (error) {
            alert(`Erro:\n\n-> ${error}`)
        } finally {
            setAguardandoApi(false)
        }
    }

    return {
        listaEntregasFuturas,
        atualizaListaDeEntregasFuturas,
        criaNovaEntregaFutura,
        alteraEntregaPendente,
        loadingEntregasFuturas,
        aguardandoApiEntregaFutura: aguardandoApi
    }
}