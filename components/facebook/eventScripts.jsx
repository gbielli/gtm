export const eventScripts = {
  ViewContent: (params) => `
      fbq('track', 'ViewContent', {
        content_ids: {{CUST JS - FB Content IDs}},
        content_type: 'product',
        contents: {{CUST JS - FB Contents}},
        currency: {{DLV - ${params.currency}}},
        value: {{DLV - ${params.value}}}
      }, {
        eventID: 'VC-{{Unique Event ID}}'
      });
    `,
  AddToCart: (params) => `
      fbq('track', 'AddToCart', {
        content_ids: {{CUST JS - FB Content IDs}},
        content_type: 'product',
        contents: {{CUST JS - FB Contents}},
        currency: {{DLV - ${params.currency}}},
        value: {{DLV - ${params.value}}}
      }, {
        eventID: 'ADD-{{Unique Event ID}}'
      });
    `,
  Purchase: (params) => `
      fbq('track', 'Purchase', {
        content_ids: {{CUST JS - FB Content IDs}},
        contents: {{CUST JS - FB Contents}},
        content_type: 'product',
        currency: {{DLV - ${params.currency}}},
        value: {{DLV - ${params.value}}},
        num_items: {{DLV - ${params.num_items}}}
      }, {
        eventID: 'P-{{Unique Event ID}}'
      });
    `,
  CompleteRegistration: (params) => `
      fbq('track', 'CompleteRegistration', {
        content_name: {{DLV - ${params.content_name}}},
        currency: {{DLV - ${params.currency}}},
        status: {{DLV - ${params.status}}},
        value: {{DLV - ${params.value}}}
      }, {
        eventID: 'CR-{{Unique Event ID}}'
      });
    `,
  Lead: (params) => `
      fbq('track', 'Lead', {
        content_name: {{DLV - ${params.content_name}}},
        content_category: {{DLV - ${params.content_category}}},
        currency: {{DLV - ${params.currency}}},
        value: {{DLV - ${params.value}}}
      }, {
        eventID: 'L-{{Unique Event ID}}'
      });
    `,
  InitiateCheckout: (params) => `
      fbq('track', 'InitiateCheckout', {
        content_ids: {{CUST JS - FB Content IDs}},
        contents: {{CUST JS - FB Contents}},
        currency: {{DLV - ${params.currency}}},
        num_items: {{DLV - ${params.num_items}}},
        value: {{DLV - ${params.value}}}
      }, {
        eventID: 'IC-{{Unique Event ID}}'
      });
    `,
  AddPaymentInfo: (params) => `
      fbq('track', 'AddPaymentInfo', {
        content_ids: {{CUST JS - FB Content IDs}},
        contents: {{CUST JS - FB Contents}},
        currency: {{DLV - ${params.currency}}},
        value: {{DLV - ${params.value}}}
      }, {
        eventID: 'API-{{Unique Event ID}}'
      });
    `,
  Subscribe: (params) => `
      fbq('track', 'Subscribe', {
        currency: {{DLV - ${params.currency}}},
        predicted_ltv: {{DLV - ${params.predicted_ltv}}},
        value: {{DLV - ${params.value}}}
      }, {
        eventID: 'S-{{Unique Event ID}}'
      });
    `,
  StartTrial: (params) => `
      fbq('track', 'StartTrial', {
        currency: {{DLV - ${params.currency}}},
        predicted_ltv: {{DLV - ${params.predicted_ltv}}},
        value: {{DLV - ${params.value}}}
      }, {
        eventID: 'ST-{{Unique Event ID}}'
      });
    `,
  Search: (params) => `
      fbq('track', 'Search', {
        content_ids: {{CUST JS - FB Content IDs}},
        contents: {{CUST JS - FB Contents}},
        currency: {{DLV - ${params.currency}}},
        search_string: {{DLV - ${params.search_string}}},
        value: {{DLV - ${params.value}}}
      }, {
        eventID: 'S-{{Unique Event ID}}'
      });
    `,
};
