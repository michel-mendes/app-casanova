"use client"

import React, { useState, useEffect } from 'react'

import { useModal } from '@/hooks/useModal'

import { FormVenda } from '@/app/components/FormVenda'

import { useVendas } from '@/hooks/useVendas'
import { IVenda } from '../../interfaces'

import { LoadingAnimation } from '../../components/LoadingAnimation'
import { Input } from '../../components/Input'

import moment from 'moment'

import style from "./page.module.css"

function VendasPage() {

    const modalVenda = useModal()
    const [dadosVendaModal, setDadosVendaModal] = useState<IVenda>()

    const [startDate, setStartDate] = useState(new Date(Date.now()).toJSON().slice(0, 10))
    const [endDate, setEndDate] = useState(new Date(Date.now()).toJSON().slice(0, 10))
    const [search, setSearch] = useState("")

    const { listaVendas, atualizaLista, loadingVendas } = useVendas()

    function getTotalVendas(): number {
        let valorTotalVendas: number = 0

        for (const venda of listaVendas) {
            valorTotalVendas += Number(venda.vlrLiquido || 0)
        }

        return valorTotalVendas
    }

    return (
        <div className={style.page_container}>
            <div className={style.filter_container}>
                <div className={style.container_date_selector}>
                    <Input
                        label='Data inicial'
                        fieldName='dataInicial'
                        inputType='date'
                        onChange={(e) => { setStartDate(e as string) }}
                        value={startDate}
                    />

                    <button onClick={() => {
                        setStartDate(moment(startDate).subtract(1, "month").toISOString().slice(0, 10))
                        setEndDate(moment(endDate).subtract(1, "month").toISOString().slice(0, 10))
                    }}>{"<<"} -30 dias</button>
                </div>

                <div>
                    <Input
                        label='Data final'
                        fieldName='dataFinal'
                        inputType='date'
                        onChange={(e) => { setEndDate(e as string) }}
                        value={endDate}
                    />

                    <button onClick={() => {
                        setStartDate(moment(startDate).add(1, "month").toISOString().slice(0, 10))
                        setEndDate(moment(endDate).add(1, "month").toISOString().slice(0, 10))
                    }}>+30 dias {">>"}</button>
                </div>

                <div className={style.container_filtro_texto}>
                    <Input
                        label='Pesquisa por'
                        fieldName='texto'
                        inputType='text'
                        placeholder={{ insideInput: false, text: 'Nome do cliente' }}
                        value={search}
                        onChange={(value) => { setSearch(String(value).toUpperCase()) }}
                        onPressReturnKey={() => { atualizaLista(startDate, endDate, search) }}
                    />
                </div>

                <button onClick={() => { atualizaLista(startDate, endDate, search) }}>Listar</button>
            </div>

            {
                (loadingVendas)
                    ? <LoadingAnimation />
                    : <div>
                        <table className={style.table_vendas}>
                            <thead>
                                <tr>
                                    <th>Nº Venda</th>
                                    <th>Data</th>
                                    <th>Cliente</th>
                                    <th>Valor</th>
                                    <th>Vendedor</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    listaVendas.length > 0 && listaVendas.map((venda, vendaIndex) => {
                                        const dataVenda = new Date(venda.dataEmissao!).toLocaleDateString()
                                        const valorVenda = Number(venda.vlrLiquido).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })

                                        return (
                                            <tr className={style.row_venda} key={`${venda.id}${vendaIndex}`} onClick={() => {
                                                setDadosVendaModal(venda)
                                                modalVenda.openModal()
                                            }}>
                                                <td className={`${style.column_detail_venda} ${style.col_n_venda}`}>{venda.id}</td>
                                                <td className={`${style.column_detail_venda} ${style.col_data}`}>{dataVenda}</td>
                                                <td className={`${style.column_detail_venda}`}>{venda.nome}</td>
                                                <td className={`${style.column_detail_venda} ${style.col_valor}`}>{valorVenda}</td>
                                                <td>{venda.operador ? venda.operador.nomeOperador : ""}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>

                            {/* <tfoot>
                                <tr>
                                    <td colSpan={4}>Total: {getTotalVendas().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                            </tfoot> */}
                        </table>

                        <div className={style.rodape_total_vendas}>
                            <span>{listaVendas.length} vendas</span>
                            <span>R$ {getTotalVendas().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>
            }

            <modalVenda.ModalComponent modalTitle='Consulta venda' modalButtons={{ cancelButton: { onClick: () => { modalVenda.closeModal() }, customCaption: "Fechar" } }}>
                <FormVenda venda={dadosVendaModal!} />
            </modalVenda.ModalComponent>
        </div>
    )
}

export default VendasPage