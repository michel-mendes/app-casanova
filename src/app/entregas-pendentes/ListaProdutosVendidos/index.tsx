import { useEffect, useState } from "react"

import { IEntregaPendente } from "@/database/models-mongoose/vendaEntregaFutura/IEntregaPendente"
import { IProdutoPendente } from "@/app/interfaces"

import style from "./index.module.css"

export function ListaProdutosPendentesEntrega({ listaEntregasPendentes }: { listaEntregasPendentes: Array<IEntregaPendente> }) {

    const [produtosPendentes, setProdutosPendentes] = useState<Array<IProdutoPendente>>([])

    // Gera a lista de produtos vendidos a partir da lista de entregas pendentes
    useEffect(() => {
        let listaProdutos: Array<IProdutoPendente> = []

        // Itera cada entrega na lista
        for (const entrega of listaEntregasPendentes) {

            // Itera cada produto da entrega
            for (const produto of entrega.itensRestantes) {

                // Se o produto da entrega em questão não constar na lista, então adicione
                if (!listaProdutos.includes({ descricaoProduto: produto.descricao })) {
                    const produtoVendido: IProdutoPendente = {
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
                    const produtoVendido = listaProdutos.find(item => item.descricaoProduto == produto.descricao)

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

        setProdutosPendentes(listaProdutos)
    }, [])

    return (
        <div className={style.lista_produtos}>
            <div className={style.header}>
                <p className={style.coluna_produto}>Descrição do produto</p>
                <p className={style.coluna_quatidade}>Quantidade pendente de entrega</p>
            </div>

            <div>
                {
                    produtosPendentes.map(produtoPendente => {
                        return (
                            <div>
                                <div className={style.dados_produto}>
                                    <p className={style.coluna_produto}>{`-> `}{produtoPendente.descricaoProduto}</p>
                                    <p className={style.coluna_quatidade}>{produtoPendente.totalVendido} {produtoPendente.unidade}</p>
                                </div>

                                <div>
                                    <ul className={style.lista_clientes}>
                                        {
                                            (produtoPendente.listaClientes) && produtoPendente.listaClientes.map(cliente => {
                                                return (
                                                    <li>
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
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}