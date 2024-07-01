import { NextApiRequest, NextApiResponse } from "next";
import { listaClientes } from "@/service/dbService";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const {method} = req

        switch (method) {
            case "GET": {
                const todosClientes = await listaClientes()
                res.status(200).json(todosClientes)
                break;
            }
        }
    } catch(error: any) {
        res.status(400).json({
            error_code: "api_clientes",
            message: error.message
        })
    }
}

export default handler