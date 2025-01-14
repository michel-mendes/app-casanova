"use client"

import React, { useEffect, useState } from 'react'

import { useModal } from '@/hooks/useModal'

import { useProdutos } from '@/hooks/useProdutos'
import { useEntregasFuturas } from '@/hooks/useVendaEntregaFutura'

import { ListaProdutos } from './ListaProdutos'
import EditarProdutoPage from './editar/[idProduto]/page'

import { Input } from '@/app/components/Input'

import style from "./page.module.css"

function ProdutosPage() {

    const modalEditarProduto = useModal()

    const { listaProdutos, atualizaListaProdutos, carregandoProdutos } = useProdutos()
    const { listaEntregasFuturas, atualizaListaDeEntregasFuturas, aguardandoApiEntregaFutura } = useEntregasFuturas()

    const [idProdutoSelecionado, setIdProdutoSelecionado] = useState(0)

    function handleClicaBotaoAtualizaLista() {
        const inputPesquisa = document.getElementById("inputPesquisa") as HTMLInputElement

        atualizaListaProdutos(inputPesquisa.value)
    }

    useEffect(() => {atualizaListaDeEntregasFuturas("somente-nao-finalizadas")}, [])

    return (
        <div className={style.page_container}>
            <h1>Busca de Produtos</h1>

            <div className={style.container_pesquisa}>
                <span>
                    <Input inputType='text' fieldName='inputPesquisa' autocomplete={false} placeholder={{insideInput: true, text: "Busque por nome, código, observações..."}} onPressReturnKey={handleClicaBotaoAtualizaLista}/>
                </span>
        
                <button onClick={handleClicaBotaoAtualizaLista}>Atualizar</button>
            </div>

            <ListaProdutos
                listaProdutos={listaProdutos}
                carregandoProdutos={carregandoProdutos}
                listaEntregasFuturas={listaEntregasFuturas}
                setIdProdutoSelecionado={setIdProdutoSelecionado}
                openModal={modalEditarProduto.openModal}    
            />

            <modalEditarProduto.ModalComponent modalTitle='Editando produto' modalButtons={
                {
                    saveButton: {
                        onClick: () => {modalEditarProduto.closeModal()},
                        customCaption: "Salvar alterações"
                    },
                    cancelButton: {
                        onClick: () => {modalEditarProduto.closeModal()},
                        customCaption: "Cancelar alterações (ESC)"
                    }
                }}
            >
                <EditarProdutoPage params={{idProduto: String(idProdutoSelecionado)}} />
            </modalEditarProduto.ModalComponent>

        </div>
    )
}

export default ProdutosPage