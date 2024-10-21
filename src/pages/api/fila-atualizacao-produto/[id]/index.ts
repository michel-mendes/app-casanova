import { NextApiRequest, NextApiResponse } from "next";
import { deletaFilaAtualizacaoProduto } from "@/service/nuvem/filaAtualizacaoProdutos";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query } = req
    const { id } = query

    if (method === "DELETE") {
        try {
            const filaDeletada = await deletaFilaAtualizacaoProduto(String(id))

            res.status(200).send(filaDeletada)
        } catch (error: any) {
            return res.status(400).json({ error: error.message })
        }
    }

}

export default handler