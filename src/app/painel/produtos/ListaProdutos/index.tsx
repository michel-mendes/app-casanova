import React from 'react'
import Link from 'next/link'

import { AtributosProduto } from '@/database/models/produtos/Produto'

import style from "./index.module.css"

interface IListaProdutosProps {
    listaProdutos: Array<AtributosProduto>
}

function ListaProdutos({ listaProdutos }: IListaProdutosProps) {
    return (
        <table className={style.tabela_produtos}>

            {/* Header, nomes das colunas */}
            <thead>
                <tr>
                    <th>Produto</th>
                    <th className={style.coluna_vista}>À vista</th>
                    <th className={style.coluna_prazo}>À prazo</th>
                    <th className={style.coluna_estoque}>Estoque</th>
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
                            return (
                                <tr key={produto.id}>
                                    <td className={style.coluna_dados_produto}>
                                        <Link href={`/painel/produtos/editar/${produto.id}`}>
                                            <b>{produto.descricao}</b>
                                        </Link>

                                        <div className={style.container_dados_produto_mobile}>
                                            <span>Código: {produto.barras}</span>
                                            <span>Status: {produto.status == 1 ? "Ativo" : "Inativo"}</span>
                                        </div>

                                        <div className={style.container_dados_produto_mobile}>
                                            <span>À vista: {Number(produto.vlrVista).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            <span>À prazo: {Number(produto.vlrPrazo).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            <span>Estoque: {Number(produto.estoque).toLocaleString(undefined, { maximumFractionDigits: 2 })} {produto.unidade}</span>
                                        </div>
                                    </td>

                                    <td className={style.coluna_vista}>{Number(produto.vlrVista).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className={style.coluna_prazo}>{Number(produto.vlrPrazo).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className={style.coluna_estoque}>{Number(produto.estoque).toLocaleString(undefined, { maximumFractionDigits: 2 })} {produto.unidade}</td>
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