import { ValidationError } from 'class-validator';
import {
  transformAndValidateSync,
  TransformValidationOptions
} from 'class-transformer-validator';

import { AnyClass, StringOrRetValsObject } from 'typing';

export const createDtoValidator = (
  model: AnyClass,
  options?: TransformValidationOptions
) => {
  return (data: any) => {
    try {
      transformAndValidateSync(model, data, options);

      return {};
    } catch (e: any) {
      return convertError(e as ValidationError[]);
    }
  };
};

function convertError(errors: ValidationError[]) {
  const result: StringOrRetValsObject = {};

  for (const error of Array.from(errors)) {
    const fieldName = error.property;
    const children = error?.children as ValidationError[];

    if (children?.length > 0) {
      result[fieldName] = convertError(children);
    } else {
      result[fieldName] = Object.values(error.constraints!)[0];
    }
  }

  return result;
}
