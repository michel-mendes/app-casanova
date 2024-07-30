import { NextApiRequest, NextApiResponse } from "next";
import { listaClientesComDebito } from "@/service/contasReceber";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const {method} = req

    if (method === "GET") {
        
        try {
            const listaContasReceberGeral = await listaClientesComDebito()

            res.status(200).json(listaContasReceberGeral)
        } catch (error: any) {
            return res.status(500).json({ error: error.message })
        }

    }
}

export default handler