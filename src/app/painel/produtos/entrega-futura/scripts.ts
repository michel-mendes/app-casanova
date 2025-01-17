import { useEffect, useState } from "react"

import { useEntregasFuturas } from "@/hooks/useVendaEntregaFutura"

import { sortArrayOfObjects, strToHex } from "@/app/helpers"
import { IEntregaPendente } from "@/database/models-mongoose/vendaEntregaFutura/IEntregaPendente"

// interface ProdutoEntregaFutura {}
export interface ProdutoEntregaFutura {
    idProduto?: number,
    descricaoProduto?: string,
    totalVendido?: number,
    unidade?: string,
    listaClientes?: Array<{
        idVenda: number,
        dataVenda: Date,
        quantidade: number,
        nomeCliente: string,
    }>
}

export function useScripts() {

    const { listaEntregasFuturas, atualizaListaDeEntregasFuturas, loadingEntregasFuturas } = useEntregasFuturas()

    const [produtosPendentes, setProdutosPendentes] = useState<Array<ProdutoEntregaFutura>>([])

    async function handleClickImprimeRelatorio() {
        const dadosRelatorio = strToHex(JSON.stringify(produtosPendentes))

        localStorage.setItem("produtos-entrega-futura", dadosRelatorio)

        window.open(`/relatorio/produtos-entrega-pendente/`, "_blank", "width=auto, height=auto")
    }

    
    useEffect(() => { atualizaListaDeEntregasFuturas("somente-nao-finalizadas") }, [])

    // Gera a lista de produtos vendidos a partir da lista de entregas pendentes
    useEffect(() => {
        const listaProdutosEntregaFutura = geraListaProdutosEntregaFutura(listaEntregasFuturas)
        
        setProdutosPendentes(listaProdutosEntregaFutura)
    }, [listaEntregasFuturas])

    return {
        handleClickImprimeRelatorio,
        loadingEntregasFuturas,
        produtosPendentes,
    }
}


// Helpers
function geraListaProdutosEntregaFutura(listaEntregasFuturas: Array<IEntregaPendente>) {

    const listaProdutos: Array<ProdutoEntregaFutura> = []

    // Itera cada entrega na lista
    for (const entrega of listaEntregasFuturas) {

        // Não contabiliza produtos com entrega finalizada...
        if (entrega.finalizada) continue

        // Itera cada produto da entrega
        for (const produto of entrega.itensRestantes) {

            const produtoEncontrado = listaProdutos.some(item => item.idProduto === produto.idProduto)

            // Se o produto da entrega em questão não constar na lista, então adicione
            if (!produtoEncontrado) {
                const produtoVendido: ProdutoEntregaFutura = {
                    idProduto: produto.idProduto,
                    descricaoProduto: produto.descricao,
                    totalVendido: produto.qtde,
                    unidade: produto.unidade,
                    listaClientes: [{
                        idVenda: entrega.idVenda,
                        dataVenda: entrega.dataEmissao,
                        quantidade: produto.qtde,
                        nomeCliente: entrega.nomeCliente
                    }]
                }

                listaProdutos.push(produtoVendido)
            }

            // Se o produto constar na lista, apenas adicione o cliente que tem o mesmo produto comprado
            else {
                const produtoVendido = listaProdutos.find(item => item.idProduto == produto.idProduto)

                produtoVendido!.totalVendido! += produto.qtde
                produtoVendido!.listaClientes!.push({
                    idVenda: entrega.idVenda,
                    dataVenda: entrega.dataEmissao,
                    quantidade: produto.qtde,
                    nomeCliente: entrega.nomeCliente
                })
            }
        }
    }

    const listaProdutosOrdenadaPorDescricao = sortArrayOfObjects<ProdutoEntregaFutura>(listaProdutos, "descricaoProduto", true)

    return listaProdutosOrdenadaPorDescricao
}