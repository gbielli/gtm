// jsonGenerator.js

function generateUniqueId() {
  return Math.floor(100 + Math.random() * 900);
}

function createVariableObject(platform, events, conversionId) {
  if (platform === "tiktok" || platform === "googleAds") {
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
      ],
      fingerprint: Date.now().toString(),
      formatValue: {},
    };
  }
  if (platform === "facebook") {
    const variables = Object.values(events).flatMap((eventData) =>
      Object.entries(eventData.parameters || {}).map(
        ([paramKey, paramValue]) => ({
          accountId: "6247820543",
          containerId: "195268723",
          variableId: generateUniqueId().toString(),
          name: `DLV - ${paramValue}`,
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
              value: paramValue,
            },
          ],
          fingerprint: "1726563952359",
          formatValue: {},
        })
      )
    );

    const constVariable = {
      accountId: "6247820543",
      containerId: "194603635",
      variableId: generateUniqueId().toString(),
      name: `CONST - ${platform} ID`,
      type: "c",
      parameter: [{ type: "TEMPLATE", key: "value", value: conversionId }],
    };

    return [...variables, constVariable];
  }

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
    ],
    fingerprint: Date.now().toString(),
    formatValue: {},
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
      const variableObjs = createVariableObject(
        platform,
        data.events,
        data.conversionId
      );
      jsonObj.containerVersion.variable.push(...variableObjs);
    }
  });

  return jsonObj;
}
