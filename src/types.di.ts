import { Field, FieldTypes } from "fields/types";
import { FieldValidationRule } from "rules/types";
import { FieldRuleValidationResult, FieldValidationContext, FieldValidationOptions, FieldValidationResult, ObjectValidationResult } from "validation/types";

export interface ReactSimpleValidationDependencyInjection {
  validateRule: (
    rule: FieldValidationRule,
    field: Field,
    context: FieldValidationContext,
    defaultImpl: ReactSimpleValidationDependencyInjection["validateRule"]
  ) => FieldRuleValidationResult;

  validateField: (
    field: Field,
    context: FieldValidationContext,
    defaultImpl: ReactSimpleValidationDependencyInjection["validateField"]
  ) => FieldValidationResult;

  validateObject: <Schema extends FieldTypes, Obj extends object = object>(
    obj: Obj,
    schema: Schema,
    options: FieldValidationOptions,
    defaultImpl: ReactSimpleValidationDependencyInjection["validateObject"]
  ) => ObjectValidationResult<Schema>;
}
