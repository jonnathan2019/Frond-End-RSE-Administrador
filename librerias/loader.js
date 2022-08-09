window.onload = function () {
    $('#onload').fadeOut();
    $('body').removeClass('hidden');
    //para resulatdos
    setTimeout(() => {
        $('#onload_resultados').fadeOut();
        $('body').removeClass('hidden_resultados');
    },2000)
}

