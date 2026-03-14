const ACCOUNT_ID = "6247820543";
const CONTAINER_ID = "194603635";

const containerMeta = {
  path: `accounts/${ACCOUNT_ID}/containers/${CONTAINER_ID}`,
  accountId: ACCOUNT_ID,
  containerId: CONTAINER_ID,
  name: "GTM Export",
  publicId: "GTM-5BPKFTKF",
  usageContext: ["WEB"],
  fingerprint: "1726235913680",
  tagManagerUrl: `https://tagmanager.google.com/#/container/accounts/${ACCOUNT_ID}/containers/${CONTAINER_ID}/workspaces?apiLink=container`,
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
};

export const buildExport = (containerVersion) => ({
  exportFormatVersion: 2,
  exportTime: new Date().toISOString(),
  containerVersion: {
    path: `accounts/${ACCOUNT_ID}/containers/${CONTAINER_ID}/versions/2`,
    accountId: ACCOUNT_ID,
    containerId: CONTAINER_ID,
    containerVersionId: "2",
    name: "GTM Export",
    container: containerMeta,
    ...containerVersion,
  },
});

export { ACCOUNT_ID, CONTAINER_ID };
