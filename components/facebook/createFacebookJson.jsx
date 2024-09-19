function generateUniqueId() {
  return Math.floor(100 + Math.random() * 900);
}

function createFacebookVariables(events, conversionId) {
  const variables = Object.entries(events).flatMap(([eventType, eventData]) =>
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
    name: "CONST - Facebook ID",
    type: "c",
    parameter: [{ type: "TEMPLATE", key: "value", value: conversionId }],
  };

  return [...variables, constVariable];
}

function createFacebookTags(events) {
  return Object.keys(events).map((eventType) => ({
    accountId: "6247820543",
    containerId: "194603635",
    tagId: generateUniqueId().toString(),
    name: `CUST - FB - ${eventType}`,
    type: "html",
    parameter: [
      {
        type: "TEMPLATE",
        key: "html",
        value: "<script>\n  (function(){return;})()\n</script>",
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
  }));
}

export function createFacebookJsonObject(facebookData) {
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
      tag: [],
      variable: [],
    },
  };

  if (facebookData.selected) {
    const facebookVariables = createFacebookVariables(
      facebookData.events,
      facebookData.conversionId
    );
    jsonObj.containerVersion.variable.push(...facebookVariables);

    const facebookTags = createFacebookTags(facebookData.events);
    jsonObj.containerVersion.tag.push(...facebookTags);
  }

  return jsonObj;
}
