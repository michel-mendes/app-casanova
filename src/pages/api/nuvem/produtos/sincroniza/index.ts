import { NextApiRequest, NextApiResponse } from "next";
import { sincronizaProdutosLocalComNuvem } from "@/service/nuvem/produtosNuvem";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req

    if (method === "GET") {
        try {
            const produtos = await sincronizaProdutosLocalComNuvem()

            res.status(200).json("OK")
        } catch (error: any) {
            return res.status(500).json({ error: error.message })
        }
    }

}

export default handler