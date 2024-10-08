import { useContasReceber } from "@/hooks/useContasReceber"
import { IClienteDevedor } from "@/service/contasReceber"
import { useEffect, useState } from "react"

import { strToHex } from "@/app/helpers"

type TipoLista =    "ClientesExcetoPerdidos" |
                    "ClientesIncluindoPerdios" |
                    "ClientesVencidos30D" |
                    "ClientesPerdidos" |
                    "ClientesHaver"

export function useScripts() {
    const {
        atualizaListas,
        carregandoContasReceber,
        listaReceberTotal,
        listaReceberExcetoPerdidos,
        listaReceberVencidos30d,
        listaReceberPerdidos,
        listaClientesHaver
     } = useContasReceber()

    const [ listaClientes, setListaClientes ] = useState< Array<IClienteDevedor> >([])
    const [ tipoLista, setTipoLista ] = useState<TipoLista>("ClientesExcetoPerdidos")

    async function handleClickBotaoAtualizarLista(tipoSelecionado: TipoLista) {
        if (!tipoSelecionado) return

        await atualizaListas()
        setTipoLista(tipoSelecionado)
    }

    function handleClickImprimeRelatorio() {
        const dadosRelatorio = strToHex( JSON.stringify(listaClientes) )
        
        window.open(`/relatorio/contas-receber/${dadosRelatorio}`, "_blank", "width=auto, height=auto")
    }

    useEffect(() => {

        switch (tipoLista) {
            case "ClientesExcetoPerdidos": {
                setListaClientes(listaReceberExcetoPerdidos)
                break
            }
            case "ClientesIncluindoPerdios": {
                setListaClientes(listaReceberTotal)
                break
            }
            case "ClientesVencidos30D": {
                setListaClientes(listaReceberVencidos30d)
                break
            }
            case "ClientesPerdidos": {
                setListaClientes(listaReceberPerdidos)
                break
            }
            case "ClientesHaver": {
                setListaClientes(listaClientesHaver)
                break
            }
        }  

    }, [listaReceberTotal, tipoLista])

    return {
        handleClickBotaoAtualizarLista,
        handleClickImprimeRelatorio,
        carregandoContasReceber,
        listaClientes,
    }
}