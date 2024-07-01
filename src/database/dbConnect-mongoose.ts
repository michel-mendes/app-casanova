import mongoose from "mongoose"

async function connectDatabaseMongoDB() {

    // Skip connection procedure if already is connected
    if ( mongoose.connections.length > 0 && mongoose.connections[0].readyState == 1 /* Connected */) {
        // console.log(`Banco de dados MongoDB já conectado. Ignorando procedimento de conexão.`)
        return
    }

    const databaseName = process.env.DB_NAME
    const connectionString = process.env.MONGODB_CONNECTION_STRING!

    try {

        console.log(`Não há conexão estabelecida com o banco de dados. Iniciando procedimento de conexão...`)
        
        mongoose.set('strictQuery', true)
        await mongoose.connect( connectionString )

        console.log(`Conexão com o banco de dados "${ databaseName }" realizada com sucesso!`)
        
    } catch (e) {
        console.log(`Erro ao conectar com o banco de dados >> ${e}`)
        process.exit(1)
    }

}

export { connectDatabaseMongoDB }