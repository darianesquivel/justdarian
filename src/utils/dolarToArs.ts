const DOLAR_OFICIAL_API = "https://dolarapi.com/v1/dolares/oficial";
let dolarVenta = 1500;

try {
  const response = await fetch(DOLAR_OFICIAL_API);

  if (response.ok) {
    const data = await response.json();

    dolarVenta = data.venta;
  } else {
    console.error(
      `Error al obtener la cotización: ${response.status} ${response.statusText}`
    );
  }
} catch (error) {
  console.error("Error en la solicitud fetch:", error);
}

export const dolarsToArs = (dolares: number): string => {
  if (dolarVenta > 0) {
    const resultado = dolares * dolarVenta;
    return resultado.toFixed(2);
  }
  return "N/A";
};
