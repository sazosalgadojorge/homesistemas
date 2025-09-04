function renderhead() {
    console.log('=== INICIANDO CARGA DEL HEADER ===');
    
    // Verificar si estamos en producción o desarrollo
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    console.log('Entorno:', isProduction ? 'PRODUCCIÓN' : 'DESARROLLO');
    
    // Construir la URL del header
    const headerUrl = isProduction ? './header.html' : 'header.html';
    console.log('URL del header:', headerUrl);
    
    fetch(headerUrl)
      .then(response => {
        console.log('Respuesta del fetch:', response.status, response.statusText);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(data => {
        console.log('Header cargado, longitud:', data.length);
        
        const headerArea = document.getElementById('header-area');
        if (!headerArea) {
          console.error('No se encontró el elemento header-area');
          return;
        }
        
        headerArea.innerHTML = data;
        console.log('Header insertado en el DOM');
  
        // Inicializar funcionalidad del menú
        initializeMenuFunctionality();
      })
      .catch(error => {
        console.error('Error cargando el header:', error);
        // Fallback: intentar cargar desde ruta relativa
        console.log('Intentando fallback...');
        fetch('./header.html')
          .then(response => response.text())
          .then(data => {
            document.getElementById('header-area').innerHTML = data;
            initializeMenuFunctionality();
          })
          .catch(fallbackError => {
            console.error('Error en fallback:', fallbackError);
          });
      });
}

function initializeMenuFunctionality() {
    console.log('=== INICIANDO FUNCIONALIDAD DEL MENÚ ===');
    
    const headerArea = document.getElementById('header-area');
    const openButton = headerArea.querySelector(".th-menu-toggle.d-block");
    const menuWrapper = document.querySelector(".th-menu-wrapper");
    const closeButton = document.querySelector(".th-menu-wrapper .th-menu-toggle");
  
    // Funcionalidad del botón de abrir menú
    if (openButton && menuWrapper) {
      openButton.addEventListener("click", function () {
        menuWrapper.classList.add("th-body-visible");
        console.log("Menú mostrado");
        // Reinicializar después de mostrar el menú
        setTimeout(initializeMobileMenu, 100);
      });
    }
  
    // Funcionalidad del botón de cerrar menú
    if (closeButton && menuWrapper) {
      closeButton.addEventListener("click", function () {
        menuWrapper.classList.remove("th-body-visible");
        console.log("Menú ocultado");
      });
    }

    // Inicializar tooltips
    try {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltipList = [...tooltipTriggerList].map((el) => new bootstrap.Tooltip(el));
        console.log('Tooltips inicializados:', tooltipList.length);
    } catch (error) {
        console.error('Error al inicializar tooltips:', error);
    }

    // Inicializar menú móvil
    initializeMobileMenu();
}

function initializeMobileMenu() {
    console.log('=== INICIANDO MENÚ MÓVIL ===');
    
    // Remover event listeners existentes para evitar duplicados
    document.removeEventListener('click', mobileMenuClickHandler);
    
    // Agregar nuevo event listener
    document.addEventListener('click', mobileMenuClickHandler);
    
    // Verificar elementos
    setTimeout(() => {
        const toggles = document.querySelectorAll('.mobile-menu-toggle, .mobile-submenu-toggle');
        console.log('Elementos encontrados:', toggles.length);
        toggles.forEach((toggle, index) => {
            console.log(`Toggle ${index + 1}:`, toggle.textContent.trim());
        });
    }, 300);
    
    console.log('=== MENÚ MÓVIL INICIALIZADO ===');
}

function mobileMenuClickHandler(e) {
    // Verificar si el click fue en un toggle del menú móvil
    if (e.target.closest('.mobile-menu-toggle') || e.target.closest('.mobile-submenu-toggle')) {
        e.preventDefault();
        e.stopPropagation();
        
        const toggle = e.target.closest('.mobile-menu-toggle') || e.target.closest('.mobile-submenu-toggle');
        const submenu = toggle.nextElementSibling;
        const arrow = toggle.querySelector('.mobile-arrow');
        
        console.log('Toggle clicked:', toggle.textContent.trim());
        
        if (submenu && submenu.classList.contains('mobile-submenu')) {
            if (submenu.classList.contains('active')) {
                submenu.classList.remove('active');
                arrow.classList.remove('rotated');
            } else {
                submenu.classList.add('active');
                arrow.classList.add('rotated');
            }
        }
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderhead);
} else {
    renderhead();
}