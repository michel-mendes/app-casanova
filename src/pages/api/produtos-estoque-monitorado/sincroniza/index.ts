import { NextApiRequest, NextApiResponse } from "next";
import { sincronizaProdutosEstoqueMonitorado } from "@/service/nuvem/produtosEstoqueMonitorado";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req

    if (method === "GET") {
        try {
            await sincronizaProdutosEstoqueMonitorado()

            res.status(200).send("OK")
        } catch (error: any) {
            return res.status(500).json({ error: error.message })
        }
    }

}

export default handler