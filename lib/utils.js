import { eventScripts, FacebookPixelBase } from "@/lib/eventScripts";
import { facebookParamsList } from "@/lib/facebookParamsList";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getDefaultTrigger = (eventType) => {
  return eventType
    .split(/(?=[A-Z])/)
    .join("_")
    .toLowerCase();
};

export function generateUniqueId() {
  return Math.floor(100 + Math.random() * 900);
}

export function createFacebookNumItems(productListPath) {
  return {
    accountId: "6247820543",
    containerId: "195268723",
    variableId: generateUniqueId().toString(),
    name: `CUST JS - FB num_items`,
    type: "jsm",
    parameter: [
      {
        type: "TEMPLATE",
        key: "javascript",
        value: `function () {
  var items = {{DLV - ${productListPath}}};
  if (items && Array.isArray(items)) {
   return items.length;
  }
  return 0;
}`,
      },
    ],
    fingerprint: "1726563952359",
    formatValue: {},
  };
}

export function createFacebookContents(productListPath, idName, quantityPath) {
  return {
    accountId: "6247820543",
    containerId: "195268723",
    variableId: generateUniqueId().toString(),
    name: `CUST JS - FB Contents`,
    type: "jsm",
    parameter: [
      {
        type: "TEMPLATE",
        key: "javascript",
        value: `function() {
    var productList = {{DLV - ${productListPath}}};
    return productList.map(function(item) {
      return { id: item.${idName}, quantity: item.${quantityPath}};
    });
  }`,
      },
    ],
    fingerprint: "1726563952359",
    formatValue: {},
  };
}

export function createFacebookContentIds(productListPath, idName) {
  return {
    accountId: "6247820543",
    containerId: "195268723",
    variableId: generateUniqueId().toString(),
    name: `CUST JS - FB Content IDs`,
    type: "jsm",
    parameter: [
      {
        type: "TEMPLATE",
        key: "javascript",
        value: `function() {
    var productList = {{DLV - ${productListPath}}};
    return productList.map(function(item) {
      return item.${idName};
    });
  }`,
      },
    ],
    fingerprint: "1726563952359",
    formatValue: {},
  };
}

export function createFacebookTriggers(events, triggers) {
  console.log("Paramètres et événements reçus:", triggers, events);

  const triggersList = [];
  const triggerIdMap = {};

  Object.entries(events).forEach(([eventType, isSelected]) => {
    if (isSelected && triggers[eventType]) {
      const triggerId = generateUniqueId().toString();
      const trigger = {
        accountId: "6247820543",
        containerId: "195268723",
        triggerId: triggerId,
        name: `CUST - ${triggers[eventType]}`,
        type: "CUSTOM_EVENT",
        customEventFilter: [
          {
            type: "EQUALS",
            parameter: [
              {
                type: "TEMPLATE",
                key: "arg0",
                value: "{{_event}}",
              },
              {
                type: "TEMPLATE",
                key: "arg1",
                value: triggers[eventType],
              },
            ],
          },
        ],
        fingerprint: "1727279967299",
      };

      triggersList.push(trigger);
      triggerIdMap[eventType] = triggerId;
      console.log("Trigger créé:", JSON.stringify(trigger));
    }
  });

  return { triggersList, triggerIdMap };
}

export function createFacebookVariables(events, parameters, pixelId) {
  console.log("Début de createFacebookVariables");
  console.log("Events reçus:", JSON.stringify(events));
  console.log("Paramètres reçus:", JSON.stringify(parameters));
  console.log("PixelId reçu:", pixelId);

  const variables = [];
  const createdParams = new Set();

  const createDLVVariable = (paramValue) => {
    console.log(`Création de DLV variable pour: ${paramValue}`);
    return {
      accountId: "6247820543",
      containerId: "195268723",
      variableId: generateUniqueId().toString(),
      name: `DLV - ${paramValue}`,
      type: "v",
      parameter: [
        { type: "INTEGER", key: "dataLayerVersion", value: "2" },
        { type: "BOOLEAN", key: "setDefaultValue", value: "false" },
        { type: "TEMPLATE", key: "name", value: paramValue },
      ],
      fingerprint: "1726563952359",
      formatValue: {},
    };
  };

  let hasProductListPath = false;
  let idPath = "id"; // Valeur par défaut
  let quantityPath = "quantity"; // Valeur par défaut

  // Traitement des événements
  Object.entries(events).forEach(([eventType, eventData]) => {
    if (eventData && facebookParamsList[eventType]) {
      Object.entries(facebookParamsList[eventType]).forEach(
        ([paramName, paramConfig]) => {
          const paramValue =
            parameters[eventType]?.[paramName] || parameters[paramName];
          if (paramValue) {
            if (paramName === "idPath") {
              idPath = paramValue;
            } else if (paramName === "quantityPath") {
              quantityPath = paramValue;
            } else if (!createdParams.has(paramValue)) {
              if (paramName === "productListPath") {
                hasProductListPath = true;
              }
              variables.push(createDLVVariable(paramValue));
              createdParams.add(paramValue);
            }
          }
        }
      );
    }
  });

  // Création des variables Custom JavaScript
  let productListPath = "ecommerce.items"; // Valeur par défaut
  if (hasProductListPath) {
    productListPath =
      parameters[
        Object.keys(parameters).find((key) => parameters[key].productListPath)
      ]?.productListPath || productListPath;
  }

  console.log("Création des variables Custom JavaScript");
  variables.push(createFacebookNumItems(productListPath));
  variables.push(createFacebookContents(productListPath, idPath, quantityPath));
  variables.push(createFacebookContentIds(productListPath, idPath));

  console.log(`Nombre total de variables créées: ${variables.length}`);

  const constVariable = {
    accountId: "6247820543",
    containerId: "194603635",
    variableId: generateUniqueId().toString(),
    name: "CONST - Facebook ID",
    type: "c",
    parameter: [{ type: "TEMPLATE", key: "value", value: pixelId }],
  };

  variables.push(constVariable);

  return variables;
}

export function createFacebookTags(events, parameters, pixelId, triggerIdMap) {
  console.log("Paramètres et événements reçus:", parameters, events);

  const tags = [];

  // Création du tag de base pour le pixel Facebook
  const basePixelTag = {
    accountId: "6247820543",
    containerId: "194603635",
    tagId: generateUniqueId().toString(),
    name: "FB - Base Pixel",
    type: "html",
    parameter: [
      {
        type: "TEMPLATE",
        key: "html",
        value: FacebookPixelBase(pixelId),
      },
      {
        type: "BOOLEAN",
        key: "supportDocumentWrite",
        value: "false",
      },
    ],
    fingerprint: Date.now().toString(),
    firingTriggerId: ["2147479553"],
    tagFiringOption: "ONCE_PER_EVENT",
    monitoringMetadata: {
      type: "MAP",
    },
    consentSettings: {
      consentStatus: "NOT_SET",
    },
  };

  tags.push(basePixelTag);

  const pageViewTag = {
    accountId: "6247820543",
    containerId: "194603635",
    tagId: generateUniqueId().toString(),
    name: "FB - Page View",
    type: "html",
    parameter: [
      {
        type: "TEMPLATE",
        key: "html",
        value:
          "<script>\n  fbq('track', 'PageView',{},\n     {\n      eventID: \"PV-{{Unique Event ID}}\"\n     }\n   );\n</script>",
      },
      {
        type: "BOOLEAN",
        key: "supportDocumentWrite",
        value: "false",
      },
    ],
    fingerprint: Date.now().toString(),
    firingTriggerId: ["2147479553"],
    tagFiringOption: "ONCE_PER_EVENT",
    monitoringMetadata: {
      type: "MAP",
    },
    consentSettings: {
      consentStatus: "NOT_SET",
    },
  };

  tags.push(pageViewTag);

  // Création des tags pour chaque événement sélectionné
  Object.entries(events).forEach(([eventType, isSelected]) => {
    if (isSelected && eventScripts[eventType]) {
      const eventParams = parameters;
      const eventScript = eventScripts[eventType](eventParams);

      const script = `
<script>
  ${eventScript}
</script>
`;

      const eventTag = {
        accountId: "6247820543",
        containerId: "194603635",
        tagId: generateUniqueId().toString(),
        name: `FB - ${eventType}`,
        type: "html",
        parameter: [
          {
            type: "TEMPLATE",
            key: "html",
            value: script,
          },
          {
            type: "BOOLEAN",
            key: "supportDocumentWrite",
            value: "false",
          },
        ],
        fingerprint: Date.now().toString(),
        setupTag: [
          {
            tagName: "FB - Base Pixel",
          },
        ],
        firingTriggerId: [triggerIdMap[eventType]],
        tagFiringOption: "ONCE_PER_EVENT",
        monitoringMetadata: {
          type: "MAP",
        },
        consentSettings: {
          consentStatus: "NOT_SET",
        },
      };

      tags.push(eventTag);
    }
  });

  return tags;
}
