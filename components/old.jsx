import { generateUniqueId } from "./utils"; // Assurez-vous que cette fonction est disponible

function createParams(platform, events) {
  if (platform === "facebook") {
    return Object.values(events).flatMap((eventData) =>
      Object.entries(eventData.parameters || {}).map(
        ([paramKey, paramValue]) => ({
          type: "MAP",
          map: [
            { type: "TEMPLATE", key: "key", value: paramKey },
            { type: "TEMPLATE", key: "value", value: paramValue },
          ],
        })
      )
    );
  }
  return [];
}

function createVariableObject(platform, events) {
  const eventEntries = Object.entries(events)
    .filter(([_, eventData]) => eventData.conversionLabel !== "")
    .map(([eventType, eventData]) => ({
      type: "MAP",
      map: [
        { type: "TEMPLATE", key: "key", value: eventType },
        { type: "TEMPLATE", key: "value", value: eventData.conversionLabel },
      ],
    }));

  return {
    accountId: "6247820543",
    containerId: "194603635",
    variableId: `${generateUniqueId()}`,
    name: `LT - ${platform} conversions`,
    type: "smm",
    parameter: [
      {
        type: "BOOLEAN",
        key: "setDefaultValue",
        value: "true",
      },
      {
        type: "TEMPLATE",
        key: "input",
        value: "{{Event}}",
      },
      {
        type: "TEMPLATE",
        key: "defaultValue",
        value: "{{Event}} is not a conversion",
      },
      {
        type: "LIST",
        key: "map",
        list: eventEntries,
      },
      ...params, // Ajout des paramètres créés par createParams
    ],
    fingerprint: Date.now().toString(),
    formatValue: {},
  };
}

function createConst(platform, conversionId) {
  return {
    accountId: "6247820543",
    containerId: "194603635",
    variableId: `${generateUniqueId()}`,
    name: `CONST - ${platform} ID`,
    type: "c",
    parameter: [{ type: "TEMPLATE", key: "value", value: conversionId }],
  };
}

export function createJsonObject(adPlatforms) {
  const jsonObj = {
    exportFormatVersion: 2,
    exportTime: new Date().toISOString(),
    containerVersion: {
      path: "accounts/6247820543/containers/194603635/versions/2",
      accountId: "6247820543",
      containerId: "194603635",
      containerVersionId: "2",
      name: "start template",
      container: {
        path: "accounts/6247820543/containers/194603635",
        accountId: "6247820543",
        containerId: "194603635",
        name: "Template client side",
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
    },
  };

  Object.entries(adPlatforms).forEach(([platform, data]) => {
    if (data.selected) {
      const variableObj = createVariableObject(platform, data.events);
      const createConstObj = createConst(platform, data.conversionId);
      jsonObj.containerVersion.variable.push(variableObj);
      jsonObj.containerVersion.variable.push(createConstObj);
    }
  });

  return jsonObj;
}
