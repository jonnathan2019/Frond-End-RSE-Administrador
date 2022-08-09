var usuario_ID = "1";//OBtenemos el ID de la URLs
var tema_ID = "1";

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

    dia = dia + 1;
    if (dia < 10) {
        dia = "0" + dia
    }

    if (mes < 10) {
        mes = "0" + mes
    }

    var fecha_editada = ano + "/" + mes + "/" + dia
    return fecha_editada;
}
var codigo_tema = '';
var estandar_id = '';
var dimension_id = '';
var fecha_creacion = '';
var fecha_modificacion = '';
//________________________________
async function getInfoUsuarioTema() {
    const respuesta = await fetch(`${link_service}consultas/usuarioId/${usuario_ID}`)
    const json = await respuesta.json()

    return json;
}

async function getInfoTemaTem() {
    const respuesta = await fetch(`${link_service}consultas/temaId/${tema_ID}`)
    const json = await respuesta.json()

    return json;
}

async function getInfoDimensionesTem() {
    const respuesta = await fetch(`${link_service}consultas/listarDimensiones`)
    const json = await respuesta.json()

    return json;
}

async function getInfoIndicadoresTem() {
    const respuesta = await fetch(`${link_service}consultas/listarIndicadores`)
    const json = await respuesta.json()

    return json;
}

//________________________________
window.onload = function () {
    // Cogemos los valores pasados por get
    var valores = getGET();
    //console.log(valores)

    usuario_ID = valores['usuario']
    tema_ID = valores['tema_ID']

    //cargamos al informacion del USUARIO 
    const info_user = document.querySelector('.datos-usuario');
    let out_info_user = '';

    (async function () {
        //cargamos la Info del usuario
        const datos_usuario = await getInfoUsuarioTema();
        out_info_user += `
                            <div class="nombre-user">
                                <span>${datos_usuario.usuario}</span>
                            </div>
                            <div class="correo-user">
                                <span>${datos_usuario.administrador.correo}</span>
                            </div>
                                `;
        info_user.innerHTML = out_info_user;

        //cargamos la info del tema
        const datos_tema = await getInfoTemaTem();
        document.getElementById('nombre-tema').value = datos_tema.nombre;
        fecha_modificacion = cambiar_fecha(datos_tema.Fecha_Modificacion);
        fecha_creacion = cambiar_fecha(datos_tema.Fecha_Creacion);
        document.getElementById('descripcion-tema').value = datos_tema.descripcion;
        document.getElementById('dimension-selecionada').value = datos_tema.dimension.nombre;

        codigo_tema = datos_tema.codigo_tema;
        dimension_id = datos_tema.dimension.dimension_ID;
        estandar_id = datos_tema.dimension.estandar.estandar_ID;

        //cargamos la Info de las Dimensiones en el Select
        const datos_dimensiones = await getInfoDimensionesTem()
        var preguntas = document.querySelector('.selector-dimensiones');
        let outPreguntas = '<option value="">Elija la Dimension</option>';
        datos_dimensiones.forEach(element => {
            outPreguntas += `
            <option value="${element.dimension_ID}" id="">${element.nombre}</option>              
                  `;
        });
        preguntas.innerHTML = outPreguntas;

        //cargamos los Indicadores del Tema
        const indicadores = document.querySelector('.cuerpo-tabla-indicadores');
        let outIndicadores = '';
        const datos_indicadores = await getInfoIndicadoresTem();
        datos_indicadores.forEach(element => {
            if (tema_ID == element.tema.tema_ID) {
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
            }

        })
        indicadores.innerHTML = outIndicadores;

    })()
}


function cargar_estar_label() {
    var select = document.getElementById("selector");
    var value = select.options[select.selectedIndex].value;
    dimension_id = value;//We save the ID of Dimention
    var respuesta = select.options[select.selectedIndex].text;
    //console.log(value)
    document.getElementById('dimension-selecionada').value = respuesta;
}

async function putTemaTem(fecha_creacion,fecha_modificacion,codigo_tema,estandar_id,dimension_id,nombre,descripcion) {
    await fetch(`${link_service}consultas/actualizarTema/${tema_ID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Fecha_Creacion: fecha_creacion,
            Fecha_Modificacion: fecha_modificacion,
            codigo_tema: codigo_tema,
            dimension: {
                estandar: {
                    estandar_ID: estandar_id
                },
                dimension_ID: dimension_id
            },
            nombre: nombre,
            descripcion: descripcion
        })
    })
}

function guardar_tema() {
    var f = new Date();
    //aaaa/mm/ddd
    fecha_modificacion = f.getFullYear() + "/" + (f.getMonth() + 1) + "/" + (f.getDate() + 1);

    //llamamos a la funcion para actualizar 
    var nombre = document.getElementById('nombre-tema').value;
    var descripcion = document.getElementById('descripcion-tema').value;
    (async function () {
        await putTemaTem(fecha_creacion,fecha_modificacion,codigo_tema,estandar_id,dimension_id,nombre,descripcion)
        swal("Datos actualizados correctamente.")
    })()
}

async function del_Indicador(indicador_ID) {
    await fetch(`${link_service}consultas/eliminarIndicador/${indicador_ID}`, {
        method: 'DELETE',
    })
}


setTimeout(() => {
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

    //Eliminar Indicador
    const botones_eliminar_indicador = document.querySelectorAll(".eliminar-indicador");

    const eliminar_indicador = function (evento) {
        var elementos_inidcador_1 = evento.srcElement.parentElement;//obtenemos padre (<td> botones) de boton ACTUALIZAR
        var elementos_inidcador_2 = elementos_inidcador_1.parentElement.getElementsByTagName("td");
        indicador_ID = elementos_inidcador_2[0].textContent;
        (async function () {
            await del_Indicador(indicador_ID)
            // swal("eliminar " + indicador_ID)
            swal("Indicador Eliminado Correctamente.")
            setTimeout(() => {
                location.reload();
            }, 2000)
        })()
    }

    botones_eliminar_indicador.forEach(boton => {
        //Agregar listener
        boton.addEventListener("click", eliminar_indicador);
    });
    //___________________INDICADOR Fin__________________

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