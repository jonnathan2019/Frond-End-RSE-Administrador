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

//cargamos los TEMAS para el INDICADOR
async function getTemas() {
    await fetch(`${link_service}consultas/listarTemas`)
        .then(respuesta => respuesta.json())
        .then(data => {
            var preguntas = document.querySelector('.selector-temas');
            let outPreguntas = '<option value="">Elija la Tema</option>';
            data.forEach(element => {
                outPreguntas += `
            <option value="${element.tema_ID}" id="">${element.nombre}</option>              
                  `;
            });

            preguntas.innerHTML = outPreguntas;
        })
}

//cargamos los NIVELES para el INDICADOR
async function getNiveles() {
    await fetch(`${link_service}consultas/listarNiveles`)
        .then(respuesta => respuesta.json())
        .then(data => {
            var preguntas = document.querySelector('.selector-niveles');
            let outPreguntas = '<option value="">Elija la Nivel</option>';
            data.forEach(element => {
                outPreguntas += `
            <option value="${element.nivel_ID}" id="">${element.nombre}</option>              
                  `;
            });

            preguntas.innerHTML = outPreguntas;
        })
}

(async function () {
    await getTemas();
    await getNiveles();
})()

async function setIndicador(nombre_indicador,selected_tema,selected_nivel,descripcion_indicador,fecha_actual,fecha_actual,codigo_indicador) {
    await fetch(`${link_service}consultas/insertarIndicador`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nombre: nombre_indicador,
            tema: {
                tema_ID: selected_tema
            },
            nivel: {
                nivel_ID: selected_nivel
            },
            descripcion: descripcion_indicador,
            Fecha_Creacion: fecha_actual,
            Fecha_Modificacion: fecha_actual,
            codigo_indicador: codigo_indicador
        })
    })
}

function guardar_indicador() {
    var codigo_indicador;
    crear_codigo();
    codigo_indicador = codigo;

    var nombre_indicador = document.getElementById("nombre-indicador").value;
    //var fecha_creacion_indicador = document.getElementById("fecha-creacion-indicador").value;
    //var fecha_modificacion_indicador = document.getElementById("fecha-modificacion-indicador").value;
    var descripcion_indicador = document.getElementById("descripcion-indicador").value;

    var combo_tema = document.getElementById("selector-tema");
    var selected_tema = combo_tema.options[combo_tema.selectedIndex].value;

    var combo_nivel = document.getElementById("selector-nivel");
    var selected_nivel = combo_nivel.options[combo_nivel.selectedIndex].value;

    var f = new Date();
    //aaaa/mm/ddd
    var fecha_actual = f.getFullYear() + "/" + (f.getMonth() + 1) + "/" + (f.getDate() + 1);

    //ingresamos los datos
    (async function (){
        await setIndicador(nombre_indicador,selected_tema,selected_nivel,descripcion_indicador,fecha_actual,fecha_actual,codigo_indicador);
    })()
    swal("Datos Ingresados Correctamente!")
}

//crear codigo
function crear_codigo() {
    codigo = "RSE_" + 1;
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
    // window.location.href = `${url_global_pagina}registrar_normas/registrar_tema${extencion}?usuario=${usuario_ID}`;
}

function siguiente() {
    window.location.href = `${url_global_pagina}registrar_normas/registrar_preguntas_cualitativas${extencion}?usuario=${usuario_ID}`;
}

function salir() {
    window.location.href = `${url_global_pagina_index}index${extencion}`;
}