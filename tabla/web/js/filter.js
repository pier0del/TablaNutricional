// --- seleccion de elementos ---
// aqui seleccionamos los elementos del html que vamos a usar
//si no los seleccionamos aqui, el js no los puede leer ni manipular

const buscador = document.getElementById("buscador");
const tabla = document.getElementById("tabla-nutricional");
const tbody = tabla.querySelector("tbody");
const filasOriginales = Array.from(tbody.querySelectorAll("tr"));
const mensajeSinResultados = document.getElementById("sin-resultados");


// --- botones ---
const botonLimpiar = document.getElementById("limpiar");
const botonOrdenarNombre = document.getElementById("ordenar-nombre");
const botonOrdenarCalorias = document.getElementById("ordenar-calorias");


//-- normalizar texto (para buscar bien): minusculas + sin tildes/diacriticos ---
const normalizar = (s) => 
    s
        .toLowerCase() //convierte todo a minusculas
        .normalize("NFD") // Normalizacion Unicode -> descompone caracteres acentuados en base + acento ( ejm: á -> a +  ́ )
        .replace(/\p{Diacritic}/gu, "") // Elimina los caracteres diacríticos(acentos ) usando una expresion regular con soporte Unicode
        .trim(); // Elimina espacios en blanco al inicio y al final

const actualizarEstado = (visibles) => {
    if (!mensajeSinResultados) return;
    mensajeSinResultados.textContent = `${visibles} resultados`;
    mensajeSinResultados.classList.toggle("oculto", visibles !== 0);
    // si visibles es diferente de 0, agrega la clase oculto (oculta el mensaje)
    // si visibles es 0, quita la clase oculto (muestra el mensaje)
};


const aplicarFiltro = () => {
    const texto = normalizar(buscador.value);
    // obtiene el texto del buscador normalizado
    
    let visibles = 0;
    //Contador de filas visibles (para saber si hay resultados)

    filasOriginales.forEach((fila) => {
        //recorremos todas las filas de la tabla

        const alimento = normalizar(fila.children[0].textContent);
        //fila.children[0] es la primera celda de la fila (nombre del alimento)
        //leemos su texto y lo normalizamos

        fila.classList.remove("seleccionado");
        // quitamos la clase seleccionado (resaltado) de la fila antes de aplicar el filtro

        const coincide = texto === "" || alimento.includes(texto);
        //coindice es true si el texto del buscador esta vacio o si el nombre del alimento incluye el texto del buscador

        if (coincide) {
            fila.style.display = "";
            // mostramos la fila

            if (texto !== "") fila.classList.add("seleccionado");
            //si el usuario escribio algo en el buscador, resaltamos la fila

            visibles++;
            //aumentamos el contador de resultados visibles
        } else {
            fila.style.display = "none";
            //ocultamos la fila SI NO coincide
        }
    });
    actualizarEstado(visibles);
    //actualizamos el estado del mensaje de sin resultados
};

// --- filtro en vivo ----
// cada vez que el usuario escribe en el buscador, se aplica el filtro
buscador.addEventListener("input", aplicarFiltro);

//--- limpiar buscador ---
// al hacer click en el boton limpiar, se vacia el buscador y se aplica el filtro
botonLimpiar.addEventListener("click", () => {
    buscador.value = "";
    aplicarFiltro();
    buscador.focus();
});

//--- ordenar por nombre ---
//ordena alfabeticamente por nombre de alimento
botonOrdenarNombre.addEventListener("click", () => {
    const filasOrdenadas = [...filasOriginales].sort((a, b) => {
        //clonamos el array original y lo ordenamos
    
        const nombreA= normalizar(a.children[0].textContent);
        const nombreB= normalizar(b.children[0].textContent);
        return nombreA.localeCompare(nombreB, "es");
        //localcompare ordena strings segun las reglas del idioma especificado (español en este caso)
    });

    tbody.innerHTML = ""; //limpiamos el tbody para insertar las filas ordenadas

    filasOrdenadas.forEach((fila) => tbody.appendChild(fila));
    //insertamos las filas ordenadas en el tbody
    
    aplicarFiltro(); // reaplica el filtro para mantener la visibilidad
});

//--- ordenar por calorias ---
//ordena numericamente por calorias
// Number() convierte el texto a numero para poder comparar
botonOrdenarCalorias.addEventListener("click", () => {
    const filasOrdenadas = [...filasOriginales].sort((a, b) => {
        return Number(a.children[1].textContent) - Number(b.children[1].textContent);
        //orden ascendente por calorias
    });

    tbody.innerHTML = "";
    filasOrdenadas.forEach((fila) => tbody.appendChild(fila));

    aplicarFiltro(); // reaplica el filtro para mantener la visibilidad
});

//estado inicial
aplicarFiltro();
