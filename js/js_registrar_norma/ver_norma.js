var estandar_ID = "1";
var dimension_ID = '';
var tema_ID = '';
var indicador_ID = '';


//Obtenemos el USUARIO de la URL
function obtener_valor(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


var usuario_ID = obtener_valor("usuario");//OBtenemos el ID de la URL
//_______________________________________
async function getInfoUsuarioNorma() {
    const respuesta = await fetch(`${link_service}consultas/usuarioId/${usuario_ID}`)
    const json = await respuesta.json()

    return json;
}

async function getInfoEstandaresNorma() {
    const respuesta = await fetch(`${link_service}consultas/listarEstandares`)
    const json = await respuesta.json()

    return json;
}

async function getInfoDimensionesNorma() {
    const respuesta = await fetch(`${link_service}consultas/listarDimensiones`)
    const json = await respuesta.json()

    return json;
}

async function getInfoTemasNorma() {
    const respuesta = await fetch(`${link_service}consultas/listarTemas`)
    const json = await respuesta.json()

    return json;
}

async function getInfoIndicadoresNorma() {
    const respuesta = await fetch(`${link_service}consultas/listarIndicadores`)
    const json = await respuesta.json()

    return json;
}
//_______________________________________

(async function () {
    //cargamos la info del usuario 
    const datos_usuario = await getInfoUsuarioNorma()
    const info_user = document.querySelector('.datos-usuario');
    let out_info_user = '';
    out_info_user += `
                            <div class="nombre-user">
                                <span>${datos_usuario.usuario}</span>
                            </div>
                            <div class="correo-user">
                                <span>${datos_usuario.administrador.correo}</span>
                            </div>
                                `;
    info_user.innerHTML = out_info_user;

    //cargamos la Info del Estandar
    const datos_estandares = await getInfoEstandaresNorma()
    const estandares = document.querySelector('.cuerpo-tabla-estandares');
    let outEstandares = '';
    datos_estandares.forEach(element => {
        outEstandares += `
                        <tr>
                            <td>${element.estandar_ID}</td>
                            <td>${element.nombre}</td>
                            <td>${element.descripcion}</td>
                            <td>${element.institucion_Pertenencia}</td>
                            <td>${element.version}</td>
                            <td>${element.pagina_Oficial}</td>
                            <td>${element.anio_Creacion}</td>
                            <td>${element.anio_Vigencia}</td>
                            <td>${element.pais_Origen}</td>
                            <td>${element.region_Aplica}</td>
                            <td>${element.Fecha_Creacion}</td>
                            <td>${element.Fecha_Modificacion}</td>
                            <td>
                                <button class="actualizar-estandar" id="actualizar">Actualizar</button>
                                <button class="eliminar-estandar" id="eliminar">Eliminar</i></button>
                            </td>
                        </tr>
                            `;

    })
    estandares.innerHTML = outEstandares;

    //cargamos la Info de las Dimensiones
    const datos_dimensiones = await getInfoDimensionesNorma();
    const dimensiones = document.querySelector('.cuerpo-tabla-dimensiones');
    let outDimensiones = '';
    datos_dimensiones.forEach(element => {
        outDimensiones += `
                        <tr>
                            <td>${element.dimension_ID}</td>
                            <td>${element.nombre}</td>
                            <td>${element.descripcion}</td>
                            <td>${element.estandar.nombre}</td>
                            <td>${element.Fecha_Creacion}</td>
                            <td>${element.Fecha_Modificacion}</td>
                            <td>
                                <button class="actualizar-dimension" id="actualizar">Actualizar</button>
                                <button class="eliminar-dimension" id="eliminar">Eliminar</i></button>
                            </td>
                        </tr>
                            `;

    })
    dimensiones.innerHTML = outDimensiones;

    //cargamos Info Temas
    const datos_temas = await getInfoTemasNorma();
    const temas = document.querySelector('.cuerpo-tabla-temas');
    let outTemas = '';
    datos_temas.forEach(element => {
        outTemas += `
                        <tr>
                            <td>${element.tema_ID}</td>
                            <td>${element.nombre}</td>
                            <td>${element.descripcion}</td>
                            <td>${element.dimension.nombre}</td>
                            <td>${element.Fecha_Creacion}</td>
                            <td>${element.Fecha_Modificacion}</td>
                            <td>
                                <button class="actualizar-tema" id="actualizar">Actualizar</button>
                                <button class="eliminar-tema" id="eliminar">Eliminar</i></button>
                            </td>
                        </tr>
                            `;

    })
    temas.innerHTML = outTemas;

    //cargamos Info de los Indicadores
    const datos_indicadores = await getInfoIndicadoresNorma();
    const indicadores = document.querySelector('.cuerpo-tabla-indicadores');
    let outIndicadores = '';
    datos_indicadores.forEach(element => {
        outIndicadores += `
                        <tr>
                            <td>${element.indicador_ID}</td>
                            <td>${element.nombre}</td>
                            <td>${element.descripcion}</td>
                            <td>${element.tema.nombre}</td>
                            <td>${element.nivel.nombre}</td>
                            <td>${element.Fecha_Creacion}</td>
                            <td>${element.Fecha_Modificacion}</td>
                            <td>
                                <button class="actualizar-indicador" id="actualizar">Actualizar</button>
                                <button class="eliminar-indicador" id="eliminar">Eliminar</i></button>
                            </td>
                        </tr>
                            `;

    })
    indicadores.innerHTML = outIndicadores;

})()

// //cargamos al informacion del USUARIO 
// const info_user = document.querySelector('.datos-usuario');
// let out_info_user = '';
// fetch(`${link_service}consultas/usuarioId/${usuario_ID}`)
//     .then(response => response.json())
//     .then(data => {
//         out_info_user += `
//                             <div class="nombre-user">
//                                 <span>${data.usuario}</span>
//                             </div>
//                             <div class="correo-user">
//                                 <span>${data.administrador.correo}</span>
//                             </div>
//                                 `;
//         info_user.innerHTML = out_info_user;


//     })

// //Estandanres Cargar
// const estandares = document.querySelector('.cuerpo-tabla-estandares');
// let outEstandares = '';
// fetch(`${link_service}consultas/listarEstandares`)
//     .then(respuesta => respuesta.json())
//     .then(data => {
//         data.forEach(element => {
//             outEstandares += `
//                             <tr>
//                                 <td>${element.estandar_ID}</td>
//                                 <td>${element.nombre}</td>
//                                 <td>${element.descripcion}</td>
//                                 <td>${element.institucion_Pertenencia}</td>
//                                 <td>${element.version}</td>
//                                 <td>${element.pagina_Oficial}</td>
//                                 <td>${element.anio_Creacion}</td>
//                                 <td>${element.anio_Vigencia}</td>
//                                 <td>${element.pais_Origen}</td>
//                                 <td>${element.region_Aplica}</td>
//                                 <td>${element.Fecha_Creacion}</td>
//                                 <td>${element.Fecha_Modificacion}</td>
//                                 <td>
//                                     <button class="actualizar-estandar" id="actualizar">Actualizar</button>
//                                     <button class="eliminar-estandar" id="eliminar">Eliminar</i></button>
//                                 </td>
//                             </tr>
//                                 `;

//         })
//         estandares.innerHTML = outEstandares;
//     })


// //Dimensiones Cargar
// const dimensiones = document.querySelector('.cuerpo-tabla-dimensiones');
// let outDimensiones = '';
// fetch(`${link_service}consultas/listarDimensiones`)
//     .then(respuesta => respuesta.json())
//     .then(data => {
//         data.forEach(element => {
//             outDimensiones += `
//                             <tr>
//                                 <td>${element.dimension_ID}</td>
//                                 <td>${element.nombre}</td>
//                                 <td>${element.descripcion}</td>
//                                 <td>${element.estandar.nombre}</td>
//                                 <td>${element.Fecha_Creacion}</td>
//                                 <td>${element.Fecha_Modificacion}</td>
//                                 <td>
//                                     <button class="actualizar-dimension" id="actualizar">Actualizar</button>
//                                     <button class="eliminar-dimension" id="eliminar">Eliminar</i></button>
//                                 </td>
//                             </tr>
//                                 `;

//         })
//         dimensiones.innerHTML = outDimensiones;
//     })


// //Temas Cargar
// const temas = document.querySelector('.cuerpo-tabla-temas');
// let outTemas = '';
// fetch(`${link_service}consultas/listarTemas`)
//     .then(respuesta => respuesta.json())
//     .then(data => {
//         data.forEach(element => {
//             outTemas += `
//                             <tr>
//                                 <td>${element.tema_ID}</td>
//                                 <td>${element.nombre}</td>
//                                 <td>${element.descripcion}</td>
//                                 <td>${element.dimension.nombre}</td>
//                                 <td>${element.Fecha_Creacion}</td>
//                                 <td>${element.Fecha_Modificacion}</td>
//                                 <td>
//                                     <button class="actualizar-tema" id="actualizar">Actualizar</button>
//                                     <button class="eliminar-tema" id="eliminar">Eliminar</i></button>
//                                 </td>
//                             </tr>
//                                 `;

//         })
//         temas.innerHTML = outTemas;
//     })

// //Indicadores Cargar
// const indicadores = document.querySelector('.cuerpo-tabla-indicadores');
// let outIndicadores = '';
// fetch(`${link_service}consultas/listarIndicadores`)
//     .then(respuesta => respuesta.json())
//     .then(data => {
//         data.forEach(element => {
//             outIndicadores += `
//                             <tr>
//                                 <td>${element.indicador_ID}</td>
//                                 <td>${element.nombre}</td>
//                                 <td>${element.descripcion}</td>
//                                 <td>${element.tema.nombre}</td>
//                                 <td>${element.nivel.nombre}</td>
//                                 <td>${element.Fecha_Creacion}</td>
//                                 <td>${element.Fecha_Modificacion}</td>
//                                 <td>
//                                     <button class="actualizar-indicador" id="actualizar">Actualizar</button>
//                                     <button class="eliminar-indicador" id="eliminar">Eliminar</i></button>
//                                 </td>
//                             </tr>
//                                 `;

//         })
//         indicadores.innerHTML = outIndicadores;
//     })


async function delEstandarNorma(estandar_ID) {
    await fetch(`${link_service}consultas/eliminarEstandar/${estandar_ID}`, {
        method: 'DELETE',
    })
}

async function delDimensionNorma(dimension_ID) {
    await fetch(`${link_service}consultas/eliminarDimension/${dimension_ID}`, {
        method: 'DELETE',
    })
}

async function delTemaNorma(tema_ID) {
    await fetch(`${link_service}consultas/eliminarTema/${tema_ID}`, {
        method: 'DELETE',
    })
}

async function delInicadorNorma(indicador_ID) {
    await fetch(`${link_service}consultas/eliminarIndicador/${indicador_ID}`, {
        method: 'DELETE',
    })
}

setTimeout(() => {
    //________________ESTANDAR inicio_________________________
    const botones_actualizar_estandar = document.querySelectorAll(".actualizar-estandar");
    //obtenemos los datos de las filas de estadnares
    const obtener_datos_estandar = function (evento) {
        var elementos_estandar_1 = evento.srcElement.parentElement;//obtenemos padre (<td> botones) de boton ACTUALIZAR
        console.log(elementos_estandar_1)
        // vamos al elemento padre (<tr>) y buscamos todos los elementos <td>
        // que contenga el elemento padre
        var elementos_estandar_2 = elementos_estandar_1.parentElement.getElementsByTagName("td");

        estandar_ID = elementos_estandar_2[0].textContent;
        window.location.href = `${url_global_pagina}registrar_normas/estandar_actualizar${extencion}?usuario=${usuario_ID}&estandar_ID=${estandar_ID}`;


    }
    // botones_actualizar_estandar es un arreglo así que lo recorremos
    botones_actualizar_estandar.forEach(boton => {
        //Agregar listener
        boton.addEventListener("click", obtener_datos_estandar);
    });

    const botones_eliminar_estandar = document.querySelectorAll(".eliminar-estandar");

    const eliminar_estandar = function (evento) {
        var elementos_estandar_1 = evento.srcElement.parentElement;//obtenemos padre (<td> botones) de boton ACTUALIZAR
        console.log(elementos_estandar_1)
        // vamos al elemento padre (<tr>) y buscamos todos los elementos <td>
        // que contenga el elemento padre
        var elementos_estandar_2 = elementos_estandar_1.parentElement.getElementsByTagName("td");

        estandar_ID = elementos_estandar_2[0].textContent;

        (async function () {
            await delEstandarNorma(estandar_ID)
            swal("eliminar " + estandar_ID)
            setTimeout(() => {
                location.reload();
            }, 2000)

        })()
    }

    botones_eliminar_estandar.forEach(boton => {
        //Agregar listener
        boton.addEventListener("click", eliminar_estandar);
    });
    //________________ESTANDAR FIn_________________________
    //_________________DIMENSION Inicio_________________
    const botones_dimension_estandar = document.querySelectorAll(".actualizar-dimension");

    const obtener_datos_dimension = function (evento) {
        var elementos_dim_1 = evento.srcElement.parentElement;//obtenemos padre (<td> botones) de boton ACTUALIZAR
        console.log(elementos_dim_1)
        // vamos al elemento padre (<tr>) y buscamos todos los elementos <td>
        // que contenga el elemento padre
        var elementos_dim_2 = elementos_dim_1.parentElement.getElementsByTagName("td");

        dimension_ID = elementos_dim_2[0].textContent;
        window.location.href = `${url_global_pagina}registrar_normas/dimension_actualizar${extencion}?usuario=${usuario_ID}&dimension_ID=${dimension_ID}`;


    }

    botones_dimension_estandar.forEach(boton => {
        boton.addEventListener("click", obtener_datos_dimension);
    });
    //Eliminar DIMENSION
    const botones_eliminar_dimension = document.querySelectorAll(".eliminar-dimension");

    const eliminar_dimension = function (evento) {
        var elementos_dim_1 = evento.srcElement.parentElement;//obtenemos padre (<td> botones) de boton ACTUALIZAR
        var elementos_dim_2 = elementos_dim_1.parentElement.getElementsByTagName("td");
        dimension_ID = elementos_dim_2[0].textContent;

        (async function () {
            await delDimensionNorma(dimension_ID)
            swal("eliminar " + dimension_ID)
            setTimeout(() => {
                location.reload();
            }, 2000)

        })()
    }

    botones_eliminar_dimension.forEach(boton => {
        //Agregar listener
        boton.addEventListener("click", eliminar_dimension);
    });

    //_________________DIMENSION FIN_________________
    //_________________TEMA Inicio_________________
    const botones_nivel_estandar = document.querySelectorAll(".actualizar-tema");
    const obtener_datos_nivel = function (evento) {
        var elementos_nivel_1 = evento.srcElement.parentElement;//obtenemos padre (<td> botones) de boton ACTUALIZAR
        console.log(elementos_nivel_1)
        // vamos al elemento padre (<tr>) y buscamos todos los elementos <td>
        // que contenga el elemento padre
        var elementos_nivel_2 = elementos_nivel_1.parentElement.getElementsByTagName("td");

        tema_ID = elementos_nivel_2[0].textContent;
        window.location.href = `${url_global_pagina}registrar_normas/temas_actualizar${extencion}?usuario=${usuario_ID}&tema_ID=${tema_ID}`;


    }

    botones_nivel_estandar.forEach(boton => {
        boton.addEventListener("click", obtener_datos_nivel);
    });

    //Eliminar TEMA
    const botones_eliminar_tema = document.querySelectorAll(".eliminar-tema");

    const eliminar_tema = function (evento) {
        var elementos_tema_1 = evento.srcElement.parentElement;//obtenemos padre (<td> botones) de boton ACTUALIZAR
        var elementos_tema_2 = elementos_tema_1.parentElement.getElementsByTagName("td");
        tema_ID = elementos_tema_2[0].textContent;

        (async function () {
            await delTemaNorma(tema_ID)
            swal("eliminar " + tema_ID)
            setTimeout(() => {
                location.reload();
            }, 2000)

        })()
    }

    botones_eliminar_tema.forEach(boton => {
        //Agregar listener
        boton.addEventListener("click", eliminar_tema);
    });

    //_________________TEMA Fin_________________
    //___________________INDICADOR Inicio__________________
    const botones_indicador = document.querySelectorAll(".actualizar-indicador");
    const obtener_datos_indicador = function (evento) {
        var elementos_indicador_1 = evento.srcElement.parentElement;//obtenemos padre (<td> botones) de boton ACTUALIZAR
        console.log(elementos_indicador_1)
        // vamos al elemento padre (<tr>) y buscamos todos los elementos <td>
        // que contenga el elemento padre
        var elementos_indicador_2 = elementos_indicador_1.parentElement.getElementsByTagName("td");

        indicador_ID = elementos_indicador_2[0].textContent;
        window.location.href = `${url_global_pagina}registrar_normas/indicador_actualizar${extencion}?usuario=${usuario_ID}&indicador_ID=${indicador_ID}`;


    }

    botones_indicador.forEach(boton => {
        boton.addEventListener("click", obtener_datos_indicador);
    });
    //Eliminar INIDCADOR
    const botones_eliminar_indicador = document.querySelectorAll(".eliminar-indicador");

    const eliminar_indicador = function (evento) {
        var elementos_indicador_1 = evento.srcElement.parentElement;//obtenemos padre (<td> botones) de boton ACTUALIZAR
        var elementos_indicador_2 = elementos_indicador_1.parentElement.getElementsByTagName("td");
        indicador_ID = elementos_indicador_2[0].textContent;

        (async function () {
            await delInicadorNorma(indicador_ID)
            swal("eliminar " + indicador_ID)
            setTimeout(() => {
                location.reload();
            }, 2000)
        })()
    }

    botones_eliminar_indicador.forEach(boton => {
        //Agregar listener
        boton.addEventListener("click", eliminar_indicador);
    })
    //___________________INDICADOR Fin__________________






}, 1500)


function mostrar_norma_registarada() {
    window.location.href = `${url_global_pagina}registrar_normas/ver_normas${extencion}?usuario=${usuario_ID}`;
}

function registrar_norma() {
    window.location.href = `${url_global_pagina}registrar_normas/registrar_norma${extencion}?usuario=${usuario_ID}`;
}

function ir_perfil() {
    window.location.href = `${url_global_pagina}perfil_administrador${extencion}?usuario=${usuario_ID}`;
}

function salir() {
    window.location.href = `${url_global_pagina_index}index${extencion}`;
}