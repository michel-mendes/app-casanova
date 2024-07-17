"use client"

import React, { useEffect, useState, useRef } from 'react'
import { navigate } from "../actions"

import { useRomaneioEntrega } from '@/hooks/useRomaneioEntrega'
import { LoadingAnimation } from '../components/LoadingAnimation'

import style from "./page.module.css"
import { IRomaneioEntrega } from '@/database/models-mongoose/romaneioEntrega/IRomaneioEntrega'

function ConsultaEntregasPage() {

    const { listaRomaneios, atualizaListaRomaneios, loadingRomaneios, imprimeRomaneioNoServidor } = useRomaneioEntrega()

    useEffect(() => {
        atualizaListaRomaneios()
    }, [])

    return (
        <div className={style.page_container}>
            <h1 className={style.titulo_pagina}>Consulta Entregas</h1>

            {
                loadingRomaneios
                    ? <LoadingAnimation />
                    : <ListaEntregas listaRomaneios={listaRomaneios} imprimeRomaneioNoServidor={imprimeRomaneioNoServidor} />
            }
        </div>
    )
}

function ListaEntregas({ listaRomaneios, imprimeRomaneioNoServidor }: {
    listaRomaneios: Array<IRomaneioEntrega>
    imprimeRomaneioNoServidor: (id: string) => Promise<string | undefined>
}) {
    return (
        <div className={style.lista_conteiner}>

            {/* Header com colunas */}
            <div className={style.lista_header}>

                {/* Linha com os nomes das colunas */}
                <div className={style.linha_nomes_colunas}>
                    <span className={style.col_numero_entrega}>Nº entrega</span>
                    <span className={style.col_data}>Data</span>
                    <span className={style.col_cliente}>Cliente</span>
                    {/* <span className={style.col_endereco}>Endereço</span> */}
                </div>

            </div>

            {/* Body com dados */}
            <div>
                {
                    listaRomaneios.map(romaneio => {
                        return <LinhaDadosEntrega romaneio={romaneio} imprimeRomaneioNoServidor={imprimeRomaneioNoServidor} key={romaneio.id} />
                    })
                }
            </div>
        </div>
    )
}

function LinhaDadosEntrega({ romaneio, imprimeRomaneioNoServidor }: {
    romaneio: IRomaneioEntrega
    imprimeRomaneioNoServidor: (id: string) => Promise<string | undefined>
}) {

    const [isExpanded, setIsExpanded] = useState(false)
    const [lineHeight, setLineHeight] = useState<{ height: string } | {}>({})

    const lineRef = useRef<HTMLDivElement>(null)
    const detailsRef = useRef<HTMLDivElement>(null)

    function clickEntrega() {
        setIsExpanded(prevState => !prevState)
    }

    async function handleCliqueBotaoImprimirServidor() {
        if ( !confirm("Confirma impressão do romaneio?") ) return
        
        const resultadoImpressaoServidor = await imprimeRomaneioNoServidor(romaneio.id)

        alert(resultadoImpressaoServidor)
    }

    useEffect(() => {
        if (isExpanded) {
            const detailsHeight = detailsRef.current?.clientHeight!
            const actualLineHeight = lineRef.current?.clientHeight!

            setLineHeight({ height: Number(detailsHeight + actualLineHeight + 2).toString() + "px" })
        } else {
            setLineHeight({})
        }
    }, [isExpanded])

    return (
        // Linha de dados
        <div className={style.linha_dados_entrega} ref={lineRef} style={lineHeight}>

            <div className={style.dados} onClick={clickEntrega}>
                <span className={style.col_numero_entrega}>{romaneio.numeroEntrega}</span>
                <span className={style.col_data}>{new Date(romaneio.dataEntrega).toLocaleString()}</span>
                <span className={style.col_cliente}>{romaneio.nomeCliente}</span>
                {/* <span className={style.col_endereco}>{romaneio.enderecoEntrega}</span> */}
            </div>

            <div className={style.detalhes_entrega} ref={detailsRef} key={romaneio.id}>
                <p><b>Nº venda:</b> <span>{romaneio.idVenda}</span></p>
                <p><b>Endereço de entrega:</b> <span>{romaneio.enderecoEntrega}</span></p>
                <br />
                <h3>Produtos entregues</h3>
                <hr />
                {
                    romaneio.itensEntrega.map(produto => {
                        return (
                            <div key={produto.idItemVenda!}>
                                <br />

                                <span>{produto.qtde} {produto.unidade}</span>
                                &nbsp;
                                <span>{produto.descricao}</span>
                                &nbsp;
                                <span>{produto.observacoes}</span>

                                <br />
                                <br />
                                <hr />
                            </div>
                        )
                    })
                }

                {/* <a target="_blank" href={`/imprime-romaneio/${romaneio.id}`} rel="noopener noreferrer" className={style.button_container}>
                    <button className={style.imprime_romaneio}>Imprimir romaneio de entrega</button>
                </a> */}

                <div className={style.button_container}>
                    <button onClick={handleCliqueBotaoImprimirServidor} className={style.imprime_romaneio}>
                        <span>Imprimir romaneio</span>
                    </button>
                </div>
            </div>

        </div>
    )
}

export default ConsultaEntregasPage