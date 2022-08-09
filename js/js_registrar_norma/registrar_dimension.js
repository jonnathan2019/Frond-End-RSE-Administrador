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

async function getEstandares() {
    await fetch(`${link_service}consultas/listarEstandares`)
        .then(respuesta => respuesta.json())
        .then(data => {
            var preguntas = document.querySelector('.selector-estandares');
            let outPreguntas = '<option value="">Elija el Estandar</option>';
            data.forEach(element => {

                console.log(element.nombre)
                outPreguntas += `
             <option value="${element.estandar_ID}" id="">${element.nombre}</option>              
                   `;
            });

            preguntas.innerHTML = outPreguntas;
        })
}

async function setDimensiones(fecha_actual,fecha_actual,codigo_dim,selected,descripcion_dimension,nombre_dimension) {
    await fetch(`${link_service}consultas/insertarDimension`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Fecha_Creacion: fecha_actual,
            Fecha_Modificacion: fecha_actual,
            codigo_dimension: codigo_dim,
            estandar: {
                estandar_ID: selected
            },
            descripcion: descripcion_dimension,
            nombre: nombre_dimension
        })
    })
}

(async function () {
    await getEstandares();
})()

function gurdar_dimension() {
    var codigo_dim;
    crear_codigo();
    codigo_dim = codigo;

    var nombre_dimension = document.getElementById("nombre-dimension").value;
    var descripcion_dimension = document.getElementById("descripcion-dimension").value;

    var combo = document.getElementById("selector");
    var selected = combo.options[combo.selectedIndex].value;

    var f = new Date();
    //aaaa/mm/ddd
    var fecha_actual = f.getFullYear() + "/" + (f.getMonth() + 1) + "/" + (f.getDate() + 1);

    //ingresamos los datos
    (async function(){
        await setDimensiones(fecha_actual,fecha_actual,codigo_dim,selected,descripcion_dimension,nombre_dimension);
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
    // window.location.href = `${url_global_pagina}registrar_normas/registrar_estandar${extencion}?usuario=${usuario_ID}`;
}

function siguiente() {
    window.location.href = `${url_global_pagina}registrar_normas/registrar_tema${extencion}?usuario=${usuario_ID}`;
}

function salir() {
    window.location.href = `${url_global_pagina_index}index${extencion}`;
}