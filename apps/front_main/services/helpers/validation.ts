import { ValidationError } from 'class-validator';
import {
  transformAndValidateSync,
  TransformValidationOptions
} from 'class-transformer-validator';

import { AnyClass, StringOrRetValsObject } from 'typing/src/utils';
import { FieldData } from 'rc-field-form/es/interface';

export const createFormikValidator = (
  model: AnyClass,
  options?: TransformValidationOptions
) => {
  return (data: any) => {
    try {
      transformAndValidateSync(model, data, options);

      return {};
    } catch (e: any) {
      return convertErrorToFormik(e as ValidationError[]);
    }
  };
};

function convertErrorToFormik(errors: ValidationError[]) {
  const result: StringOrRetValsObject = {};

  for (const error of Array.from(errors)) {
    const fieldName = error.property;
    const children = error?.children as ValidationError[];

    if (children?.length > 0) {
      result[fieldName] = convertErrorToFormik(children);
    } else {
      result[fieldName] = Object.values(error.constraints!)[0];
    }
  }

  return result;
}

export const createFieldDataErrorsPopulate = (
  model: AnyClass,
  options?: TransformValidationOptions
) => {
  return (data: any, fds: FieldData[], onlyTouched = false) => {
    try {
      transformAndValidateSync(model, data, options);

      return getFieldDataWithoutErrors(fds);
    } catch (e: any) {
      return populateErrorsToFieldData(
        e as ValidationError[],
        getFieldDataWithoutErrors(fds),
        onlyTouched
      );
    }
  };
};

const getFieldDataWithoutErrors = (fds: FieldData[]) =>
  fds.map((fd) => {
    fd.errors = [];
    return fd;
  });

function populateErrorsToFieldData(
  errors: ValidationError[],
  fds: FieldData[],
  onlyTouched: boolean,
  path: Array<string | number> = []
) {
  for (const error of Array.from(errors)) {
    const fieldName = error.property;
    const newPath = [
      ...path,
      isNaN(Number(fieldName)) ? fieldName : parseInt(fieldName)
    ];
    const children = error?.children as ValidationError[];

    if (children?.length > 0) {
      fds = populateErrorsToFieldData(children, fds, onlyTouched, newPath);
    } else {
      fds = fds.map((fd) => {
        if (
          ((onlyTouched && fd.touched) || !onlyTouched) &&
          JSON.stringify(fd.name) == JSON.stringify(newPath)
        ) {
          fd.errors = [Object.values(error.constraints!)[0]];
        }
        return fd;
      });
    }
  }

  return fds;
}
