'use client'

import React, { useRef } from 'react'

import { ListaClientesEmDebito } from './ListaClientesEmDebito'
import { strToHex, hexToStr } from '@/app/helpers'

import { LoadingAnimation } from '../../components/LoadingAnimation'

import { useScripts } from "./scripts"
import style from "./page.module.css"

function PageContasReceber() {

    const { handleClickBotaoAtualizarLista, handleClickImprimeRelatorio, carregandoContasReceber, listaClientes } = useScripts()

    const selectTipoListaRef = useRef<HTMLSelectElement>(null)

    return (
        <div className={style.page_container}>

            <div className={style.toolbar_container}>

                <label>
                    <p>Exibindo a lista</p>
                    <select ref={selectTipoListaRef}>
                        <option value="ClientesExcetoPerdidos">Clientes em débito (exceto perdidos)</option>
                        <option value="ClientesIncluindoPerdios">Clientes em débito (incluido perdidos)</option>
                        <option value="ClientesVencidos30D">Clientes com vencimento +30 dias</option>
                        <option value="ClientesPerdidos">Clientes com débito perdidos</option>
                        <option value="ClientesHaver">Clientes em haver</option>
                    </select>
                </label>

                <button onClick={() => { handleClickBotaoAtualizarLista( selectTipoListaRef.current?.value! as any ) }}>Atualizar</button>
                <button disabled={listaClientes.length == 0} onClick={handleClickImprimeRelatorio}>Imprimir relatório</button>

            </div>


            <div>
                {
                    (carregandoContasReceber)
                    ? <LoadingAnimation />
                    : <ListaClientesEmDebito lista={listaClientes} />
                }
            </div>

        </div>
    )
}

export default PageContasReceber