import { NextApiRequest, NextApiResponse } from "next";
import { createNewVendasEntregaFutura, getAllVendasEntregaFutura, alteraEntregaPendente } from "@/service/vendasEntregaFutura";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { method, query, body } = req

        switch (method) {
            case "GET": {
                const listaVendasEntregaFutura = await getAllVendasEntregaFutura()

                res.status(200).send(listaVendasEntregaFutura)
                break;
            }
            case "POST": {
                try {
                    const receivedData = JSON.parse(body)

                    const novaEntregaFuturaCadastrada = await createNewVendasEntregaFutura(receivedData)

                    res.status(200).send(novaEntregaFuturaCadastrada)
                } catch (error) {
                    res.status(400).send(error)
                }
                break;
            }
            case "PUT": {
                try {
                    const receivedData = JSON.parse(body)
                    const { id } = query

                    const entregaFuturaAlterada = await alteraEntregaPendente(String(id), receivedData)

                    res.status(200).send(entregaFuturaAlterada)
                } catch (error) {
                    res.status(400).send(error)
                }
            }
        }
    } catch (error: any) {
        res.status(400).json({
            error_code: "api_vendasEntregaFutura",
            message: error.message || error
        })
    }
}

export default handler