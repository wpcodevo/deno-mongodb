const omitFields = (obj: any, ...props: string[]) => {
  const result = { ...obj };
  props.forEach(function (prop) {
    delete result[prop];
  });
  return result;
};

export default omitFields;
