import {
	FieldCustomValidationRule, FieldExpectedBooleanValueRule, FieldExpectedDateValueRule, FieldExpectedNumberValueRule, FieldExpectedTextValueRule,
	FieldFileContentTypeRule, FieldFileExtensionRule, FieldMaxDateValueRule, FieldMaxFileSizeRule, FieldMaxNumberValueRule,
	FieldMaxTextLengthRule, FieldMinDateValueRule, FieldMinArrayLengthRule, FieldMinNumberValueRule, FieldMinTextLengthRule,
	FieldRegExpRule, FieldRequiredRule, FieldValidationRule, FieldFileContentAndExtensionTypeRule
} from "rules/types";

export const BASE_FIELD_TYPES = {
	text: "text",
	number: "number",
	boolean: "boolean",
	date: "date",
	file: "file",
	array: "array",
	object: "object"
};

export type BaseFieldType = keyof typeof BASE_FIELD_TYPES;

export interface FieldTypeBase<ValueType, Rule extends FieldValidationRule> {
	readonly type: string;
	readonly baseType: BaseFieldType;
	readonly baseValue: ValueType; // this is the 'empty' value, the default value is always undefined
	readonly rules: Rule[];
}

export type TextFieldValidationRules =
	| FieldRequiredRule
	| FieldCustomValidationRule
	| FieldMinTextLengthRule
	| FieldMaxTextLengthRule
	| FieldExpectedTextValueRule
	| FieldRegExpRule;

export interface TextFieldType extends FieldTypeBase<string, TextFieldValidationRules> {
	readonly type: "text";
	readonly baseType: "text";
}

export type NumberFieldValidationRules =
	| FieldRequiredRule
	| FieldCustomValidationRule
	| FieldMinNumberValueRule
	| FieldMaxNumberValueRule
	| FieldExpectedNumberValueRule;

export interface NumberFieldType extends FieldTypeBase<number, NumberFieldValidationRules> {
	readonly type: "number";
	readonly baseType: "number";
}

export type BooleanFieldValidationRules =
	| FieldRequiredRule
	| FieldCustomValidationRule
	| FieldExpectedBooleanValueRule;

export interface BooleanFieldType extends FieldTypeBase<boolean, BooleanFieldValidationRules> {
	readonly type: "boolean";
	readonly baseType: "boolean";
}

export type DateFieldValidationRules =
	| FieldRequiredRule
	| FieldCustomValidationRule
	| FieldMinDateValueRule
	| FieldMaxDateValueRule
	| FieldExpectedDateValueRule;

export interface DateFieldType extends FieldTypeBase<Date, DateFieldValidationRules> {
	readonly type: "date";
	readonly baseType: "date";
}

export type FileFieldValidationRules =
	| FieldRequiredRule
	| FieldCustomValidationRule
	| FieldMaxFileSizeRule
	| FieldFileContentTypeRule
	| FieldFileExtensionRule
	| FieldFileContentAndExtensionTypeRule;

export interface FileFieldType extends FieldTypeBase<File, FileFieldValidationRules> {
	readonly type: "file";
	readonly baseType: "file";
}

export type ObjectFieldValidationRules =
	| FieldRequiredRule
	| FieldCustomValidationRule;

// embedded objects to be validated
export interface ObjectFieldType extends FieldTypeBase<unknown, ObjectFieldValidationRules> {
	readonly type: "object";
	readonly baseType: "object";
	readonly objectFieldTypes: FieldTypes; // to validate child members
}

export type ArrayFieldValidationRules =
	| FieldRequiredRule
	| FieldCustomValidationRule
	| FieldMinArrayLengthRule
	| FieldMaxDateValueRule;

// array of embedded values to be validated
export interface ArrayFieldType extends FieldTypeBase<unknown[], ArrayFieldValidationRules> {
	readonly type: "array";
	readonly baseType: "array";
	readonly itemFieldType: FieldType; // to validate child members of array items
}

export type FieldType =
	| TextFieldType
	| NumberFieldType
	| BooleanFieldType
	| DateFieldType
	| FileFieldType
	| ObjectFieldType
	| ArrayFieldType;

export interface FieldTypes {
	[name: string]: FieldType
}

export interface FieldValues {
	[name: string]: unknown
}
