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


async function getDimensiones() {
    await fetch(`${link_service}consultas/listarDimensiones`)
        .then(respuesta => respuesta.json())
        .then(data => {
            var preguntas = document.querySelector('.selector-dimensiones');
            let outPreguntas = '<option value="">Elija la Dimension</option>';
            data.forEach(element => {
                outPreguntas += `
            <option value="${element.dimension_ID}" id="">${element.nombre}</option>              
                  `;
            });

            preguntas.innerHTML = outPreguntas;
        })
}

async function setTemas(fecha_actual,fecha_actual,codigo_tema,selected,nombre_tema,descripcion_tema) {
    await fetch(`${link_service}consultas/insertarTema`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Fecha_Creacion: fecha_actual,
            Fecha_Modificacion: fecha_actual,
            codigo_tema: codigo_tema,
            dimension: {
                dimension_ID: selected
            },
            nombre: nombre_tema,
            descripcion: descripcion_tema
        })
    })
}

(async function () {
    await getDimensiones();
})()

function guardar_tema() {
    var codigo_tema;
    crear_codigo();
    codigo_tema = codigo;
    //----- Insertar TEMA
    var nombre_tema = document.getElementById("nombre-tema").value;
    //var fecha_creacion_tema = document.getElementById("fecha-creacion-tema").value;
    //var fecha_modificacion_tema = document.getElementById("fecha-modificacion-tema").value;
    var descripcion_tema = document.getElementById("descripcion-tema").value;

    var combo = document.getElementById("selector");
    var selected = combo.options[combo.selectedIndex].value;

    var f = new Date();
    //aaaa/mm/ddd
    var fecha_actual = f.getFullYear() + "/" + (f.getMonth() + 1) + "/" + (f.getDate() + 1);
    //ingresamos los datos
    (async function (){
        await setTemas(fecha_actual,fecha_actual,codigo_tema,selected,nombre_tema,descripcion_tema);
    })()
    swal("Datos Registrados Corectamente")

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
    // window.location.href = `${url_global_pagina}registrar_normas/registrar_dimension${extencion}?usuario=${usuario_ID}`;
}

function siguiente() {
    window.location.href = `${url_global_pagina}registrar_normas/registrar_indicador${extencion}?usuario=${usuario_ID}`;
}


function salir() {
    window.location.href = `${url_global_pagina_index}index${extencion}`;
}