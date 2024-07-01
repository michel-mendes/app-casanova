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

    const router = useRouter()

    return (
        <div>
            {
                (!romaneio)
                    ? <span>Carregando romaneio, aguarde...</span>
                    : <>
                        <table className={style.tabela}>
                            <tbody>
                                <tr className={style.titulo_romaneio}>
                                    <td colSpan={4}>ROMANEIO DE ENTREGA</td>
                                </tr>
                                <tr className={style.numero_venda}>
                                    <td colSpan={4}>Venda nº {romaneio.idVenda}</td>
                                </tr>
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

function FormularioRomaneio({ romaneio }: { romaneio: IRomaneioEntrega }) {
    return (
        <div>
            <div>
                <span>ROMANEIO DE ENTREGA</span>
            </div>
            <div>
                <span>Venda nº {romaneio.idVenda}</span>
            </div>

            <div>
                <span>Cliente</span>
                <span>{romaneio.nomeCliente}</span>
                <span>Data entrega</span>
                <span>{new Date(romaneio.dataEntrega).toLocaleDateString()}</span>
            </div>

            <div>
                <span>PRODUTOS CONSTANTES NA ENTREGA</span>
            </div>
            <div>
                <span>Quantidade</span>
                <span>Descrição do Produto</span>
                <span>Observações</span>
            </div>

            {
                romaneio.itensEntrega.map(produto => {
                    return (
                        <div>
                            <span>{produto.qtde} {String(produto.unidade).toLowerCase()}</span>
                            <span>{produto.descricao}</span>
                            <span>{produto.observacoes}</span>
                        </div>
                    )
                })
            }

            <div>
                <span>Observações</span>
                <span>{romaneio.observacoes}</span>
            </div>
            <div>
                <span>Nome do recebedor</span>
                <span></span>
            </div>

            <div>
                <span>Assinatura</span>
                <span></span>
            </div>

            <div>
                <span>NÃO ACEITAREMOS RECLAMAÇÕES POSTERIORES</span>
            </div>
        </div>
    )
}

export default EntregaIdPage