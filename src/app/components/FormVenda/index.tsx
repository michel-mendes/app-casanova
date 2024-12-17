import React, { useEffect, useState } from 'react'

import { useVendas } from '@/hooks/useVendas'

import { AbaDadosVenda } from './AbaDadosVenda'
import { AbaDadosItens } from './AbaDadosItens'
import { IVenda } from '@/app/interfaces'

import { LoadingAnimation } from '../LoadingAnimation'

import style from "./index.module.css"

interface FormVendaProps {
    venda: IVenda
}

function FormVenda({ venda }: FormVendaProps) {

    const { localizaVenda, loadingVendas } = useVendas()

    const [dadosVenda, setDadosVenda] = useState<IVenda | null>(null)

    const [abaAtiva, setAbaAtiva] = useState<"DADOS_VENDA" | "DADOS_ITENS">("DADOS_VENDA")

    useEffect(() => {
        async function fetchVenda() {
            const vendaLocalizada = await localizaVenda(venda.id!)

            setDadosVenda(vendaLocalizada!)
        }

        fetchVenda()
    }, [])

    return (
        // Container da venda
        <div className={style.container_venda}>

            {
                (loadingVendas || !dadosVenda)
                    ? <LoadingAnimation />
                    : (
                        <>
                            {/* Container abas */}
                            <div>
                                <button onClick={() => { setAbaAtiva("DADOS_VENDA") }}>Dados venda</button>
                                <button onClick={() => { setAbaAtiva("DADOS_ITENS") }}>Produtos</button>
                            </div>
                            {
                                (abaAtiva == "DADOS_VENDA")
                                    ? <AbaDadosVenda dadosVenda={dadosVenda} />
                                    : <AbaDadosItens dadosVenda={dadosVenda} />
                            }
                        </>
                    )
            }

        </div>
    )
}

export { FormVenda }