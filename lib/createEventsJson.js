export const jsonObj = (gtmTriggers) => {
  return {
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
      trigger: gtmTriggers,
    },
  };
};
