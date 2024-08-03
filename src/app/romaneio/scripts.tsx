import { useEffect, useState } from "react"

import { useRomaneioEntrega } from "@/hooks/useRomaneioEntrega"

import { IRomaneioEntrega } from "@/database/models-mongoose/romaneioEntrega/IRomaneioEntrega"
import { ITempRomaneioEntrega } from "../interfaces"

function useScripts() {

    const { criaNovoRomaneio, imprimeRomaneioNoServidor } = useRomaneioEntrega()

    const [romaneios, setRomaneios] = useState<Array<ITempRomaneioEntrega>>([])
    const [gravacaoLiberada, setGravacaoLiberada] = useState(false)


    function validaQuantidadesDosProdutos(tempRomaneioLocal: ITempRomaneioEntrega): boolean {

        for (const produto of tempRomaneioLocal.itensEntrega) {
            if (!produto.qtde || produto.qtde <= 0) {
                alert(`Por favor, insira uma quantidade válida para "${produto.descricao}"!`)
                return false
            }

            if (produto.qtde > produto.qtdeRestante) {
                alert(`Verifique o item "${produto.descricao}".\n\nA quantidade digitada é maior que o restante para entregar!`)
                return false
            }
        }

        return true

    }

    async function handleClickBotaoSalvaRomaneio(tempRomaeioLocal: ITempRomaneioEntrega) {

        try {
            // Finaliza função caso não passe na validação dos dados
            if (!validaQuantidadesDosProdutos(tempRomaeioLocal)) return

            const confirmado = confirm(`Confirma o fechamento do romaneio para ${tempRomaeioLocal.nomeCliente}?`)

            if (!confirmado) return

            const novoRomaneio = await criaNovoRomaneio(tempRomaeioLocal as unknown as IRomaneioEntrega)

            // Remove o romaneio da lista caso o cadastro tenha sido um sucesso
            if (novoRomaneio) {
                setRomaneios(listaAtual => {
                    const listaAtualizada = listaAtual.filter(romaneio => romaneio.idEntregaPendente !== String(novoRomaneio.idEntregaPendente))
                    return listaAtualizada
                })

                if (confirm("Deseja imprimir o romaneio de entrega?")) {
                    const statusImpressão = await imprimeRomaneioNoServidor(novoRomaneio)
                    alert(statusImpressão)
                }
            }
        } catch (error: any) {
            alert(error.message)
        }

    }

    // Salva lista de romaneios temporários no armazenamento local do navegador sempre que houver alterações e
    // estiver liberada a gravação da mesma
    useEffect(() => {
        if (gravacaoLiberada && localStorage) {
            localStorage.setItem("romaneio", JSON.stringify(romaneios))
        }
    }, [romaneios])

    // Obtém a lista de romaneios temporarios na inicialização do componente
    // e libera a alteração de gravação da lista
    useEffect(() => {
        if (localStorage) {
            const listaRomaneioLocalStorage: Array<ITempRomaneioEntrega> = JSON.parse(localStorage.getItem("romaneio") || "[]")
            
            setRomaneios(listaRomaneioLocalStorage)
            setGravacaoLiberada(true)
        }
    }, [])

    return {
        romaneios, setRomaneios, handleClickBotaoSalvaRomaneio
    }
}

export default useScripts