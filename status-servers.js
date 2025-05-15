function mostrarEstadoServidores(estado) {
    const toastEl = document.getElementById('serverToast');
    const toastMessage = document.getElementById('toastMessage');

    // Cambiar color y texto según el estado
    if (estado === 'ok') {
      toastEl.classList.remove('bg-danger');
      toastEl.classList.add('bg-success');
      toastMessage.textContent = '✅ Servidores operativos al 100%';
    } else if (estado === 'lento') {
      toastEl.classList.remove('bg-success');
      toastEl.classList.add('bg-danger');
      toastMessage.textContent = '⚠️ Servidores respondiendo con lentitud';
    }

    // Mostrar el toast
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }

  // Ejemplo: simula estado desde un backend o monitoreo
  // Puedes reemplazar con llamada fetch/AJAX real
  document.addEventListener('DOMContentLoaded', () => {
    const estadoServidor = 'ok'; // o 'lento'
    mostrarEstadoServidores(estadoServidor);
  });
  