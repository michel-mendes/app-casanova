import { ContasPagarTotalSemanas } from "@/service/types"

function useContasPagar() {
    
    async function listaTotalSemanal() {
        try {
            const lista: ContasPagarTotalSemanas = await (await fetch("/api/contasPagarTotal")).json()
            return lista
        } catch (error) {
            return []
        }
    }

    async function listaSemanaAtual() {
        try {
            const lista = await (await fetch("/api/contasPagarSemanaAtual")).json()
            return lista
        } catch (error) {
            return []
        }
    }
    
    return { listaTotalSemanal, listaSemanaAtual }
}

export default useContasPagar