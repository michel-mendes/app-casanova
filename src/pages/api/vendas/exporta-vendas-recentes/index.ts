import { NextApiRequest, NextApiResponse } from "next";
import { exportaVendasRecentes } from "@/service/vendas";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req

    if (method === "GET") {
        try {
            await exportaVendasRecentes()
            // const novaVenda = await novaVendaNuvem(dadosRecebidos)

            res.status(200).send("OK")
        } catch (error: any) {
            return res.status(400).json({ error: error.message })
        }
    }

}

export default handler