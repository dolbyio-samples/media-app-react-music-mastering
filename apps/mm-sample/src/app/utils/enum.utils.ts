export const getEnumKey = (enumeration: any, val: any) => {
  return Object.keys(enumeration).find((k) => enumeration[k] === val)!;
};

export const getEnumValueAtIndex = (enumeration: any, index: number) => {
  return Object.values(enumeration)[index];
};

export const getEnumKeyAtIndex = (enumeration: any, index: number) => {
  const value = getEnumValueAtIndex(enumeration, index);
  return getEnumKey(enumeration, value);
};
