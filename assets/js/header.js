function renderhead() {
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const headerUrl = isProduction ? './header.html' : 'header.html';

    fetch(headerUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(data => {
        const headerArea = document.getElementById('header-area');
        if (!headerArea) {
          return;
        }

        headerArea.innerHTML = data;
        initializeMenuFunctionality();
      })
      .catch(error => {
        console.error('Error cargando el header:', error);
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
    const headerArea = document.getElementById('header-area');
    const openButton = headerArea.querySelector(".th-menu-toggle.d-block");
    const menuWrapper = document.querySelector(".th-menu-wrapper");
    const closeButton = document.querySelector(".th-menu-wrapper .th-menu-toggle");

    if (openButton && menuWrapper) {
      openButton.addEventListener("click", function () {
        menuWrapper.classList.add("th-body-visible");
        document.body.classList.add("mobile-menu-open");
        setTimeout(initializeMobileMenu, 100);
      });
    }

    if (closeButton && menuWrapper) {
      closeButton.addEventListener("click", function () {
        closeMobileMenu(menuWrapper);
      });
    }

    // Cerrar menú al hacer clic en el backdrop (fuera del panel)
    if (menuWrapper) {
      menuWrapper.addEventListener("click", function (e) {
        if (!e.target.closest(".th-menu-area")) {
          closeMobileMenu(menuWrapper);
        }
      });
    }

    // Cerrar menú al hacer clic en un link de navegación
    headerArea.querySelectorAll(".th-mobile-menu a:not(.mobile-menu-toggle):not(.mobile-submenu-toggle)").forEach(function (link) {
      link.addEventListener("click", function () {
        if (menuWrapper) closeMobileMenu(menuWrapper);
      });
    });

    try {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltipList = [...tooltipTriggerList].map((el) => new bootstrap.Tooltip(el));
    } catch (error) {
        console.error('Error al inicializar tooltips:', error);
    }

    initializeMobileMenu();
}

function initializeMobileMenu() {
    document.removeEventListener('click', mobileMenuClickHandler);
    document.addEventListener('click', mobileMenuClickHandler);
}

function closeMobileMenu(menuWrapper) {
    menuWrapper.classList.remove("th-body-visible");
    document.body.classList.remove("mobile-menu-open");
}

function mobileMenuClickHandler(e) {
    if (e.target.closest('.mobile-menu-toggle') || e.target.closest('.mobile-submenu-toggle')) {
        e.preventDefault();
        e.stopPropagation();

        const toggle = e.target.closest('.mobile-menu-toggle') || e.target.closest('.mobile-submenu-toggle');
        const submenu = toggle.nextElementSibling;
        const arrow = toggle.querySelector('.mobile-arrow');

        if (submenu && submenu.classList.contains('mobile-submenu')) {
            if (submenu.classList.contains('active')) {
                submenu.classList.remove('active');
                toggle.classList.remove('active');
                arrow.classList.remove('rotated');
            } else {
                submenu.classList.add('active');
                toggle.classList.add('active');
                arrow.classList.add('rotated');
            }
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderhead);
} else {
    renderhead();
}
