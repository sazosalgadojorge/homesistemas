// Extensión para obtener la semana del año (definir antes de usarla)
Date.prototype.getWeek = function () {
  const date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const week1 = new Date(date.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(((date - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
  );
};

// Cargar los datos de turnos_sistemas.json para Desarrollo
fetch("assets/json/turnos_sistemas.json")
  .then((response) => response.json())
  .then((data) => {
    const semanaActual = new Date().getWeek();
    const turnoDesarrollo = data.find(
      (t) => t.semana === semanaActual && t.area === "Desarrollo",
    );

    if (turnoDesarrollo) {
      document.getElementById("turnoDesarrollo").innerHTML = `
                <h3 style="font-size: 25px">Área de Desarrollo</h3>
                <p style="font-size: 20px">${turnoDesarrollo.responsable}</p>
                <p style="font-size: 20px">${turnoDesarrollo.telefono}</p>
              `;
    } else {
      document.getElementById("turnoDesarrollo").innerHTML =
        "<p>No hay turno asignado para esta semana</p>";
    }
  })
  .catch((error) => {
    console.error("Error cargando turnos de sistemas:", error);
    document.getElementById("turnoDesarrollo").innerHTML =
      "<p>Error al cargar los turnos</p>";
  });

// Cargar los datos de turnos_soporte.json para Soporte Técnico
fetch("assets/json/turnos_soporte.json")
  .then((response) => response.json())
  .then((data) => {
    const semanaActual = new Date().getWeek();
    const turnoSoporte = data.find(
      (t) => t.semana === semanaActual && t.area === "Soporte",
    );

    if (turnoSoporte) {
      document.getElementById("turnoSoporte").innerHTML = `
                <h3 style="font-size: 25px">Soporte Técnico</h3>
                <p style="font-size: 20px">${turnoSoporte.responsable}</p>
                <p style="font-size: 20px">${turnoSoporte.telefono}</p>
              `;
    } else {
      document.getElementById("turnoSoporte").innerHTML =
        "<p>No hay turno asignado para esta semana</p>";
    }
  })
  .catch((error) => {
    console.error("Error cargando turnos de soporte:", error);
    document.getElementById("turnoSoporte").innerHTML =
      "<p>Error al cargar los turnos</p>";
  });
