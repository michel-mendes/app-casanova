import { NextApiRequest, NextApiResponse } from "next";
import { localizaProdutoPorCodigo } from "@/service/nuvem/produtosNuvem";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query } = req
    const { idProduto } = query

    if (method === "GET") {
        try {
            const produtoLocalizado = await localizaProdutoPorCodigo(Number( String(idProduto) ))

            res.status(200).json(produtoLocalizado)
        } catch (error: any) {
            return res.status(500).json({ error: error.message })
        }
    }

}

export default handler