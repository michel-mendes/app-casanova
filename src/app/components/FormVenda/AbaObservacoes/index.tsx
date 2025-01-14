import { IVenda } from '@/app/interfaces';
import React from 'react'

import style from "./index.module.css"

interface AbaObservacoesProps {
    dadosVenda: IVenda;
}

function AbaObservacoes({ dadosVenda }: AbaObservacoesProps) {
    return (
        <div className={style.container_observacoes}>
            <textarea>{dadosVenda.obs}</textarea>
        </div>
    )
}

export default AbaObservacoes