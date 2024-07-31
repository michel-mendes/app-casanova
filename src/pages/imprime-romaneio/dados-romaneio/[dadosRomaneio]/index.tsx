// "use client"

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

import { IRomaneioEntrega } from '@/database/models-mongoose/romaneioEntrega/IRomaneioEntrega'
import { LoadingAnimation } from '@/app/components/LoadingAnimation'

import style from "./style.module.css"

function ImprimeRomaneioPage() {
    const params = useParams()

    const [romaneio, setRomaneio] = useState<IRomaneioEntrega | null>(null)

    useEffect(() => {
        async function getRomaneio() {
            try {
                const dadosDecodificados = (params) ? decodeURIComponent( String(params.dadosRomaneio) ) : null
                const dadosRomaneio: IRomaneioEntrega | null = JSON.parse(dadosDecodificados || "null") || null

                setRomaneio(dadosRomaneio)

                // setTimeout(window.print, 1000)

            } catch (error: any) {
                setRomaneio(null)
                alert(error.message)
            }
        }

        getRomaneio()
    }, [params])

    return (
        <div>
            {
                (!romaneio)
                    ? <LoadingAnimation />
                    : <FormularioRomaneio romaneio={romaneio} />
            }
            <table></table>
        </div>
    )
}

function FormularioRomaneio({ romaneio }: { romaneio: IRomaneioEntrega }) {
    return (
        <div className={style.romaneio}>
            <div className={style.titulo_secao}>
                <span>ROMANEIO DE ENTREGA nº {romaneio.numeroEntrega}</span>
            </div>
            <div className={style.linha_numero_venda}>
                <span>Venda {romaneio.tipoVenda}</span>
            </div>

            <div className={style.linha_cliente_e_data}>
                <span className={style.celula_cliente}>Cliente</span>
                <span className={style.valor_nome_cliente}>{romaneio.nomeCliente}</span>
                <span className={style.celula_data_entrega}>Data entrega</span>
                <span className={style.valor_data_entrega}>{new Date(romaneio.dataEntrega).toLocaleDateString()}</span>
            </div>

            <div className={style.linha_cliente_e_data}>
                <span className={style.celula_cliente}>Endereço</span>
                <span className={style.valor_nome_cliente}>{romaneio.enderecoEntrega}</span>
                {/* <span className={style.celula_data_entrega}>Data entrega</span> */}
                {/* <span className={style.valor_data_entrega}>{new Date(romaneio.dataEntrega).toLocaleDateString()}</span> */}
            </div>

            <div className={style.titulo_secao}>
                <span>PRODUTOS CONSTANTES NA ENTREGA</span>
            </div>
            <div className={style.linha_colunas}>
                <span className={style.coluna_qtde_produto}>Quantidade</span>
                <span className={style.coluna_nome_produto}>Descrição do Produto</span>
                <span className={style.coluna_obs_produto}>Observações</span>
            </div>

            {
                (romaneio && romaneio.itensEntrega) && romaneio.itensEntrega.map(produto => {
                    return (
                        <div className={style.linha_valores} key={produto.idItemVenda}>
                            <span className={style.coluna_qtde_produto}>{Number(produto.qtde).toLocaleString(undefined, { maximumFractionDigits: 2 })} {String(produto.unidade).toLowerCase()}</span>
                            <span className={style.coluna_nome_produto}>{produto.descricao}</span>
                            <span className={style.coluna_obs_produto}>{produto.observacoes}</span>
                        </div>
                    )
                })
            }

            <div className={style.linha_adicionais}>
                <span>Observações</span>
                <span>{romaneio.observacoes}</span>
            </div>
            <div className={style.linha_adicionais}>
                <span>Nome do recebedor</span>
                <span></span>
            </div>

            <div className={style.linha_adicionais}>
                <span>Assinatura</span>
                <span className={style.assinatura}></span>
            </div>

            <div className={style.mensagem_rodape}>
                <span>NÃO ACEITAREMOS RECLAMAÇÕES POSTERIORES</span>
            </div>
        </div>
    )
}

export default ImprimeRomaneioPage