// // Documentación MD Script
// document.querySelectorAll('#navTree a').forEach(link => {
//   link.addEventListener('click', async (e) => {
//     e.preventDefault();
//     const file = link.getAttribute('data-doc');
//     const response = await fetch(file);
//     const text = await response.text();
//     document.getElementById('docContent').innerHTML = marked.parse(text); // usar 'marked' para parsear markdown
//   });
// });

// const enlaces = document.querySelectorAll('#navTree a');

// enlaces.forEach(link => {
//   link.addEventListener('click', async (e) => {
//     e.preventDefault();

//     // remover activo de todos
//     enlaces.forEach(l => l.classList.remove('activo'));

//     // agregar activo al actual
//     link.classList.add('activo');

//     // cargar contenido
//     const file = link.getAttribute('data-doc');
//     const response = await fetch(file);
//     const markdown = await response.text();
//     document.getElementById('docContent').innerHTML = marked.parse(markdown);
//   });
// });

// Documentación MD Script
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

// Cargar automáticamente el primer archivo al cargar la página
// Ahora detecta si es móvil o escritorio y carga en el contenedor correspondiente

document.addEventListener('DOMContentLoaded', async () => {
  const isMobile = window.innerWidth < 768;
  const selectOpciones = document.getElementById('opciones');
  const primerLink = document.querySelector('#navTree a');

  if (isMobile && selectOpciones) {
    // Móvil: cargar el primer documento en docContentMobile
    const file = selectOpciones.value;
    const response = await fetch(file);
    const markdown = await response.text();
    document.getElementById('docContentMobile').innerHTML = marked.parse(markdown);
  } else if (primerLink) {
    // Escritorio: cargar el primer documento en docContent
    primerLink.classList.add('activo'); // Marcarlo como activo
    const file = primerLink.getAttribute('data-doc');
    const response = await fetch(file);
    const markdown = await response.text();
    document.getElementById('docContent').innerHTML = marked.parse(markdown);
  }
});

// Lógica para móvil: cargar markdown al seleccionar opción
const selectOpciones = document.getElementById('opciones');
if (selectOpciones) {
  selectOpciones.addEventListener('change', async (e) => {
    const file = e.target.value;
    const response = await fetch(file);
    const markdown = await response.text();
    document.getElementById('docContentMobile').innerHTML = marked.parse(markdown);
  });

  // Opcional: cargar el primer documento al cargar la página en móvil
  document.addEventListener('DOMContentLoaded', async () => {
    if (window.innerWidth < 768) { // Solo en móvil
      const file = selectOpciones.value;
      const response = await fetch(file);
      const markdown = await response.text();
      document.getElementById('docContentMobile').innerHTML = marked.parse(markdown);
    }
  });
}

window.addEventListener('resize', async () => {
  const isMobile = window.innerWidth < 768;
  const selectOpciones = document.getElementById('opciones');
  const primerLink = document.querySelector('#navTree a');
  const docContent = document.getElementById('docContent');
  const docContentMobile = document.getElementById('docContentMobile');

  if (isMobile && selectOpciones && docContentMobile) {
    // Si pasas a móvil, carga el documento seleccionado en móvil y limpia escritorio
    const file = selectOpciones.value;
    const response = await fetch(file);
    const markdown = await response.text();
    docContentMobile.innerHTML = marked.parse(markdown);
    if (docContent) docContent.innerHTML = '';
  } else if (!isMobile && primerLink && docContent) {
    // Si pasas a escritorio, carga el primer documento en escritorio y limpia móvil
    primerLink.classList.add('activo');
    const file = primerLink.getAttribute('data-doc');
    const response = await fetch(file);
    const markdown = await response.text();
    docContent.innerHTML = marked.parse(markdown);
    if (docContentMobile) docContentMobile.innerHTML = '';
  }
});

// -------------------------------
// BUSCADOR CON INDEXACIÓN LOCAL
// -------------------------------
const index = new FlexSearch.Document({
  tokenize: 'forward',
  document: {
    id: 'file',
    index: ['title', 'content']
  }
});

const docs = [];
const navLinks = document.querySelectorAll('#navTree a');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// Función para normalizar texto (eliminar acentos, pasar a minúsculas y reemplazar ñ por n)
function normalizeText(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // elimina acentos
    .replace(/ñ/g, 'n')
    .replace(/Ñ/g, 'n')
    .toLowerCase();
}

// 1. Indexar TODOS los archivos .md que estén listados en el menú
(async () => {
  for (const link of navLinks) {
    const file = link.getAttribute('data-doc');
    const response = await fetch(file);
    const markdown = await response.text();
    const rawTitle = markdown.split('\n').find(line => line.trim().startsWith('#')) || 'Sin título';
    const title = rawTitle.replace(/^#+\s*/, '').trim();
    const plain = markdown.replace(/[#>*_\-\[\]()`]/g, '').substring(0, 500); // limpiar y resumir

    // Indexa el texto normalizado
    const doc = {
      file,
      title,
      content: plain,
      normTitle: normalizeText(title),
      normContent: normalizeText(plain)
    };
    docs.push(doc);
    index.add({
      file,
      title: doc.normTitle,
      content: doc.normContent
    });
  }
})();

// 2. Escuchar input y mostrar resultados
searchInput.addEventListener('input', async (e) => {
  const query = normalizeText(e.target.value.trim());
  if (!query) return (searchResults.innerHTML = '');

  const results = index.search(query, { enrich: true, limit: 7 });
  const files = new Set();
  results.forEach(r => r.result.forEach(res => files.add(res)));

  searchResults.innerHTML = '';
  [...files].forEach(file => {
    const doc = docs.find(d => d.file === file);
    if (!doc) return;

    const li = document.createElement('li');
    li.className = 'list-group-item list-group-item-action';
    li.textContent = doc.title.replace(/^#\s*/, '');

    li.addEventListener('click', async () => {
      const response = await fetch(doc.file);
      const markdown = await response.text();
      document.getElementById('docContent').innerHTML = marked.parse(markdown);

      // sincronizar el menú lateral
      document.querySelectorAll('#navTree a').forEach(l => l.classList.remove('activo'));
      const match = document.querySelector(`#navTree a[data-doc="${doc.file}"]`);
      if (match) {
        match.classList.add('activo');
        match.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      searchInput.value = '';
      searchResults.innerHTML = '';
    });

    searchResults.appendChild(li);
  });
});