import React, { useEffect, useState } from 'react'

import { TabControl } from '../TabControl'

import { useOrcamentos } from '@/hooks/useOrcamentos'
import { OrcamentoAttributes } from '@/database/models/orcamentos/Orcamento'

import { LoadingAnimation } from '../LoadingAnimation'

import style from "./index.module.css"
import { AbaDetalhamentoOrcamento } from './AbaDetalhamentoOrcamento'
import { AbaDadosItensOrcamento } from './AbaDadosItens'
import { AbaObservacoesOrcamento } from './AbaObservacoes'

interface FormOrcamentoProps {
    orcamento: OrcamentoAttributes | null
}

function FormOrcamento({ orcamento }: FormOrcamentoProps) {

    const { localizaOrcamento, loadingOrcamentos } = useOrcamentos()

    const [exibirCustosMargem, setExibirCustosMargem] = useState(false)

    const [dadosOrcamento, setDadosOrcamento] = useState<OrcamentoAttributes | null>(null)

    useEffect(() => {
        async function fetchOrcamento() {
            if (!orcamento) return
            
            const orcamentoLocalizado = await localizaOrcamento(orcamento.id!)

            setDadosOrcamento(orcamentoLocalizado!)
        }

        fetchOrcamento()
    }, [])

    return (
        // Container do orcamento
        <div className={style.container_venda}>

            {
                (loadingOrcamentos)

                    // Animação de carregando se estiver aguardando API
                    ? <LoadingAnimation />

                    // Se não localizar a orcamento, renderize "Orçamento não localizada"
                    : (!orcamento)
                    ? (
                        <div className={style.container_venda_inexistente}>
                            <span>Orçamento não localizado!</span>
                        </div>
                    )

                    // Se orcamento for localizada, renderizar TabControl com dados da orcamento
                    : (
                        <TabControl tabs={[
                            {
                                tabTitle: "Dados orcamento",
                                tabContent: <AbaDetalhamentoOrcamento dadosOrcamento={dadosOrcamento!} exibirCustosMargem={exibirCustosMargem} />
                            },
                            {
                                tabTitle: "Produtos",
                                tabContent: <AbaDadosItensOrcamento dadosOrcamento={dadosOrcamento!} exibirCustosMargem={exibirCustosMargem} />
                            },
                            {
                                tabTitle: "Observações",
                                tabContent: <AbaObservacoesOrcamento dadosOrcamento={dadosOrcamento!} />
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

export { FormOrcamento }