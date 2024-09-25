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
  AddToWishList: (params) => `
      fbq('track', 'AddToWishList', {
        content_ids: {{CUST JS - FB Content IDs}},
        contents: {{CUST JS - FB Contents}},
        currency: {{DLV - ${params.currency}}},
        value: {{DLV - ${params.value}}}
      }, {
        eventID: 'ADD-{{Unique Event ID}}'
      });`,
  SubmitApplication: (params) => `
      fbq('track', 'submitApplication', {}, {
        eventID: 'SA-{{Unique Event ID}}'
      });`,
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
        num_items: {{CUST JS - FB num_items}}
      }, {
        eventID: 'P-{{Unique Event ID}}'
      });
    `,
  CompleteRegistration: (params) => `
      fbq('track', 'CompleteRegistration', {
      currency: {{DLV - ${params.currency}}},
      value: {{DLV - ${params.value}}},
      },{
        eventID: 'CR-{{Unique Event ID}}'
      });
    `,
  Lead: (params) => `
      fbq('track', 'Lead', {
        currency: {{DLV - ${params.currency}}},
        value: {{DLV - ${params.value}}}
      }, {
        eventID: 'L-{{Unique Event ID}}'
      });
    `,
  Contact: (params) => `
      fbq('track', 'Contact', {}, {
      eventID: 'C-{{Unique Event ID}}'
      });`,
  FindLocation: (params) => `
      fbq('track', 'FindLocation', {}, {
      eventID: 'FL-{{Unique Event ID}}'
      });`,
  InitiateCheckout: (params) => `
      fbq('track', 'InitiateCheckout', {
        content_ids: {{CUST JS - FB Content IDs}},
        contents: {{CUST JS - FB Contents}},
        currency: {{DLV - ${params.currency}}},
        num_items: {{CUST JS - FB num_items}},
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
  PageView: (params) => `
      fbq('track', 'PageView', {}, {
        eventID: 'PV-{{Unique Event ID}}'
     });`,
  Schedule: (params) => `
      fbq('track', 'Schedule', {}, {
        eventID: 'SC-{{Unique Event ID}}'
      });`,
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

export const FacebookPixelBase = (FacebookPixelId) => `<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', ${FacebookPixelId});
</script>
<noscript>
  <img height="1" width="1" style="display:none" 
       src="https://www.facebook.com/tr?id=${FacebookPixelId}&ev=PageView&noscript=1"/>
</noscript>`;
