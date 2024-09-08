import React from 'react'

function EditarProdutoPage({params}: {params: {id: string}}) {
    return (
        <div>
            <div>
                <span>{"<-"}</span>
                <span>Produtos</span>
                <span> / </span>
                <span>Editar produto</span>
            </div>
            
            Editando o produto [{params.id}]
        </div>
    )
}

export default EditarProdutoPage