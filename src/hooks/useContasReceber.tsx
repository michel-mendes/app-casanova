import { useState } from "react";
import { IClienteDevedor, IContasReceber } from "@/service/contasReceber";

export function useContasReceber() {
    const [ listaReceberTotal, setListaReceberTotal ] = useState< Array<IClienteDevedor> >([])
    const [ listaReceberExcetoPerdidos, setListaReceberExcetoPerdidos ] = useState< Array<IClienteDevedor> >([])
    const [ listaReceberVencidos30d, setListaReceberVencidos30d ] = useState< Array<IClienteDevedor> >([])
    const [ listaReceberPerdidos, setListaReceberPerdidos ] = useState< Array<IClienteDevedor> >([])
    const [ listaClientesHaver, setListaClientesHaver ] = useState< Array<IClienteDevedor> >([])

    const [ erroApiContasReceber, setErroApiContasReceber ] = useState< string | null >(null)
    
    const [ carregandoContasReceber, setCarregandoContasReceber ] = useState(false)

    async function atualizaListas() {
        try {
            setCarregandoContasReceber(true)

            const apiResponse = await fetch(`/api/contas-receber`)

            // Erro ---------------------------
            if (!apiResponse.ok) {
                const erroApi: string = (await apiResponse.json() as any).error
                
                setErroApiContasReceber( erroApi )
                return
            }
            // --------------------------------

            const listaReceber: IContasReceber = await apiResponse.json()

            setListaReceberTotal( listaReceber.receberTotal.clientes )
            setListaReceberExcetoPerdidos( listaReceber.receberExcetoPerdidos.clientes )
            setListaReceberVencidos30d( listaReceber.receberVencidos30d.clientes )
            setListaReceberPerdidos( listaReceber.receberPerdidos.clientes )
            setListaClientesHaver( listaReceber.clientesHaver.clientes )
        } finally {
            setCarregandoContasReceber(false)
        }
    }

    return {
        atualizaListas,
        listaReceberTotal,
        listaReceberVencidos30d,
        listaReceberExcetoPerdidos,
        listaReceberPerdidos,
        listaClientesHaver,
        carregandoContasReceber,
        erroApiContasReceber
    }
}