import { receber, clientes, auxBaixas } from "../index"

function initReceberClientes() {
    clientes.hasMany(receber, {foreignKey: "idCliente", as: "listaDebito"})
    receber.hasMany(auxBaixas, {foreignKey: "idOrigem", as: "baixasParciais"})

    return {
        receberClientes: clientes
    }
}

export default initReceberClientes().receberClientes