'use client'

import React, { useEffect, useState } from 'react'

import Image from 'next/image'

import { useProdutosNuvem } from '@/hooks/useProdutosNuvem'
import { AtributosProdutoNuvem } from '@/database/models-mongoose/produtosNuvem/IProdutosNuvem'

import style from "./page.module.css"

function EditarProdutoPage({ params }: { params: { idProduto: string } }) {

    const { localizaProdutoPorCodigo } = useProdutosNuvem()

    const [produto, setProduto] = useState<AtributosProdutoNuvem>()

    useEffect(() => {

        localizaProdutoPorCodigo(Number(params.idProduto))
        .then(produto => {
            setProduto(produto)
        })
        .catch(error => {
            alert(`Erro: ${error.message}`)
        })

    }, [])

    return (
        <div>

            {/* Header */}
            <div>
                <span>Cadastros</span>
                <span>{">"}</span>
                <span>Produtos</span>
                <span>{">"}</span>
                <span>{produto?.descricao}</span>
            </div>

            {/* Dados do produto */}
            <div className={style.container_produto}>

                {/* Seção dados gerais do produto */}
                <div className={style.secao_dados_produto}>
                    <h2>Dados gerais do produto</h2>

                    <div className={style.container_dados_gerais}>

                        {/* Conteiner da imagem do produto */}
                        <div>
                            <label htmlFor="">
                                <span>Imagem <i>{"(opcional)"}</i></span>
                                <Image src={""} alt='Imagem do produto' />
                                <span>Adicionar imagem</span>
                            </label>
                        </div>

                        {/* Conteiner de dados do produto: nome, descrição, observações, etc... */}
                        <div>

                            <div className={style.container_cod_status}>
                                <label htmlFor="">
                                    <span>Id / código</span>
                                    <input type="text" name="" id="" value={produto?.idProduto} />
                                </label>

                                <label htmlFor="">
                                    <span>Código de barras</span>
                                    <input type="text" name="" id="" value={produto?.barras} />
                                </label>

                                <label htmlFor="">
                                    <span>Status</span>
                                    <input type="text" name="" id="" value={produto?.status == 1 ? "Ativo" : "Inativo"} />
                                </label>
                            </div>

                            <div className={style.container_nome_obs}>
                                <label htmlFor="">
                                    <span>Nome / descrição</span>
                                    <input type="text" name="" id="" value={produto?.descricao} />
                                </label>

                                <label htmlFor="">
                                    <span>Observações internas</span>
                                    <input type="text" name="" id="" value={produto?.obs} />
                                </label>
                            </div>
                        </div>

                    </div>


                </div>

                {/* Seção dados de estoque do produto */}
                <div className={style.secao_estoque_produto}>
                    <div>
                        <h2>Estoque do produto</h2>
                    </div>

                    <div>
                        <label htmlFor="">
                            <span>Estoque</span>
                            <input type="number" name="" id="" value={produto?.estoque} />
                        </label>

                        <label htmlFor="">
                            <span>Unidade de medida</span>
                            <input type="text" name="" id="" value={produto?.unidade} />
                        </label>

                        <label htmlFor="">
                            <span>m² / Pallet</span>
                            <input type="number" name="" id="" value={produto?.m2Pallet} />
                        </label>

                        <label htmlFor="">
                            <span>m² / Caixa</span>
                            <input type="number" name="" id="" value={produto?.m2Caixa} />
                        </label>

                        <label htmlFor="">
                            <span>Localização física</span>
                            <input type="text" name="" id="" value={produto?.localizacao} />
                        </label>
                    </div>
                </div>

                {/* Seção dados de valor do produto */}
                <div className={style.secao_valores_produto}>
                    <div>
                        <h2>Valores do produto</h2>
                    </div>

                    <div>
                        <label htmlFor="">
                            <span>Custo R$</span>
                            <input type="number" name="" id="" value={produto?.vlrCusto} />
                        </label>

                        <label htmlFor="">
                            <span>% À vista</span>
                            <input type="number" name="" id="" value={produto?.margemVista} />
                        </label>

                        <label htmlFor="">
                            <span>À vista</span>
                            <input type="number" name="" id="" value={produto?.vlrVista} />
                        </label>

                        <label htmlFor="">
                            <span>% À prazo</span>
                            <input type="number" name="" id="" value={produto?.margemPrazo} />
                        </label>

                        <label htmlFor="">
                            <span>À prazo</span>
                            <input type="number" name="" id="" value={produto?.vlrPrazo} />
                        </label>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default EditarProdutoPage