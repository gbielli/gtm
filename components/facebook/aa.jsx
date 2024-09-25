const createDLVVariable = (paramValue) => {
  return {
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
  };
};

let hasProductListPath = false;
let idPath = "";

Object.entries(events).forEach(([eventType, isSelected]) => {
  if (isSelected && facebookEvent[eventType]) {
    console.log(`Traitement de l'événement: ${eventType}`);

    Object.entries(facebookEvent[eventType]).forEach(
      ([paramName, paramConfig]) => {
        const paramValue = parameters[eventType]?.[paramName];

        if (paramValue) {
          if (paramName === "idPath") {
            idPath = paramValue;
          } else if (!createdParams.has(paramValue)) {
            console.log(
              `Création de variable pour ${paramName}: ${paramValue}`
            );

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
