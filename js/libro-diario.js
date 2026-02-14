// =======================================
// LIBRO DIARIO CON PARTIDAS NUMERADAS
// =======================================

const IVA = 0.13;
let numeroPartida = 1;
let aporteInicialRegistrado = false;

// CATÁLOGO OFICIAL
const cuentas = {
    1101: { nombre: "Efectivo y Equivalentes", debe: 0, haber: 0 },
    1102: { nombre: "Bancos", debe: 0, haber: 0 },
    1103: { nombre: "Cuentas por Cobrar Clientes", debe: 0, haber: 0 },
    1104: { nombre: "IVA Crédito Fiscal (13%)", debe: 0, haber: 0 },
    1105: { nombre: "Inventarios", debe: 0, haber: 0 },
    1106: { nombre: "Documentos por Cobrar", debe: 0, haber: 0 },
    1201: { nombre: "Propiedad, Planta y Equipo", debe: 0, haber: 0 },
    1202: { nombre: "Mobiliario y Equipo", debe: 0, haber: 0 },
    2101: { nombre: "Cuentas por Pagar Proveedores", debe: 0, haber: 0 },
    2102: { nombre: "IVA Débito Fiscal (13%)", debe: 0, haber: 0 },
    2103: { nombre: "Documentos por Pagar", debe: 0, haber: 0 },
    3101: { nombre: "Capital Social", debe: 0, haber: 0 },
    4101: { nombre: "Ventas", debe: 0, haber: 0 },
    4102: { nombre: "Rebajas y Devoluciones s/ Ventas", debe: 0, haber: 0 },
    5101: { nombre: "Compras", debe: 0, haber: 0 },
    5102: { nombre: "Gastos de Venta", debe: 0, haber: 0 },
    5103: { nombre: "Gastos de Alquiler", debe: 0, haber: 0 },
    5104: { nombre: "Gastos de Publicidad", debe: 0, haber: 0 }
};

const libroDiario = document.getElementById("libroDiario");
const libroMayor = document.getElementById("libroMayor");

function formatear(n) {
    return "$" + n.toFixed(2);
}

function procesarOperacion() {

    const texto = document.getElementById("inputOperacion").value.toLowerCase();

    if (!texto) return alert("Ingrese una operación.");

    const montoMatch = texto.match(/\$?\d+(\.\d+)?/);
    if (!montoMatch) return alert("No se encontró un monto válido.");

    const monto = parseFloat(montoMatch[0].replace("$",""));
    const iva = monto * IVA;

    let movimientos = [];

    // =====================
    // APORTE (OBLIGATORIO PRIMERO)
    // =====================
    if (texto.includes("aporte") || texto.includes("aportar") || texto.includes("capital")) {

        movimientos.push({ codigo:1101, tipo:"debe", monto:monto });
        movimientos.push({ codigo:3101, tipo:"haber", monto:monto });

        aporteInicialRegistrado = true;
    }

    else if (!aporteInicialRegistrado) {
        return alert("⚠️ Debe registrar primero un APORTE DE CAPITAL.");
    }

    // =====================
    // COMPRA DE MOBILIARIO CONTADO
    // =====================
    else if (texto.includes("mobiliario") || texto.includes("equipo de oficina")) {

        movimientos.push({ codigo:1202, tipo:"debe", monto:monto });
        movimientos.push({ codigo:1104, tipo:"debe", monto:iva });
        movimientos.push({ codigo:1101, tipo:"haber", monto:monto + iva });
    }

    // =====================
    // COMPRA AL CRÉDITO
    // =====================
    else if ((texto.includes("comprar") || texto.includes("compra")) &&
             (texto.includes("credito") || texto.includes("crédito") || texto.includes("fiado"))) {

        movimientos.push({ codigo:5101, tipo:"debe", monto:monto });
        movimientos.push({ codigo:1104, tipo:"debe", monto:iva });
        movimientos.push({ codigo:2101, tipo:"haber", monto:monto + iva });
    }

    // =====================
    // COMPRA CONTADO
    // =====================
    else if (texto.includes("comprar") || texto.includes("compra")) {

        movimientos.push({ codigo:5101, tipo:"debe", monto:monto });
        movimientos.push({ codigo:1104, tipo:"debe", monto:iva });
        movimientos.push({ codigo:1101, tipo:"haber", monto:monto + iva });
    }

    // =====================
    // VENTA CON PAGARÉ
    // =====================
    else if (texto.includes("pagare") || texto.includes("pagaré")) {

        movimientos.push({ codigo:1106, tipo:"debe", monto:monto + iva });
        movimientos.push({ codigo:4101, tipo:"haber", monto:monto });
        movimientos.push({ codigo:2102, tipo:"haber", monto:iva });
    }

    // =====================
    // VENTA CONTADO
    // =====================
    else if (texto.includes("venta") || texto.includes("vender")) {

        movimientos.push({ codigo:1101, tipo:"debe", monto:monto + iva });
        movimientos.push({ codigo:4101, tipo:"haber", monto:monto });
        movimientos.push({ codigo:2102, tipo:"haber", monto:iva });
    }

    // =====================
    // PAGO A PROVEEDORES
    // =====================
    else if (texto.includes("proveedor")) {

        movimientos.push({ codigo:2101, tipo:"debe", monto:monto });
        movimientos.push({ codigo:1101, tipo:"haber", monto:monto });
    }

    // =====================
    // DEVOLUCIÓN SOBRE COMPRA
    // =====================
    else if (texto.includes("devol")) {

        movimientos.push({ codigo:2101, tipo:"debe", monto:monto + iva });
        movimientos.push({ codigo:5101, tipo:"haber", monto:monto });
        movimientos.push({ codigo:1104, tipo:"haber", monto:iva });
    }

    // =====================
    // PAGO DE ALQUILER
    // =====================
    else if (texto.includes("alquiler") || texto.includes("renta")) {

        movimientos.push({ codigo:5103, tipo:"debe", monto:monto });
        movimientos.push({ codigo:1101, tipo:"haber", monto:monto });
    }

    // =====================
    // COBRO A CLIENTES
    // =====================
    else if (texto.includes("clientes") || texto.includes("cobro") || texto.includes("recibimos")) {

        movimientos.push({ codigo:1101, tipo:"debe", monto:monto });
        movimientos.push({ codigo:1106, tipo:"haber", monto:monto });
    }

    // =====================
    // GASTO DE PUBLICIDAD
    // =====================
    else if (texto.includes("publicidad") || texto.includes("radio") || texto.includes("pauta")) {

        movimientos.push({ codigo:5104, tipo:"debe", monto:monto });
        movimientos.push({ codigo:1101, tipo:"haber", monto:monto });
    }

    else {
        return alert("Operación no reconocida.");
    }

    registrarPartida(movimientos);
    generarMayor();
    document.getElementById("inputOperacion").value = "";
}

// =====================
// REGISTRAR PARTIDA
// =====================

function registrarPartida(movimientos) {

    const divPartida = document.createElement("div");
    divPartida.classList.add("partida");

    let html = `<h5>Partida N° ${numeroPartida}</h5>`;
    html += `
    <table class="table table-sm">
        <thead>
            <tr>
                <th>Cuenta</th>
                <th>Debe</th>
                <th>Haber</th>
            </tr>
        </thead>
        <tbody>
    `;

    movimientos.forEach(mov => {

        cuentas[mov.codigo][mov.tipo] += mov.monto;

        html += `
        <tr>
            <td>${mov.codigo} - ${cuentas[mov.codigo].nombre}</td>
            <td>${mov.tipo === "debe" ? formatear(mov.monto) : ""}</td>
            <td>${mov.tipo === "haber" ? formatear(mov.monto) : ""}</td>
        </tr>
        `;
    });

    html += `
        </tbody>
    </table>
    `;

    divPartida.innerHTML = html;
    libroDiario.appendChild(divPartida);

    numeroPartida++;
}

// =====================
// GENERAR MAYOR
// =====================

function generarMayor() {

    libroMayor.innerHTML = "";

    for (let codigo in cuentas) {

        const cuenta = cuentas[codigo];
        if (cuenta.debe === 0 && cuenta.haber === 0) continue;

        const saldo = cuenta.debe - cuenta.haber;

        const div = document.createElement("div");
        div.classList.add("cuenta-t");

        div.innerHTML = `
        <strong>${codigo} - ${cuenta.nombre}</strong><br>
        Debe: ${formatear(cuenta.debe)} |
        Haber: ${formatear(cuenta.haber)} <br>
        Saldo: ${formatear(Math.abs(saldo))} 
        ${saldo >= 0 ? "(Deudor)" : "(Acreedor)"}
        `;

        libroMayor.appendChild(div);
    }
}
