import { useScripts } from "./scripts";
import { IProdutoRomaneioProps } from "@/app/interfaces";

import iconAdd from "../../images/add-circle-svgrepo-com.svg"
import iconRemove from "../../images/minus-circle-svgrepo-com.svg"

import style from "./index.module.css"

function ProdutoRomaneio({ listaRomaneios, setListaRomaneios, romaneio, produto, myIndex, idInputObs }: IProdutoRomaneioProps) {

    const scripts = useScripts({ listaRomaneios, myIndex, produto, romaneio, setListaRomaneios, idInputObs })
    const possuiBordaInferior = (myIndex + 1) < romaneio.itensEntrega.length


    return (
        <div className={style.romaneio_item} style={(possuiBordaInferior) ? { borderBottom: "1px dashed silver" } : {}}>
            <div className={`${style.item_data} ${style.descricao_produto_container}`}>
                <span>{produto.descricao}</span>
                <span style={{ color: "#3483fa", fontWeight: "bold", cursor: "pointer", padding: "5px", width: "fit-content" }} onClick={scripts.excluiProduto}>Excluir</span>
            </div>

            <div className={`${style.item_data} ${style.quant_modifier_container}`}>
                <div className={style.quant_input_container}>
                    <button className={style.button_quantidade} onClick={scripts.handleClicaBotaoSubtrairProduto}>
                        <img src={iconRemove.src} alt="" />
                    </button>

                    <input className={style.input_quantidade} type="number" value={produto.qtde} onChange={e => scripts.atualizaQuantProduto((e.target.value) ? Number(e.target.value) : undefined)} /> {produto.unidade}

                    <button className={style.button_quantidade} onClick={scripts.handleClicaBotaoSomarProduto}>
                        <img src={iconAdd.src} alt="" />
                    </button>
                </div>
                <span style={{ fontWeight: "bold" }}>{Number(produto.qtdeRestante).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} {produto.unidade} restante</span>
            </div>

            <div className={`${style.item_data} ${style.obs_container}`}>
                <input className={style.input_observacoes} type="text" name="" id={idInputObs} value={produto.observacoes} onChange={scripts.atualizaObservacoesProduto} autoComplete='off' />
                <span style={{ fontWeight: "bold" }}>Observações</span>
            </div>
        </div>
    )
}

export { ProdutoRomaneio }