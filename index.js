'use stric'
//Dependencias usadas
const express = require('express')
const mongoose = require('mongoose')
const bearerToken = require('express-bearer-token')
const cors = require('cors')
const config = require("./config");

const app = express()
const PORT = process.env.PORT || 3000


app.use(express.json())
app.use(cors())
app.use(bearerToken())

// Traemos las rutas necesarias
const usersRoute = require('./routes/users')
    // Enganchamos la ruta
app.use(usersRoute)

app.get("/", (req, res) => {
    res.send('Hola mundo')
})

async function conectDatabase() {
    let db = mongoose.connections;
    try {
        await mongoose.connect(config.mongoConfig, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

    } catch (err) {
        console.log(`
            No ha sido posible conectar con la base de datos.
            Message: ${err}
        `)
    }
}

async function init() {
    await conectDatabase();
    app.listen(PORT, () => console.log(`Conectado al puerto http://localhost:${PORT}`))
}

init();
module.exports = app