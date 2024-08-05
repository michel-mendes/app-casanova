'use client'

import React from 'react'

import { IClienteDevedor } from '@/service/contasReceber'

interface ListaClientesEmDebitoProps {
    lista: Array<IClienteDevedor>
}

function ListaClientesEmDebito({ lista }: ListaClientesEmDebitoProps) {
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Nome do cliente</th>
                        <th>Valor do débito</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        (lista && lista.length > 0)
                            ? lista.map(cliente => {
                                return (

                                    <tr>
                                        <td>{cliente.nome}</td>
                                        <td>{Number(cliente.valor).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    </tr>

                                )
                            })
                            :   <tr>
                                    <td colSpan={2}>Não há nada aqui</td>
                                </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

export { ListaClientesEmDebito }