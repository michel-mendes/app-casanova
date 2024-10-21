import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import { AtributosProduto } from '@/database/models/produtos/Produto'
import { IEntregaPendente } from '@/database/models-mongoose/vendaEntregaFutura/IEntregaPendente'

import style from "./index.module.css"
import { IProdutoPendente } from '@/app/interfaces'

interface IListaProdutosProps {
    listaProdutos: Array<AtributosProduto>
    listaEntregasFuturas?: Array<IEntregaPendente>
}

function ListaProdutos({ listaProdutos, listaEntregasFuturas }: IListaProdutosProps) {

    const [listaProdutosVendidos, setListaProdutosVendidos] = useState<Array<IProdutoPendente>>([])

    useEffect(() => {
        let tempListaProdutos: Array<IProdutoPendente> = []

        if (!listaEntregasFuturas) return

        for (const entrega of listaEntregasFuturas) {
            if (entrega.finalizada) continue

            for (const produto of entrega.itensRestantes) {
                const produtoEncontrado = tempListaProdutos.some(item => item.idProduto === produto.idProduto)

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

                    tempListaProdutos.push(produtoVendido)
                }

                else {
                    const produtoVendido = tempListaProdutos.find(item => item.idProduto == produto.idProduto)

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

        setListaProdutosVendidos(tempListaProdutos)
    }, [listaEntregasFuturas])

    return (
        <table className={style.tabela_produtos}>

            {/* Header, nomes das colunas */}
            <thead>
                <tr>
                    <th>Produto</th>
                    <th className={style.coluna_vista}>À vista</th>
                    <th className={style.coluna_prazo}>À prazo</th>
                    <th className={style.coluna_estoque}>{(listaEntregasFuturas && listaEntregasFuturas.length > 0)? "Estoque físico" : "Estoque"}</th>
                    {
                        (listaEntregasFuturas && listaEntregasFuturas.length > 0) && (
                            <th className={style.coluna_estoque_disponivel}>
                                Estoque disponível
                            </th>
                        )
                    }
                    <th className={style.coluna_status}>Status</th>
                </tr>
            </thead>

            {/* Body */}
            <tbody>
                {
                    listaProdutos.length < 1
                        ? (
                            <tr>
                                <td colSpan={5}>Não há nenhum produto aqui</td>
                            </tr>
                        )
                        : listaProdutos.map(produto => {

                            const produtoVendido = listaProdutosVendidos.find(item => item.idProduto == produto.id)
                            
                            return (
                                <tr className={style.linha_produto} key={produto.id} possui-venda={(produtoVendido ? "true" : "false")}>
                                    <td className={style.coluna_dados_produto}>
                                        <Link href={`/painel/produtos/editar/${produto.id}`}>
                                            <b>{produto.descricao}</b>
                                            {
                                                (produtoVendido) && (
                                                    <>
                                                    <hr />
                                                    <p>
                                                        <span>
                                                            <b>PRODUTO VENDIDO: {Number(produtoVendido.totalVendido).toLocaleString(undefined, {maximumFractionDigits: 2})} {produtoVendido.unidade}</b>
                                                        </span>
                                                    </p>
                                                    </>
                                                )
                                            }
                                        </Link>

                                        <div className={style.container_dados_produto_mobile}>
                                            <span>Código: {produto.barras}</span>
                                            <span>Status: {produto.status == 1 ? "Ativo" : "Inativo"}</span>
                                        </div>

                                        <div className={style.container_dados_produto_mobile}>
                                            {/* <span><b>Custo:</b> {Number(produto.vlrCusto).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span> */}
                                            <span><b>À vista:</b> {Number(produto.vlrVista).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            <span><b>À prazo:</b> {Number(produto.vlrPrazo).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            <span><b>Estoque:</b> {Number(produto.estoque).toLocaleString(undefined, { maximumFractionDigits: 2 })} {produto.unidade}</span>
                                        </div>
                                    </td>

                                    <td className={style.coluna_vista}>{Number(produto.vlrVista).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className={style.coluna_prazo}>{Number(produto.vlrPrazo).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className={style.coluna_estoque}>{Number(produto.estoque).toLocaleString(undefined, { maximumFractionDigits: 2 })} {produto.unidade}</td>

                                    {
                                        (produtoVendido)
                                        ? (
                                            <td className={style.coluna_estoque_disponivel}>{Number(produto.estoque - produtoVendido.totalVendido!).toLocaleString(undefined, {maximumFractionDigits: 2})} {produto.unidade}</td>
                                        )
                                        : (listaEntregasFuturas && listaEntregasFuturas.length > 0) ? (
                                            <td className={style.coluna_estoque_disponivel}>{Number(produto.estoque).toLocaleString(undefined, {maximumFractionDigits: 2})} {produto.unidade}</td>
                                        )
                                        : null
                                    }

                                    <td className={style.coluna_status}>{produto.status == 1 ? "Ativo" : "Inativo"}</td>
                                </tr>
                            )
                        })
                }
            </tbody>


            {/* Footer */}
            <tfoot>
                <tr>
                    <td>{listaProdutos.length} {listaProdutos.length > 1 ? "produtos" : "produto"}</td>
                </tr>
            </tfoot>

        </table>
    )
}

export { ListaProdutos }