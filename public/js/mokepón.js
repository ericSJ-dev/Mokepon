//Esta class sirve para definir la logica que va a seguir la pagina web
// en este caso el jueguito de mokepon usando javaScript

//: Obtener elementos del DOM
const seccionSeleccionarAtaque = document.getElementById("seleccionar-ataque");
const seccionReiniciar = document.getElementById("reiniciar");
const botonMascotaJugador = document.getElementById("boton-mascota");
const botonReiniciar = document.getElementById("boton-reiniciar");
const seccionSeleccionarMascota = document.getElementById("seleccionar-mascota");
const spanMascotaJugador = document.getElementById("mascota-jugador");
const spanMascotaEnemigo = document.getElementById("mascota-enemigo");
const spanVictoriasJugador = document.getElementById('victorias-jugador')
const spanVictoriasEnemigo = document.getElementById('victorias-enemigo')
const sectionMensajes = document.getElementById("resultado");
const ataqueDelJugador = document.getElementById("ataques-del-jugador");
const ataqueDelEnemigo = document.getElementById("ataques-del-enemigo");
const contenedorTarjetas = document.getElementById("contenedor-tarjetas");
const contenedorAtaques = document.getElementById("contenedor-ataques");
const sectionVerMapa = document.getElementById("ver-mapa")
const mapa = document.getElementById("mapa")

//: Declarar variables globales

//Aqui se puede cambiar la ip y el puerto del servidor dependiendo de tus especificaciones, recomiendo dejar el puerto 8080
let serverIp = "192.168.18.159"
let serverPort = "8080"

let jugadorId = null
let enemigoId = null
let ataqueJugador = []
let ataqueEnemigo = []
let mokeponesEnemigos = []
let indexAtaqueJugador
let indexAtaqueEnemigo
let opcionMokepones
let ataquesMokepon
let ataquesMokeponEnemigo
let inputCapipepo
let inputRatigueya
let inputHipodoge
let botonFuego
let botonAgua
let botonTierra
let botones = []
let mascotaJugador
let mascotaJugadorObjeto
let victoriasJugador = 0
let victoriasEnemigo = 0
let mokepones = []
let lienzo = mapa.getContext("2d")
let intervalo
let mapaBackground = new Image()
mapaBackground.src = "./assets/mokemap.png"
let alturaBuscada
let anchoMapa = window.innerWidth - 20
const anchoMaximoMapa = 350
if (anchoMapa > anchoMaximoMapa) {
    anchoMapa = anchoMaximoMapa - 20
}
alturaBuscada = anchoMapa * 600 / 800
mapa.width = anchoMapa
mapa.height = alturaBuscada

//: Clase Mokepon
class Mokepon {
    constructor(nombre, foto, vida, fotoMapa, id = null) {
        this.id = id;
        this.nombre = nombre;
        this.foto = foto;
        this.vida = vida;
        this.ataques = [];
        this.ancho = 40;
        this.alto = 40;
        this.x = aleatorio(0, mapa.width - this.ancho);
        this.y = aleatorio(0, mapa.height - this.alto);
        this.mapaFoto = new Image();
        this.mapaFoto.src = fotoMapa
        this.velocidadX = 0;
        this.velocidadY = 0;
    }

    pintarMokepon() {
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto
        )
    }
}

//: Crear instancias de Mokepon
let hipodoge = new Mokepon("Hipodoge", "./assets/mokepon_hipodoge.png", 5, "./assets/hipodoge.png");
let capipepo = new Mokepon("Capipepo", "./assets/mokepon_capipepo.png", 5, "./assets/capipepo.png");
let ratigueya = new Mokepon("Ratigueya", "./assets/mokepon_ratigueya.png", 5, "./assets/ratigueya.png");

//: Definir ataques de cada Mokepon
const HIPODOGE_ATAQUES = [
    { nombre: "💧", id: "boton-agua" },
    { nombre: "💧", id: "boton-agua" },
    { nombre: "💧", id: "boton-agua" },
    { nombre: "🔥", id: "boton-fuego" },
    { nombre: "🌱", id: "boton-tierra" }
]

const CAPIPEPO_ATAQUES = [
    { nombre: "🌱", id: "boton-tierra" },
    { nombre: "🌱", id: "boton-tierra" },
    { nombre: "🌱", id: "boton-tierra" },
    { nombre: "💧", id: "boton-agua" },
    { nombre: "🔥", id: "boton-fuego" }
]

const RATIGUEYA_ATAQUES = [
    { nombre: "🔥", id: "boton-fuego" },
    { nombre: "🔥", id: "boton-fuego" },
    { nombre: "🔥", id: "boton-fuego" },
    { nombre: "🌱", id: "boton-tierra" },
    { nombre: "💧", id: "boton-agua" }
]

//: Asignar ataques a cada Mokepon
hipodoge.ataques.push(...HIPODOGE_ATAQUES)
capipepo.ataques.push(...CAPIPEPO_ATAQUES)
ratigueya.ataques.push(...RATIGUEYA_ATAQUES)

//: Añadir Mokepones al array de mokepones
mokepones.push(hipodoge, capipepo, ratigueya)

function iniciarJuego() {
    mokepones.forEach((mokepon) => {
        //: Crear opción de Mokepon
        opcionMokepones = `
        <input type="radio" name="mascota" id=${mokepon.nombre} />
        <label class="tarjeta-mascota" for=${mokepon.nombre}>
            <p>${mokepon.nombre}</p>
            <img src=${mokepon.foto} alt=${mokepon.nombre}>
        </label>
        `
        //: Añadir opción de Mokepon al contenedor
        contenedorTarjetas.innerHTML += opcionMokepones
        //: Obtener referencias de los inputs de Mokepon
        inputHipodoge = document.getElementById("Hipodoge");
        inputCapipepo = document.getElementById("Capipepo");
        inputRatigueya = document.getElementById("Ratigueya");
    })

    //: Ocultar secciones al iniciar
    seccionSeleccionarAtaque.style.display = "none";
    seccionReiniciar.style.display = "none";
    sectionVerMapa.style.display = "none";

    //: Añadir eventos a los botones
    botonMascotaJugador.addEventListener("click", seleccionarMascotaJugador);
    botonReiniciar.addEventListener("click", reiniciarJuego);

    //: Unirse al juego
    unirseAlJuego()
}

function unirseAlJuego() {
    //: Enviar petición para unirse al juego
    fetch(`http://${serverIp}:${serverPort}/unirse`).then(function (res) {
        if (res.ok) {
            res.text().then(function (respuesta) {
                //: Guardar ID del jugador
                jugadorId = respuesta
            })
        }
    })
}

function seleccionarMascotaJugador() {
    //: Verificar la mascota seleccionada
    if (inputHipodoge.checked) {
        spanMascotaJugador.innerHTML = inputHipodoge.id
        mascotaJugador = inputHipodoge.id
    } else if (inputCapipepo.checked) {
        spanMascotaJugador.innerHTML = inputCapipepo.id
        mascotaJugador = inputCapipepo.id
    } else if (inputRatigueya.checked) {
        spanMascotaJugador.innerHTML = inputRatigueya.id
        mascotaJugador = inputRatigueya.id
    } else {
        //: Mostrar alerta si no se seleccionó una mascota
        alert("Debes seleccionar una mascota");
        return
    }

    //: Ocultar sección de selección de mascota
    seccionSeleccionarMascota.style.display = "none";
    //: Seleccionar Mokepon
    seleccionarMokepon(mascotaJugador)
    //: Extraer ataques de la mascota seleccionada
    extraerAtaques(mascotaJugador);
    //: Mostrar mapa
    sectionVerMapa.style.display = "flex";
    iniciarMapa()
}

function seleccionarMokepon(mascotaJugador) {
    //: Enviar petición para seleccionar Mokepon
    fetch(`http://${serverIp}:${serverPort}/mokepon/${jugadorId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mokepon: mascotaJugador
        })
    })
}

function seleccionarMascotaEnemigo(enemigo) {
    //: Mostrar nombre de la mascota enemiga
    spanMascotaEnemigo.innerHTML = enemigo.nombre;
    ataquesMokeponEnemigo = enemigo.ataques;
    //: Iniciar secuencia de ataque
    secuenciaAtaque();
}

function extraerAtaques(mascotaJugador) {
    let ataques
    //: Buscar ataques de la mascota seleccionada
    for (let i = 0; i < mokepones.length; i++) {
        if (mascotaJugador == mokepones[i].nombre) {
            ataques = mokepones[i].ataques
        }
    }
    //: Mostrar ataques
    mostrarAtaques(ataques)
}

function mostrarAtaques(ataques) {
    //: Crear botones de ataque
    ataques.forEach((ataque) => {
        ataquesMokepon = `
        <button id=${ataque.id} class="boton-de-ataque BAtaque">${ataque.nombre} </button>
        `
        contenedorAtaques.innerHTML += ataquesMokepon
    })
    //: Obtener referencias de los botones de ataque
    botonFuego = document.getElementById("boton-fuego");
    botonAgua = document.getElementById("boton-agua");
    botonTierra = document.getElementById("boton-tierra");
    botones = document.querySelectorAll(".BAtaque");
}

function secuenciaAtaque() {
    //: Añadir eventos a los botones de ataque
    botones.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            if (e.target.textContent.trim() === '🔥') {
                ataqueJugador.push("Fuego")
                boton.style.background = "#1d0ea3";
                boton.disabled = true;
            } else if (e.target.textContent.trim() === '💧') {
                ataqueJugador.push("Agua")
                boton.style.background = "#1d0ea3";
                boton.disabled = true;
            } else if (e.target.textContent.trim() === '🌱') {
                ataqueJugador.push("Tierra")
                boton.style.background = "#1d0ea3";
                boton.disabled = true;
            }
            //: Enviar ataques cuando se seleccionen 5
            if (ataqueJugador.length == 5) {
                enviarAtaques()
            }
        })
    })
}

function enviarAtaques() {
    //: Enviar ataques al servidor
    fetch(`http://${serverIp}:${serverPort}/mokepon/${jugadorId}/ataques`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ataques: ataqueJugador
        })
    })
    //: Obtener ataques del enemigo
    intervalo = setInterval(obtenerAtaques, 50)
}

function obtenerAtaques() {
    //: Enviar petición para obtener ataques del enemigo
    fetch(`http://${serverIp}:${serverPort}/mokepon/${enemigoId}/ataques`)
        .then(function (res) {
            if (res.ok) {
                res.json()
                    .then(function ({ ataques }) {
                        if (ataques.length == 5) {
                            ataqueEnemigo = ataques
                            //: Iniciar combate
                            combate()
                        }
                    })
            }
        })
}

function obtenerAtaques() {
    //: Enviar petición para obtener ataques del enemigo
    fetch(`http://${serverIp}:${serverPort}/mokepon/${enemigoId}/ataques`)
        .then(function (res) {
            if (res.ok) {
                res.json()
                    .then(function ({ ataques }) {
                        if (ataques.length == 5) {
                            ataqueEnemigo = ataques
                            //: Iniciar combate
                            combate()
                        }
                    })
            }
        })
}

function indexAmbosOponentes(jugador, enemigo) {
    //: Asignar los ataques de jugador y enemigo
    indexAtaqueJugador = ataqueJugador[jugador]
    indexAtaqueEnemigo = ataqueEnemigo[enemigo]
}

function combate() {
    //: Detener el intervalo
    clearInterval(intervalo)
    //: Realizar combate entre ataques del jugador y enemigo
    for (let i = 0; i < ataqueJugador.length; i++) {
        if (ataqueJugador[i] == ataqueEnemigo[i]) {
            indexAmbosOponentes(i, i)
            crearMensajes("EMPATE")
            spanVictoriasJugador.innerHTML = victoriasJugador
            spanVictoriasEnemigo.innerHTML = victoriasEnemigo
        } else if (ataqueJugador[i] == "Fuego" && ataqueEnemigo[i] == "Tierra" || ataqueJugador[i] == "Agua" && ataqueEnemigo[i] == "Fuego" || ataqueJugador[i] == "Tierra" && ataqueEnemigo[i] == "Agua") {
            indexAmbosOponentes(i, i)
            crearMensajes("GANASTE")
            victoriasJugador++
            spanVictoriasJugador.innerHTML = victoriasJugador
        } else {
            indexAmbosOponentes(i, i)
            crearMensajes("PERDISTE")
            victoriasEnemigo++
            spanVictoriasEnemigo.innerHTML = victoriasEnemigo
        }
    }

    //: Revisar las victorias al finalizar combate
    revisarVictorias()
}

function revisarVictorias() {
    //: Verificar el resultado del combate
    if (victoriasJugador == victoriasEnemigo) {
        crearMensajeFinal("HUBO EMPATE o.O")
    } else if (victoriasJugador > victoriasEnemigo) {
        crearMensajeFinal("FELICITACIONES, GANASTE!!! :D 🎉");
    } else {
        crearMensajeFinal("LO SIENTO, PERDISTE :(");
    }

}

function crearMensajes(resultado) {

    let nuevoAtaqueDelJugador = document.createElement("p");
    let nuevoAtaqueDelEnemigo = document.createElement("p");

    //: Mostrar el resultado del combate
    sectionMensajes.innerHTML = resultado;
    nuevoAtaqueDelJugador.innerHTML = indexAtaqueJugador;
    nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueEnemigo;

    //: Añadir ataques al historial de combate
    ataqueDelJugador.appendChild(nuevoAtaqueDelJugador);
    ataqueDelEnemigo.appendChild(nuevoAtaqueDelEnemigo);
}

function crearMensajeFinal(resultadoFinal) {
    //: Mostrar el mensaje final del combate
    sectionMensajes.innerHTML = resultadoFinal;
    //: Mostrar sección de reinicio
    seccionReiniciar.style.display = "block";
}

function pintarCanvas() {
    //: Actualizar posición de la mascota del jugador
    mascotaJugadorObjeto.x = mascotaJugadorObjeto.x + mascotaJugadorObjeto.velocidadX
    mascotaJugadorObjeto.y = mascotaJugadorObjeto.y + mascotaJugadorObjeto.velocidadY
    //: Limpiar el lienzo y redibujar el mapa
    lienzo.clearRect(0, 0, mapa.width, mapa.height)
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height
    )
    //: Pintar la mascota del jugador
    mascotaJugadorObjeto.pintarMokepon()

    //: Enviar la posición de la mascota del jugador al servidor
    enviarPosicion(mascotaJugadorObjeto.x, mascotaJugadorObjeto.y)

    //: Pintar los mokepones enemigos y verificar colisiones
    mokeponesEnemigos.forEach(function (mokepon) {
        if (mokepon) {
            mokepon.pintarMokepon()
            revisarColision(mokepon)
        }
    })

}
// Función para enviar la posición del jugador al servidor
function enviarPosicion(x, y) {
    fetch(`http://${serverIp}:${serverPort}/mokepon/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x, // Enviar la coordenada x
            y  // Enviar la coordenada y
        })
    }).then(function (res) {
        if (res.ok) {
            res.json()
                .then(function ({ enemigos }) {
                    // Actualizar la posición de los enemigos
                    mokeponesEnemigos = enemigos.map(function (enemigo) {
                        let mokeponEnemigo = null
                        if (enemigo.mokepon != undefined) {
                            const mokeponNombre = enemigo.mokepon.nombre || ""
                            // Crear una instancia del mokepon enemigo según su nombre
                            if (mokeponNombre === "Hipodoge") {
                                mokeponEnemigo = new Mokepon('Hipodoge', './assets/mokepons_mokepon_hipodoge_attack.png', 5, './assets/hipodoge.png', enemigo.id)
                            } else if (mokeponNombre === "Capipepo") {
                                mokeponEnemigo = new Mokepon('Capipepo', './assets/mokepons_mokepon_capipepo_attack.png', 5, './assets/capipepo.png', enemigo.id)
                            } else if (mokeponNombre === "Ratigueya") {
                                mokeponEnemigo = new Mokepon('Ratigueya', './assets/mokepons_mokepon_ratigueya_attack.png', 5, './assets/ratigueya.png', enemigo.id)
                            }

                            mokeponEnemigo.x = enemigo.x  // Asignar coordenada x del enemigo
                            mokeponEnemigo.y = enemigo.y  // Asignar coordenada y del enemigo

                            return mokeponEnemigo  // Devolver la instancia del mokepon enemigo
                        }
                    })

                })
        }
    })
}

// Función para detener el movimiento del jugador
function detenerMovimiento() {
    mascotaJugadorObjeto.velocidadX = 0
    mascotaJugadorObjeto.velocidadY = 0
}

// Función para mover el jugador hacia arriba
function moverArriba() {
    mascotaJugadorObjeto.velocidadY = -5
}

// Función para mover el jugador hacia la derecha
function moverDerecha() {
    mascotaJugadorObjeto.velocidadX = 5
}

// Función para mover el jugador hacia la izquierda
function moverIzquierda() {
    mascotaJugadorObjeto.velocidadX = -5
}

// Función para mover el jugador hacia abajo
function moverAbajo() {
    mascotaJugadorObjeto.velocidadY = 5
}

// Función para manejar las teclas presionadas
function teclaPresionada(event) {
    switch (event.key) {
        case "ArrowUp":
            moverArriba();
            break;

        case "ArrowDown":
            moverAbajo();
            break;

        case "ArrowRight":
            moverDerecha();
            break;

        case "ArrowLeft":
            moverIzquierda();
            break;

        default:
            break;
    }
}

// Función para iniciar el mapa y establecer los eventos de teclado
function iniciarMapa() {
    mascotaJugadorObjeto = obtenerObjetoMascota()  // Obtener el objeto de la mascota del jugador
    intervalo = setInterval(pintarCanvas, 50)  // Actualizar el canvas cada 50ms

    window.addEventListener("keydown", teclaPresionada);  // Evento para presionar teclas
    window.addEventListener("keyup", detenerMovimiento);  // Evento para soltar teclas
}

// Función para obtener el objeto de la mascota del jugador
function obtenerObjetoMascota() {
    for (let i = 0; i < mokepones.length; i++) {
        if (mascotaJugador == mokepones[i].nombre) {
            return mokepones[i]
        }
    }
}

// Función para revisar si hay una colisión entre el jugador y un enemigo
function revisarColision(enemigo) {
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x

    const arribaMascota = mascotaJugadorObjeto.y
    const abajoMascota = mascotaJugadorObjeto.y + mascotaJugadorObjeto.alto
    const derechaMascota = mascotaJugadorObjeto.x + mascotaJugadorObjeto.ancho
    const izquierdaMascota = mascotaJugadorObjeto.x

    if (
        abajoMascota < arribaEnemigo ||
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo
    ) {
        return;
    }
    detenerMovimiento()  // Detener el movimiento del jugador
    clearInterval(intervalo)  // Limpiar el intervalo
    enemigoId = enemigo.id
    seccionSeleccionarAtaque.style.display = "flex";
    sectionVerMapa.style.display = "none"
    seleccionarMascotaEnemigo(enemigo);

    mokeponesEnemigos = mokeponesEnemigos.filter(m => m.id !== enemigo.id);
}

// Función para generar un número aleatorio entre min y max
function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para reiniciar el juego recargando la página
function reiniciarJuego() {
    location.reload();
}

// Evento para cargar e iniciar el juego
window.addEventListener("load", iniciarJuego);
