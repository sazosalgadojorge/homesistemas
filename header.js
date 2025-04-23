function renderhead() {
    fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-area').innerHTML = data;
    })
    .catch(error => console.error('Error cargando el header:', error));
}

renderhead();


