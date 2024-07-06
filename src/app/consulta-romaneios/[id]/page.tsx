"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"

import { useRomaneioEntrega } from '@/hooks/useRomaneioEntrega'
import { IRomaneioEntrega } from '@/database/models-mongoose/romaneioEntrega/IRomaneioEntrega'

import style from "./page.module.css"

function EntregaIdPage({ params }: { params: { id: string } }) {

    const { exibeRomaneio } = useRomaneioEntrega()
    const [romaneio, setRomaneio] = useState<IRomaneioEntrega>()



    useEffect(() => {
        async function getRomaneio() {
            const romaneio = await exibeRomaneio(params.id)

            if (romaneio) {
                setRomaneio(romaneio)
            }
        }

        getRomaneio()
    }, [])

    return (
        <div>
            {
                (!romaneio)
                    ? <span>Carregando romaneio, aguarde...</span>
                    : <>
                        <table className={style.tabela}>
                            <tbody>
                                <tr className={style.titulo_romaneio}>
                                    <td colSpan={4}>ROMANEIO DE ENTREGA nº {romaneio.numeroEntrega}</td>
                                </tr>
                                {/* <tr className={style.numero_venda}>
                                    <td colSpan={4}>Venda nº {romaneio.idVenda}</td>
                                </tr> */}
                                <tr>
                                    <td className={style.fundo_prata}>Cliente</td>
                                    <td>{romaneio.nomeCliente}</td>
                                    <td className={style.fundo_prata}>Data</td>
                                    <td>{new Date(romaneio.dataEntrega).toLocaleDateString()}</td>
                                </tr>
                                <tr>
                                    <td className={style.fundo_prata}>Endereço</td>
                                    <td colSpan={3}>{romaneio.enderecoEntrega}</td>
                                </tr>
                                <tr>
                                    <td colSpan={4} className={`${style.fundo_prata}`}>PRODUTOS</td>
                                </tr>
                                <tr className={style.fundo_prata}>
                                    <td>Quantidade</td>
                                    <td colSpan={2}>Descrição</td>
                                    <td>Observações</td>
                                </tr>
                                {
                                    romaneio.itensEntrega.map(produto => {
                                        return (
                                            <tr>
                                                <td>{produto.qtde} {produto.unidade}</td>
                                                <td colSpan={2}>{produto.descricao}</td>
                                                <td>{produto.observacoes}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>

                        <a target="_blank" href={`/imprime-romaneio/${romaneio.id}`} rel="noopener noreferrer">
                                <button>Imprimir romaneio</button>
                            {/* <div className={`${dark ? styles.iconTwitterWhite : styles.iconTwitter} mr-3`} /> */}
                        </a>
                    </>
            }
        </div>
    )
}

export default EntregaIdPage