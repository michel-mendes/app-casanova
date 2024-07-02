"use client"

import React, { useRef, useState, useEffect } from 'react'
import { useVendas } from '@/hooks/useVendas'
import { useEntregasFuturas } from '@/hooks/useVendaEntregaFutura'
import { IVenda } from '../interfaces'

import { LoadingAnimation } from '../components/LoadingAnimation'
import { Input } from '../components/Input'

import moment from 'moment'

import style from "./page.module.css"

function VendasPage() {
    const [startDate, setStartDate] = useState(new Date(Date.now()).toJSON().slice(0, 10))
    const [endDate, setEndDate] = useState(new Date(Date.now()).toJSON().slice(0, 10))

    const { listaVendas, atualizaLista, alteraVenda, loadingVendas } = useVendas()
    const { criaNovaEntregaFutura } = useEntregasFuturas();

    const vendaRefs = useRef<Array<HTMLDivElement | null>>([]);

    function getMediaMargem(): number {
        if (!listaVendas || !listaVendas.length || listaVendas.length == 0) return 0

        let somaMargens = 0
        let mediaMargens = 0

        for (const venda of listaVendas) {
            somaMargens += venda.margemLucro || 0
        }

        mediaMargens = somaMargens / listaVendas.length

        return mediaMargens
    }

    function updateVendaExpansionElement(newListaVendas: Array<IVenda>) {
        vendaRefs.current = newListaVendas.map((_, index) => { return vendaRefs.current[index] })
    }

    function toggleExpandVenda(vendaIndex: number) {
        const ref = vendaRefs.current[vendaIndex];
        if (ref) {
            const isExpanded = ref.getAttribute("is-expanded") === "true";
            ref.setAttribute("is-expanded", String(!isExpanded));
        }
    }

    function handleClickAlteraVenda(idVenda: number) {
        alteraVenda(idVenda, { entregaFutura: 1 })
    }

    function handleClickNovaEntregaFutura(idVenda: number) {
        const dadosVenda = listaVendas.find(venda => venda.id == idVenda)
        let quantidadeTotalProdutos = 0

        for (const produto of dadosVenda?.itensVenda!) {
            quantidadeTotalProdutos += produto.qtde
        }

        const novaEntragaFutura = {
            idVenda: dadosVenda?.id!,
            dataEmissao: dadosVenda?.dataEmissao!,
            nomeCliente: dadosVenda?.nome!,
            endereco: `${dadosVenda?.endereco}${dadosVenda?.numero ? `, ${dadosVenda?.numero}` : ""}${dadosVenda?.bairro ? ` (${dadosVenda?.bairro})` : ""}`,
            cidade: dadosVenda?.cidade!,
            uf: dadosVenda?.uf!,
            valorVenda: dadosVenda?.vlrLiquido!,
            status: "Pendente",
            quantidadeTotalProdutos,
            quantidadeEntregue: 0,

            itensRestantes: dadosVenda?.itensVenda?.map(itemVenda => {
                return {
                    idVenda: itemVenda.idVenda,
                    idItemVenda: itemVenda.id,
                    idProduto: itemVenda.idProduto,
                    qtdeTotalComprado: itemVenda.qtde,
                    qtde: itemVenda.qtde,
                    unidade: itemVenda.unidade,
                    valorUnit: itemVenda.vlrUnitario,
                    valorTotal: itemVenda.vlrTotal,
                    descricao: itemVenda.descricao,
                }
            }) || [],
            itensEntregues: [],
        } as any

        criaNovaEntregaFutura(novaEntragaFutura)
        alteraVenda(idVenda, {entregaFutura: 1})
        dadosVenda!.entregaFutura = 1;
    }

    useEffect(() => {
        updateVendaExpansionElement(listaVendas)
    }, [listaVendas]);

    return (
        <div className={style.div}>
            <div className={style.filter_container}>
                <Input label='Data inicial' fieldName='dataInicial' inputType='date' placeholder={{insideInput: false, text: 'Período de vencimento'}} onChange={(e) => { setStartDate(e as string) }} value={startDate} />
                <Input label='Data final' fieldName='dataFinal' inputType='date' placeholder={{insideInput: false, text: 'Período de vencimento'}} onChange={(e) => { setEndDate(e as string) }} value={endDate} />
                <Input label='Pesquisa por' fieldName='texto' inputType='text' placeholder={{insideInput: false, text: 'Termo para pesquisa'}} />

                <button onClick={() => { atualizaLista(startDate, endDate) }}>Listar</button>
            </div>

            {
                (loadingVendas)
                    ? <LoadingAnimation />
                    : <table className={style.table_vendas}>
                        <thead>
                            <tr>
                                <th>Nº Venda</th>
                                <th>Data</th>
                                <th>Cliente</th>
                                <th>Valor</th>
                                <th>Margem</th>
                                <th>Entrega futura?</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                listaVendas.length > 0 && listaVendas.map((venda, vendaIndex) => {
                                    const dataVenda = new Date(venda.dataEmissao!).toLocaleDateString()
                                    const valorVenda = Number(venda.vlrLiquido).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
                                    const margem = Number(venda.margemLucro).toFixed() + "%"

                                    return (
                                        <>
                                            <tr className={style.row_venda}>
                                                <td className={`${style.column_detail_venda} ${style.col_n_venda}`} onClick={() => { toggleExpandVenda(vendaIndex) }}>{venda.id}</td>
                                                <td className={`${style.column_detail_venda} ${style.col_data}`} onClick={() => { toggleExpandVenda(vendaIndex) }}>{dataVenda}</td>
                                                <td className={`${style.column_detail_venda}`} onClick={() => { toggleExpandVenda(vendaIndex) }}>{venda.nome}</td>
                                                <td className={`${style.column_detail_venda} ${style.col_valor}`} onClick={() => { toggleExpandVenda(vendaIndex) }}>{valorVenda}</td>
                                                <td className={`${style.column_detail_venda} ${style.col_margem}`} onClick={() => { toggleExpandVenda(vendaIndex) }}>{margem}</td>
                                                <td className={style.col_btn_add_entrega}>
                                                    {
                                                        (venda.entregaFutura == 1)
                                                            ? <span>--</span>
                                                            : <button onClick={() => { handleClickNovaEntregaFutura(venda.id!) }}>Cadastrar entrega futura</button>
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={6}>

                                                    <div
                                                        is-expanded="false"
                                                        className={style.div_itens_venda}
                                                        ref={(element) => { vendaRefs.current[vendaIndex] = element }}
                                                    >
                                                        <h3>Detalhamento da venda</h3>
                                                        <div>
                                                            <br />
                                                            <span>Data da venda: {moment(venda.dataEmissao).add(3, "hours").format(`DD/MM/YYYY - HH:mm:ss`)}</span>
                                                            <br />
                                                            <span>Nome do cliente: <span>{venda.nome}</span></span>
                                                            <br />
                                                            <span>Endereço: <span>{venda.endereco},{venda.numero} ({venda.bairro})</span></span>
                                                            <br /><br />
                                                        </div>

                                                        <h3>Relação de produtos</h3>
                                                        <br />
                                                        <table className={style.table_itens_venda}>
                                                            <thead>
                                                                <tr>
                                                                    <th>Código</th>
                                                                    <th>Produto</th>
                                                                    <th>Qtde Comprada</th>
                                                                    <th>Preço</th>
                                                                    <th>Total</th>
                                                                    {/* <th>Cód Produto</th> */}
                                                                    <th>Margem %</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>
                                                                {
                                                                    (venda.itensVenda) && venda.itensVenda.map(produto => {
                                                                        const prodId = produto.idProduto
                                                                        const prodQtde = produto.qtde
                                                                        const prodUn = produto.unidade
                                                                        const prodVrUnitario = produto.vlrUnitario.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                                        const prodVrTotal = produto.vlrTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                                        const prodDescricao = produto.descricao
                                                                        const prodCusto = produto.vlrCustoDia
                                                                        const prodMargem = produto.margemLucro
                                                                        return (
                                                                            <tr>
                                                                                <td style={{ border: "1px solid #c0c0c0" }}>{prodId}</td>
                                                                                <td style={{ border: "1px solid #c0c0c0" }}>{prodDescricao}</td>
                                                                                <td style={{ border: "1px solid #c0c0c0" }}>{prodQtde} {prodUn}</td>
                                                                                <td style={{ border: "1px solid #c0c0c0" }}>{prodVrUnitario}</td>
                                                                                <td style={{ border: "1px solid #c0c0c0" }}>{prodVrTotal}</td>
                                                                                <td style={{ border: "1px solid #c0c0c0" }}>{Number(prodMargem).toFixed(0)}%</td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        </>
                                    )
                                })
                            }
                        </tbody>

                        <tfoot>
                            <tr>
                                <td>Margem Média</td>
                                <td>{getMediaMargem().toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
            }
        </div>
    )
}

export default VendasPage