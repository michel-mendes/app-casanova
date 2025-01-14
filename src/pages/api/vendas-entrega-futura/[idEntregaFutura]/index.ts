import { NextApiRequest, NextApiResponse } from "next";
import { deletaEntregaPendente } from "@/service/nuvem/vendasEntregaFutura";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query } = req
    const { idEntregaFutura } = query

    if (method === "DELETE") {
        try {
            const entregaCancelada = await deletaEntregaPendente(String(idEntregaFutura))

            res.status(200).json(entregaCancelada)
        } catch (error: any) {
            return res.status(400).json({ error: error.message })
        }
    }

}

export default handler