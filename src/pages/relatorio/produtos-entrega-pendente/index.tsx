import { Inter } from "next/font/google";

import { ProdutoEntregaFutura } from "@/app/painel/produtos/entrega-futura/scripts";

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import { hexToStr } from '@/app/helpers'

import style from "./index.module.css"

const inter = Inter({ subsets: ["latin"] })

function PageRelatorioProdutosEntregaFutura() {

    const [listaProdutosEntregaFutura, setListaProdutosEntregaFutura] = useState<Array<ProdutoEntregaFutura>>([])

    useEffect(() => {
        try {
            const dadosLocalStorage = localStorage.getItem("produtos-entrega-futura") || "[]"
            const dados: Array<ProdutoEntregaFutura> = JSON.parse(hexToStr(dadosLocalStorage))

            setListaProdutosEntregaFutura(dados)
        } catch (error) {
            setListaProdutosEntregaFutura([])
        }
    }, [])

    return (
        // <div className={inter.className}>
        <div className={style.page_container}>

            <div className={style.toolbar_container}>
                <button onClick={() => { print() }}>Imprimir relatório</button>
                <button onClick={() => { close() }}>Fechar</button>
            </div>

            {
                (!listaProdutosEntregaFutura || listaProdutosEntregaFutura.length == 0)
                    ? <p>Não há dados suficientes para gerar relatório</p>
                    : (

                        <div className={style.relatorio_container}>
                            {/* <div className={style.titulo_relatorio}>
                            <p>Relatório de contas a receber</p>
                        </div> */}

                            <div className={style.linha_dados_cliente}>
                                <p className={style.coluna_descricao}><b>Descrição do produto</b></p>
                                <p><b>Quantidade para entregar</b></p>
                            </div>

                            {
                                listaProdutosEntregaFutura.map((produto, index) => {
                                    if (produto.totalVendido && produto.totalVendido > 0.2) {
                                        return (
                                            <>
                                                <div key={index} className={style.linha_dados_cliente}>
                                                    <span className={style.coluna_descricao}>{produto.descricaoProduto}</span>
                                                    <span>{produto.totalVendido.toLocaleString(undefined, { maximumFractionDigits: 2 })} {produto.unidade}</span>
                                                </div>
                                            </>
                                        )
                                    } else return null
                                })
                            }

                            {/* <div className={style.linha_dados_cliente}>
                            <p><b>Total a receber</b></p>
                            <p><b>R$ {totalContasReceber.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</b></p>
                        </div> */}
                        </div>

                    )
            }
        </div>
    )
}

export default PageRelatorioProdutosEntregaFutura