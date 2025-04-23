// Función para normalizar texto (eliminar acentos y caracteres especiales)
function normalizeText(text) {
    return text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
        .replace(/[^a-z0-9\s]/g, ' ') // Reemplaza caracteres especiales con espacios
        .replace(/\s+/g, ' ') // Reduce múltiples espacios a uno solo
        .trim();
}

function handleSearch(event) {
    event.preventDefault();
    const searchTerm = normalizeText(document.getElementById('searchInput').value);
    const blogs = document.querySelectorAll('.th-blog');
    
    // Si no hay término de búsqueda, mostrar todos los blogs
    if (!searchTerm) {
        blogs.forEach(blog => blog.style.display = 'block');
        return;
    }

    // Dividir el término de búsqueda en palabras individuales
    const searchWords = searchTerm.split(' ').filter(word => word.length > 0);
    
    blogs.forEach(blog => {
        // Buscar en todo el contenido del blog
        const blogContent = normalizeText(blog.textContent);
        
        // Buscar específicamente en elementos
        const title = normalizeText(blog.querySelector('.blog-title')?.textContent || '');
        const paragraph = normalizeText(blog.querySelector('.blog-content p')?.textContent || '');
        const tags = blog.dataset.tags ? normalizeText(blog.dataset.tags) : '';
        
        // Buscar coincidencia exacta de la frase completa
        const hasExactMatch = blogContent.includes(searchTerm);
        
        // Buscar si al menos una palabra coincide
        const hasPartialMatch = searchWords.some(word => 
            blogContent.includes(word) || 
            title.includes(word) || 
            paragraph.includes(word) || 
            tags.includes(word)
        );
        
        blog.style.display = (hasExactMatch || hasPartialMatch) ? 'block' : 'none';
    });
}

// Agregar evento submit al formulario de búsqueda
document.querySelector('.search-form').addEventListener('submit', handleSearch);

// Agregar evento input para búsqueda en tiempo real
document.getElementById('searchInput').addEventListener('input', handleSearch);

// Función para filtrar por tag
function filterByTag(tag) {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = tag;
    handleSearch(new Event('submit'));
}

// Asegurarse de que el DOM esté cargado antes de agregar los event listeners
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.getElementById('searchInput');
    
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
});