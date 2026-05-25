function fetchWithRetry(url, retries = 3, delay = 500) {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return response.text();
  }).catch(error => {
    if (retries <= 0) throw error;
    return new Promise(function(resolve) { setTimeout(resolve, delay); })
      .then(function() { return fetchWithRetry(url, retries - 1, delay * 2); });
  });
}

function renderhead() {
  var headerArea = document.getElementById('header-area');
  if (!headerArea) {
    setTimeout(renderhead, 200);
    return;
  }

  var isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  var headerUrl = isProduction ? './header.html' : 'header.html';

  fetchWithRetry(headerUrl, 3, 500)
    .then(function(data) {
      headerArea.innerHTML = data;
      initializeMenuFunctionality();
    })
    .catch(function() {
      fetchWithRetry('./header.html', 2, 500)
        .then(function(data) {
          headerArea.innerHTML = data;
          initializeMenuFunctionality();
        })
        .catch(function(err) {
          console.error('[header] Falló tras reintentos:', err);
        });
    });
}

function initializeMenuFunctionality() {
    var headerArea = document.getElementById('header-area');
    if (!headerArea) return;
    var openButton = headerArea.querySelector(".th-menu-toggle.d-block");
    var menuWrapper = document.querySelector(".th-menu-wrapper");
    var closeButton = document.querySelector(".th-menu-wrapper .th-menu-toggle");

    if (openButton && menuWrapper) {
      openButton.addEventListener("click", function() {
        menuWrapper.classList.add("th-body-visible");
        document.body.classList.add("mobile-menu-open");
        setTimeout(initializeMobileMenu, 100);
      });
    }

    if (closeButton && menuWrapper) {
      closeButton.addEventListener("click", function() {
        closeMobileMenu(menuWrapper);
      });
    }

    if (menuWrapper) {
      menuWrapper.addEventListener("click", function(e) {
        if (!e.target.closest(".th-menu-area")) {
          closeMobileMenu(menuWrapper);
        }
      });
    }

    headerArea.querySelectorAll(".th-mobile-menu a:not(.mobile-menu-toggle):not(.mobile-submenu-toggle)").forEach(function(link) {
      link.addEventListener("click", function() {
        if (menuWrapper) closeMobileMenu(menuWrapper);
      });
    });

    try {
        var tips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        for (var i = 0; i < tips.length; i++) {
          new bootstrap.Tooltip(tips[i]);
        }
    } catch (e) {
        console.error('[header] Error tooltips:', e);
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

        var toggle = e.target.closest('.mobile-menu-toggle') || e.target.closest('.mobile-submenu-toggle');
        var submenu = toggle.nextElementSibling;
        var arrow = toggle.querySelector('.mobile-arrow');

        if (submenu && submenu.classList.contains('mobile-submenu')) {
            submenu.classList.toggle('active');
            toggle.classList.toggle('active');
            if (arrow) arrow.classList.toggle('rotated');
        }
    }
}

renderhead();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('header-area') || !document.getElementById('header-area').children.length) {
      renderhead();
    }
  });
}
