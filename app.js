const trackingProgress = document.querySelector("#tracking-progress");
const input = document.querySelector("#tracking-number");
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
const shop = document.querySelector("#order-shop");
const eventDescription = document.querySelector("#event-description");
const imgCreated = document.querySelector("#img-created");
const imgReceived = document.querySelector("#img-received");
const imgProcessed = document.querySelector("#img-processed");
const imgDelivered = document.querySelector("#img-delivered");

const defaultImages = {
  created: "img/step1.png",
  received: "img/step2.png",
  processed: "img/step3.png",
  delivered: "img/step4.png",
};

const newImages = {
  created: "img/step-new1.png",
  received: "img/step-new2.png",
  processed: "img/step-new3.png",
  delivered: "img/step-new4.png",
};

const orderStatus = {
  created: "Orden recibida.<br>Paquete en preparación 📦",
  received: "Paquete preparado.<br>Listo para ser despachado 🚚",
  processed: "Envío en progreso 🚚",
  delivered: "Envío entregado correctamente 🎉",
  delegated: "Envío delegado a courier externo",
  deleted: "Paquete preparado.<br>Listo para ser despachado 🚚",
  canceled: "Envío cancelado ❌",
  archived: "Envío archivado 📥",
  tpc_registered: "Envío en preparación para despacho",
  tpc_dispatched: "Envío en tránsito 🚚",
  tpc_delivered: "Envío entregado correctamente 🎉",
  tpc_canceled: "Envío no entregado por falla del receptor ❌",
  tpc_postponed: "Envío pospuesto",
  ext_delegated: "Envío delegado a courier externo",
};

const statusOnFront = {
  created: 1,
  received: 2,
  processed: 3,
  delivered: 4,
};

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

const publicId = params.public_id;

if (Boolean(publicId) && publicId.length === 10) {
  document.querySelector("#tracking-number").value = publicId;
  Swal.fire(`Código de seguimiento: ${publicId}`, "Al dar click en consultar, podrás ver el estatus", "info");
}

// Make the request to Central
const getTrackingProgress = async (trackingNumber) => {
  const response = await fetch(`https://central.thepackco.cl/api/shops/order/${trackingNumber}/`);
  return response.status === 200 ? await response.json() : null;
};

// Function to update step images
function updateStepImages(currentStep) {
  const imageMap = {
    1: newImages.created,
    2: newImages.received,
    3: newImages.processed,
    4: newImages.delivered,
  };

  imgCreated.innerHTML = `<img class="icon" src="${currentStep >= 1 ? imageMap[1] : defaultImages.created}" />`;
  imgReceived.innerHTML = `<img class="icon" src="${currentStep >= 2 ? imageMap[2] : defaultImages.received}" />`;
  imgProcessed.innerHTML = `<img class="icon" src="${currentStep >= 3 ? imageMap[3] : defaultImages.processed}" />`;
  imgDelivered.innerHTML = `<img class="icon" src="${currentStep >= 4 ? imageMap[4] : defaultImages.delivered}" />`;
}

// When the search button is clicked, get the tracking number and make the request
searchButton.addEventListener("click", async () => {
  const regex = /^[a-z0-9]+$/i;
  // Clean variables

  trackingProgress.classList.add("d-none");
  steps.innerHTML = "";

  const trackingNumber = document.querySelector("#tracking-number").value.trim().toUpperCase();

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
      "El número de seguimiento solo puede contener alfanuméricos",
      "Por favor, ingrese un número de seguimiento válido",
      "warning"
    );
  }
  const orderData = await getTrackingProgress(trackingNumber);
  if (!Object.keys(orderData).length) {
    return Swal.fire(
      "El número de seguimiento no existe",
      "Por favor, ingrese un número de seguimiento válido",
      "warning"
    );
  }

  trackingProgress.classList.remove("d-none");

  showTrackingNumber.innerHTML = `#${trackingNumber}`;

  // Nombre del cliente
  customerName.innerHTML = `<strong>${toTitleCase(orderData.customer_name)}</strong>`;

  // Region
  region.innerHTML = orderData.address_region_name;

  // Comuna
  city.innerHTML = orderData.address_city_name;

  //   Dirección del cliente
  const totalDirection = [orderData.address_street, orderData.address_flat, orderData.address_additional].join(" ");
  customerDirection.innerHTML = `<strong>${toTitleCase(totalDirection)}</strong>`;

  //   Productos
  let aux = "";
  for (const product of orderData.products) {
    if (product.name === "DELIVERY") {
      continue;
    }
    aux += `<li>${product.quantity}x ${product.name}</li>`;
  }
  orderProducts.innerHTML = toTitleCase(aux);

  shop.innerHTML = orderData.shop_name;

  //   Código de orden
  orderCode.innerHTML = orderData.reference_code;

  //   Paquetes
  packages.innerHTML = orderData.packages;

  //   Repartidor
  for (const evento of orderData.events) {
    if (evento.name === "tpc_registered" && evento.additional_data.driver_name) {
      deliver.innerHTML = toTitleCase(evento.additional_data.driver_name);
    }
  }

  //   Tiempo estimado de entrega
  for (const evento of orderData.events) {
    if (evento.name === "tpc_dispatched" && evento.additional_data.eta) {
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
    // Update step images
    updateStepImages(statusOnFront[orderData.status]);
  }
  statusCondition.innerHTML = orderStatus[orderData.status];

  // Evento del envío
  eventDescription.innerHTML = `${orderData.events[orderData.events.length - 1].description}`;
});

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    Swal.fire({
      position: "center",
      icon: "info",
      title: "Buscando pedido",
      showConfirmButton: false,
      timer: 1000,
    });
    searchButton.click();
  }
});
