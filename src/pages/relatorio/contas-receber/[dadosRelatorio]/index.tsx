import { Inter } from "next/font/google";

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import { hexToStr } from '@/app/helpers'

import style from "./index.module.css"

const inter = Inter({ subsets: ["latin"] })

function PageRelatorioContasReceber() {

    const pageParams = useParams<{dadosRelatorio: string}>()
    
    const [listaContasReceber, setListaContasReceber] = useState<Array<{nome: string, valor: number}>>([])
    const [totalContasReceber, setTotalContasReceber] = useState(0)
    
    useEffect(() => {
        if (pageParams) {
            try {
                const dados = JSON.parse( hexToStr(pageParams.dadosRelatorio) )
                let valorTotal = 0

                for (const cliente of dados) {
                    valorTotal += cliente.valor
                }

                setListaContasReceber(dados)
                setTotalContasReceber(valorTotal)
            } catch(error) {
                setListaContasReceber([])
            }
        }
    }, [pageParams])
    
    return (
        // <div className={inter.className}>
        <div className={style.page_container}>

            <div className={style.toolbar_container}>
                <button onClick={() => {print()}}>Imprimir relatório</button>
                <button onClick={() => {close()}}>Fechar</button>
            </div>

            {
                (!listaContasReceber || listaContasReceber.length == 0)
                ? <p>Não há dados suficientes para gerar relatório</p>
                : (

                    <div className={style.relatorio_container}>
                        {/* <div className={style.titulo_relatorio}>
                            <p>Relatório de contas a receber</p>
                        </div> */}
                        
                        <div className={style.linha_dados_cliente}>
                            <p><b>Nome do cliente</b></p>
                            <p><b>Valor</b></p>
                        </div>

                        {
                            listaContasReceber.map((cliente, index) => {
                                return (
                                    <div key={index} className={style.linha_dados_cliente}>
                                        <span>{cliente.nome}</span>
                                        <span>R$ {cliente.valor.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                    </div>
                                )
                            })
                        }
                        
                        <div className={style.linha_dados_cliente}>
                            <p><b>Total a receber</b></p>
                            <p><b>R$ {totalContasReceber.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</b></p>
                        </div>
                    </div>

                )
            }
        </div>
    )
}

export default PageRelatorioContasReceber