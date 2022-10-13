const trackingProgress = document.querySelector("#tracking-progress");
const searchButton = document.querySelector("#search-button");
const showTrackingNumber = document.querySelector("#show-tracking-number");
const customerName = document.querySelector("#customer-name");
const customerDirection = document.querySelector("#customer-direction");
const orderProducts = document.querySelector("#order-products");
const region = document.querySelector("#region");
const city = document.querySelector("#city");
const orderCode = document.querySelector("#order-code");
const packages = document.querySelector("#packages");
const deliver = document.querySelector("#deliver");
const orderTime = document.querySelector("#order-time");
const statusCondition = document.querySelector("#status-condition");
const steps = document.querySelector("#progressbar");

const orderStatus = {
  created: "Orden recibida.<br>Paquete en preparación📦",
  received: "Paquete preparado.<br>Listo para ser despachado🚚",
  processed: "Envío en progreso🚚.",
  delivered: "Envío entregado correctamente🎉",
  delegated: "Envío delegado a courier externo",
  deleted: "Paquete preparado.<br>Listo para ser despachado🚚",
  canceled: "Envío cancelado✖️",
  tpc_registered: "Envío en preparación para despacho",
  tpc_dispatched: "Envío en tránsito",
  tpc_delivered: "Envío entregado correctamente🎉",
  tpc_canceled: "Envío no entregado por falla del receptor✖️",
  tpc_postponed: "Envío pospuesto",
  ext_delegated: "Envío delegado a courier externo",
};

const statusOnFront = {
  received: 1,
  processed: 2,
  tpc_dispatched: 3,
  tpc_delivered: 4,
  delivered: 4,
};

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// Make the request to Central
const getTrackingProgress = async (trackingNumber) => {
  const response = await fetch(
    `https://central.thepackco.cl/api/shops/order/${trackingNumber}/`
  );
  return response.status === 200 ? await response.json() : null;
};

// When the search button is clicked, get the tracking number and make the request
searchButton.addEventListener("click", async () => {
  const regex = /^[a-z0-9]+$/i;
  steps.innerHTML = "";

  const trackingNumber = document
    .querySelector("#tracking-number")
    .value.trim()
    .toUpperCase();

  if (!trackingNumber) {
    return Swal.fire(
      "El número de seguimiento no puede estar vacío",
      "Por favor, ingrese un número de seguimiento válido",
      "warning"
    );
  } else if (trackingNumber.length !== 10) {
    return Swal.fire(
      "El número de seguimiento debe tener 10 caracteres",
      "Por favor, ingrese un número de seguimiento válido",
      "warning"
    );
  } else if (!regex.test(trackingNumber)) {
    return Swal.fire(
      "Еl número de seguimiento solo puede contener letras y números",
      "Por favor, ingrese un número de seguimiento válido",
      "warning"
    );
  }
  const orderData = await getTrackingProgress(trackingNumber);
  if (!orderData) {
    return Swal.fire(
      "El número de seguimiento no existe",
      "Por favor, ingrese un número de seguimiento válido",
      "warning"
    );
  }

  trackingProgress.classList.remove("d-none");

  showTrackingNumber.innerHTML = `#${trackingNumber}`;

  // Nombre del cliente
  customerName.innerHTML = `<strong>${orderData.customer_name}</strong>`;

  //   Region
  region.innerHTML = orderData.address_region_name;

  // Comuna
  city.innerHTML = orderData.address_city_name;

  //   Dirección del cliente
  const totalDirection = [
    orderData.address_street,
    orderData.address_flat,
    orderData.address_additional,
  ].join(" ");
  customerDirection.innerHTML = `
      <strong>${toTitleCase(totalDirection)}</strong>
      `;

  //   Productos
  orderProducts.innerHTML = orderData.product_description;

  //   Código de orden
  orderCode.innerHTML = orderData.reference_code;

  //   Paquetes
  packages.innerHTML = orderData.packages;

  //   Repartidor
  for (const evento of orderData.events) {
    if (evento.name === "tpc_registered") {
      deliver.innerHTML = evento.additional_data.driver_name;
    }
  }

  //   Tiempo estimado de entrega
  for (const evento of orderData.events) {
    if (evento.name === "tpc_dispatched") {
      orderTime.innerHTML = evento.additional_data.eta;
    }
  }

  //   Condición de envío
  if (orderData.status in statusOnFront) {
    let condition = "";
    for (let index = 0; index < statusOnFront[orderData.status]; index++) {
      condition += '<li class="active step0"></li>';
    }
    steps.innerHTML = condition;
  }
  statusCondition.innerHTML = orderStatus[orderData.status];
});
