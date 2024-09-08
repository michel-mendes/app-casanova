import { useEffect, useState } from "react"

import { IEntregaPendente } from "@/database/models-mongoose/vendaEntregaFutura/IEntregaPendente"
import { IProdutoPendente } from "@/app/interfaces"

import { sortArrayOfObjects } from "@/app/helpers"

import style from "./index.module.css"

export function ListaProdutosPendentesEntrega({ listaEntregasPendentes, mostraClientes }: { listaEntregasPendentes: Array<IEntregaPendente>, mostraClientes: boolean }) {

    const [produtosPendentes, setProdutosPendentes] = useState<Array<IProdutoPendente>>([])

    // Gera a lista de produtos vendidos a partir da lista de entregas pendentes
    useEffect(() => {
        let listaProdutos: Array<IProdutoPendente> = []

        // Itera cada entrega na lista
        for (const entrega of listaEntregasPendentes) {

            // Não contabiliza produtos com entrega finalizada...
            if (entrega.finalizada) continue

            // Itera cada produto da entrega
            for (const produto of entrega.itensRestantes) {

                const produtoEncontrado = listaProdutos.some(item => item.idProduto === produto.idProduto)

                // Se o produto da entrega em questão não constar na lista, então adicione
                if (!produtoEncontrado) {
                    const produtoVendido: IProdutoPendente = {
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

                // Se o produto constar na lista, apenas adicione o cliente que tem o mesmo comprado
                else {
                    const produtoVendido = listaProdutos.find(item => item.idProduto == produto.idProduto)
                    // const produtoVendido = listaProdutos.find(item => item.descricaoProduto == produto.descricao)

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

        const listaProdoutosOrganizada = sortArrayOfObjects<IProdutoPendente>(listaProdutos, "descricaoProduto", true)
        setProdutosPendentes(listaProdoutosOrganizada)
    }, [listaEntregasPendentes])

    return (
        <div className={style.lista_produtos}>
            <div className={style.header}>
                <p className={style.coluna_produto}>Produto</p>
                <p className={style.coluna_quatidade}>Quantidade</p>
                <p className={style.coluna_num_clientes}>Núm. clientes</p>
            </div>

            <div>
                {
                    produtosPendentes.map((produtoPendente, index) => {
                        if (produtoPendente.totalVendido == 0) return null
                        
                        return (
                            <div className={style.linha_produto} key={`${produtoPendente.idProduto}${index}`}>
                                <div className={style.dados_produto}>
                                    <p className={style.coluna_produto}>{produtoPendente.descricaoProduto}</p>
                                    <p className={style.coluna_quatidade}>{Number(produtoPendente.totalVendido).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 })} {produtoPendente.unidade}</p>
                                    <p className={style.coluna_num_clientes}>{produtoPendente.listaClientes?.length}</p>
                                </div>

                                {
                                    mostraClientes && (
                                        <div>
                                            <ul className={style.lista_clientes}>
                                                {
                                                    (produtoPendente.listaClientes) && produtoPendente.listaClientes.map((cliente, index) => {
                                                        if (cliente.quantidade == 0) return null
                                                        
                                                        return (
                                                            <li key={`${cliente.idVenda}${index}`}>
                                                                <span>{new Date(cliente.dataVenda).toLocaleDateString()}</span>
                                                                <span> - </span>
                                                                <span>{cliente.nomeCliente}</span>
                                                                <span> - </span>
                                                                <span>{cliente.quantidade}</span>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}