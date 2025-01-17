import { NextApiRequest, NextApiResponse } from "next";
import { localizaOrcamentoPorId } from "@/service/orcamentos";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query, body } = req
    const { id } = query

    if (method === "GET") {
        try {
            const orcamento = await localizaOrcamentoPorId(Number(id))

            res.status(200).json(orcamento)
        } catch (error: any) {
            return res.status(404).json({ error: error.message })
        }
    }

}

export default handler