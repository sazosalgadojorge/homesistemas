// $(function() {
//     var pressed = false;
//     var start = undefined;
//     var startX, startWidth;
    
//     $("table th").mousedown(function(e) {
//         start = $(this);
//         pressed = true;
//         startX = e.pageX;
//         startWidth = $(this).width();
//         $(start).addClass("resizing");
//     });
    
//     $(document).mousemove(function(e) {
//         if(pressed) {
//             $(start).width(startWidth+(e.pageX-startX));
//         }
//     });
    
//     $(document).mouseup(function() {
//         if(pressed) {
//             $(start).removeClass("resizing");
//             pressed = false;
//         }
//     });
// });

    // Resize de las columnas de la tabla

document.querySelectorAll('th').forEach((th) => {
    const resizer = document.createElement('div');
    resizer.className = 'resizer';
    th.appendChild(resizer);
  
    resizer.addEventListener('mousedown', (event) => {
      const startX = event.clientX;
      const startWidth = th.offsetWidth;
      
      // Prevenir selección de texto y otros comportamientos no deseados
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.body.style.mozUserSelect = 'none';
      document.body.style.msUserSelect = 'none';
      
      // Prevenir eventos predeterminados
      event.preventDefault();
  
      const onMouseMove = (e) => {
        const newWidth = startWidth + (e.clientX - startX);
        th.style.width = `${newWidth}px`;
      };
  
      const onMouseUp = () => {
        // Restaurar la selección de texto
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        document.body.style.mozUserSelect = '';
        document.body.style.msUserSelect = '';
        
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
  
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  });


// Configuración de la paginación
// const itemsPorPagina = 10; // Puedes ajustar este número según necesites
// let paginaActual = 1;

// function filtrarTabla(searchTerm) {
//     const tabla = document.querySelector('table');
//     const filas = tabla.querySelectorAll('tbody tr');
//     let filasVisibles = 0;
    
//     filas.forEach(fila => {
//         const texto = fila.textContent.toLowerCase();
//         if (texto.includes(searchTerm.toLowerCase())) {
//             fila.dataset.visible = 'true';
//             filasVisibles++;
//         } else {
//             fila.dataset.visible = 'false';
//         }
//     });
    
//     paginaActual = 1;
//     paginarTabla();
// }

// function paginarTabla() {
//     const tabla = document.querySelector('table');
//     if (!tabla) {
//         console.error('No se encontró la tabla');
//         return;
//     }
    
//     const filas = tabla.querySelectorAll('tbody tr[data-visible="true"], tbody tr:not([data-visible])');
//     console.log(filas);
//     console.log(filas.length);
//     if (!filas.length) {
//         console.error('No se encontraron filas en la tabla');
//         return;
//     }
    
//     // Ocultar todas las filas
//     tabla.querySelectorAll('tbody tr').forEach(fila => fila.style.display = 'none');
    
//     // Calcular índices para la página actual
//     const inicio = (paginaActual - 1) * itemsPorPagina;
//     const fin = inicio + itemsPorPagina;
    
//     // Mostrar solo las filas de la página actual
//     for (let i = inicio; i < fin && i < filas.length; i++) {
//         filas[i].style.display = 'table-row';
//     }
    
//     actualizarControlesPaginacion(filas.length);
// }

// function actualizarControlesPaginacion(totalItems) {
//     const totalPaginas = Math.ceil(totalItems / itemsPorPagina);
//     const paginacionNav = document.querySelector('nav[aria-label="Page navigation"]');
    
//     if (!paginacionNav) return;
    
//     const ul = paginacionNav.querySelector('ul.pagination');
//     ul.innerHTML = `
//         <li class="page-item ${paginaActual === 1 ? 'disabled' : ''}">
//             <a class="page-link" href="#" onclick="cambiarPagina(-1); return false;">Anterior</a>
//         </li>
//         <li class="page-item ${paginaActual === totalPaginas ? 'disabled' : ''}">
//             <a class="page-link" href="#" onclick="cambiarPagina(1); return false;">Siguiente</a>
//         </li>
//     `;
// }

// function cambiarPagina(direccion) {
//     const tabla = document.querySelector('table');
//     const filasVisibles = tabla.querySelectorAll('tbody tr[data-visible="true"], tbody tr:not([data-visible])');
//     const totalPaginas = Math.ceil(filasVisibles.length / itemsPorPagina);
    
//     const nuevaPagina = paginaActual + direccion;
//     if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
//         paginaActual = nuevaPagina;
//         paginarTabla();
//     }
// }

// function irAPagina(numeroPagina) {
//     paginaActual = numeroPagina;
//     paginarTabla();
// }

// // Inicializar la paginación cuando el documento esté listo
// document.addEventListener('DOMContentLoaded', () => {
//     console.log('DOM Cargado');
//     setTimeout(() => {
//         paginarTabla();
//     }, 500);
// });

// // Event listener para el buscador
// document.querySelector('#floatingInput').addEventListener('input', (e) => {
//     filtrarTabla(e.target.value);
// });

// // Agregar estilos directamente en JavaScript para asegurar que se apliquen
// const styles = `
//     .pagination-controls {
//         margin: 20px 0;
//         text-align: center;
//     }
//     .pagination-btn {
//         padding: 8px 16px;
//         margin: 0 5px;
//         cursor: pointer;
//         border: 1px solid #ddd;
//         background-color: #f8f9fa;
//         border-radius: 4px;
//     }
//     .pagination-btn:disabled {
//         cursor: not-allowed;
//         opacity: 0.6;
//     }
//     .pagination-info {
//         margin: 0 10px;
//         display: inline-block;
//         padding: 8px;
//     }
// `;

// // Agregar los estilos al documento
// const styleSheet = document.createElement("style");
// styleSheet.textContent = styles;
// document.head.appendChild(styleSheet);