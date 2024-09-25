import { eventScripts, FacebookPixelBase } from "./eventScripts";
import { facebookEvent } from "./facebookEvent";

function generateUniqueId() {
  return Math.floor(100 + Math.random() * 900);
}

function createFacebookNumItems(productListPath) {
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

function createFacebookContents(productListPath, idName, quantityPath) {
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

function createFacebookContentIds(productListPath, idName) {
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

function createFacebookVariables(events, parameters, pixelId) {
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
    if (eventData && facebookEvent[eventType]) {
      Object.entries(facebookEvent[eventType]).forEach(
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

function createFacebookTags(events, parameters, pixelId) {
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

  // Création des tags pour chaque événement sélectionné
  Object.entries(events).forEach(([eventType, isSelected]) => {
    if (isSelected && eventScripts[eventType]) {
      const eventParams = parameters[eventType] || {};
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
        firingTriggerId: ["2147479553"],
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

export function createFacebookJsonObject(facebookData) {
  console.log("Création de l'objet JSON Facebook");
  console.log("Données Facebook reçues:", facebookData);

  if (!facebookData || !facebookData.pixelId) {
    console.error("Données Facebook invalides ou manquantes");
    return null;
  }

  const jsonObj = {
    exportFormatVersion: 2,
    exportTime: new Date().toISOString(),
    containerVersion: {
      path: "accounts/6247820543/containers/194603635/versions/2",
      accountId: "6247820543",
      containerId: "194603635",
      containerVersionId: "2",
      name: "Facebook Event Tracking",
      container: {
        path: "accounts/6247820543/containers/194603635",
        accountId: "6247820543",
        containerId: "194603635",
        name: "Facebook Event Tracking",
        publicId: "GTM-5BPKFTKF",
        usageContext: ["WEB"],
        fingerprint: "1726235913680",
        tagManagerUrl:
          "https://tagmanager.google.com/#/container/accounts/6247820543/containers/194603635/workspaces?apiLink=container",
        features: {
          supportUserPermissions: true,
          supportEnvironments: true,
          supportWorkspaces: true,
          supportGtagConfigs: false,
          supportBuiltInVariables: true,
          supportClients: false,
          supportFolders: true,
          supportTags: true,
          supportTemplates: true,
          supportTriggers: true,
          supportVariables: true,
          supportVersions: true,
          supportZones: true,
          supportTransformations: false,
        },
        tagIds: ["GTM-5BPKFTKF"],
      },
      variable: [],
      tag: [],
    },
  };

  const facebookVariables = createFacebookVariables(
    facebookData.events,
    facebookData.parameters,
    facebookData.pixelId
  );
  jsonObj.containerVersion.variable.push(...facebookVariables);

  console.log(
    `Nombre total de variables créées: ${jsonObj.containerVersion.variable.length}`
  );

  const facebookTags = createFacebookTags(
    facebookData.events,
    facebookData.parameters,
    facebookData.pixelId
  );
  jsonObj.containerVersion.tag.push(...facebookTags);

  console.log(
    `Nombre total de tags créés: ${jsonObj.containerVersion.tag.length}`
  );

  return jsonObj;
}
