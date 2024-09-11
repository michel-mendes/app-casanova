"use client"

import React from 'react'

import { useProdutos } from '@/hooks/useProdutos'
import { ListaProdutos } from './ListaProdutos'

import { Input } from '@/app/components/Input'

import style from "./page.module.css"

function ProdutosPage() {

    const { listaProdutos, atualizaListaProdutos } = useProdutos()

    return (
        <div className={style.page_container}>
            <h1>Busca de Produtos</h1>

            <div className={style.contaier_pesquisa}>
                <Input inputType='text' fieldName='inputPesquisa' autocomplete={false} placeholder={{insideInput: true, text: "Busque por nome, código, observações..."}} />
        
                <button onClick={() => {
                    const inputPesquisa = document.getElementById("inputPesquisa") as HTMLInputElement

                    atualizaListaProdutos(inputPesquisa.value)
                }}>Buscar</button>
            </div>

            <ListaProdutos listaProdutos={listaProdutos} />

        </div>
    )
}

export default ProdutosPage