import { ChildMemberInfo } from "@react-simple/react-simple-mapping";
import { ValueOrArray } from "@react-simple/react-simple-util";
import { Field, FieldType, FieldTypes, ObjectFieldType } from "fields/types";
import { FieldValidationRule } from "rules/types";
import {
  FieldRuleValidationErrors, FieldRuleValidationResult, FieldValidationContext, FieldValidationOptions, FieldValidationResult,
  ObjectValidationResult
} from "validation/types";

export interface ReactSimpleValidationDependencyInjection {
  fields: {
    getChildFieldTypeByName: (
      fieldType: FieldType,
      name: string,
      defaultImpl: ReactSimpleValidationDependencyInjection["fields"]["getChildFieldTypeByName"]
    ) => FieldType | undefined;

    getChildFieldTypeInfoByFullQualifiedName: (
      fieldType: FieldType,
      fullQualifiedName: string,
      createMissingChildObjects: boolean,
      defaultImpl: ReactSimpleValidationDependencyInjection["fields"]["getChildFieldTypeInfoByFullQualifiedName"]
    ) => ChildMemberInfo<FieldType, FieldType> | undefined;

    getChildFieldTypeByFullQualifiedName: (
      fieldType: FieldType,
      fullQualifiedName: string,
      defaultImpl: ReactSimpleValidationDependencyInjection["fields"]["getChildFieldTypeByFullQualifiedName"]
    ) => FieldType | undefined;
  };

  validation: {
    validateRule: (
      rule: FieldValidationRule,
      field: Field,
      context: FieldValidationContext,
      defaultImpl: ReactSimpleValidationDependencyInjection["validation"]["validateRule"]
    ) => FieldRuleValidationResult;

    validateField: (
      field: Field,
      context: FieldValidationContext,
      previousResult: FieldValidationResult | undefined,
      defaultImpl: ReactSimpleValidationDependencyInjection["validation"]["validateField"]
    ) => FieldValidationResult;

    validateObject: <Schema extends FieldTypes, Obj extends object = object>(
      obj: Obj,
      schema: Schema | ObjectFieldType<Schema>,
      options: FieldValidationOptions,
      defaultImpl: ReactSimpleValidationDependencyInjection["validation"]["validateObject"]
    ) => ObjectValidationResult<Schema>;
  };

  validationResult: {
    getChildValidationResult: (
      result: ObjectValidationResult | FieldValidationResult | FieldRuleValidationResult,
      fullQualifiedName: string,
      defaultImpl: ReactSimpleValidationDependencyInjection["validationResult"]["getChildValidationResult"]
    ) => FieldValidationResult | undefined;

    getFieldRuleValidationErrorMessage: (
      result: Pick<FieldRuleValidationResult, "message" | "rule">,
      cultureId: string | undefined,
      defaultImpl: ReactSimpleValidationDependencyInjection["validationResult"]["getFieldRuleValidationErrorMessage"]
    ) => string;

    getFieldRuleValidationErrorMessages: (
      result: ValueOrArray<FieldRuleValidationResult>,
      cultureId: string | undefined,
      defaultImpl: ReactSimpleValidationDependencyInjection["validationResult"]["getFieldRuleValidationErrorMessages"]
    ) => string[];

    getFieldValidationErrorMessages: (
      result: ValueOrArray<FieldValidationResult>,
      cultureId: string | undefined,
      defaultImpl: ReactSimpleValidationDependencyInjection["validationResult"]["getFieldValidationErrorMessages"]
    ) => FieldRuleValidationErrors;

    getObjectValidationErrorMessages: (
      result: ValueOrArray<ObjectValidationResult>,
      cultureId: string | undefined,
      defaultImpl: ReactSimpleValidationDependencyInjection["validationResult"]["getObjectValidationErrorMessages"]
    ) => FieldRuleValidationErrors;
  };
}
