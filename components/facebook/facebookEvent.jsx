export const facebookEvent = {
  AddPaymentInfo: {
    productListPath: { type: "string", placeholder: "ecommerce.items" },
    idPath: { type: "string", placeholder: "id" },
    value: { type: "string", placeholder: "ecommerce.value" },
    currency: { type: "string", placeholder: "ecommerce.currency" },
  },
  AddToCart: {
    productListPath: { type: "string", placeholder: "ecommerce.items" },
    idPath: { type: "string", placeholder: "id" },
    value: { type: "string", placeholder: "ecommerce.value" },
    currency: { type: "string", placeholder: "ecommerce.currency" },
  },
  AddToWishList: {
    productListPath: { type: "string", placeholder: "ecommerce.items" },
    idPath: { type: "string", placeholder: "id" },
    value: { type: "string", placeholder: "ecommerce.value" },
    currency: { type: "string", placeholder: "ecommerce.currency" },
  },
  CompleteRegistration: {
    value: { type: "string", placeholder: "ecommerce.value" },
    currency: { type: "string", placeholder: "ecommerce.currency" },
  },
  Contact: {},
  FindLocation: {},
  InitiateCheckout: {
    productListPath: { type: "string", placeholder: "ecommerce.items" },
    idPath: { type: "string", placeholder: "id" },
    value: { type: "string", placeholder: "ecommerce.value" },
    currency: { type: "string", placeholder: "ecommerce.currency" },
  },
  Lead: {
    value: { type: "string", placeholder: "ecommerce.value" },
    currency: { type: "string", placeholder: "ecommerce.currency" },
  },
  Purchase: {
    productListPath: { type: "string", placeholder: "ecommerce.items" },
    idPath: { type: "string", placeholder: "id" },
    quantityPath: { type: "string", placeholder: "quantity" },
    value: { type: "string", placeholder: "ecommerce.value" },
    currency: { type: "string", placeholder: "ecommerce.currency" },
  },
  Schedule: {},
  Search: {
    productListPath: { type: "string", placeholder: "ecommerce.items" },
    idPath: { type: "string", placeholder: "id" },
    value: { type: "string", placeholder: "ecommerce.value" },
    currency: { type: "string", placeholder: "ecommerce.currency" },
    search_string: { type: "string", placeholder: "ecommerce.search_string" },
  },
  StartTrial: {
    currency: { type: "string", placeholder: "ecommerce.currency" },
    predicted_ltv: { type: "string", placeholder: "ecommerce.predicted_ltv" },
    value: { type: "string", placeholder: "ecommerce.value" },
  },
  SubmitApplication: {},
  Subscribe: {
    currency: { type: "string", placeholder: "ecommerce.currency" },
    predicted_ltv: { type: "string", placeholder: "ecommerce.predicted_ltv" },
    value: { type: "string", placeholder: "ecommerce.value" },
  },
  ViewContent: {
    productListPath: { type: "string", placeholder: "ecommerce.items" },
    idPath: { type: "string", placeholder: "id" },
    value: { type: "string", placeholder: "ecommerce.value" },
    currency: { type: "string", placeholder: "ecommerce.currency" },
  },
};

export const parameterDescriptions = {
  productListPath: "Chemin vers la liste des produits dans le Data Layer",
  idPath: "Nom de la variable contenant l'ID du produit dans le Data Layer",
  quantityPath:
    "Nom de la variable contenant la quantité du produit dans le Data Layer",
  value: "Chemin vers la variable contenant la valeur de l'achat",
  currency: "Code devise de l'événement",
  search_string: "Chaîne de recherche",
  predicted_ltv: "Valeur prévue de l'événement",
};
