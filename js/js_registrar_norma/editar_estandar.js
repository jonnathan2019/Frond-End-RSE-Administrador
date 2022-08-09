var usuario_ID = "1";//OBtenemos el ID de la URLs
var estandar_ID = "1";

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
var codigo_estandar = '';
var fecha_creacion = '';
var fecha_modificacion = '';
var estandar_id = '';
//___________________
//obtenemos la info del Usuario
async function getInfoUsuario() {
    const respuesta = await fetch(`${link_service}consultas/usuarioId/${usuario_ID}`)
    const json = await respuesta.json()

    return json;
}

//obtenemos la info del Estandar
async function getInfoEstandar() {
    const respuesta = await fetch(`${link_service}consultas/estandarId/${estandar_ID}`)
    const json = await respuesta.json()

    return json;
}

//Obtenemos la Info de las dimensiones del Estandar
async function getInfoDimensiones() {
    const respuesta = await fetch(`${link_service}consultas/listarDimensiones`)
    const json = await respuesta.json()

    return json;
}

//___________________

window.onload = function () {
    // Cogemos los valores pasados por get
    var valores = getGET();
    //console.log(valores)

    usuario_ID = valores['usuario']
    estandar_ID = valores['estandar_ID']

    //cargamos al informacion del USUARIO 
    const info_user = document.querySelector('.datos-usuario');
    let out_info_user = '';
    (async function () {
        //cargamos la info del Usuario
        const datos_usuario = await getInfoUsuario();
        out_info_user += `
                            <div class="nombre-user">
                                <span>${datos_usuario.usuario}</span>
                            </div>
                            <div class="correo-user">
                                <span>${datos_usuario.administrador.correo}</span>
                            </div>
                                `;
        info_user.innerHTML = out_info_user;
        //cargamos la info del Estandar
        const datos_estandar = await getInfoEstandar();
        document.getElementById('nombre-estandar').value = datos_estandar.nombre;
        document.getElementById('pais-ofical').value = datos_estandar.pagina_Oficial;
        document.getElementById('ano-creacion-estandar').value = datos_estandar.anio_Creacion;
        document.getElementById('institucion-pertenecia-estandar').value = datos_estandar.institucion_Pertenencia;
        document.getElementById('ano-vigencia-estandar').value = datos_estandar.anio_Vigencia;
        document.getElementById('vercion-estandar').value = datos_estandar.version;
        document.getElementById('pais-origen-estandar').value = datos_estandar.pais_Origen;
        document.getElementById('region-aplicacion-estandar').value = datos_estandar.region_Aplica;
        fecha_modificacion = cambiar_fecha(datos_estandar.Fecha_Modificacion);
        fecha_creacion = cambiar_fecha(datos_estandar.Fecha_Creacion);
        document.getElementById('descripcion-estandar').value = datos_estandar.descripcion;
        codigo_estandar = datos_estandar.codigo_estandar;
        estandar_id = datos_estandar.estandar_ID;
        //cargamos la info de las Dimensiones del Estandar
        const dimensiones = document.querySelector('.cuerpo-tabla-dimensiones');
        let outDimensiones = '';
        const datos_dimensiones = await getInfoDimensiones();
        datos_dimensiones.forEach(element => {
            console.log(estandar_id)
            console.log("-   " + element.estandar.estandar_ID)
            if (estandar_id == element.estandar.estandar_ID) {
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
            }

        })
        dimensiones.innerHTML = outDimensiones;

    })()
}


async function putInfoEstandar(fecha_creacion, fecha_modificacion, codigo_estandar, version, descripcion, nombre, region_Aplica, anio_Vigencia, pais_Origen, anio_Creacion, pagina_Oficial, institucion_Pertenencia) {
    await fetch(`${link_service}consultas/actualizarEstandar/${estandar_ID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Fecha_Creacion: fecha_creacion,
            Fecha_Modificacion: fecha_modificacion,
            codigo_estandar: codigo_estandar,
            version: version,
            descripcion: descripcion,
            nombre: nombre,
            region_Aplica: region_Aplica,
            anio_Vigencia: anio_Vigencia,
            pais_Origen: pais_Origen,
            anio_Creacion: anio_Creacion,
            pagina_Oficial: pagina_Oficial,
            institucion_Pertenencia: institucion_Pertenencia
        })
    })
}

function actualizar_estandar() {

    var f = new Date();
    //aaaa/mm/ddd
    fecha_modificacion = f.getFullYear() + "/" + (f.getMonth() + 1) + "/" + (f.getDate() + 1);

    //llamamos a la funcion para actualizar la Info del Estandar
    var codigo_estandar = codigo_estandar;
    var version = document.getElementById('vercion-estandar').value;
    var descripcion = document.getElementById('descripcion-estandar').value;
    var nombre = document.getElementById('nombre-estandar').value;
    var region_Aplica = document.getElementById('region-aplicacion-estandar').value;
    var anio_Vigencia = document.getElementById('ano-vigencia-estandar').value;
    var pais_Origen = document.getElementById('pais-origen-estandar').value;
    var anio_Creacion = document.getElementById('ano-creacion-estandar').value;
    var pagina_Oficial = document.getElementById('pais-ofical').value;
    var institucion_Pertenencia = document.getElementById('institucion-pertenecia-estandar').value;
    (async function () {
        await putInfoEstandar(fecha_creacion, fecha_modificacion, codigo_estandar, version, descripcion, nombre, region_Aplica, anio_Vigencia, pais_Origen, anio_Creacion, pagina_Oficial, institucion_Pertenencia)
    })()
    swal("Datos actualizados correctamente.")
}

async function delDimension(dimension_ID) {
    await fetch(`${link_service}consultas/eliminarDimension/${dimension_ID}`, {
        method: 'DELETE',
    })
}

setTimeout(() => {
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
            await delDimension(dimension_ID)//pasamos como parametro el ID de la Dimesnion a elminar
            swal("eliminar " + dimension_ID)
            setTimeout(()=>{
                location.reload();
            },2000)
        })()
    }

    botones_eliminar_dimension.forEach(boton => {
        //Agregar listener
        boton.addEventListener("click", eliminar_dimension);
    });

    //_________________DIMENSION FIN_________________
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