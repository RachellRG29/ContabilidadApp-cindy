// ===============================
// CONTABILIDAD - app cindy calculadora
// ===============================

function iniciarContabilidad(){

  const form = document.getElementById("form-contabilidad");
  const inputNombre = document.getElementById("input-nombre");
  const inputSalario = document.getElementById("input-salario");
  const tablaBody = document.getElementById("tabla-contabilidad");

  if(!form) return; // Evita error si no está cargado

  // Validación de nombre
  inputNombre.addEventListener("input", () => {
    inputNombre.value = inputNombre.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
  });

  function formatearMoneda(valor) {
    return `$${valor.toFixed(2)}`;
  }

  function validarDatos(nombre, salario) {
    if (!nombre || nombre.length < 2) return false;
    if (isNaN(salario) || salario <= 0) return false;
    return true;
  }

  function calcularISSS(sueldo, aplicar) {
    if (!aplicar) return 0;
    let isss = sueldo * 0.03;
    if (isss > 30) isss = 30;
    return isss;
  }

  function calcularAFP(sueldo, aplicar) {
    if (!aplicar) return 0;
    let afp = sueldo * 0.0725;
    if (afp > 581.21) afp = 581.21;
    return afp;
  }

  function calcularRenta(sueldo, isss, afp) {
    return sueldo - isss - afp;
  }

  function obtenerTramoISR(renta) {
    if (renta <= 550.00) return "Tramo 1 (Exento)";
    if (renta <= 895.24) return "Tramo 2 (10%)";
    if (renta <= 2038.10) return "Tramo 3 (20%)";
    return "Tramo 4 (30%)";
  }

  function calcularISR(renta) {
    if (renta <= 550.00) return 0;
    if (renta <= 895.24)
      return 17.67 + (renta - 550.00) * 0.10;
    if (renta <= 2038.10)
      return 60.00 + (renta - 895.24) * 0.20;
    return 288.57 + (renta - 2038.10) * 0.30;
  }

  function calcularLiquido(sueldo, isss, afp, isr) {
    return sueldo - isss - afp - isr;
  }

  function agregarFilaTabla({ nombre, sueldo, isss, afp, renta, tramo, isr, liquido }) {

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${nombre}</td>
      <td>${formatearMoneda(sueldo)}</td>
      <td>${formatearMoneda(isss)}</td>
      <td>${formatearMoneda(afp)}</td>
      <td>${formatearMoneda(renta)}</td>
      <td><span class="badge bg-secondary">${tramo}</span></td>
      <td>${formatearMoneda(isr)}</td>
      <td><b>${formatearMoneda(liquido)}</b></td>
    `;

    tablaBody.appendChild(tr);
  }

  form.addEventListener("submit", function(e){
    e.preventDefault();

    const nombre = inputNombre.value.trim();
    const sueldo = parseFloat(inputSalario.value);
    const aplicar =
      document.querySelector('input[name="descuentos"]:checked').value === "si";

    if (!validarDatos(nombre, sueldo)) return;

    const isss = calcularISSS(sueldo, aplicar);
    const afp = calcularAFP(sueldo, aplicar);
    const renta = calcularRenta(sueldo, isss, afp);
    const isr = calcularISR(renta);
    const liquido = calcularLiquido(sueldo, isss, afp, isr);
    const tramo = obtenerTramoISR(renta);

    agregarFilaTabla({
      nombre,
      sueldo,
      isss,
      afp,
      renta,
      tramo,
      isr,
      liquido
    });

    form.reset();
  });

}

// Ejecutar cuando el contenido dinámico ya esté cargado
iniciarContabilidad();
