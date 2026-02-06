//CONTABILIDAD LOGICA DE LA TABLA Y EL FORMULARIO

const form = document.getElementById("form-contabilidad");
const inputNombre = document.getElementById("input-nombre");
const inputSalario = document.getElementById("input-salario");
const tablaBody = document.getElementById("tabla-contabilidad");

inputNombre.addEventListener("input", () => {
  inputNombre.value = inputNombre.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
});

// ---- Formatear la moneda ----
function formatearMoneda(valor) {
  return new Intl.NumberFormat("es-SV", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(valor);
}

function limpiarInputs() {
  inputNombre.value = "";
  inputSalario.value = "";
  inputNombre.focus();
}

// ---- Validaciones ----
function validarDatos(nombre, salario) {

  nombre = nombre.trim();

  // Validacion del nombre
  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

  if (!nombre || nombre.length < 2) {
    alert("⚠️ Ingrese un nombre válido (mínimo 2 letras).");
    return false;
  }

  // Evita espacios dobles o nombre solo con espacios
  if (!soloLetras.test(nombre)) {
    alert("⚠️ El nombre solo debe contener letras y espacios.");
    return false;
  }

  if (salario === "" || salario === null || salario === undefined) {
    alert("⚠️ Ingrese el sueldo.");
    return false;
  }

  salario = parseFloat(salario);

  if (isNaN(salario)) {
    alert("⚠️ El sueldo debe ser numérico.");
    return false;
  }

  if (salario <= 0) {
    alert("⚠️ El sueldo debe ser mayor a 0.");
    return false;
  }

  return true;
}

// ===============================

// ISSS
function calcularISSS(sueldo) {
  const isss = sueldo * 0.03;
  return Math.min(isss, 30);
}

// AFP
function calcularAFP(sueldo) {
  return sueldo * 0.0725;
}

// Renta imponible = sueldo - descuentos (ISSS + AFP)
function calcularRentaImponible(sueldo, isss, afp) {
  const sueldoC = Math.round(sueldo * 100);
  const isssC   = Math.round(isss * 100);
  const afpC    = Math.round(afp * 100);

  const rentaC = sueldoC - (isssC + afpC);
  return rentaC / 100;
}

// ISR 
function calcularISR(renta) {

  // I TRAMO: Exento
  if (renta <= 550.00) return 0;

  // II TRAMO: 10% sobre exceso de $550.00 + cuota fija $17.67
  if (renta <= 895.24) {
    return (renta - 550.00) * 0.10 + 17.67;
  }

  // III TRAMO: 20% sobre exceso de $895.24 + cuota fija $60.00
  if (renta <= 2038.10) {
    return (renta - 895.24) * 0.20 + 60.00;
  }

  // IV TRAMO: 30% sobre exceso de $2,038.10 + cuota fija $288.57
  return (renta - 2038.10) * 0.30 + 288.57;
}

// Sueldo líquido = sueldo - isss - afp - isr
function calcularSueldoLiquido(sueldo, isss, afp, isr) {
  const sueldoC = Math.round(sueldo * 100);
  const isssC   = Math.round(isss * 100);
  const afpC    = Math.round(afp * 100);
  const isrC    = Math.round(isr * 100);

  const liquidoC = sueldoC - (isssC + afpC + isrC);
  return liquidoC / 100;
}


//  RENDER FILA EN TABLA

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

function mostrarMensajeTablaVacia() {
  if (tablaBody.children.length === 0) {
    tablaBody.innerHTML = `
      <tr id="fila-vacia">
        <td colspan="7" class="text-center text-muted py-4">
          ⚠️ No hay registros. Complete los campos obligatorios.
        </td>
      </tr>
    `;
  }
}

// Quita el mensaje si existe
function quitarMensajeTablaVacia() {
  const fila = document.getElementById("fila-vacia");
  if (fila) fila.remove();
}


//  EVENTO CALCULAR Y SUBIR A LA TABLA

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = inputNombre.value.trim();
  const sueldo = parseFloat(inputSalario.value);

  if (!validarDatos(nombre, sueldo)) return;

  if(agregarFilaTabla===null){
    alert("Debe llenar los campos");

  }

  // cálculos
  const isss = calcularISSS(sueldo);
  const afp = calcularAFP(sueldo);
  const renta = calcularRentaImponible(sueldo, isss, afp);
  const isr = parseFloat(calcularISR(renta).toFixed(2));
  const liquido = calcularSueldoLiquido(sueldo, isss, afp, isr);

  quitarMensajeTablaVacia(); 

  // agregar fila
  agregarFilaTabla({
    nombre,
    sueldo,
    isss,
    afp,
    renta,
    isr,
    liquido
  });

  limpiarInputs();
});

mostrarMensajeTablaVacia();
