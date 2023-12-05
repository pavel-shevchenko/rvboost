export const wrapValidate =
  (validateFunc: (data: { [key: string]: any }) => { [key: string]: any }) =>
  (data: { [key: string]: any }) => {
    Object.keys(data).map((prop) => {
      if (typeof data[prop] === 'undefined' || data[prop] === null)
        data[prop] = '';
    });

    const validateRes = validateFunc(data);
    Object.keys(validateRes).map((prop) => {
      if (typeof data[prop] === 'undefined' || data[prop] === null)
        delete validateRes[prop];
    });

    return validateRes;
  };
