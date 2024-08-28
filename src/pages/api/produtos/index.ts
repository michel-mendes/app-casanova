import { NextApiRequest, NextApiResponse } from "next";
import { listaProdutos, listaProdutosSemVenda } from "@/service/produtos";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, body, query } = req
    const { q } = query // q = termo de pesquisa. Ex: "grelha redonda"

    if (method === "GET") {
        try {
            const produtos = await listaProdutos( (q) ? String(q) : "" )

            res.status(200).json(produtos)
        } catch (error: any) {
            return res.status(500).json({ error: error.message })
        }
    }

}

export default handler