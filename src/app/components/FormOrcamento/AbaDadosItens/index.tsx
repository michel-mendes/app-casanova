import React from 'react'

import { IVenda } from '@/app/interfaces'

import style from "./index.module.css"
import { OrcamentoAttributes } from '@/database/models/orcamentos/Orcamento';

interface AbaDadosItensOrcamentoProps {
  dadosOrcamento: OrcamentoAttributes;
  exibirCustosMargem: boolean;
}

function AbaDadosItensOrcamento({ dadosOrcamento, exibirCustosMargem }: AbaDadosItensOrcamentoProps) {

    const totalProdutos = () => {
        let total = 0

        for (const produto of dadosOrcamento.itensOrcamento!) {
            total += produto.vlrTotal!
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

                            {/* Exibir colunas de custo e margem se usuário optar */}
                            {
                                (exibirCustosMargem) && (
                                    <>
                                        <th className={style.colunas_custo_margem}>Custo unitário</th>
                                        <th className={style.colunas_custo_margem}>Custo total</th>
                                        <th className={style.colunas_custo_margem}>Margem %</th>
                                    </>
                                )
                            }
                        </tr>
                    </thead>

                    <tbody>
                        {
                            dadosOrcamento.itensOrcamento!.map((produto, index) => {

                                const custoAtual = (produto.produto) ? produto.produto.vlrCusto : 0
                                const custoTotal = custoAtual * produto.qtde!
                                const margemLucro = !(custoAtual > 0) ? 0 : Number(((produto.vlrUnitario! - custoAtual) * 100) / custoAtual)

                                return (
                                    <tr key={index}>
                                        <td className={style.coluna_numItem}>{index + 1}</td>
                                        <td className={style.coluna_codigo}>{(produto.produto) ? produto.produto.barras : ""}</td>
                                        <td>{produto.descricao}</td>
                                        <td className={style.coluna_qtde}>{Number(produto.qtde).toLocaleString(undefined, { maximumFractionDigits: 2 })} {produto.unidade}</td>
                                        <td className={style.coluna_vrUnit}>R$ {Number(produto.vlrUnitario).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</td>
                                        <td className={style.coluna_vrTotal}>R$ {Number(produto.vlrTotal).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</td>

                                        {/* Exibir colunas de custo e margem se usuário optar */}
                                        {
                                            (exibirCustosMargem) && (
                                                <>
                                                    <td className={style.colunas_custo_margem}>R$ {custoAtual.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                                    <td className={style.colunas_custo_margem}>R$ {custoTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                                    <td className={style.colunas_custo_margem}>{margemLucro.toFixed(0)}%</td>
                                                </>
                                            )
                                        }
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

                {/* Rodapé */}
                <div className={style.table_footer}>
                    <span>{dadosOrcamento.itensOrcamento?.length} {(dadosOrcamento.itensOrcamento?.length! > 1 ? "itens" : "item")}</span> {/* Quantidade de itens */}
                    <span>R$ {totalProdutos().toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span> {/* Valor total da venda */}
                </div>

            </div>
        </>
    )
}

export { AbaDadosItensOrcamento }