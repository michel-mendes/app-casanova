import React from 'react'

import { AtributosProduto } from '@/database/models/produtos/Produto'

import style from "./index.module.css"

interface IListaProdutosProps {
    listaProdutos: Array<AtributosProduto>
}

function ListaProdutos({ listaProdutos }: IListaProdutosProps) {
    return (
        <table>

            {/* Header, nomes das colunas */}
            <thead>
                <tr>
                    <th>Produto</th>
                    <th>À vista</th>
                    <th>À prazo</th>
                    <th>Estoque</th>
                    <th>Status</th>
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
                            return (
                                <tr key={produto.id}>
                                    <td>
                                        <span>Cód: {produto.barras}</span>
                                        <br />
                                        <span>{produto.descricao}</span>
                                    </td>
                                    <td>{Number(produto.vlrVista).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>{Number(produto.vlrPrazo).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>{Number(produto.estoque).toLocaleString(undefined, { maximumFractionDigits: 2 })} {produto.unidade}</td>
                                    <td>{produto.status == 1 ? "Ativo" : "Inativo"}</td>
                                </tr>
                            )
                        })
                }
            </tbody>
            

            {/* Footer */}
            <tfoot>
                <tr>
                    <td>{listaProdutos.length} { listaProdutos.length > 1 ? "produtos" : "produto" }</td>
                </tr>
            </tfoot>

        </table>
    )
}

export { ListaProdutos }