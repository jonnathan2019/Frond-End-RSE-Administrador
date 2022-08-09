
//Obtenemos el USUARIO de la URL

function obtener_valor(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var usuario_ID = obtener_valor("usuario");
//cargamos al informacion del USUARIO 
const info_user = document.querySelector('.datos-usuario');
let out_info_user = '';
//para guardar el id del enscuetado y de la empresa
var encuestado_id;
var empresa_id;
//___________________________
//obtenemos la info del Usuario
async function getDataUsuario() {
    const respuesta = await fetch(`${link_service}consultas/usuarioId/${usuario_ID}`)
    const json = await respuesta.json()

    return json;
}
//obtenemos la info de la Empresa
async function getDataEmpresa() {
    const respuesta = await fetch(`${link_service}consultas/empresaId/${empresa_id}`)
    const json = await respuesta.json()

    return json;
}
//mostramos la informacion del usuario
(async function () {
    //cargamos la Info del USUARIo
    const datos_usuario = await getDataUsuario()
    out_info_user += `
                            <div class="nombre-user">
                                <span>${datos_usuario.usuario}</span>
                            </div>
                            <div class="correo-user">
                                <span>${datos_usuario.encuestado.correo}</span>
                            </div>
                                `;
    info_user.innerHTML = out_info_user;
    //-------------------------
    document.getElementById('nombre').value = datos_usuario.encuestado.nombre;
    document.getElementById('apellido').value = datos_usuario.encuestado.apellido;
    document.getElementById('usuario').value = datos_usuario.usuario;
    document.getElementById('email').value = datos_usuario.encuestado.correo;
    document.getElementById('contrasena').value = datos_usuario.contrasena;
    document.getElementById('confirmar-contrasena').value = datos_usuario.contrasena;

    encuestado_id = datos_usuario.encuestado.encuestado_ID;
    empresa_id = datos_usuario.encuestado.empresa.empresa_ID;

    //Carga,os la info de la empresa
    const datos_empresa = await getDataEmpresa();
    document.getElementById('nombre-empresa').value = datos_empresa.nombre;
    document.getElementById('secto-opera').value = datos_empresa.sector_tipo;
    document.getElementById('numero-empleados').value = datos_empresa.numero_empleados;
    document.getElementById('ruc-empresa').value = datos_empresa.ruc_empresa;

})()
//__________________________
//para actualizar los datos del Usuario
async function putDatosUsuario() {
    await fetch(`${link_service}consultas/actualizarUsuario/${usuario_ID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            usuario: document.getElementById('usuario').value,
            contrasena: document.getElementById('contrasena').value,
            encuestado: {
                nombre: document.getElementById('nombre').value,
                apellido: document.getElementById('apellido').value,
                correo: document.getElementById('email').value,
                encuestado_ID: encuestado_id,
                empresa: {
                    empresa_ID: empresa_id
                }
            },
            administrador_ID: null,
        })
    })

}
function actualizar_usaurio() {
    var contrasena = document.getElementById('contrasena').value;
    var confirmar_contrasena = document.getElementById('confirmar-contrasena').value;
    if (contrasena == confirmar_contrasena) {
        (async function () {
            await putDatosUsuario();
        })()
        swal("Datos actualizados correctamente.")
    } else {
        swal("Las contraseñas no coinciden.")
    }


}
//para actualizar los datos de la EMPRESAa
async function putDatosEmpresa() {
    await fetch(`${link_service}consultas/actualizarEmpresa/${empresa_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nombre: document.getElementById('nombre-empresa').value,
            sector_tipo: document.getElementById('secto-opera').value,
            numero_empleados: document.getElementById('numero-empleados').value,
            ruc_empresa: document.getElementById('ruc-empresa').value
        })
    })
}

function actualizar_empresa() {
    (async function (){
        await putDatosEmpresa()
    })()
    swal("Datos de la Empresa actualizados correctamente.")
}

function ir_evaluacion() {
    window.location.href = `${url_global_pagina}evaluacion_principal${extencion}?usuario=${usuario_ID}`;
}

function ir_reporte() {
    window.location.href = `${url_global_pagina}resultados${extencion}?usuario=${usuario_ID}`;
}
function ir_perfil() {
    window.location.href = `${url_global_pagina}perfil_usuario${extencion}?usuario=${usuario_ID}`;
}

function regresar() {
    history.back()
}

function salir() {
    window.location.href = `${url_global_pagina}login_encuestado${extencion}`;
}
