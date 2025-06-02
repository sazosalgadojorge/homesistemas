// Código Konami
        const konamiCode = [
          "ArrowUp", "ArrowUp",
          "ArrowDown", "ArrowDown",
          "ArrowLeft", "ArrowRight",
          "ArrowLeft", "ArrowRight",
          "b", "a"
        ];
        
        let konamiIndex = 0;
        
        document.addEventListener("keydown", (e) => {
          if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
              activarEasterEgg();
              konamiIndex = 0;
            }
          } else {
            konamiIndex = 0; // reiniciar si la secuencia falla
          }
        });
        
        function activarEasterEgg() {
          // Crear un contenedor para el mensaje y el GIF
          const container = document.createElement("div");
          container.style.position = "fixed";
          container.style.top = "50%";
          container.style.left = "50%";
          container.style.transform = "translate(-50%, -50%)";
          container.style.zIndex = "9999";
          container.style.textAlign = "center";
          container.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
          container.style.border = "4px solid #ff0000";
          container.style.borderRadius = "12px";
          container.style.boxShadow = "0 0 20px rgba(0,0,0,0.3)";
          container.style.padding = "20px";
        
          // Mensaje de Mario
          const mensaje = document.createElement("p");
          mensaje.textContent = "¡Te ganaste el whiskey! 🍺✨";
          mensaje.style.fontSize = "1.5rem";
          mensaje.style.color = "#d01000";
          mensaje.style.marginBottom = "10px";
        
          // GIF de Super Mario
          const gif = document.createElement("img");
          gif.src = "./assets/img/egg.gif"; // GIF de Mario
          gif.alt = "Super Mario";
          gif.style.width = "200px";
          gif.style.height = "200px";
          gif.style.objectFit = "contain";
        
          container.appendChild(mensaje);
          container.appendChild(gif);
          document.body.appendChild(container);
        
          // Eliminar el contenedor después de 5 segundos
          setTimeout(() => {
            container.remove();
          }, 5000);
        }