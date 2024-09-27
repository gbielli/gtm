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

export const scriptUniqueEventId = {
  accountId: "4701696234",
  containerId: "11615571",
  templateId: "178",
  name: "Unique Event ID",
  fingerprint: "1715852074802",
  templateData:
    '___TERMS_OF_SERVICE___\n\nBy creating or modifying this file you agree to Google Tag Manager\'s Community\nTemplate Gallery Developer Terms of Service available at\nhttps://developers.google.com/tag-manager/gallery-tos (or such other URL as\nGoogle may provide), as modified from time to time.\n\n\n___INFO___\n\n{\n  "type": "MACRO",\n  "id": "cvt_temp_public_id",\n  "version": 1,\n  "securityGroups": [],\n  "displayName": "Unique Event ID",\n  "description": "Generates unique event id",\n  "categories": [\n    "UTILITY"\n  ],\n  "containerContexts": [\n    "WEB"\n  ],\n  "brand": {\n    "displayName": "stape-io",\n    "id": "github.com_stape-io"\n  }\n}\n\n\n___TEMPLATE_PARAMETERS___\n\n[]\n\n\n___SANDBOXED_JS_FOR_WEB_TEMPLATE___\n\nconst copyFromDataLayer = require(\'copyFromDataLayer\');\nconst setInWindow = require(\'setInWindow\');\nconst copyFromWindow = require(\'copyFromWindow\');\nconst getTimestampMillis = require(\'getTimestampMillis\');\nconst generateRandom = require(\'generateRandom\');\nconst localStorage = require(\'localStorage\');\n\nreturn getBrowserId() + \'_\' + getPageLoadId() + getGtmUniqueEventId();\n\nfunction getGtmUniqueEventId() {\n    return copyFromDataLayer(\'gtm.uniqueEventId\') || \'0\';\n}\n\nfunction getBrowserId() {\n    let gtmBrowserId = localStorage.getItem(\'gtmBrowserId\');\n\n    if (!gtmBrowserId) {\n        gtmBrowserId = getTimestampMillis() + generateRandom(100000, 999999);\n        localStorage.setItem(\'gtmBrowserId\', gtmBrowserId);\n    }\n\n    return gtmBrowserId;\n}\n\nfunction getPageLoadId() {\n  let eventId = copyFromWindow(\'gtmPageLoadId\');\n\n  if (!eventId) {\n    eventId = getTimestampMillis() + generateRandom(100000, 999999);\n    setInWindow(\'gtmPageLoadId\', eventId, false);\n  }\n\n  return eventId;\n}\n\n\n___WEB_PERMISSIONS___\n\n[\n  {\n    "instance": {\n      "key": {\n        "publicId": "read_data_layer",\n        "versionId": "1"\n      },\n      "param": [\n        {\n          "key": "keyPatterns",\n          "value": {\n            "type": 2,\n            "listItem": [\n              {\n                "type": 1,\n                "string": "gtm.uniqueEventId"\n              }\n            ]\n          }\n        }\n      ]\n    },\n    "clientAnnotations": {\n      "isEditedByUser": true\n    },\n    "isRequired": true\n  },\n  {\n    "instance": {\n      "key": {\n        "publicId": "access_globals",\n        "versionId": "1"\n      },\n      "param": [\n        {\n          "key": "keys",\n          "value": {\n            "type": 2,\n            "listItem": [\n              {\n                "type": 3,\n                "mapKey": [\n                  {\n                    "type": 1,\n                    "string": "key"\n                  },\n                  {\n                    "type": 1,\n                    "string": "read"\n                  },\n                  {\n                    "type": 1,\n                    "string": "write"\n                  },\n                  {\n                    "type": 1,\n                    "string": "execute"\n                  }\n                ],\n                "mapValue": [\n                  {\n                    "type": 1,\n                    "string": "gtmPageLoadId"\n                  },\n                  {\n                    "type": 8,\n                    "boolean": true\n                  },\n                  {\n                    "type": 8,\n                    "boolean": true\n                  },\n                  {\n                    "type": 8,\n                    "boolean": false\n                  }\n                ]\n              }\n            ]\n          }\n        }\n      ]\n    },\n    "clientAnnotations": {\n      "isEditedByUser": true\n    },\n    "isRequired": true\n  },\n  {\n    "instance": {\n      "key": {\n        "publicId": "access_local_storage",\n        "versionId": "1"\n      },\n      "param": [\n        {\n          "key": "keys",\n          "value": {\n            "type": 2,\n            "listItem": [\n              {\n                "type": 3,\n                "mapKey": [\n                  {\n                    "type": 1,\n                    "string": "key"\n                  },\n                  {\n                    "type": 1,\n                    "string": "read"\n                  },\n                  {\n                    "type": 1,\n                    "string": "write"\n                  }\n                ],\n                "mapValue": [\n                  {\n                    "type": 1,\n                    "string": "gtmBrowserId"\n                  },\n                  {\n                    "type": 8,\n                    "boolean": true\n                  },\n                  {\n                    "type": 8,\n                    "boolean": true\n                  }\n                ]\n              }\n            ]\n          }\n        }\n      ]\n    },\n    "clientAnnotations": {\n      "isEditedByUser": true\n    },\n    "isRequired": true\n  }\n]\n\n\n___TESTS___\n\nscenarios: []\n\n\n___NOTES___\n\nCreated on 11/03/2021, 11:05:32\n\n\n',
  galleryReference: {
    host: "github.com",
    owner: "stape-io",
    repository: "unique-event-id-variable",
    version: "df7bc964739af2ec09a49bb48df1c20ef6ef37c2",
    signature:
      "90f36a55b09280b9be35541fff3820a359daa7a5b59a20a72691a9ffebf63a20",
  },
};
