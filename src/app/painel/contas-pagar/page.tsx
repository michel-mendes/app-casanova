"use client"

import React, { useEffect, useState } from 'react'

import { useContasPagar } from '@/hooks/useContasPagar'

import { Input } from '@/app/components/Input'

import style from "./page.module.css"
import moment from 'moment'

function ContasPagarPage() {

    const { atualizaListaContasPagar, listaContasPagar, carregandoContasPagar } = useContasPagar()

    const [startDate, setStartDate] = useState(moment(Date.now()).startOf("week").subtract(0, "day").startOf("day").toJSON().slice(0, 10))
    const [endDate, setEndDate] = useState(moment(Date.now()).endOf("week").subtract(1, "day").endOf("day").toJSON().slice(0, 10))
    const [search, setSearch] = useState("")

    const valorTotalContasPagar = (() => {
        let total = 0

        for (const contaPagar of listaContasPagar) {
            total += Number(contaPagar.vlrParcela)
        }

        return total
    })()

    useEffect(() => {
        console.log(listaContasPagar)
    }, [listaContasPagar])

    return (
        <div className={style.page_container}>
            <h1>Contas a Pagar</h1>

            <div className={style.filter_container}>
                <div>
                    <Input label='Data inicial' fieldName='dataInicial' inputType='date' onChange={(e) => { setStartDate(e as string) }} value={startDate} />
                    <button onClick={() => {
                        setStartDate(moment(startDate).subtract(1, "week").toISOString().slice(0, 10))
                        setEndDate(moment(endDate).subtract(1, "week").toISOString().slice(0, 10))
                    }}>Período anterior (-30D)</button>
                </div>

                <div>
                    <Input label='Data final' fieldName='dataFinal' inputType='date' onChange={(e) => { setEndDate(e as string) }} value={endDate} />
                    <button onClick={() => {
                        setStartDate(moment(startDate).add(1, "week").toISOString().slice(0, 10))
                        setEndDate(moment(endDate).add(1, "week").toISOString().slice(0, 10))
                    }}>Próximo período (+30D)</button>
                </div>

                <Input label='Pesquisa' fieldName='texto' inputType='text' placeholder={{ insideInput: false, text: 'Ex: Nome fornecedor, número documento, histórico...' }} value={search} onChange={(value) => { setSearch(String(value)) }} />

                <button onClick={() => { atualizaListaContasPagar(startDate, endDate, search) }}>Listar</button>
            </div>

            <div className={style.table_container}>
                <table>
                    <thead>
                        <tr>
                            <th>Pago</th>
                            <th>Razão social</th>
                            <th>Plano contas</th>
                            <th>Vencimento</th>
                            <th>Nº parcela</th>
                            <th>Nota / documento</th>
                            <th>Valor</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            (listaContasPagar && listaContasPagar.length > 0)
                                ? listaContasPagar.map(contaPagar => {
                                    return (
                                        <tr key={contaPagar.id}>
                                            <td>{contaPagar.quitado == 0 ? "NÃO" : "SIM"}</td>
                                            <td>{contaPagar.fornecedor ? contaPagar.fornecedor.razao : "*"}</td>
                                            <td>{contaPagar.planoContas ? contaPagar.planoContas.descricao : "*"}</td>
                                            <td>{moment(contaPagar.dtVencimento!).add(3, "hours").toDate().toLocaleDateString()}</td>
                                            <td>{contaPagar.parcela}</td>
                                            <td>{contaPagar.documento}</td>
                                            <td>{Number(contaPagar.vlrParcela).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                        </tr>
                                    )
                                })
                                : (
                                    <tr>
                                        <td colSpan={7}>Não há contas para esse período</td>
                                    </tr>
                                )
                        }
                    </tbody>
                </table>
            </div>

            <div>
                <span>Qtde contas: {listaContasPagar.length}</span>
                <span>Total: R$ {valorTotalContasPagar.toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2})}</span>
            </div>
        </div>
    )
}

export default ContasPagarPage