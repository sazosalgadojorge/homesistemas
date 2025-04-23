// Documentación MD

document.querySelectorAll('#navTree a').forEach(link => {
  link.addEventListener('click', async (e) => {
    e.preventDefault();
    const file = link.getAttribute('data-doc');
    const response = await fetch(file);
    const text = await response.text();
    document.getElementById('docContent').innerHTML = marked.parse(text); // usar 'marked' para parsear markdown
  });
});

