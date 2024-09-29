import {
  createFacebookTags,
  createFacebookTriggers,
  createFacebookVariables,
} from "@/lib/utils";
import { scriptUniqueEventId } from "../../lib/eventScripts";

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
      variable: [
        {
          accountId: "4701696234",
          containerId: "11615571",
          variableId: "179",
          name: "Unique Event ID",
          type: "cvt_11615571_178",
          fingerprint: "1715852091288",
          formatValue: {},
        },
      ],
      tag: [],
      trigger: [],
      customTemplate: [],
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

  const { triggersList, triggerIdMap } = createFacebookTriggers(
    facebookData.events,
    facebookData.triggers
  );
  jsonObj.containerVersion.trigger.push(...triggersList);

  console.log(
    `Nombre total de triggers créés: ${jsonObj.containerVersion.trigger.length}`
  );

  const facebookTags = createFacebookTags(
    facebookData.events,
    facebookData.parameters,
    facebookData.pixelId,
    triggerIdMap
  );
  jsonObj.containerVersion.tag.push(...facebookTags);

  console.log(
    `Nombre total de tags créés: ${jsonObj.containerVersion.tag.length}`
  );

  jsonObj.containerVersion.customTemplate.push(scriptUniqueEventId);

  return jsonObj;
}
