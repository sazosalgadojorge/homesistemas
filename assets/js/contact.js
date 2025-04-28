document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.contact-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        var nombre = document.getElementById('nombre').value;
        var email = document.getElementById('email').value;
        var number = document.getElementById('number').value;
        var message = document.getElementById('message').value;
        
        var templateParams = {
            from_name: nombre,
            from_email: email,
            phone_number: number,
            message: message
        };
        
        // Actualiza 'template_e52pfee' con el ID correcto de tu plantilla
        emailjs.send('service_7zlru3m', 'template_9469gml', templateParams)
            .then(function(response) {
                alert('¡Mensaje enviado exitosamente!');
                event.target.reset();
            }, function(error) {
                alert('Error al enviar el mensaje: ' + error.text);
            });
    });
}); 