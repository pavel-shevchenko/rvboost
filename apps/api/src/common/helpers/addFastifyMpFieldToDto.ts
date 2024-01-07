import { AnyClass } from 'typing';

// @Todo: Made recursive for form nested data sets
export const addFastifyMultipartFieldToDto = (
  fieldname: string,
  value: any,
  dto: InstanceType<AnyClass>
) => {
  if (fieldname.endsWith('[]')) {
    const nameWoBraces = fieldname.slice(0, -2);
    if (!Array.isArray(dto[nameWoBraces])) dto[nameWoBraces] = [];
    dto[nameWoBraces].push(value);
  } else if (value === 'true' && fieldname in dto) {
    dto[fieldname] = true;
  } else {
    dto[fieldname] = value;
  }
};
