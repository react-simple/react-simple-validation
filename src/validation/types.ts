import { FieldType, FieldTypes, FieldValues } from "fields";
import { FieldValidationRule } from "rules";

export interface FieldRuleValidationResult {
	rule: FieldValidationRule;
	isChecked: boolean; // certain rules work for certain field types only; if incompatible it's isValid but !isChecked
	isValid: boolean;

	message?: string; // custom message
	regExpMatch?: RegExpMatchArray;
}

export interface FieldValidationResult<Obj = unknown> {
	fieldType: FieldType;
	fieldValue: unknown;
	isValid: boolean;

	ruleValidationResult: FieldRuleValidationResult[]; // valid and non-valid too
	objectValidationResult?: ObjectValidationResult<Obj>; // if baseType is 'object'
	arrayValidationResult?: FieldValidationResult[]; // if baseType is 'array'
}

export interface ObjectValidationResult<Obj> {
	fieldTypes: FieldTypes;
	fieldValues: Obj;
	isValid: boolean;
	validationResult: Partial<{ [name in keyof Obj]: FieldValidationResult }>;
} 
