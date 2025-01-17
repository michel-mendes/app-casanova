'use client'

import React, { useRef } from 'react'

import { ListaProdutosEntregaFutura } from './ListaProdutosEntregaFutura'

import { LoadingAnimation } from '@/app/components/LoadingAnimation'

import { useScripts } from "./scripts"
import style from "./page.module.css"

function PageContasReceber() {

    const { handleClickImprimeRelatorio, loadingEntregasFuturas, produtosPendentes } = useScripts()

    return (
        <div className={style.page_container}>

            <div className={style.toolbar_container}>
                <button disabled={produtosPendentes.length == 0} onClick={handleClickImprimeRelatorio}>Imprimir relatório</button>
            </div>


            <div>
                {
                    (loadingEntregasFuturas)
                    ? <LoadingAnimation />
                    : <ListaProdutosEntregaFutura listaProdutosEntregaPendente={produtosPendentes} />
                }
            </div>

        </div>
    )
}

export default PageContasReceber