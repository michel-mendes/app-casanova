import { NextApiRequest, NextApiResponse } from "next";
import { listaCompletaProdutosSomenteIdeDescricao } from "@/service/nuvem/produtosNuvem";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req

    if (method === "GET") {
        try {
            const listaProdutos = await listaCompletaProdutosSomenteIdeDescricao()

            res.status(200).json(listaProdutos)
        } catch (error: any) {
            return res.status(500).json({ error: error.message })
        }
    }

}

export default handler