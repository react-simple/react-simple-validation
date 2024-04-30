import {
	RequiredRule, MaxLengthRule, MinLengthRule, RegExpRule, ValidationRule, MinNumberValueRule, MaxNumberValueRule,
	MinDateValueRule, MaxDateValueRule, MinSizeRule, MaxSizeRule, ContentTypeRule, CustomRule
} from "rules/types";

export const BASE_FIELD_TYPES = {
	text: "text",
	number: "number",
	boolean: "boolean",
	date: "date",
	file: "file",
	object: "object",
	custom: "custom"
};

export type BaseFieldType = keyof typeof BASE_FIELD_TYPES;

export interface FieldTypeBase<ValueType, Rule extends ValidationRule> {
	readonly type: string;
	readonly baseType: BaseFieldType;
	readonly isArray: boolean;
	readonly baseValue: ValueType; // this is the 'empty' value, the default value is always undefined
	readonly rules: Rule[];
}

export interface TextFieldType extends FieldTypeBase<string, RequiredRule | MinLengthRule | MaxLengthRule | RegExpRule | CustomRule> {
	readonly type: "text";
	readonly baseType: "text";
}

export interface TextArrayFieldType extends FieldTypeBase<string[], RequiredRule | MinLengthRule | MaxLengthRule | RegExpRule | CustomRule> {
	readonly type: "text-array";
	readonly baseType: "text";
}

export interface NumberFieldType extends FieldTypeBase<number, RequiredRule | MinNumberValueRule | MaxNumberValueRule | CustomRule> {
	readonly type: "number";
	readonly baseType: "number";
}

export interface NumberArrayFieldType extends FieldTypeBase<number[], RequiredRule | MinNumberValueRule | MaxNumberValueRule | CustomRule> {
	readonly type: "number-array";
	readonly baseType: "number";
}

export interface BooleanFieldType extends FieldTypeBase<boolean, RequiredRule | CustomRule> {
	readonly type: "boolean";
	readonly baseType: "boolean";
}

export interface BooleanArrayFieldType extends FieldTypeBase<boolean[], RequiredRule | CustomRule> {
	readonly type: "boolean-array";
	readonly baseType: "boolean";
}

export interface DateFieldType extends FieldTypeBase<Date, RequiredRule | MinDateValueRule | MaxDateValueRule | CustomRule> {
	readonly type: "date";
	readonly baseType: "date";
}

export interface DateArrayFieldType extends FieldTypeBase<Date[], RequiredRule | MinDateValueRule | MaxDateValueRule | CustomRule> {
	readonly type: "date-array";
	readonly baseType: "date";
}

export interface FileFieldType extends FieldTypeBase<File, RequiredRule | MinSizeRule | MaxSizeRule | ContentTypeRule | CustomRule> {
	readonly type: "file";
	readonly baseType: "file";
}

export interface FileArrayFieldType extends FieldTypeBase<File[], RequiredRule | MinSizeRule | MaxSizeRule | ContentTypeRule | CustomRule> {
	readonly type: "file-array";
	readonly baseType: "file";
}

export interface FieldSet {
	readonly fieldDefs: { [name: string]: FieldType };
	readonly fieldValues: { [name: string]: unknown };
}

// embedded objects to be validated
export interface FieldSetFieldType extends FieldTypeBase<unknown, RequiredRule | CustomRule> {
	readonly type: "fieldset";
	readonly baseType: "object";
	readonly fieldDefs: { [name: string]: FieldType }; // to validate child members
}

// array of embedded objects to be validated
export interface FieldSetArrayFieldType extends FieldTypeBase<unknown[], RequiredRule | CustomRule> {
	readonly type: "fieldset-array";
	readonly baseType: "object";
	readonly fieldDefs: { [name: string]: FieldType }; // to validate child members of array items
}

export type FieldType =
	| TextFieldType
	| TextArrayFieldType
	| NumberFieldType
	| NumberArrayFieldType
	| BooleanFieldType
	| BooleanArrayFieldType
	| DateFieldType
	| DateArrayFieldType
	| FileFieldType
	| FileArrayFieldType
	| FieldSetFieldType
	| FieldSetArrayFieldType;
