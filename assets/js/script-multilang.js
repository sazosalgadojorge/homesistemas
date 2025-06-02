async function cargarIdioma(idioma) {
  try {
    const response = await fetch(`./i18n/${idioma}.json`);
    const data = await response.json();

    // Cambia los textos principales por id
    if (data.hero) {
      document.getElementById('titulo-bienvenido').textContent = data.hero.title;
      document.getElementById('subtitulo-bienvenido').textContent = data.hero.subtitle;
      document.getElementById('btn-incidencias').textContent = data.hero.incidencias_button;
      document.getElementById('btn-apps').textContent = data.hero.apps_button;
      document.getElementById('marcas-title').textContent = data.hero.marcas_title;
      document.getElementById('incidencias-title').textContent = data.hero.incidencias_title;
      document.getElementById('incidencias-text').textContent = data.hero.incidencias_text;
      document.getElementById('incidencias-button').textContent = data.hero.incidencias_button;
    }

    if (data.about) {
      document.getElementById('about-title').textContent = data.about.title;
      document.getElementById('about-subtitle').textContent = data.about.subtitle;
      document.getElementById('about-text').textContent = data.about.text;
      document.getElementById('about-text1').textContent = data.about.collab_text1;
      document.getElementById('about-text2').textContent = data.about.collab_text2;
      document.getElementById('about-button').textContent = data.about.button;
    }

    if (data.frutapp) {
      document.getElementById('frutapp-title').textContent = data.frutapp.title;
      document.getElementById('frutapp-subtitle').textContent = data.frutapp.subtitle;
      document.getElementById('frutapp-text').textContent = data.frutapp.text;
    }

    if (data.phishing) {
      document.getElementById('phishing-title').textContent = data.phishing.title;
      document.getElementById('phishing-text').textContent = data.phishing.text;
      document.getElementById('phishing-button').textContent = data.phishing.button;
    }

    if (data.incidencias) {
      document.getElementById('incidencias-title').textContent = data.incidencias.title;
      document.getElementById('incidencias-text').textContent = data.incidencias.text;
      document.getElementById('incidencias-button').textContent = data.incidencias.button;
    }

    if (data.contacto) {
      document.getElementById('contacto-title').textContent = data.contacto.title;
      document.getElementById('contacto-button').textContent = data.contacto.send_button;
    }

    if (data.team) {
      document.getElementById('team-title').textContent = data.team.title;
      document.getElementById('team-subtitle').textContent = data.team.subtitle;
    }

    if (data.footer) {
      document.getElementById('footer-chile').textContent = data.footer.chile_title;
      document.getElementById('footer-peru').textContent = data.footer.peru_title;
    }

    // Si usas data-translate para más elementos
    document.querySelectorAll('[data-translate]').forEach(el => {
      const keys = el.getAttribute('data-translate').split('.');
      let texto = data;
      keys.forEach(k => {
        if (texto) texto = texto[k];
      });
      if (texto) el.textContent = texto;
    });
  } catch (error) {
    console.error('Error cargando el idioma:', error);
  }
}

// Detectar el idioma por defecto (o guardado en localStorage)
document.addEventListener('DOMContentLoaded', () => {
  const idiomaGuardado = localStorage.getItem('idioma') || 'es';
  cargarIdioma(idiomaGuardado);
});

// Cambiar idioma (ejemplo con botones)
document.getElementById('btn-es').addEventListener('click', () => {
  localStorage.setItem('idioma', 'es');
  cargarIdioma('es');
});
document.getElementById('btn-en').addEventListener('click', () => {
  localStorage.setItem('idioma', 'en');
  cargarIdioma('en');
});

