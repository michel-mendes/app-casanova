"use client"

import React from 'react'

import { useProdutos } from '@/hooks/useProdutos'

import style from "./page.module.css"

function ProdutosPage() {

    const {listaProdutos, atualizaListaProdutos} = useProdutos()

    return (
        <div className={style.page_container}>
            <h1>Busca de Produtos</h1>

            <input type="text" id='inputPesquisa' />
            <button onClick={() => { 
                const inputPesquisa = document.getElementById("inputPesquisa") as HTMLInputElement

                atualizaListaProdutos(inputPesquisa.value)
            }}>Atualiza produtos</button>
            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descrição</th>
                        <th>Custo</th>
                        <th>À vista</th>
                        <th>À prazo</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        listaProdutos.length == 0
                        ? (
                            <tr>
                                <td colSpan={5}>Nenhum produto para mostrar</td>
                            </tr>
                        )
                        : listaProdutos.map(produto => {
                            return (
                                <tr>
                                    <td>{produto.barras}</td>
                                    <td>{produto.descricao}</td>
                                    <td>{Number(produto.vlrCusto).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                    <td>{Number(produto.vlrVista).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                    <td>{Number(produto.vlrPrazo).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>

                <tfoot>
                    <tr>
                        <td>{listaProdutos.length} {(listaProdutos.length > 1 ? "produtos" : "produto")}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

export default ProdutosPage