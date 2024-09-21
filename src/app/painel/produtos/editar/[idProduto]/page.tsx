'use client'

import React, { useEffect, useState } from 'react'

import Image from 'next/image'

import { useProdutos } from '@/hooks/useProdutos'
import { AtributosProduto } from '@/database/models/produtos/Produto'

function EditarProdutoPage({ params }: { params: { idProduto: string } }) {

    const {listaProdutos, atualizaListaProdutos} = useProdutos()

    const [produto, setProduto] = useState<AtributosProduto>()

    useEffect(() => { atualizaListaProdutos() }, [])

    useEffect(() => {
        if (listaProdutos && listaProdutos.length > 0) {
            const produtoLocalizado = listaProdutos.find(item => item.id == Number(params.idProduto))

            setProduto(produtoLocalizado)
        }
    }, [listaProdutos])

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
            <div>

                <div>
                    <span>Dados gerais do produto</span>
                </div>

                <div>

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

                        <div>
                            <div>
                                <label htmlFor="">
                                    <span>Id / código</span>
                                    <input type="text" name="" id="" value={produto?.id} />
                                </label>

                                <label htmlFor="">
                                    <span>Código de barras</span>
                                    <input type="text" name="" id="" value={produto?.barras} />
                                </label>
                            </div>

                            <label htmlFor="">
                                <span>Status</span>
                                <input type="text" name="" id="" value={produto?.status == 1 ? "Ativo" : "Inativo"} />
                            </label>
                        </div>

                        <div>
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

                {/* Dados de estoque do produto */}
                <div>
                    <div>
                        <span>Estoque do produto</span>
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
                            <span>Localização física</span>
                            <input type="text" name="" id="" value={produto?.localizacao} />
                        </label>
                    </div>
                </div>

                {/* Dados de valores do produto */}
                <div>
                    <div>
                        <span>Valores do produto</span>
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