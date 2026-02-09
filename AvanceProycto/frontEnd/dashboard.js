const lista = document.getElementById("lista");

function agregar() {
    const texto = document.getElementById("nuevaComision").value;

    if (texto === "") return;

    const li = document.createElement("li");
    li.innerHTML = `
        ${texto}
        <span class="delete" onclick="eliminar(this)">❌</span>
    `;

    lista.appendChild(li);
    document.getElementById("nuevaComision").value = "";
}

function eliminar(elemento) {
    elemento.parentElement.remove();
}