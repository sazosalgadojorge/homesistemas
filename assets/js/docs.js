// Documentación MD Script
document.querySelectorAll('#navTree a').forEach(link => {
  link.addEventListener('click', async (e) => {
    e.preventDefault();
    const file = link.getAttribute('data-doc');
    const response = await fetch(file);
    const text = await response.text();
    document.getElementById('docContent').innerHTML = marked.parse(text); // usar 'marked' para parsear markdown
  });
});

const enlaces = document.querySelectorAll('#navTree a');

enlaces.forEach(link => {
  link.addEventListener('click', async (e) => {
    e.preventDefault();

    // remover activo de todos
    enlaces.forEach(l => l.classList.remove('activo'));

    // agregar activo al actual
    link.classList.add('activo');

    // cargar contenido
    const file = link.getAttribute('data-doc');
    const response = await fetch(file);
    const markdown = await response.text();
    document.getElementById('docContent').innerHTML = marked.parse(markdown);
  });
});

