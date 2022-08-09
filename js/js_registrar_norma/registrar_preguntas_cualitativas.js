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
//cargamos los indicadores 
async function getIndicadores() {
    await fetch(`${link_service}consultas/listarIndicadores`)
        .then(respuesta => respuesta.json())
        .then(data => {
            var preguntas = document.querySelector('.selector-indicadores');
            let outPreguntas = '<option value="">Elija un Inidicador</option>';
            data.forEach(element => {
                outPreguntas += `
            <option value="${element.indicador_ID}" id="">${element.nombre}</option>              
                  `;
            });

            preguntas.innerHTML = outPreguntas;
        })
}

(async function () {
    await getIndicadores();
})()

//creeamos las preguntas cuantitativas (SELECT)
// function crear_preguntas() {
//     var select = document.getElementById("selector_pregunta");
//     var value = select.options[select.selectedIndex].value;

//     const preguntas = document.querySelector('.contenedor-preguntas-cualitativas');
//     let outPreguntas = '';
//     //console.log(value)
//     for (i = 0; i < value; i++) {
//         outPreguntas += `
//                     <div class="datos-1">
//                         <input type="text" id="pregunta_${i + 1}" placeholder="Preguta ${i + 1}">
//                     </div>                 
//                   `;
//     }

//     preguntas.innerHTML = outPreguntas;


// }
//creamos las preguntas cualitativas con INPUT
var numero_pregutas = 0;
function crear_preguntas_cualitativas() {
    numero_pregutas = document.getElementById("cantidad-preguntas-culitativas").value;

    const preguntas = document.querySelector('.contenedor-preguntas-cualitativas');
    let outPreguntas = '';
    //console.log(value)
    for (i = 0; i < numero_pregutas; i++) {
        outPreguntas += `
                    <div class="datos-1">
                    <textarea name="" id="pregunta_${i + 1}" class="preguntas_cualitativas_insertar" placeholder="Preguta ${i + 1}"></textarea>
                    </div>                 
                  `;
    }

    preguntas.innerHTML = outPreguntas;


}

// Ingresamos las preguntas Cualitativas
async function setPreguntasCualitativas(pregunta_cualitativa, fecha_actual, fecha_actual, codigo_pregunta) {
    await fetch(`${link_service}consultas/insertarPreguntasCualitativas`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            pregunta_cualitativa: pregunta_cualitativa,
            Fecha_Creacion: fecha_actual,
            Fecha_Modificacion: fecha_actual,
            codigo_pegunta_cualitativa: codigo_pregunta
        })
    })
}
//obtenemos el ID de las preguntas Cualitativas previamente ingresadas
async function getIDPreguntasCualitativas() {
    const respuesta = await fetch(`${link_service}consultas/preguntasCualitativas`)
    const json = await respuesta.json()
    console.log(json)
    return json;
}

//ingresamos el ID para Pregunta Cualitativa Indicador
async function setPreguntaCualitaitvaIndicador(selected, pregunta_Cualitativa_ID) {
    await fetch(`${link_service}consultas/insertarPreguntasCualitativasIndicador`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            indicador_ID: selected,
            pregunta_Cualitativa_ID: pregunta_Cualitativa_ID
        })
    })
}

function guardar_preguntas_cualitativas() {
    //para crear el codigo
    crear_codigo();
    codigo_pregunta = codigo;
    //obtener los datos del selector
    var combo = document.getElementById("selector");
    var selected = combo.options[combo.selectedIndex].value;

    if (selected != "") {
        if (numero_pregutas != 0) {
            //obtenemso la fecha actual
            var f = new Date();
            var fecha_actual = f.getFullYear() + "/" + (f.getMonth() + 1) + "/" + (f.getDate());//aaaa/mm/ddd

            let preguntas_cualitativas = [];
            let aux = 0;
            //obtenemos las preguntas de los TextArea
            for (i = 1; i <= numero_pregutas; i++) {
                var preguntas = document.getElementById(`pregunta_${i}`).value;
                // var preguntas_2 = document.getElementById(`pregunta_${i}`);
                if (preguntas != "") {
                    preguntas_cualitativas.push(preguntas)
                } else {
                    // preguntas_2.style.border = "2px solid red";
                    aux = 1;
                }

            }

            if (aux == 0) {
                (async function () {
                    //recorremos el array de preguntas para ingresar pregunta por pregunta
                    for (i = 0; i < preguntas_cualitativas.length; i++) {
                        //ingreamos las spreguntas
                        await setPreguntasCualitativas(preguntas_cualitativas[i], fecha_actual, fecha_actual, codigo_pregunta)

                    }
                    //obtenemos las preguntas cualitativas ingresas
                    const datos = await getIDPreguntasCualitativas(preguntas_cualitativas);
                    //ordenamos y obtenemos los IDs de las ultimas preguntas ingresadas
                    datos.sort(function (a, b) {
                        return a.pregunta_Cualitativa_ID - b.pregunta_Cualitativa_ID;
                    });
                    //console.log(datos)
                    let datos_preguntas = datos.slice((datos.length - (preguntas_cualitativas.length)), datos.length);
                    datos_preguntas.forEach(element_pregunta => {
                        // console.log(element_pregunta.pregunta_cualitativa)
                        // console.log(element_pregunta.pregunta_Cualitativa_ID)
                        //ingresamos el id del INDICADOR y la Preguntaa Cualitativa
                        (async function () {
                            await setPreguntaCualitaitvaIndicador(selected, element_pregunta.pregunta_Cualitativa_ID)
                        })()
                    })
                })()
                swal("Preguntas registradas Correctamente!")
            } else {
                swal("Porfvor ingrese todas las preguntas!")
            }

        } else {
            swal("Tiene que ingresar al menos una pregunta!")
        }
    } else {
        swal("Porfavor selecione un Indicador!")
    }


}

//crear codigo
function crear_codigo() {
    codigo = "RSE_" + 1;
}
//demora
function syncDelay(milliseconds) {
    var start = new Date().getTime();
    var end = 0;
    while ((end - start) < milliseconds) {
        end = new Date().getTime();
    }
}

function mostrar_norma_registarada() {
    window.location.href = `${url_global_pagina}registrar_normas/ver_normas${extencion}?usuario=${usuario_ID}`;
}

function registrar_norma() {
    window.location.href = `${url_global_pagina}registrar_normas/registrar_norma${extencion}?usuario=${usuario_ID}`;
}

function ir_perfil() {
    window.location.href = `${url_global_pagina}perfil_administrador${extencion}?usuario=${usuario_ID}`;
}

//botones atras y siguiente
function atras() {
    history.back();
    // window.location.href = `${url_global_pagina}registrar_normas/registrar_indicador${extencion}?usuario=${usuario_ID}`;
}

function siguiente() {
    window.location.href = `${url_global_pagina}registrar_normas/registrar_preguntas_cuantitativas${extencion}?usuario=${usuario_ID}`;
}

function salir() {
    window.location.href = `${url_global_pagina_index}index${extencion}`;
}

//CUANTITATIVAs
// function crear_preguntas_cuantitativas() {
//     var select = document.getElementById("selector_pregunta_cuantitativa");
//     var value = select.options[select.selectedIndex].value;

//     const preguntas = document.querySelector('.contenedor-preguntas-cualitativas-cuantitativas');
//     let outPreguntas = '';
//     //console.log(value)
//     for (i = 0; i < value; i++) {
//         outPreguntas += `
//                     <div class="datos-1">
//                         <input type="text" id="pregunta_${i + 1}" placeholder="Preguta ${i + 1}">
//                     </div>                 
//                   `;
//     }

//     preguntas.innerHTML = outPreguntas;


// }