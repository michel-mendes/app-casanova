'use client'

import React, { useState, useEffect } from 'react'

import { sortArrayOfObjects } from '@/app/helpers'

import { ProdutoEntregaFutura } from '../scripts'

interface ListaProdutosEntregaFuturaProps {
    listaProdutosEntregaPendente: Array<ProdutoEntregaFutura>
}

import style from "./index.module.css"

function ListaProdutosEntregaFutura({ listaProdutosEntregaPendente }: ListaProdutosEntregaFuturaProps) {

    // useEffect(() => {
    //     const listaOrdenada = sortArrayOfObjects<ProdutoEntregaFutura>(listaProdutosEntregaPendente, "descricaoProduto", true)

    //     calculaValorTotal()
    //     setListaOrdenadaPorValor(listaOrdenada)
    // }, [listaProdutosEntregaPendente])

    return (
        <div className={style.container_lista}>
            <table className={style.tabela}>
                <thead>
                    <tr>
                        <th>Descrição do produto</th>
                        <th>Quantidade</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        (listaProdutosEntregaPendente && listaProdutosEntregaPendente.length > 0)
                            ? listaProdutosEntregaPendente.map((produto, itemIndex) => {
                                return (

                                    ((produto.totalVendido) && produto.totalVendido > 0.2)
                                    ? (
                                        <tr key={itemIndex}>
                                            <td>{produto.descricaoProduto}</td>
                                            <td className={style.coluna_valor}>{Number(produto.totalVendido).toLocaleString(undefined, { maximumFractionDigits: 2 })} {produto.unidade}</td>
                                        </tr>
                                    )
                                    : null

                                )
                            })
                            : <tr>
                                <td colSpan={2}>Não há nada aqui</td>
                            </tr>
                    }

                    {/* <tr>
                        <td colSpan={2}><hr /></td>
                    </tr>
                    <tr>
                        <td>*** TOTAL ***</td>
                        <td className={style.coluna_valor}>{valorTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr> */}

                </tbody>
            </table>
        </div>
    )
}

export { ListaProdutosEntregaFutura }