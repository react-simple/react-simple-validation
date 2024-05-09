import { FieldType, FieldTypes } from "fields";
import { FieldValidationRule } from "rules";

export interface FieldRuleValidationResult {
	rule: FieldValidationRule;
	isChecked: boolean; // certain rules work for certain field types only; if incompatible it's isValid but !isChecked
	isValid: boolean;

	message?: string; // custom message
	regExpMatch?: RegExpMatchArray;
}

export interface FieldValidationResult<TFieldType extends FieldType = FieldType, Value = unknown> {
	fieldType: TFieldType;
	fieldValue: Value;
	isValid: boolean;

	ruleValidationResult: FieldRuleValidationResult[]; // valid and non-valid too
	objectValidationResult?: ObjectValidationResult; // if baseType is 'object'
	arrayValidationResult?: FieldValidationResult[]; // if baseType is 'array'
}

export interface ObjectValidationResult<TypeObj = unknown, ValueObj = unknown> {
	fieldTypes: FieldTypes<TypeObj>;
	fieldValues: ValueObj;
	isValid: boolean;
	validationResult: { [name in keyof TypeObj]: FieldValidationResult }; // all evaluated rules
	errors: { [name in keyof TypeObj]: FieldValidationResult }; // failed rules only
}
