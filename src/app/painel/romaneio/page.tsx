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
                                    <span>Entrega para: <span className={style.texto_nome_cliente}>{romaneio.nomeCliente}</span></span>
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