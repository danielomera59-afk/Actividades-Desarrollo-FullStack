console.log("java script conectado correctamente")
const input = document.getElementById("Tarea");
const boton = document.getElementById("btnAgregar");
const lista = document.getElementById("listaTareas");
const mensaje = document.getElementById("mensaje");

class Tarea {
    constructor(nombre){
        this.id = Date.now();
        this.nombre = nombre;
        this.destacado = false;
    }
    // Agregamos metodo nuevo a la clase tarea previamente declarado
    toggleDestacado(){
    this.destacado= !this.destacado;
    }
}
const p = new Tarea("");
console.log(p);
p.toggleDestacado();
console.log("valor destacado: "+ p.destacado);

class GestorTareas{
    constructor(){
        this.Tareas = [];
    }
    // Agregar solo el nuevo metodo a la clase nueva
    agregar(nombre){
        const nuevo =new Tarea(nombre);
        this.Tareas.push(nuevo);
        return nuevo;
    }
    eliminar(id){

        const index = this.Tareas.findIndex(p => p.id === id);
        if(index !== -1){
            this.Tareas.splice(index,1);
            return true;
        }
        return false;
    }
    toggleDestacado(id){
        const prod = this.Tareas.find(p => p.id === id);
        if (prod){
            prod.toggleDestacado();
            return true;
        }
        return false;
    }

    obtenerTodos(){
        return this.Tareas;

    }
    editar(id, nuevoNombre){
        const prod = this.Tareas.find(p => p.id === id);
        if(prod && nuevoNombre.trim()!==""){
            prod.nombre = nuevoNombre.trim();
            return true;

        }
        return false;
    }
}
const gestor =new GestorTareas();
console.log(gestor);
console.log(gestor.obtenerTodos());

function renderLista(){
    lista.innerHTML="";
    
    const Tareas = gestor.obtenerTodos();
    Tareas.forEach((prod)=>{
        console.log (prod.nombre);
        const li =  document.createElement("li");
        li.textContent = prod.nombre;


        if (prod.destacado){
            li.classList.add("destacado");
        }
        // Click: destacar/ normal
        li.addEventListener("click",()=>{
            gestor.toggleDestacado(prod.id);
            renderLista();
        });
        //doble click: eliminar
        li.addEventListener("dblclick", (event)=>{
            console.log("Adentro de eliminar elemento en la lista");
            console.log(event.type);
                console.log(event.target);
            gestor.eliminar(prod.id)
            renderLista();
        })
        // editar con click derechoo
        li.addEventListener("contextmenu",(e) => {
            e.preventDefault();
            const nuevo = prompt("editar nombre:", prod.nombre);
            if (nuevo==null) return;//cancelo
            gestor.editar(prod.id, nuevo);
            renderLista();
        });
        lista.appendChild(li);
    });
    
}
boton.addEventListener("click",()=>{
    const texto = input.value.trim();

    if (texto == ""){
        mensaje.textContent ="Escribe una Tarea antes de agregar";
        mensaje.classList.add("mensaje-error");
        return;
    }

    mensaje.textContent = "";
    mensaje.classList.remove("mensaje-error");
    console.log("texto:"+texto);
    gestor.agregar(texto);
    input.value = "";
    


    renderLista();
});
