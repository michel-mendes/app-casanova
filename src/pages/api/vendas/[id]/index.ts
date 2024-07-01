import { NextApiRequest, NextApiResponse } from "next";
import { alteraVenda, buscaVendaPorId } from "@/service/vendas";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const {method, query, body} = req

        switch (method) {
            case "GET": {
                const {id} = query

                const venda = await buscaVendaPorId(Number(id))

                if (venda) {
                    res.status(200).json(venda)
                } else {
                    res.status(500).send(`Não foi possível localizar a venda nº ${id}`)
                }
            }
            case "PUT": {
                const {id} = query
                const receivedData = JSON.parse(body)

                const venda = await alteraVenda(Number(id), receivedData)

                res.status(200).json(venda)
                break;
            }
        }
    } catch(error: any) {
        res.status(400).json({
            error_code: "api_vendas",
            message: error.message || error
        })
    }
}

export default handler