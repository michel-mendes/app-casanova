"use client"

import React from 'react'
import useScripts from './scripts'

import { ProdutoRomaneio } from './ProdutoRomaneio'

import style from "./page.module.css"

function RomaneioPage() {

    const scripts = useScripts()

    return (
        <div className={style.page_container}>
            <h1>Romaneios de Entrega</h1>


            <div className={style.romaneios_container}>
                {
                    scripts.romaneios.length < 1
                    ? (
                        <div className={style.container_sem_romaneio}>
                            <p>Não há nenhum romaneio para preenchimento no momento</p>
                        </div>
                    )
                    : scripts.romaneios.map(romaneio => {
                        return (
                            <div className={style.romaneio} key={romaneio.idVenda}>

                                {/* Header */}
                                <div className={style.romaneio_header}>
                                    <span className={style.container_nome_endereco}>
                                        <span>Entrega para: </span> <span className={style.texto_nome_cliente}>{romaneio.nomeCliente}</span>
                                        <br /><br />
                                        <span className={style.container_endereco}><span>Endereço: </span><input className={style.input_edita_endereco_entgega} type="text" value={romaneio.enderecoEntrega} onChange={(e) => {
                                            scripts.setRomaneios(prevState => {
                                                const romaneioEnderecoAtualizado = prevState.map(prevRomaneio => {
                                                    if (prevRomaneio.idVenda == romaneio.idVenda) {
                                                        return {
                                                            ...prevRomaneio,
                                                            enderecoEntrega: e.target.value
                                                        }
                                                    }

                                                    return prevRomaneio
                                                })

                                                return romaneioEnderecoAtualizado
                                            })

                                        }} /></span>
                                    </span>

                                    <span className={style.texto_data_entrega}>{new Date(romaneio.dataEntrega).toLocaleDateString()}</span>
                                </div>

                                {/* Body / Items */}
                                <div>
                                    {
                                        romaneio.itensEntrega.map((itemEntrega, index) => {
                                            return <ProdutoRomaneio romaneio={romaneio} listaRomaneios={scripts.romaneios} setListaRomaneios={scripts.setRomaneios} produto={itemEntrega} myIndex={index} key={itemEntrega.idItemVenda} idInputObs={`inputObservacoesItemEntregar_${itemEntrega.idItemVenda}`} />
                                        })
                                    }
                                </div>

                                {/* Footer */}
                                <div className={style.romaneio_footer}>

                                    <label>
                                        <p>Observações gerais:</p>
                                        <input type="text" value={romaneio.observacoes} onChange={(e) => {
                                            scripts.setRomaneios(prevState => {
                                                const romaneioObsAtualizado = prevState.map(prevRomaneio => {
                                                    if (prevRomaneio.idVenda == romaneio.idVenda) {
                                                        return {
                                                            ...prevRomaneio,
                                                            observacoes: e.target.value
                                                        }
                                                    }

                                                    return prevRomaneio
                                                })

                                                return romaneioObsAtualizado
                                            })
                                        }} />
                                    </label>

                                    <button className={style.button_salvar_entrega} onClick={() => { scripts.handleClickBotaoSalvaRomaneio(romaneio) }}>Finalizar romaneio e salvar entrega</button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default RomaneioPage