"use client"

import React from 'react'

import { useProdutos } from '@/hooks/useProdutos'
import { ListaProdutos } from './ListaProdutos'

import style from "./page.module.css"

function ProdutosPage() {

    const {listaProdutos, atualizaListaProdutos} = useProdutos()

    return (
        <div className={style.page_container}>
            <h1>Busca de Produtos</h1>

            <input type="text" id='inputPesquisa' />
            <button onClick={() => { 
                const inputPesquisa = document.getElementById("inputPesquisa") as HTMLInputElement

                atualizaListaProdutos(inputPesquisa.value)
            }}>Atualiza produtos</button>

            <ListaProdutos listaProdutos={listaProdutos} />
            
        </div>
    )
}

export default ProdutosPage