// ===============================
// CONTABILIDAD - app cindy calculadora
// ===============================

const form = document.getElementById("form-contabilidad");
const inputNombre = document.getElementById("input-nombre");
const inputSalario = document.getElementById("input-salario");
const tablaBody = document.getElementById("tabla-contabilidad");

// Validación de nombre
inputNombre.addEventListener("input", () => {
  inputNombre.value = inputNombre.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
});

// Formato moneda (SOLO VISUAL)
function formatearMoneda(valor) {
  return `$${valor.toFixed(2)}`;
}

// Validaciones
function validarDatos(nombre, salario) {
  if (!nombre || nombre.length < 2) return false;
  if (isNaN(salario) || salario <= 0) return false;
  return true;
}

// CÁLCULOS (SIN REDONDEAR)

// ISSS 3% tope 30
function calcularISSS(sueldo, aplicar) {
  if (!aplicar) return 0;
  let isss = sueldo * 0.03;
  if (isss > 30) isss = 30;
  return isss; // ❌ NO redondear
}

// AFP 7.25% tope 581.21
function calcularAFP(sueldo, aplicar) {
  if (!aplicar) return 0;
  let afp = sueldo * 0.0725;
  if (afp > 581.21) afp = 581.21;
  return afp; // ❌ NO redondear
}

// Renta imponible
function calcularRenta(sueldo, isss, afp) {
  return sueldo - isss - afp;
}

// ISR mensual EXACTO
function calcularISR(renta) {
  let isr = 0;

  if (renta <= 550.00) {
    isr = 0;
  } else if (renta <= 895.24) {
    isr = 17.67 + (renta - 550.00) * 0.10;
  } else if (renta <= 2038.10) {
    isr = 60.00 + (renta - 895.24) * 0.20;
  } else {
    isr = 288.57 + (renta - 2038.10) * 0.30;
  }

  return isr;
}

// Sueldo líquido
function calcularLiquido(sueldo, isss, afp, isr) {
  return sueldo - isss - afp - isr;
}


// TABLA
function agregarFilaTabla({ nombre, sueldo, isss, afp, renta, isr, liquido }) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${nombre}</td>
    <td>${formatearMoneda(sueldo)}</td>
    <td>${formatearMoneda(isss)}</td>
    <td>${formatearMoneda(afp)}</td>
    <td>${formatearMoneda(renta)}</td>
    <td>${formatearMoneda(isr)}</td>
    <td><b>${formatearMoneda(liquido)}</b></td>
  `;

  tablaBody.appendChild(tr);
}

// SUBMIT
form.addEventListener("submit", (e) => {
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

  agregarFilaTabla({
    nombre,
    sueldo,
    isss,
    afp,
    renta,
    isr,
    liquido
  });

  inputNombre.value = "";
  inputSalario.value = "";
});
