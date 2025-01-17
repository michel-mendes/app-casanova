"use client"

import React, { useState } from 'react'

import { useModal } from '@/hooks/useModal'

import { useOrcamentos } from '@/hooks/useOrcamentos'
import { OrcamentoAttributes } from '@/database/models/orcamentos/Orcamento'
import { FormOrcamento } from '@/app/components/FormOrcamento'

import { LoadingAnimation } from '../../components/LoadingAnimation'
import { Input } from '../../components/Input'

import moment from 'moment'

import style from "./page.module.css"

function OrcamentosPage() {

    const modalOrcamento = useModal()
    const [dadosOrcamentoModal, setDadosOrcamentoModal] = useState<OrcamentoAttributes>()

    const [startDate, setStartDate] = useState(new Date(Date.now()).toJSON().slice(0, 10))
    const [endDate, setEndDate] = useState(new Date(Date.now()).toJSON().slice(0, 10))
    const [search, setSearch] = useState("")

    const { listaOrcamentos, atualizaLista, loadingOrcamentos } = useOrcamentos()

    function getTotalOrcamentos(): number {
        let valorTotalOrcamentos: number = 0

        for (const orcamento of listaOrcamentos) {
            valorTotalOrcamentos += Number(orcamento.vlrLiquido || 0)
        }

        return valorTotalOrcamentos
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
                (loadingOrcamentos)
                    ? <LoadingAnimation />
                    : <div>
                        <table className={style.table_orcamentos}>
                            <thead>
                                <tr>
                                    <th>Nº Orçamento</th>
                                    <th>Data</th>
                                    <th>Cliente</th>
                                    <th>Valor</th>
                                    <th>Funcionário</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    listaOrcamentos.length > 0 && listaOrcamentos.map((orcamento, indexOrcamento) => {
                                        const dataOrcamento = new Date(orcamento.dataEmissao!).toLocaleDateString()
                                        const valorOrcamento = Number(orcamento.vlrLiquido).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })

                                        return (
                                            <tr className={style.row_orcamento} key={`${orcamento.id}${indexOrcamento}`} onClick={() => {
                                                setDadosOrcamentoModal(orcamento)
                                                modalOrcamento.openModal()
                                            }}>
                                                <td className={`${style.column_detail_orcamento} ${style.col_n_orcamento}`}>{orcamento.id}</td>
                                                <td className={`${style.column_detail_orcamento} ${style.col_data}`}>{dataOrcamento}</td>
                                                <td className={`${style.column_detail_orcamento}`}>{orcamento.clienteNome}</td>
                                                <td className={`${style.column_detail_orcamento} ${style.col_valor}`}>{valorOrcamento}</td>
                                                <td>{orcamento.operador ? orcamento.operador.nomeOperador : ""}</td>
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

                        <div className={style.rodape_total_orcamentos}>
                            <span>{listaOrcamentos.length} vendas</span>
                            <span>R$ {getTotalOrcamentos().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>
            }

            <modalOrcamento.ModalComponent modalTitle={`Consulta orçamento ${(dadosOrcamentoModal ? "Nº " + dadosOrcamentoModal.id : "")}`} modalButtons={{ cancelButton: { onClick: () => { modalOrcamento.closeModal() }, customCaption: "Fechar" } }}>
                <FormOrcamento orcamento={dadosOrcamentoModal!} />
            </modalOrcamento.ModalComponent>
        </div>
    )
}

export default OrcamentosPage