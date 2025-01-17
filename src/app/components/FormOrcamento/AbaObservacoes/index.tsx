import React from 'react'
import { OrcamentoAttributes } from '@/database/models/orcamentos/Orcamento';

import style from "./index.module.css"

interface AbaObservacoesOrcamentoProps {
    dadosOrcamento: OrcamentoAttributes;
}

function AbaObservacoesOrcamento({ dadosOrcamento }: AbaObservacoesOrcamentoProps) {
    return (
        <div className={style.container_observacoes}>
            <textarea>{dadosOrcamento.obs}</textarea>
        </div>
    )
}

export { AbaObservacoesOrcamento }