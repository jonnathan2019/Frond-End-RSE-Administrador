//Obtenemos el USUARIO de la URL
function obtener_valor(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var usuario_ID = obtener_valor("usuario");
//___________________________________
async function getDataAdministrador() {
    const respuesta = await fetch(`${link_service}consultas/usuarioId/${usuario_ID}`)
    const json = await respuesta.json()

    return json;
}

async function putAdministrador(usuario,contrsena,nombre,apellido,correo,administrador_id) {
    await fetch(`${link_service}consultas/actualizarUsuario/${usuario_ID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            usuario: usuario,
            contrasena: contrsena,
            encuestado: null,
            administrador: {
                nombre: nombre,
                apellido: apellido,
                correo: correo,
                administrador_ID: administrador_id
            }
        })
    })
}
//___________________________________
//cargamos al informacion del USUARIO 
const info_user = document.querySelector('.datos-usuario');
let out_info_user = '';
var administrador_id;

(async function () {
    const info_administrador = await getDataAdministrador();
    out_info_user += `
                            <div class="nombre-user">
                                <span>${info_administrador.usuario}</span>
                            </div>
                            <div class="correo-user">
                                <span>${info_administrador.administrador.correo}</span>
                            </div>
                                `;
    info_user.innerHTML = out_info_user;
    //---------------------------
    document.getElementById('nombre').value = info_administrador.administrador.nombre;
    document.getElementById('apellido').value = info_administrador.administrador.apellido;
    document.getElementById('usuario').value = info_administrador.usuario;
    document.getElementById('email').value = info_administrador.administrador.correo;
    document.getElementById('contrasena').value = info_administrador.contrasena;
    document.getElementById('confirmar-contrasena').value = info_administrador.contrasena;

    administrador_id = info_administrador.administrador.administrador_ID;

})()

function actualizar_administrador() {
    var contrasena = document.getElementById('contrasena').value;
    var confirmar_contrasena = document.getElementById('confirmar-contrasena').value;

    if (contrasena == confirmar_contrasena) {
        (async function (){
            await putAdministrador(document.getElementById('usuario').value,document.getElementById('contrasena').value,document.getElementById('nombre').value,document.getElementById('apellido').value,document.getElementById('email').value,administrador_id)
        })()
        swal("Datos actualizados correctamente.")
    } else {
        swal("Las contraseñas no coinciden.")
    }
}

function regresar() {
    history.back()
}

function salir() {
    window.location.href = `${url_global_pagina_index}index${extencion}`;
}