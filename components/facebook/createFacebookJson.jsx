import { facebookEvent } from "../facebookEvent";
import { eventScripts } from "./eventScripts";

function generateUniqueId() {
  return Math.floor(100 + Math.random() * 900);
}

function createFacebookContents(productListPath) {
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
      return { id: item.id, quantity: item.quantity };
    });
  }`,
      },
    ],
    fingerprint: "1726563952359",
    formatValue: {},
  };
}

function createFacebookContentIds(productListPath) {
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
      return item.id;
    });
  }`,
      },
    ],
    fingerprint: "1726563952359",
    formatValue: {},
  };
}

function createFacebookVariables(events, parameters, pixelId) {
  console.log("Création des variables Facebook");
  console.log("Events reçus:", events);
  console.log("Paramètres reçus:", parameters);

  const variables = [];

  Object.entries(events).forEach(([eventType, isSelected]) => {
    if (isSelected) {
      console.log(`Traitement de l'événement: ${eventType}`);
      if (facebookEvent[eventType]) {
        Object.entries(facebookEvent[eventType]).forEach(
          ([paramKey, paramData]) => {
            console.log(`Création de variable pour ${eventType} - ${paramKey}`);

            if (paramKey === "productListPath") {
              const customJsListId = createFacebookContents(paramKey);
              const customJsContentIds = createFacebookContentIds(paramKey);
              variables.push(customJsListId, customJsContentIds);
            }

            variables.push({
              accountId: "6247820543",
              containerId: "195268723",
              variableId: generateUniqueId().toString(),
              name: `DLV - ${paramKey}`,
              type: "v",
              parameter: [
                {
                  type: "INTEGER",
                  key: "dataLayerVersion",
                  value: "2",
                },
                {
                  type: "BOOLEAN",
                  key: "setDefaultValue",
                  value: "false",
                },
                {
                  type: "TEMPLATE",
                  key: "name",
                  value: `${paramKey}`,
                },
              ],
              fingerprint: "1726563952359",
              formatValue: {},
            });
          }
        );
      } else {
        console.warn(`Événement non trouvé dans facebookEvent: ${eventType}`);
      }
    }
  });

  console.log(`Nombre de variables DLV créées: ${variables.length}`);

  const constVariable = {
    accountId: "6247820543",
    containerId: "194603635",
    variableId: generateUniqueId().toString(),
    name: "CONST - Facebook ID",
    type: "c",
    parameter: [{ type: "TEMPLATE", key: "value", value: pixelId }],
  };

  return [...variables, constVariable];
}

function createFacebookTags(events, parameters) {
  console.log("ce sont les paramètres", parameters, events);

  return Object.entries(events)
    .map(([eventType, isSelected]) => {
      if (!isSelected || !eventScripts[eventType]) return null;

      const eventParams = parameters[eventType] || {};
      const eventScript = eventScripts[eventType](eventParams);

      const script = `
<script>
  ${eventScript}
</script>
`;

      return {
        accountId: "6247820543",
        containerId: "194603635",
        tagId: generateUniqueId().toString(),
        name: `CUST - FB - ${eventType}`,
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
    })
    .filter((tag) => tag !== null);
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
    facebookData.parameters
  );
  jsonObj.containerVersion.tag.push(...facebookTags);

  console.log(
    `Nombre total de tags créés: ${jsonObj.containerVersion.tag.length}`
  );

  return jsonObj;
}
