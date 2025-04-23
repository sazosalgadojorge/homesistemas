let anexos = [];
let anexosFiltrados = [];
let totalPages = 0;

// Agregar variables globales para la paginación
let currentPage = 1;
const rowsPerPage = 10; // Puedes ajustar este número según necesites

document.addEventListener("DOMContentLoaded", () => {
    const  floatingInput = document.getElementById("floatingInput");
    const rows = document.querySelectorAll("#dataTable tbody tr");

    // Detectar el atajo Cmd + B
    document.addEventListener("keydown", (event) => {
        if (event.metaKey && event.key === "b") { // metaKey es para la tecla Cmd
            event.preventDefault(); // Evitar comportamiento predeterminado (negrita en algunos navegadores)
             floatingInput.focus(); // Enfocar el campo de búsqueda
        }
    });


    // Filtrar las filas de la tabla al escribir
     floatingInput.addEventListener("input", () => {
            const filter = floatingInput.value.toLowerCase();
        rows.forEach(row => {
            const cells = Array.from(row.children);
            const match = cells.some(cell =>
                cell.textContent.toLowerCase().includes(filter)
            );
            row.style.display = match ? "" : "none";
        });
    });
});

async function getAnexos() {
    try {
        const response = await axios.get(`https://api.verfrut.cl/ApiAuth/GetAnexos`);
        anexos = response.data.result;
        anexosFiltrados = anexos;
    } catch (error) {
        console.error("Error al obtener los anexos:", error);
    }
}

async function renderAnexos(datos) {
    try {
        const tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = "";
        
        const capitalize = (text) => {
            return text
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        };

        // Calcular índices para la paginación
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const paginatedData = datos.slice(startIndex, endIndex);

        // Renderizar solo los datos de la página actual
        for (const anexo of paginatedData) {
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${(anexo.empresa)}</td>
                <td>${capitalize(anexo.departamento)}</td>
                <td>${capitalize(anexo.trabajador)}</td>
                <td>${capitalize(anexo.nroAnexo)}</td>
                <td>${anexo.mail == null ? "Sin mail" : anexo.mail.toLowerCase()}</td>
            `;
            tableBody.appendChild(newRow);
        }

        // Actualizar los controles de paginación
        updatePagination(datos.length);
    } catch (error) {
        console.error("Error al renderizar los anexos:", error);
    }
}

// Función para actualizar los controles de paginación
function updatePagination(totalItems) {
    totalPages = Math.ceil(totalItems / rowsPerPage);
    const paginationContainer = document.getElementById("pagination");
    
    let paginationHTML = `
        <button class="btn btn-dark" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Anterior</button>
        <span class="p-2">Página ${currentPage} de ${totalPages}</span>
        <button class="btn btn-dark" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Siguiente</button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

// Función para cambiar de página
function changePage(newPage) {
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderAnexos(anexosFiltrados);
        //filterAnexos(); // Esto re-renderizará la tabla con la nueva página
    }
}

async function init() {
    await getAnexos();
    llenarselectempresa();
    llenarselectdepartamento();
    renderAnexos(anexos);
}

async function filterAnexos() {
    let floatingInput = document.getElementById("floatingInput");
    let filter = floatingInput.value.toLowerCase();
    anexosFiltrados = anexos.filter(anexo => anexo.empresa.toLowerCase().includes(filter) 
    || anexo.departamento.toLowerCase().includes(filter) 
    || anexo.trabajador.toLowerCase().includes(filter) 
    || anexo.nroAnexo.toLowerCase().includes(filter)
    || (anexo.mail && anexo.mail.toLowerCase().includes(filter)));
    renderAnexos(anexosFiltrados);
    totalPages = Math.ceil(anexosFiltrados.length / rowsPerPage);
    selectdepartamento.value = "todos";
    selectempresa.value = "todas";
}

async function llenarselectempresa() {
    let selectempresa = document.getElementById("selectempresa");
    selectempresa.innerHTML = '<option value="todas">Todas las empresas</option>'; // Opción por defecto
    const uniqueEmpresas = [...new Set(anexos.map(anexo => anexo.empresa))];
    for (const empresa of uniqueEmpresas) {
        selectempresa.innerHTML += `<option value="${empresa}">${empresa}</option>`;
    }
}

async function filterempresa(empresa) {
    if(selectdepartamento.value == "todos"){
        currentPage = 1; // Reset a la primera página cuando se aplica un nuevo filtro
        let filteredAnexos = empresa === "todas" 
            ? anexos 
            : anexos.filter(anexo => anexo.empresa === empresa);
        renderAnexos(filteredAnexos);
        totalPages = Math.ceil(filteredAnexos.length / rowsPerPage);
    }else{
        currentPage = 1; // Reset a la primera página cuando se aplica un nuevo filtro
        let filteredAnexos = empresa === "todas" 
            ? anexos 
            : anexos.filter(anexo => anexo.empresa == empresa && anexo.departamento == selectdepartamento.value);
        renderAnexos(filteredAnexos);
        totalPages = Math.ceil(filteredAnexos.length / rowsPerPage);
    }
    
}

async function llenarselectdepartamento() {
    let selectdepartamento = document.getElementById("selectdepartamento");
    selectdepartamento.innerHTML = '<option value="todos">Seleccione Departamento (Todos)</option>'; // Opción por defecto modificada
    
    // Get unique company names using Set
    const uniqueDepartamentos = [...new Set(anexos.map(anexo => anexo.departamento))];
    for (const departamento of uniqueDepartamentos) {
        selectdepartamento.innerHTML += `<option value="${departamento}">${departamento}</option>`;
    }
}

async function filterDepartamento(departamento) {
    if(selectempresa.value == "todas"){
        currentPage = 1; // Reset a la primera página cuando se aplica un nuevo filtro
        anexosFiltrados = departamento === "todos" 
            ? anexos 
            : anexos.filter(anexo => anexo.departamento === departamento);
        renderAnexos(anexosFiltrados);
        totalPages = Math.ceil(anexosFiltrados.length / rowsPerPage);
    }else{
        currentPage = 1; // Reset a la primera página cuando se aplica un nuevo filtro
        anexosFiltrados = departamento === "todos" 
            ? anexos 
            : anexos.filter(anexo => anexo.departamento == departamento && anexo.empresa == selectempresa.value);
        renderAnexos(anexosFiltrados);
        totalPages = Math.ceil(anexosFiltrados.length / rowsPerPage);
    }
}


init();