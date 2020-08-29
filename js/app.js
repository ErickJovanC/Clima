const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
})

function buscarClima(e){
    e.preventDefault();
    console.log('Buscando el clima');

    // Validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudad === '' || pais === ''){
        mostrarError('Ambos campos son obligatorios');
    }
    
    // Consultar API
    consultarAPI(ciudad, pais);
}

function mostrarError(mensaje){
    const alerta = document.querySelector('.bg-red-100');

    if(!alerta){
        // Crear alerta
        const alerta = document.createElement('div');
        
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');
        
        alerta.innerHTML = `
        <strong class="font-bold">¡Error!</strong>
        <span class="block">${mensaje}</span>
        `;
        
        container.appendChild(alerta);

        // Eliminar alerta despues de 5 seg
        setTimeout(() => {
            alerta.remove();
        }, 5000);
    }
}

function consultarAPI(ciudad, pais){
    const appId = '81f9a2dd69084965795f235977fd708a'; // Llave generada en el sitio openweathermap.org
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}, ${pais}&appid=${appId}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            limpiarHTML();

            // Si no existe la ciudad o fue mal escrita
            if(datos.cod === '404'){
                mostrarError('Ciudad no encotrada');
            }
            else {
                mostrarClima(datos);
            }
        });
}

function mostrarClima(datos){
    const {name, main: {temp, temp_max, temp_min}} = datos;
    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    // Nombre de la ciudad
    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl');

    // Creando el elemento que mostrara la temperatura actual
    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');

    // Temepratura maxima
    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Máxima ${max} &#8451;`;
    tempMaxima.classList.add('text-xl');
    
    // Temepratura minima
    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Minima ${min} &#8451;`;
    tempMinima.classList.add('text-xl');

    // Agregando los elementos al DOM
    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima)
    resultadoDiv.appendChild(tempMinima)

    resultado.appendChild(resultadoDiv);
}

// function kelvinACentigrados(grados){
//     return parseInt(grados-237.15);
// }
// Esta función se simplifica:
const kelvinACentigrados = grados => parseInt(grados-273.15);

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}