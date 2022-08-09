//Obtenemos el USUARIO de la URL
function obtener_valor(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


var usuario_ID = obtener_valor("usuario");//OBtenemos el ID de la URL

//cargamos al informacion del USUARIO 
const info_user = document.querySelector('.datos-usuario');
let out_info_user = '';
fetch(`${link_service}consultas/usuarioId/${usuario_ID}`)
    .then(response => response.json())
    .then(data => {
        out_info_user += `
                            <div class="nombre-user">
                                <span>${data.usuario}</span>
                            </div>
                            <div class="correo-user">
                                <span>${data.administrador.correo}</span>
                            </div>
                                `;
        info_user.innerHTML = out_info_user;


    })

var codigo;
//____________________Estandar INICIO___________________
async function setDatosEstandar(fecha_actual, fecha_actual, codigo_estadar, vercion_estadar, institucion_pertenencia_estandar, pais_oficial_estandar, nombre_estandar, descripcion_estandar, pais_origen_estandar, anio_vigencia_estandar, region_aplicaicon_estandar, anio_creacion_estandar) {
    await fetch(`${link_service}consultas/insertarEstandar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Fecha_Creacion: fecha_actual,//aaaa/mm/dd
            Fecha_Modificacion: fecha_actual,
            codigo_estandar: codigo_estadar,
            version: vercion_estadar,
            institucion_Pertenencia: institucion_pertenencia_estandar,
            pagina_Oficial: pais_oficial_estandar,
            nombre: nombre_estandar,
            descripcion: descripcion_estandar,
            pais_Origen: pais_origen_estandar,
            anio_Vigencia: anio_vigencia_estandar,
            region_Aplica: region_aplicaicon_estandar,
            anio_Creacion: anio_creacion_estandar
        })
    })
}

async function getInfoEstandaresNorma() {
    const respuesta = await fetch(`${link_service}consultas/listarEstandares`)
    const json = await respuesta.json()

    return json;
}


function guardar_estandar() {//guardar ESTANDAR
    var codigo_estadar;
    var nombre_estandar = document.getElementById("nombre-estandar").value;
    var pais_oficial_estandar = document.getElementById("pais-ofical").value;
    var anio_creacion_estandar = document.getElementById("ano-creacion-estandar").value;
    var institucion_pertenencia_estandar = document.getElementById("institucion-pertenecia-estandar").value;
    var anio_vigencia_estandar = document.getElementById("ano-vigencia-estandar").value;
    var vercion_estadar = document.getElementById("vercion-estandar").value;
    var pais_origen_estandar = document.getElementById("pais-origen-estandar").value;
    var region_aplicaicon_estandar = document.getElementById("region-aplicacion-estandar").value;
    //var fecha_modificacion_estandar = document.getElementById("fecha-modificacion-estandar").value;
    //var fecha_creacion_estandar = document.getElementById("fecha-creacion-estandar").value;
    var descripcion_estandar = document.getElementById("descripcion-estandar").value;


    var f = new Date();
    //aaaa/mm/ddd
    var fecha_actual = f.getFullYear() + "/" + (f.getMonth() + 1) + "/" + (f.getDate() + 1);

    if (nombre_estandar != "" && pais_oficial_estandar != "" && anio_creacion_estandar != "" && institucion_pertenencia_estandar != "" &&
        anio_vigencia_estandar != "" && vercion_estadar != "" && pais_origen_estandar != "" &&
        region_aplicaicon_estandar != "" && descripcion_estandar != "") {


        //const fecha_modificacion = fecha_modificacion_estandar.replaceAll("-", "/");
        //const fecha_creacion = fecha_creacion_estandar.replaceAll("-", "/");
        //ingresamos los datos
        (async function () {
            const datos = await getInfoEstandaresNorma();
            codigo_estadar = crear_codigo(datos);
            await setDatosEstandar(fecha_actual, fecha_actual, codigo_estadar, vercion_estadar, institucion_pertenencia_estandar, pais_oficial_estandar, nombre_estandar, descripcion_estandar, pais_origen_estandar, anio_vigencia_estandar, region_aplicaicon_estandar, anio_creacion_estandar);
        })()
        swal("Datos Ingresados Correctamente")
    } else {
        swal("Porfavor INgrese todos los campos")
    }
}



//_____________________Estandar FIN_____________________

//crear codigo
function crear_codigo(datos) {
    if( datos.length <= 1){
        codigo = "RSE_ES_" + 1;
    }else{
        var lista = []
        datos.forEach(element => {
            lista.push(element.codigo_estandar)
        });
        console.log(lista)
        var lista_2 = lista.sort();
        console.log(lista_2)
        var ultimo_codigo = lista_2[lista_2.length-1];
        console.log(ultimo_codigo)
        var ultimo_numero_codigo = ultimo_codigo.split('_');
        var numero = ultimo_numero_codigo[ultimo_numero_codigo.length-1]
        console.log(numero)
        codigo = "RSE_ES_" + (parseInt(numero)+1);
        // console.log(datos)
        // var data = datos.sort(function (a, b) {
        //     //anio_Creacion
        //     // codigo_estandar
        //     // console.log(a.codigo_estandar)
        //     // console.log(b.codigo_estandar)
        //     return b.anio_Creacion - a.anio_Creacion;
        // });
        // console.log(data)
        // var ultimo_codigo = datos[datos.length-1].codigo_estandar;
        // var ultimo_numero_codigo = ultimo_codigo.split('_');
        // console.log(ultimo_numero_codigo)
        // var numero = ultimo_numero_codigo[ultimo_numero_codigo.length-1]
        // console.log(numero)
        // codigo = "RSE_ES_" + (parseInt(numero)+1);
        // codigo = "RSE_ES_" + (datos.length+1);
    }
    console.log(codigo)
    return codigo;
}

function ir_perfil() {
    window.location.href = `${url_global_pagina}perfil_administrador${extencion}?usuario=${usuario_ID}`;
}

function mostrar_norma_registarada() {
    window.location.href = `${url_global_pagina}registrar_normas/ver_normas${extencion}?usuario=${usuario_ID}`;
}

function registrar_norma() {
    window.location.href = `${url_global_pagina}registrar_normas/registrar_norma${extencion}?usuario=${usuario_ID}`;
}

//botones atras y siguiente
function atras() {
    history.back();
    // window.location.href = `${url_global_pagina}registrar_normas/registrar_norma${extencion}?usuario=${usuario_ID}`;
}

function siguiente() {
    window.location.href = `${url_global_pagina}registrar_normas/registrar_dimension${extencion}?usuario=${usuario_ID}`;
}

function salir() {
    window.location.href = `${url_global_pagina_index}index${extencion}`;
}