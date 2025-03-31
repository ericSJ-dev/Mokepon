//este codigo permite representar el backend del proyecto usando node.js
//por lo que actua como el servidor en el proyecto y posee la logica 
// con la que se va a responder a las peticiones del usuario.

//para ejecutar, debe abrir el terminal y acceder a la ruta de la carpeta del proyecto, posteriormente ejecutar el comando "node server.js" para encender el servidor
//para ejecutar el juego basta con abrir el archivo index.html en el navegador, este archivo se encuentra en la carpeta public

//es un jueggo multijugador, por lo que se pueden abrir varias pestañas del navegador y jugar al mismo tiempo,
//para ello se debe abrir el navegador desde el dispositivo deseado y, posteriormente ingresar en la barra de busqueda 
//la dirección ip del equipo donde se ejecutta el servidor, seguido del puerto 8080, por ejemplo: "192.168.1.48:8080"
//tenga en cuenta que debe estar conectado a la misma red local que el servidor para poder acceder a el.

const express = require("express")
const cors = require("cors")

const app = express()

// Servir archivos estáticos desde el directorio "public"
app.use(express.static("public"))
// Habilitar CORS para permitir solicitudes desde cualquier origen
app.use(cors())
// Habilitar el análisis de JSON en las solicitudes
app.use(express.json())

const jugadores = []

class Jugador {
    constructor(id) {
        //: Inicializar el ID del jugador
        this.id = id
    }
    asignarMokepon(mokepon) {
        //: Asignar un Mokepon al jugador
        this.mokepon = mokepon
    }
    actualizarPosicion(x, y) {
        //: Actualizar la posición del jugador
        this.x = x
        this.y = y
    }
    asignarAtaques(ataques) {
        //: Asignar ataques al jugador
        this.ataques = ataques
    }
}

class Mokepon {
    constructor(nombre) {
        //: Inicializar el nombre del Mokepon
        this.nombre = nombre
    }
}

// Ruta para que los jugadores se unan al juego
app.get("/unirse", (req, res) => {
    const id = `${Math.random()}`
    const jugador = new Jugador(id)
    jugadores.push(jugador)
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.send(id)
})

// Ruta para asignar un Mokepon a un jugador
app.post("/mokepon/:jugadorId", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const nombre = req.body.mokepon || ""
    const mokepon = new Mokepon(nombre)

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].asignarMokepon(mokepon)
    }

    res.end()
})

// Ruta para actualizar la posición de un jugador
app.post("/mokepon/:jugadorId/posicion", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const x = req.body.x || 0
    const y = req.body.y || 0

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].actualizarPosicion(x, y)
    }

    const enemigos = jugadores.filter((jugador) => jugadorId !== jugador.id)

    res.send({
        enemigos
    })
})

// Ruta para asignar ataques a un jugador
app.post("/mokepon/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const ataques = req.body.ataques || []

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].asignarAtaques(ataques)
    }

    res.end()
})

// Ruta para obtener los ataques de un jugador
app.get("/mokepon/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const jugador = jugadores.find((jugador) => jugador.id == jugadorId)
    res.send({
        ataques: jugador.ataques || []
    })
})

// Iniciar el servidor en el puerto 8080
app.listen(8080, () => {
    console.log("Servidor iniciado")
})

/*
proceso de instalacion-inicialización de node js por consola:
desde la carpeta del proyecto, primer comando "npm init"
ahi nos pide todos los datos para configurar lo que será el servidor.
por defecto establece el nombre del archivo para el servidor como "index.js"
(en este caso ese archivo se llama server.js)

una vez aceptados y configurados todos los parametros del comando "npm install",
este comando sirve para descargar todas las dependencias y librerias definidas en el pryecto de node.js

sigue crear el archivo index.js y alli crear todo el codigo respectivo,
finalmente usando el comando "node index.js" (node nombre archivo) 
se inicia el archivo establecido como servidor, para apagarlo se usa ctrl c
*/