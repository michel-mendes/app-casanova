"use client"

import React, { useEffect } from 'react'

import { useProdutos } from '@/hooks/useProdutos'
import { useEntregasFuturas } from '@/hooks/useVendaEntregaFutura'

import { ListaProdutos } from './ListaProdutos'

import { Input } from '@/app/components/Input'

import style from "./page.module.css"

function ProdutosPage() {

    const { listaProdutos, atualizaListaProdutos } = useProdutos()
    const {listaEntregasFuturas, atualizaListaDeEntregasFuturas, aguardandoApiEntregaFutura} = useEntregasFuturas()

    function handleClicaBotaoAtualizaLista() {
        const inputPesquisa = document.getElementById("inputPesquisa") as HTMLInputElement

        atualizaListaProdutos(inputPesquisa.value)
    }

    useEffect(() => {atualizaListaDeEntregasFuturas()}, [])

    return (
        <div className={style.page_container}>
            <h1>Busca de Produtos</h1>

            <div className={style.container_pesquisa}>
                <span>
                    <Input inputType='text' fieldName='inputPesquisa' autocomplete={false} placeholder={{insideInput: true, text: "Busque por nome, código, observações..."}} onPressReturnKey={handleClicaBotaoAtualizaLista}/>
                </span>
        
                <button onClick={handleClicaBotaoAtualizaLista}>Atualizar</button>
            </div>

            <ListaProdutos listaProdutos={listaProdutos} listaEntregasFuturas={listaEntregasFuturas} />

        </div>
    )
}

export default ProdutosPage