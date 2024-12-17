import React from 'react'

import { IVenda } from '@/app/interfaces'

import style from "./index.module.css"

interface AbaDadosItensProps {
    dadosVenda: IVenda
}

function AbaDadosItens({ dadosVenda }: AbaDadosItensProps) {

    const totalProdutos = () => {
        let total = 0

        for (const produto of dadosVenda.itensVenda!) {
            total += produto.vlrTotal
        }

        return total
    }

    return (
        <>
            {/* Aba itens da venda */}
            <div>

                <table className={style.tabela_itens}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Código</th>
                            <th>Descrição</th>
                            <th>Quant</th>
                            <th>Valor unitário</th>
                            <th>Valor total</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            dadosVenda.itensVenda!.map((produto, index) => {
                                return (
                                    <tr key={index}>
                                        <td className={style.coluna_numItem}>{index + 1}</td>
                                        <td className={style.coluna_codigo}>{produto.id}</td>
                                        <td>{produto.descricao}</td>
                                        <td className={style.coluna_qtde}>{Number(produto.qtde).toLocaleString(undefined, {maximumFractionDigits: 2})} {produto.unidade}</td>
                                        <td className={style.coluna_vrUnit}>R$ {Number(produto.vlrUnitario).toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                                        <td className={style.coluna_vrTotal}>R$ {Number(produto.vlrTotal).toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

                {/* Rodapé */}
                <div className={style.table_footer}>
                    <span>{dadosVenda.itensVenda?.length} {(dadosVenda.itensVenda?.length! > 1 ? "itens" : "item")}</span> {/* Quantidade de itens */}
                    <span>R$ {totalProdutos().toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2})}</span> {/* Valor total da venda */}
                </div>

            </div>
        </>
    )
}

export { AbaDadosItens }