'use client'

import React, { useState, useEffect } from 'react'

import { sortArrayOfObjects } from '@/app/helpers'

import { IClienteDevedor } from '@/service/contasReceber'

interface ListaClientesEmDebitoProps {
    lista: Array<IClienteDevedor>
}

import style from "./index.module.css"

function ListaClientesEmDebito({ lista }: ListaClientesEmDebitoProps) {

    const [valorTotal, setValorTotal] = useState(0)
    const [listaOrdenadaPorValor, setListaOrdenadaPorValor] = useState<Array<IClienteDevedor>>([])

    function calculaValorTotal() {
        let vrTotal = 0

        for (const cliente of lista) {
            vrTotal += cliente.valor
        }

        setValorTotal(vrTotal)
    }

    useEffect(() => {
        const listaOrdenada = sortArrayOfObjects<IClienteDevedor>(lista, "valor", false)

        calculaValorTotal()
        setListaOrdenadaPorValor(listaOrdenada)
    }, [lista])

    return (
        <div className={style.container_lista}>
            <table className={style.tabela}>
                <thead>
                    <tr>
                        <th>Nome do cliente</th>
                        <th>Valor do débito</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        (listaOrdenadaPorValor && listaOrdenadaPorValor.length > 0)
                            ? listaOrdenadaPorValor.map((cliente, itemIndex) => {
                                return (

                                    <tr key={`${itemIndex}_${cliente.nome}`}>
                                        <td>{cliente.nome}</td>
                                        <td className={style.coluna_valor}>{Number(cliente.valor).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    </tr>

                                )
                            })
                            : <tr>
                                <td colSpan={2}>Não há nada aqui</td>
                            </tr>
                    }

                    <tr>
                        <td colSpan={2}><hr /></td>
                    </tr>
                    <tr>
                        <td>*** TOTAL ***</td>
                        <td className={style.coluna_valor}>{valorTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>

                </tbody>
            </table>
        </div>
    )
}

export { ListaClientesEmDebito }