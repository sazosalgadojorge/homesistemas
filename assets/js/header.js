function renderhead() {
    fetch('header.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('header-area').innerHTML = data;
  
        const headerArea = document.getElementById('header-area');
        const openButton = headerArea.querySelector(".th-menu-toggle.d-block");
        const menuWrapper = document.querySelector(".th-menu-wrapper");
        const closeButton = document.querySelector(".th-menu-wrapper .th-menu-toggle");
  
        if (openButton && menuWrapper) {
          openButton.addEventListener("click", function () {
            menuWrapper.classList.add("th-body-visible");
            console.log("Menú mostrado");
          });
        }
  
        if (closeButton && menuWrapper) {
          closeButton.addEventListener("click", function () {
            menuWrapper.classList.remove("th-body-visible");
            console.log("Menú ocultado");
          });
        }
      })
      .catch(error => console.error('Error cargando el header:', error));
  }
  
  renderhead();