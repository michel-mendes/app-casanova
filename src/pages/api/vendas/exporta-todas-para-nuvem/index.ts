import { NextApiRequest, NextApiResponse } from "next";
import { novaVendaNuvem } from "@/service/nuvem/vendas";
import { exportaTodasVendasParaNuvem } from "@/service/vendas";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req

    if (method === "GET") {
        try {
            await exportaTodasVendasParaNuvem()
            // const novaVenda = await novaVendaNuvem(dadosRecebidos)

            res.status(200).send("OK")
        } catch (error: any) {
            return res.status(400).json({ error: error.message })
        }
    }

}

export default handler