export const toArrayKeys = (keyData) => {
  const newKeys =
    typeof keyData === "string"
      ? [keyData]
      : keyData === undefined
      ? []
      : keyData;
  return newKeys;
};
