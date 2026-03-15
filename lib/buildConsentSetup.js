import { CONSENT_TEMPLATE } from "./consentTemplate";
import { ACCOUNT_ID, CONTAINER_ID } from "./gtmContainer";

// GTM built-in "Consent Initialization - All Pages"
const CONSENT_INIT_TRIGGER_ID = "2147479572";

const randomId = () => `${Math.floor(Math.random() * 90000) + 10000}`;
const fp = () => Date.now().toString();

/**
 * Builds the complete Didomi consent setup for GTM export.
 * @param {object} opts
 * @param {boolean} opts.includeDidomiTag - Whether to include the Didomi CMP HTML tag
 * @param {string}  opts.didomiScript     - The HTML content of the Didomi CMP tag
 * @param {string}  opts.tagPrefix        - Prefix for tag names
 * @param {string}  opts.tagSuffix        - Suffix for tag names
 * @returns {{ tags, triggers, variables, customTemplate }}
 */
export const buildConsentSetup = ({
  includeDidomiTag,
  didomiScript,
  tagPrefix,
  tagSuffix,
}) => {
  const didomiConsentTriggerId = randomId();
  const allEventsBlockingTriggerId = randomId();

  // ── Variables ──────────────────────────────────────────────────────────────

  const variables = [
    {
      accountId: ACCOUNT_ID,
      containerId: CONTAINER_ID,
      variableId: randomId(),
      name: "Cookie - didomi_token",
      type: "k",
      parameter: [
        { type: "BOOLEAN", key: "decodeCookie", value: "true" },
        { type: "TEMPLATE", key: "name", value: "didomi_token" },
      ],
      fingerprint: fp(),
      formatValue: {},
    },
    {
      accountId: ACCOUNT_ID,
      containerId: CONTAINER_ID,
      variableId: randomId(),
      name: "JS - Parsed didomi_token",
      type: "jsm",
      parameter: [
        {
          type: "TEMPLATE",
          key: "javascript",
          value:
            "function() {\nvar encodedValue = {{Cookie - didomi_token}};\nif (!encodedValue) return;\n\nvar decodedValue = atob(encodedValue);\nvar parsedValue = JSON.parse(decodedValue);\n  return parsedValue;\n}",
        },
      ],
      fingerprint: fp(),
      formatValue: {},
    },
    {
      accountId: ACCOUNT_ID,
      containerId: CONTAINER_ID,
      variableId: randomId(),
      name: "JS - Didomi - ad_* consent",
      type: "jsm",
      parameter: [
        {
          type: "TEMPLATE",
          key: "javascript",
          value:
            "function() {\n  var didomi = {{JS - Parsed didomi_token}};\n  \n  if (!didomi) return 'denied';\n  \n  var vendors = didomi.vendors && didomi.vendors.enabled;\n  \n  if (!vendors) return 'denied';\n  \n  var hasVendor = vendors && vendors.includes('c:googleads-eT3rZxEY');\n  \n  return hasVendor ? 'granted' : 'denied';\n}",
        },
      ],
      fingerprint: fp(),
      formatValue: {},
    },
    {
      accountId: ACCOUNT_ID,
      containerId: CONTAINER_ID,
      variableId: randomId(),
      name: "JS - Didomi - Analytics consent",
      type: "jsm",
      parameter: [
        {
          type: "TEMPLATE",
          key: "javascript",
          value:
            "function() {\n  var didomi = {{JS - Parsed didomi_token}};\n  \n  if (!didomi) return 'denied';\n  \n  var vendors = didomi.vendors && didomi.vendors.enabled;\n  \n  if (!vendors) return 'denied';\n  \n  var hasVendor = vendors && vendors.includes('c:googleana-4TXnJigR');\n  \n  return hasVendor ? 'granted' : 'denied';\n}",
        },
      ],
      fingerprint: fp(),
      formatValue: {},
    },
    {
      accountId: ACCOUNT_ID,
      containerId: CONTAINER_ID,
      variableId: randomId(),
      name: "JS - Didomi - enabled vendors",
      type: "jsm",
      parameter: [
        {
          type: "TEMPLATE",
          key: "javascript",
          value:
            "function() {\n  var didomi = {{JS - Parsed didomi_token}};\n  \n  if (!didomi) return;\n  \n  if (didomi.vendors && didomi.vendors.enabled) {\n    return JSON.stringify(didomi.vendors.enabled);\n  }\n  \n  return;\n}",
        },
      ],
      fingerprint: fp(),
      formatValue: {},
    },
    {
      accountId: ACCOUNT_ID,
      containerId: CONTAINER_ID,
      variableId: randomId(),
      name: "JS - is didomi consented",
      type: "jsm",
      parameter: [
        {
          type: "TEMPLATE",
          key: "javascript",
          value:
            "function() {\n  var didomi = {{JS - Parsed didomi_token}};\n  if (!didomi) return;\n  \n  return !!didomi.purposes;\n}",
        },
      ],
      fingerprint: fp(),
      formatValue: {},
    },
  ];

  // ── Triggers ───────────────────────────────────────────────────────────────

  const triggers = [
    {
      accountId: ACCOUNT_ID,
      containerId: CONTAINER_ID,
      triggerId: didomiConsentTriggerId,
      name: "CE - didomi-consent",
      type: "CUSTOM_EVENT",
      customEventFilter: [
        {
          type: "EQUALS",
          parameter: [
            { type: "TEMPLATE", key: "arg0", value: "{{_event}}" },
            { type: "TEMPLATE", key: "arg1", value: "didomi-consent" },
          ],
        },
      ],
      fingerprint: fp(),
    },
    {
      accountId: ACCOUNT_ID,
      containerId: CONTAINER_ID,
      triggerId: allEventsBlockingTriggerId,
      name: "CE - All events - without consent",
      type: "CUSTOM_EVENT",
      customEventFilter: [
        {
          type: "MATCH_REGEX",
          parameter: [
            { type: "TEMPLATE", key: "arg0", value: "{{_event}}" },
            { type: "TEMPLATE", key: "arg1", value: ".*" },
          ],
        },
      ],
      filter: [
        {
          type: "EQUALS",
          parameter: [
            {
              type: "TEMPLATE",
              key: "arg0",
              value: "{{JS - is didomi consented}}",
            },
            { type: "TEMPLATE", key: "arg1", value: "true" },
            { type: "BOOLEAN", key: "negate", value: "true" },
          ],
        },
      ],
      fingerprint: fp(),
    },
  ];

  // ── Tags ───────────────────────────────────────────────────────────────────

  const tags = [];

  if (includeDidomiTag) {
    tags.push({
      accountId: ACCOUNT_ID,
      containerId: CONTAINER_ID,
      tagId: randomId(),
      name: `${tagPrefix}Didomi CMP - custom${tagSuffix}`,
      type: "html",
      parameter: [
        { type: "TEMPLATE", key: "html", value: didomiScript },
        { type: "BOOLEAN", key: "supportDocumentWrite", value: "false" },
      ],
      fingerprint: fp(),
      firingTriggerId: [CONSENT_INIT_TRIGGER_ID],
      tagFiringOption: "ONCE_PER_EVENT",
      monitoringMetadata: { type: "MAP" },
      consentSettings: { consentStatus: "NOT_SET" },
    });
  }

  tags.push(
    {
      accountId: ACCOUNT_ID,
      containerId: CONTAINER_ID,
      tagId: randomId(),
      name: `${tagPrefix}Consent mode - default${tagSuffix}`,
      type: "cvt_K8GSG",
      parameter: [
        { type: "BOOLEAN", key: "eea", value: "false" },
        { type: "TEMPLATE", key: "wait_for_update", value: "0" },
        { type: "TEMPLATE", key: "regions", value: "all" },
        { type: "BOOLEAN", key: "sendDataLayer", value: "false" },
        { type: "TEMPLATE", key: "command", value: "default" },
        { type: "TEMPLATE", key: "functionality_storage", value: "granted" },
        { type: "BOOLEAN", key: "url_passthrough", value: "false" },
        {
          type: "TEMPLATE",
          key: "ad_storage",
          value: "{{JS - Didomi - ad_* consent}}",
        },
        { type: "BOOLEAN", key: "ads_data_redaction", value: "false" },
        { type: "BOOLEAN", key: "platform_microsoft", value: "false" },
        {
          type: "TEMPLATE",
          key: "ad_user_data",
          value: "{{JS - Didomi - ad_* consent}}",
        },
        { type: "TEMPLATE", key: "security_storage", value: "granted" },
        { type: "TEMPLATE", key: "personalization_storage", value: "granted" },
        {
          type: "TEMPLATE",
          key: "analytics_storage",
          value: "{{JS - Didomi - Analytics consent}}",
        },
        {
          type: "TEMPLATE",
          key: "ad_personalization",
          value: "{{JS - Didomi - ad_* consent}}",
        },
      ],
      fingerprint: fp(),
      firingTriggerId: [CONSENT_INIT_TRIGGER_ID],
      tagFiringOption: "ONCE_PER_EVENT",
      monitoringMetadata: { type: "MAP" },
      consentSettings: { consentStatus: "NOT_SET" },
    },
    {
      accountId: ACCOUNT_ID,
      containerId: CONTAINER_ID,
      tagId: randomId(),
      name: `${tagPrefix}Consent mode - update${tagSuffix}`,
      type: "cvt_K8GSG",
      parameter: [
        {
          type: "TEMPLATE",
          key: "ad_storage",
          value: "{{JS - Didomi - ad_* consent}}",
        },
        { type: "BOOLEAN", key: "ads_data_redaction", value: "false" },
        { type: "BOOLEAN", key: "sendDataLayer", value: "false" },
        { type: "BOOLEAN", key: "platform_microsoft", value: "false" },
        {
          type: "TEMPLATE",
          key: "ad_user_data",
          value: "{{JS - Didomi - ad_* consent}}",
        },
        { type: "TEMPLATE", key: "security_storage", value: "granted" },
        { type: "TEMPLATE", key: "command", value: "update" },
        { type: "TEMPLATE", key: "functionality_storage", value: "granted" },
        { type: "TEMPLATE", key: "personalization_storage", value: "granted" },
        { type: "BOOLEAN", key: "url_passthrough", value: "false" },
        {
          type: "TEMPLATE",
          key: "analytics_storage",
          value: "{{JS - Didomi - Analytics consent}}",
        },
        {
          type: "TEMPLATE",
          key: "ad_personalization",
          value: "{{JS - Didomi - ad_* consent}}",
        },
      ],
      fingerprint: fp(),
      firingTriggerId: [didomiConsentTriggerId],
      blockingTriggerId: [allEventsBlockingTriggerId],
      tagFiringOption: "ONCE_PER_EVENT",
      monitoringMetadata: { type: "MAP" },
      consentSettings: { consentStatus: "NOT_SET" },
    },
  );

  // ── Custom Template ────────────────────────────────────────────────────────

  const customTemplate = {
    accountId: ACCOUNT_ID,
    containerId: CONTAINER_ID,
    templateId: randomId(),
    name: "Consent Mode (Google + Microsoft tags)",
    fingerprint: fp(),
    templateData: CONSENT_TEMPLATE,
    galleryReference: {
      host: "github.com",
      owner: "gtm-templates-simo-ahava",
      repository: "consent-mode",
      version: "8dea5c367947d07b21b71105ef9960c5125a9137",
      signature:
        "6504471a6fc804a0acbd2b43473cfb58917e37ac00141260bd8cc690be0ead53",
      galleryTemplateId: "K8GSG",
    },
  };

  return { tags, triggers, variables, customTemplate };
};
