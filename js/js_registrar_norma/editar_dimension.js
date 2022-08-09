var usuario_ID = "1";//OBtenemos el ID de la URLs
var dimension_ID = "1";

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
var codigo_dimension = '';
var estandar_id = '';
var fecha_creacion = '';
var fecha_modificacion = '';
//___________________________
async function getInfoUsuarioDim() {
    const respuesta = await fetch(`${link_service}consultas/usuarioId/${usuario_ID}`)
    const json = await respuesta.json()

    return json;
}

async function getInfoDimensionDim() {
    const respuesta = await fetch(`${link_service}consultas/dimensionId/${dimension_ID}`)
    const json = await respuesta.json()

    return json;
}

async function getInfoEstandaresDim() {
    const respuesta = await fetch(`${link_service}consultas/listarEstandares`)
    const json = await respuesta.json()

    return json;
}

async function getInfoTemasDim() {
    const respuesta = await fetch(`${link_service}consultas/listarTemas`)
    const json = await respuesta.json()

    return json;
}
//___________________________
window.onload = function () {
    // Cogemos los valores pasados por get
    var valores = getGET();
    //console.log(valores)

    usuario_ID = valores['usuario']
    dimension_ID = valores['dimension_ID']

    //cargamos al informacion del USUARIO 
    const info_user = document.querySelector('.datos-usuario');
    let out_info_user = '';

    (async function () {
        //cargamos la Info del Usuario
        const datos_usuarioDim = await getInfoUsuarioDim();
        out_info_user += `
        <div class="nombre-user">
            <span>${datos_usuarioDim.usuario}</span>
        </div>
        <div class="correo-user">
            <span>${datos_usuarioDim.administrador.correo}</span>
        </div>
            `;
        info_user.innerHTML = out_info_user;

        //cargamos la Info de la Dimension
        const datos_dimension = await getInfoDimensionDim()
        document.getElementById('nombre-dimension').value = datos_dimension.nombre;
        fecha_modificacion = cambiar_fecha(datos_dimension.Fecha_Modificacion);
        fecha_creacion = cambiar_fecha(datos_dimension.Fecha_Creacion);
        document.getElementById('descripcion-dimension').value = datos_dimension.descripcion;
        document.getElementById('estandar-dimension').value = datos_dimension.estandar.nombre;
        estandar_id = datos_dimension.estandar.estandar_ID;
        codigo_dimension = datos_dimension.codigo_dimension;

        //cargamos la Info del Estandar en el Select
        const datos_estandar = await getInfoEstandaresDim();
        var preguntas = document.querySelector('.selector-estandares');
        let outPreguntas = '<option value="">Elija el Estandar</option>';
        datos_estandar.forEach(element => {

            console.log(element.nombre)
            outPreguntas += `
                <option value="${element.estandar_ID}" id="">${element.nombre}</option>              
                      `;
        });
        preguntas.innerHTML = outPreguntas;

        //cargamos los Temas de la Dimension 
        const temas = document.querySelector('.cuerpo-tabla-temas');
        let outTemas = '';
        const datos_temas = await getInfoTemasDim();
        datos_temas.forEach(element => {
            if (dimension_ID == element.dimension.dimension_ID) {
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
            }

        })
        temas.innerHTML = outTemas;

    })()
}



function cargar_estar_label() {
    var select = document.getElementById("selector");
    var value = select.options[select.selectedIndex].value;
    estandar_id = value;//guardamos el ID del estandar
    var respuesta = select.options[select.selectedIndex].text;
    //console.log(value)
    document.getElementById('estandar-dimension').value = respuesta;
}

async function putDimensionesDim(fecha_creacion,fecha_modificacion,codigo_dimension,estandar_id,nombre,descripcion) {
    await fetch(`${link_service}consultas/actualizarDimension/${dimension_ID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Fecha_Creacion: fecha_creacion,
            Fecha_Modificacion: fecha_modificacion,
            codigo_dimension: codigo_dimension,
            estandar: {
                estandar_ID: estandar_id
            },
            nombre: nombre,
            descripcion: descripcion
        })
    })
}

function actualizar_dimension() {

    var f = new Date();
    //aaaa/mm/ddd
    fecha_modificacion = f.getFullYear() + "/" + (f.getMonth() + 1) + "/" + (f.getDate() + 1);

    //llamamos a la funcion para actualizar
    var nombre = document.getElementById('nombre-dimension').value;
    var descripcion = document.getElementById('descripcion-dimension').value;
    (async function () {
        await putDimensionesDim(fecha_creacion,fecha_modificacion,codigo_dimension,estandar_id,nombre,descripcion)
        swal("Datos actualizados correctamente.")
    })()
}


async function delTema(tema_ID) {
    await fetch(`${link_service}consultas/eliminarTema/${tema_ID}`, {
        method: 'DELETE',
    })
}

setTimeout(() => {
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

    //Eliminar Tema
    const botones_eliminar_tema = document.querySelectorAll(".eliminar-tema");

    const eliminar_tema = function (evento) {
        var elementos_tema_1 = evento.srcElement.parentElement;//obtenemos padre (<td> botones) de boton ACTUALIZAR
        var elementos_tema_2 = elementos_tema_1.parentElement.getElementsByTagName("td");
        tema_ID = elementos_tema_2[0].textContent;
        (async function () {
            await delTema(tema_ID)
            swal("Tema eliminado correctamente.")
            //swal("eliminar " + tema_ID)
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