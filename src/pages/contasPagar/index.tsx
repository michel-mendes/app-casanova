import React, { useState } from 'react'
import useContasPagar from '@/hooks/useContasPagar'
import { ContasPagarTotalSemanas } from '@/service/types'
import moment from 'moment'

function index() {
    const { listaTotalSemanal, listaSemanaAtual } = useContasPagar()

    const [semanalTotal, setSemanalTotal] = useState<ContasPagarTotalSemanas>([])
    const [showSemanalTotal, setShowSemanalTotal] = useState(false)

    const [listaContasPagar, setListaContasPagar] = useState([])
    const [showSemanaAtual, setShowSemanaAtual] = useState(false)

    function getTotalSemanas(): number {
        let total = 0

        for (const semana of semanalTotal) {
            total += semana.totalSemana
        }

        return total
    }

    function getTotalSemanaAtual() {
        let total = 0

        for (const contaPagar of listaContasPagar) {
            total += (contaPagar as any).vlrParcela
        }

        return total
    }

    async function handleClickButtonSemanalTotal() {
        setSemanalTotal(await listaTotalSemanal())
        setShowSemanalTotal(true)
        setShowSemanaAtual(false)
    }

    async function handleClickButtonSemanaAtual() {
        setListaContasPagar(await listaSemanaAtual())
        setShowSemanalTotal(false)
        setShowSemanaAtual(true)
    }

    return (
        <div>
            <h3>Contas a pagar</h3>

            <button onClick={handleClickButtonSemanalTotal}>Contas a pagar total semanal</button>
            <button onClick={handleClickButtonSemanaAtual}>Contas a pagar semana atual</button>

            {
                showSemanalTotal && (
                    <div>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Nº Semana</td>
                                    <td colSpan={3}>Data semana</td>
                                    <td>Valor R$</td>
                                </tr>
                                {
                                    semanalTotal.map((semana, index) => {
                                        const inicioSemana = moment(semana.inicioSemana)
                                        const fimSemana = moment(semana.fimSemana)

                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{inicioSemana.add(3, "hours").toDate().toLocaleDateString()}</td>
                                                <td>até</td>
                                                <td>{fimSemana.toDate().toLocaleDateString()}</td>
                                                <td>{semana.totalSemana.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</td>
                                            </tr>
                                        )
                                    })
                                }

                                <tr>
                                    <td colSpan={4}>Total</td>
                                    <td>
                                        {
                                            getTotalSemanas().toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )
            }

            {
                showSemanaAtual && (
                    <div>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Vencimento</td>
                                    <td>Fornecedor</td>
                                    <td>Documento</td>
                                    <td>Valor</td>
                                </tr>

                                {
                                    listaContasPagar.map((contaPagar: any, index) => {
                                        const vencimento = moment(contaPagar.dtVencimento).utc(false)
                                        const valor = Number(contaPagar.vlrParcela).toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2})

                                        return (
                                            <tr key={index}>
                                                <td>{vencimento.format("DD/MM/yyyy")}</td>
                                                <td>{contaPagar.dadosFornecedor.razao}</td>
                                                <td>{contaPagar.documento}</td>
                                                <td>{valor}</td>
                                            </tr>
                                        )
                                    })
                                }

                                <tr>
                                    <td colSpan={3}>Total semana atual</td>
                                    <td>{getTotalSemanaAtual().toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )
            }
        </div>
    )
}

export default index