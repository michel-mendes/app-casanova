import React, { useEffect, useState } from 'react'

import { useVendas } from '@/hooks/useVendas'

import { AbaDetalhamentoVenda } from './AbaDetalhamentoVenda'
import { AbaDadosItens } from './AbaDadosItens'
import { IVenda } from '@/app/interfaces'

import { LoadingAnimation } from '../LoadingAnimation'

import style from "./index.module.css"
import { TabControl } from '../TabControl'
import AbaObservacoes from './AbaObservacoes'

interface FormVendaProps {
    venda: IVenda | null
}

function FormVenda({ venda }: FormVendaProps) {

    const { localizaVenda, loadingVendas } = useVendas()

    const [exibirCustosMargem, setExibirCustosMargem] = useState(false)

    const [dadosVenda, setDadosVenda] = useState<IVenda | null>(null)

    useEffect(() => {
        async function fetchVenda() {
            if (!venda) return
            
            const vendaLocalizada = await localizaVenda(venda.id!)

            setDadosVenda(vendaLocalizada!)
        }

        fetchVenda()
    }, [])

    return (
        // Container da venda
        <div className={style.container_venda}>

            {
                (loadingVendas)

                    // Animação de carregando se estiver aguardando API
                    ? <LoadingAnimation />

                    // Se não localizar a venda, renderize "Venda não localizada"
                    : (!venda)
                    ? (
                        <div className={style.container_venda_inexistente}>
                            <span>Venda não localizada!</span>
                        </div>
                    )

                    // Se venda for localizada, renderizar TabControl com dados da venda
                    : (
                        <TabControl tabs={[
                            {
                                tabTitle: "Dados venda",
                                tabContent: <AbaDetalhamentoVenda dadosVenda={dadosVenda!} exibirCustosMargem={exibirCustosMargem} />
                            },
                            {
                                tabTitle: "Produtos",
                                tabContent: <AbaDadosItens dadosVenda={dadosVenda!} exibirCustosMargem={exibirCustosMargem} />
                            },
                            {
                                tabTitle: "Observações",
                                tabContent: <AbaObservacoes dadosVenda={dadosVenda!} />
                            }
                        ]} />
                    )
            }

            <div className={style.container_check_margem}>
                <label>
                    <span>Exibir custos e margem</span>
                    <input
                        type="checkbox"
                        checked={exibirCustosMargem}
                        onChange={() => {
                            setExibirCustosMargem(prevState => !prevState)
                        }}
                    />
                </label>
            </div>

        </div>
    )
}

export { FormVenda }