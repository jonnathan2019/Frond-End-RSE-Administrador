var usuario_ID = "1";//OBtenemos el ID de la URLs
var indicador_ID = "1";

function getGET() {
    // capturamos la url
    var loc = document.location.href;
    // si existe el interrogante
    if (loc.indexOf('?') > 0) {
        // cogemos la parte de la url que hay despues del interrogante
        var getString = loc.split('?')[1];
        // obtenemos un array con cada clave=valor
        var GET = getString.split('&');
        var get = {};
        // recorremos todo el array de valores
        for (var i = 0, l = GET.length; i < l; i++) {
            var tmp = GET[i].split('=');
            get[tmp[0]] = unescape(decodeURI(tmp[1]));
        }
        return get;
    }
}
function cambiar_fecha(fecha) {
    var array_fechasol = fecha.split("/")  //esta linea esta bien y te genera el arreglo
    var dia = parseInt(array_fechasol[2]); // porque repites el nombre dos veces con una basta
    var mes = parseInt(array_fechasol[1]);
    var ano = parseInt(array_fechasol[0]);

    if (dia < 10) {
        dia = "0" + dia
    }

    if (mes < 10) {
        mes = "0" + mes
    }

    var fecha_editada = ano + "/" + mes + "/" + dia
    return fecha_editada;
}
var codigo_indicador = '';
var estandar_id = '';
var dimension_id = '';
var tema_id = '';
var nivel_id = '';
var fecha_creacion = '';
var fecha_modificacion = '';
let preguntas_cualitativas_indicador = [];
let retroalimentacion = [];
//_______________________________
async function getInfoUsuarioInd() {
    const respuesta = await fetch(`${link_service}consultas/usuarioId/${usuario_ID}`)
    const json = await respuesta.json()

    return json;
}

async function getInfoIndicadorInd() {
    const respuesta = await fetch(`${link_service}consultas/indicadorId/${indicador_ID}`)
    const json = await respuesta.json()

    return json;
}

async function getTemasInd() {
    const respuesta = await fetch(`${link_service}consultas/listarTemas`)
    const json = await respuesta.json()

    return json;
}

async function getNivelesInd() {
    const respuesta = await fetch(`${link_service}consultas/listarNiveles`)
    const json = await respuesta.json()

    return json;
}

async function getIndicadoresInd() {
    const respuesta = await fetch(`${link_service}consultas/listarIndicadores`)
    const json = await respuesta.json()

    return json;
}
//_______________________________
window.onload = function () {
    // Cogemos los valores pasados por get
    var valores = getGET();
    //console.log(valores)

    usuario_ID = valores['usuario']
    indicador_ID = valores['indicador_ID']
    //cargamos al informacion del USUARIO 
    const info_user = document.querySelector('.datos-usuario');
    let out_info_user = '';

    (async function () {
        //cargamos la Info del Usuario
        const datos_usuario = await getInfoUsuarioInd();
        out_info_user += `
                            <div class="nombre-user">
                                <span>${datos_usuario.usuario}</span>
                            </div>
                            <div class="correo-user">
                                <span>${datos_usuario.administrador.correo}</span>
                            </div>
                                `;
        info_user.innerHTML = out_info_user;

        //cargamos la info del Indicador
        const datos_indicador = await getInfoIndicadorInd();
        document.getElementById('nombre-indicador').value = datos_indicador.nombre;
        fecha_modificacion = cambiar_fecha(datos_indicador.Fecha_Modificacion);
        fecha_creacion = cambiar_fecha(datos_indicador.Fecha_Creacion);
        document.getElementById('tema-seleccionado').value = datos_indicador.tema.nombre;
        document.getElementById('descripcion-indicador').value = datos_indicador.descripcion;
        document.getElementById('nivel-selecionado').value = datos_indicador.nivel.nombre;
        //document.getElementById('estandar-dimension').value = datos_indicador.estandar.nombre;
        //estandar_id=datos_indicador.estandar.estandar_ID;
        codigo_indicador = datos_indicador.codigo_indicador;//dato guardado internamente
        dimension_id = datos_indicador.tema.dimension.dimension_ID;//dato guardado internamente
        estandar_id = datos_indicador.tema.dimension.estandar.estandar_ID;//dato guardado internamente
        tema_id = datos_indicador.tema.tema_ID;
        nivel_id = datos_indicador.nivel.nivel_ID;
        preguntas_cualitativas_indicador = datos_indicador.preguntas_cualitativas;
        retroalimentacion = datos_indicador.retroalimentacion_indicadores;

        //cargamos los temas 
        const datos_temas = await getTemasInd();
        var preguntas = document.querySelector('.selector-temas');
        let outPreguntas = '<option value="">Elija la Tema</option>';
        datos_temas.forEach(element => {
            outPreguntas += `
        <option value="${element.tema_ID}" id="">${element.nombre}</option>              
              `;
        });
        preguntas.innerHTML = outPreguntas;

        //cargamos los Niveles
        const datos_niveles = await getNivelesInd();
        var niveles = document.querySelector('.selector-niveles');
        let outNiveles = '<option value="">Elija la Nivel</option>';
        datos_niveles.forEach(element => {
            outNiveles += `
        <option value="${element.nivel_ID}" id="">${element.nombre}</option>              
              `;
        });
        niveles.innerHTML = outNiveles;

        //cargar Preguntas del Indicador
        const datos_preguntas_indicador = await getIndicadoresInd();
        datos_preguntas_indicador.forEach(element => {
            const preguntas_cualitativas = document.querySelector('.cuerpo-tabla-preguntas');
            let out_preguntas_cualitativas = '';
            if (element.indicador_ID == indicador_ID) {
                element.preguntas_cualitativas.forEach(pregunta => {
                    out_preguntas_cualitativas += `
                            <tr class="pregunta_cualitativa">
                                <th>${pregunta.pregunta_Cualitativa_ID}</th>
                                <td><textarea name="" id="${pregunta.pregunta_Cualitativa_ID}">${pregunta.pregunta_cualitativa}</textarea></td>
                                <td>${pregunta.Fecha_Creacion}</td>
                                <td>${pregunta.Fecha_Modificacion}</td>
                                <td style="display: none;">${pregunta.codigo_pegunta_cualitativa}</td>
                                <td>
                                    <button class="actualizar-pregunta" id="actualizar">Actualizar</button>
                                    <button class="eliminar-pregunta" id="eliminar">Eliminar</i></button>
                                </td>
                            </tr>
                            
                    `;
                    //console.log(pregunta.pregunta_cualitativa)
                })
                preguntas_cualitativas.innerHTML = out_preguntas_cualitativas;
            }
        })

    })()
}



function cargar_estar_label_temas() {
    var select = document.getElementById("selector-tema");
    var value = select.options[select.selectedIndex].value;
    tema_id = value;//guardamos el ID del estandar
    var respuesta = select.options[select.selectedIndex].text;
    //console.log(value)
    document.getElementById('tema-seleccionado').value = respuesta;
}


function cargar_estar_label_nivel() {
    var select = document.getElementById("selector-nivel");
    var value = select.options[select.selectedIndex].value;
    nivel_id = value;//guardamos el ID del estandar
    var respuesta = select.options[select.selectedIndex].text;
    //console.log(value)
    document.getElementById('nivel-selecionado').value = respuesta;
}

async function putIndicadorInd(nombre, estandar_id, dimension_id, tema_id, nivel_id, descripcion, fecha_creacion, fecha_modificacion, codigo_indicador, preguntas_cualitativas_indicador, retroalimentacion) {
    await fetch(`${link_service}consultas/actualizarIndicador/${indicador_ID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nombre: nombre,
            tema: {
                dimension: {
                    estandar: {
                        estandar_ID: estandar_id
                    },
                    dimension_ID: dimension_id
                },
                tema_ID: tema_id
            },
            nivel: {
                nivel_ID: nivel_id
            },
            descripcion: descripcion,
            Fecha_Creacion: fecha_creacion,
            Fecha_Modificacion: fecha_modificacion,
            codigo_indicador: codigo_indicador,
            preguntas_cualitativas: preguntas_cualitativas_indicador,
            retroalimentacion_indicadores: retroalimentacion
        })
    })
}

function actualizar_indicador() {
    var f = new Date();
    //aaaa/mm/ddd
    fecha_modificacion = f.getFullYear() + "/" + (f.getMonth() + 1) + "/" + (f.getDate() + 1);
    // console.log("-----------------------")
    // console.log("Estadnar ID: " + estandar_id)
    // console.log("Dimesnion ID: " + dimension_id)
    // console.log("Tema ID: " + tema_id)
    // console.log("Nivel ID: " + nivel_id)
    // console.log(codigo_indicador)
    // console.log(fecha_creacion)
    // console.log(document.getElementById('nombre-indicador').value)
    // console.log(document.getElementById('descripcion-indicador').value)
    // console.log(indicador_ID)
    // console.log(preguntas_cualitativas_indicador)
    // console.log(retroalimentacion)

    var nombre = document.getElementById('nombre-indicador').value;
    var descripcion = document.getElementById('descripcion-indicador').value;

    (async function () {
        await putIndicadorInd(nombre, estandar_id, dimension_id, tema_id, nivel_id, descripcion, fecha_creacion, fecha_modificacion, codigo_indicador, preguntas_cualitativas_indicador, retroalimentacion);
        swal("Datos actualizados correctamente.")
    })()
}

async function putPreguntaCualitativaInd(id, pregunta, fecha_creacion, fecha_modificacion, codigo) {
    await fetch(`${link_service}consultas/actualizarPreguntasCualitativas/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            pregunta_cualitativa: pregunta,
            Fecha_Creacion: fecha_creacion,
            Fecha_Modificacion: fecha_modificacion,
            codigo_pegunta_cualitativa: codigo
        })
    })
}

async function delPreguntaCualitativaInd(id) {
    await fetch(`${link_service}consultas/eliminarPreguntasCualitativas/${id}`, {
        method: 'DELETE',
    })
}


async function getRelacionPreguntasIndicador() {
    const respuesta = await fetch(`${link_service}consultas/preguntasCualitativasIndicador`)
    const json = await respuesta.json()

    return json;
}

async function delRelacionPreguntasIndicador(id) {
    await fetch(`${link_service}consultas/eliminarPreguntasCualitativasIndicador//${id}`, {
        method: 'DELETE',
    })
}

/*actualizar y eliminaar preguntas*/
setTimeout(() => {
    // ------------------ ACtualizar Pregunta Cualitativa ----------------
    const botones_actualizar_preguntas = document.querySelectorAll(".actualizar-pregunta");
    //obtenemos los datos de las filas de estadnares
    const obtener_datos_preguntas = function (evento) {
        var padre = evento.srcElement.parentNode//obtenemos el primer padre
        //console.log(padre)
        while (padre.className != 'pregunta_cualitativa') {//comparamos si es el padre que buscamos
            padre = padre.parentNode;//obtenemos el siguiente padre en caso de que no se el que buscamos 
        }
        var f = new Date();
        //aaaa/mm/ddd
        fecha_modificacion = f.getFullYear() + "/" + (f.getMonth() + 1) + "/" + (f.getDate() + 1);
        var id = parseInt(padre.children[0].textContent);
        // var pregunta = padre.children[1].textContent;
        var fecha_creacion = cambiar_fecha(padre.children[2].textContent);
        var codigo = padre.children[4].textContent;
        var pregunta = document.getElementById(`${id}`).value;
        // console.log(id)
        // console.log(pregunta)
        // console.log(fecha_creacion)
        // console.log(fecha_modificacion)
        // console.log(codigo)
        (async function () {
            await putPreguntaCualitativaInd(id, pregunta, fecha_creacion, fecha_modificacion, codigo)
            swal("Pregunta actualizada correctamente.")
            setTimeout(() => {
                location.reload();
            }, 2000)

        })()

    }
    // botones_actualizar_preguntas es un arreglo así que lo recorremos
    botones_actualizar_preguntas.forEach(boton => {
        //Agregar listener
        boton.addEventListener("click", obtener_datos_preguntas);
    });

    //---------------- Eliminar Pregunta Cualitativa -----------------
    const botones_eliminar_preguntas = document.querySelectorAll(".eliminar-pregunta");
    //obtenemos los datos de las filas de estadnares
    const obtener_datos_preguntas_eliminar = function (evento) {
        var padre = evento.srcElement.parentNode//obtenemos el primer padre
        //console.log(padre)
        while (padre.className != 'pregunta_cualitativa') {//comparamos si es el padre que buscamos
            padre = padre.parentNode;//obtenemos el siguiente padre en caso de que no se el que buscamos 
        }
        var id = parseInt(padre.children[0].textContent);
        console.log(id);

        (async function () {
            //eliminamos la pregunta cualitativa
            await delPreguntaCualitativaInd(id);

            //obtenemos las relaciones de preguntas cualitativas y el Indicadors
            const datos_indicador_pregunta_cualitativa = await getRelacionPreguntasIndicador()
            datos_indicador_pregunta_cualitativa.forEach(element => {
                if (element.pregunta_Cualitativa_ID == id) {
                    // console.log("---------------")
                    // console.log(element.pregunta_Cualitativa_ID)
                    // console.log(element.indicador_Preguntas_Cualitativas_ID)//este es el ID a eliminar
                    // console.log(element.indicador_ID)

                    //eliminamos la relacion entre la pregunta Cualitativa e Indicador
                    delRelacionPreguntasIndicador(element.indicador_Preguntas_Cualitativas_ID);
                    
                    swal("Pregunta Eliminada Correctamente.")
                    setTimeout(() => {
                        location.reload();
                    }, 2000)

                }
            })
        })()

    }
    // botones_eliminar_preguntas es un arreglo así que lo recorremos
    botones_eliminar_preguntas.forEach(boton => {
        //Agregar listener
        boton.addEventListener("click", obtener_datos_preguntas_eliminar);
    });

}, 1500)


function regresar() {
    history.back();
    //window.location.href = `${url_global_pagina}registrar_normas/ver_normas${extencion}`;
}

function ir_perfil() {
    window.location.href = `${url_global_pagina}perfil_administrador${extencion}?usuario=${usuario_ID}`;
}

function salir() {
    window.location.href = `${url_global_pagina_index}index${extencion}`;
}