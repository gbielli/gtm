export const facebookEvent = {
  ViewContent: {
    productListPath: { type: "string", placeholder: "ecommerce.items" },
    idPath: { type: "string", placeholder: "id" },
    content_type: { type: "dropdown", placeholder: "product" },
    value: { type: "string", placeholder: "ecommerce.value" },
    currency: { type: "string", placeholder: "ecommerce.currency" },
  },
  AddToCart: {
    productListPath: { type: "string", placeholder: "ecommerce.items" },
    idPath: { type: "string", placeholder: "id" },
    content_type: { type: "string", placeholder: "product" },
    value: { type: "string", placeholder: "ecommerce.value" },
    currency: { type: "string", placeholder: "ecommerce.currency" },
  },
  AddToWishlist: {
    productListPath: { type: "string", placeholder: "ecommerce.items" },
    idPath: { type: "string", placeholder: "id" },
    value: { type: "string", placeholder: "ecommerce.value" },
    currency: { type: "string", placeholder: "ecommerce.currency" },
  },
  InitiateCheckout: {
    productListPath: { type: "string", placeholder: "ecommerce.items" },
    idPath: { type: "string", placeholder: "id" },
    value: { type: "string", placeholder: "ecommerce.value" },
    currency: { type: "string", placeholder: "ecommerce.currency" },
    num_items: { type: "string" },
  },
  AddPaymentInfo: {
    productListPath: { type: "string", placeholder: "ecommerce.items" },
    idPath: { type: "string", placeholder: "id" },
    value: { type: "string", placeholder: "ecommerce.value" },
    currency: { type: "string", placeholder: "ecommerce.currency" },
  },
  Purchase: {
    productListPath: { type: "string", placeholder: "ecommerce.items" },
    idPath: { type: "string", placeholder: "id" },
    content_type: { type: "string", placeholder: "product" },
    quantity: { type: "string", placeholder: "product" },
    value: { type: "string", placeholder: "ecommerce.value" },
    currency: { type: "string", placeholder: "ecommerce.currency" },
    num_items: { type: "string" },
  },
  Lead: {
    value: { type: "string", placeholder: "ecommerce.value" },
    currency: { type: "string", placeholder: "ecommerce.currency" },
  },
  CompleteRegistration: {
    value: { type: "string", placeholder: "ecommerce.value" },
    currency: { type: "string", placeholder: "ecommerce.currency" },
  },
};
