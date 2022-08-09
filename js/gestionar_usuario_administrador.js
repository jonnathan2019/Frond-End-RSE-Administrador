async function getDataAdministrador() {
    const respuesta = await fetch(`${link_service}consultas/usuarios`)
    const json = await respuesta.json()

    return json;
}

async function setDataAdministrador(usuario,contrasena,nombre,apellido,email) {
    await fetch(`${link_service}consultas/insertarUsuario`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            usuario: usuario,
            contrasena: contrasena,
            administrador: {
                nombre: nombre,
                apellido: apellido,
                correo: email
            }
        })
    })

}

function crearUsuario_Administrador() {
    let nombre = document.getElementById("nombre_administrador").value;
    let apellido = document.getElementById("apellido_administrador").value;
    let usuario = document.getElementById("nombre-usuario-administrador").value;
    let email = document.getElementById("email-administrador").value;
    let contrasena = document.getElementById("contrasena-administrador").value;
    let contrasenaConfir = document.getElementById("contrasena-confir-administrador").value;

    if (nombre == "" || apellido == "" || usuario == "" || email == ""
        || contrasena == "" || contrasenaConfir == "") {
        swal("Por favor ingrese todos los campos.")
    } else {
        if (contrasena != contrasenaConfir) {
            swal("La contraseña no coincide.")
        } else {
            //Ingresamos el usuario Administrador
            (async function (){
                await setDataAdministrador(usuario,contrasena,nombre,apellido,email)
            })()
            swal("", "Usuario registrado correctamente.", "success");
        }
    }
}

function autentificar_administrador() {
    document.querySelector('.btn').innerHTML = 'Comprobando...'
    document.querySelector('.btn').style.background = 'rgb(126, 126, 241)'
    var usuario = document.getElementById("email-administrador").value;
    var contrasena = document.getElementById("password-administrador").value;

    if (usuario == "" || contrasena == "") {
        swal("Por favor ingrese todos los campos.")
        document.querySelector('.btn').innerHTML = '<i class="fas fa-sign-in-alt"></i> Login'
        document.querySelector('.btn').style.background = 'rgb(71, 71, 241)'
    } else {
        var valor = 0;
        (async function () {
            const info_administrador = await getDataAdministrador();
            document.querySelector('.btn').innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            document.querySelector('.btn').style.background = 'rgb(71, 71, 241)'
            await info_administrador.forEach(element => {
                if (element.administrador != null) {//para comparar solo administradores
                    if (usuario == element.administrador.correo) {
                        if (contrasena == element.contrasena) {
                            valor = 1;
                            swal("", "Se identificó correctamente!", "success");
                            setTimeout(() => {
                                window.location.href = `${url_global_pagina}registrar_normas/registrar_norma${extencion}?usuario=${element.usuario_ID}`;
                            }, 2000)
                        }

                    }
                }
            })
            if (valor == 0) {
                swal("Datos incorrectos, por favor ingrese de nuevo.");
                document.querySelector('.btn').innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
                document.querySelector('.btn').style.background = 'rgb(71, 71, 241)'
            }
        })()

        
    }
}

function registrar_administrador() {
    window.location.href = `${url_global_pagina}registrar_administrador${extencion}`
}

