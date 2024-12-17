import React from 'react'

import { IVenda } from '@/app/interfaces'

import style from "./index.module.css"

interface AbaDadosVendaProps {
    dadosVenda: IVenda
}

function AbaDadosVenda({ dadosVenda }: AbaDadosVendaProps) {
    
    const descontoPercentual = Number( (Number(dadosVenda.vlrDesconto) * 100) / Number(dadosVenda.vlrBruto) )
    
    return (
        <>
            {/* Aba dados da venda */}
            <div className={style.container_form}>

                {/* Container dados da venda */}
                <div className={style.secao_dados_venda}>

                    {/* Título dados da venda */}
                    <div className={style.header_secao}>
                        <span>Dados da venda</span>
                    </div>

                    <div>
                        <label>
                            <span>Data venda</span>
                            <input type="text" readOnly value={new Date(dadosVenda.dataEmissao!).toLocaleString()} />
                        </label>

                        <label>
                            <span>Nº venda</span>
                            <input type="text" readOnly value={dadosVenda.id} />
                        </label>

                        <label>
                            <span>Tipo venda</span>
                            <input type="text" readOnly value={(dadosVenda.tipoVenda == "p" ? "À Prazo" : "À Vista")} />
                        </label>

                        <label>
                            <span>Entrega futura</span>
                            <input type="text" readOnly value={(dadosVenda.entregaFutura == 1 ? "Sim" : "Não")} />
                        </label>

                        <label>
                            <span>Vendedor</span>
                            <input type="text" readOnly value={`${dadosVenda.idOperador} - Vendedor`} /> {/* Código vendedor - Nome vendedor */}
                        </label>
                    </div>
                </div>


                {/* Container dados do cliente */}
                <div className={style.secao_dados_venda}>
                    <div className={style.header_secao}>
                        <span>Dados do cliente</span>
                    </div>

                    <div>
                        <label>
                            <span>Código / Nome cliente</span>
                            <input type="text" readOnly value={`${dadosVenda.idClientes} - ${dadosVenda.nome}`} />
                        </label>

                        <label>
                            <span>Endereço</span>
                            <input type="text" readOnly value={dadosVenda.endereco} />
                        </label>

                        <label>
                            <span>Número</span>
                            <input type="text" readOnly value={dadosVenda.numero} />
                        </label>

                        <label>
                            <span>Bairro</span>
                            <input type="text" readOnly value={dadosVenda.bairro} />
                        </label>

                        <label>
                            <span>Complemento</span>
                            <input type="text" readOnly value={dadosVenda.complemento} />
                        </label>

                        <label>
                            <span>Cidade</span>
                            <input type="text" readOnly value={dadosVenda.cidade} />
                        </label>

                        <label>
                            <span>Estado</span>
                            <input type="text" readOnly value={dadosVenda.uf} />
                        </label>

                        <label>
                            <span>CEP</span>
                            <input type="text" readOnly value={dadosVenda.cep} />
                        </label>

                        <label>
                            <span>Nº Telefone</span>
                            <input type="text" readOnly value={dadosVenda.telefone} />
                        </label>
                    </div>
                </div>

                {/* Container valores da venda */}
                <div className={style.secao_dados_venda}>

                    <div className={style.header_secao}>
                        <span>Valores da venda</span>
                    </div>

                    <div>
                        <label>
                            <span>Subtotal</span>
                            <input type="text" readOnly value={Number(dadosVenda.vlrBruto).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} />
                        </label>

                        <label>
                            <span>Frete</span>
                            <input type="text" readOnly value={Number(dadosVenda.vlrFrete).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} />
                        </label>

                        <label>
                            <span>Desconto</span>
                            <input type="text" readOnly value={Number(dadosVenda.vlrDesconto).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ` (${descontoPercentual.toFixed(2)}%)`} />
                        </label>

                        <label>
                            <span>Acréscimo</span>
                            <input type="text" readOnly value={Number(dadosVenda.vlrAcrescimo).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} />
                        </label>

                        <label>
                            <span>Total</span>
                            <input type="text" readOnly value={Number(dadosVenda.vlrLiquido).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} />
                        </label>

                        <label>
                            <span>Recebido</span>
                            <input type="text" readOnly value={Number(dadosVenda.vlrRecebido).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} />
                        </label>

                        <label>
                            <span>Troco</span>
                            <input type="text" readOnly value={Number(dadosVenda.vlrTroco).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} />
                        </label>

                    </div>
                </div>

            </div>
        </>
    )
}

export { AbaDadosVenda }