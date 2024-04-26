import {
	RequiredRule, MaxLengthRule, MinLengthRule, RegExpRule, ValidationRule, MinNumberValueRule, MaxNumberValueRule,
	MinDateValueRule, MaxDateValueRule, MinSizeRule, MaxSizeRule, ContentTypeRule
} from "rules/types";

export const BASE_FIELD_TYPES = {
	text: "text",
	number: "number",
	boolean: "boolean",
	date: "date",
	datetime: "datetime",
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
	readonly defaultRules: Rule[];
}

export interface TextFieldType extends FieldTypeBase<string, RequiredRule | MinLengthRule | MaxLengthRule | RegExpRule> {
	readonly type: "text";
	readonly baseType: "text";
}

export interface TextArrayFieldType extends FieldTypeBase<string[], RequiredRule | MinLengthRule | MaxLengthRule | RegExpRule> {
	readonly type: "text-array";
	readonly baseType: "text";
}

export interface NumberFieldType extends FieldTypeBase<number, RequiredRule | MinNumberValueRule | MaxNumberValueRule> {
	readonly type: "number";
	readonly baseType: "number";
}

export interface NumberArrayFieldType extends FieldTypeBase<number[], RequiredRule | MinNumberValueRule | MaxNumberValueRule> {
	readonly type: "number-array";
	readonly baseType: "number";
}

export interface BooleanFieldType extends FieldTypeBase<boolean, RequiredRule> {
	readonly type: "boolean";
	readonly baseType: "boolean";
}

export interface BooleanArrayFieldType extends FieldTypeBase<boolean[], RequiredRule> {
	readonly type: "boolean-array";
	readonly baseType: "boolean";
}

export interface DateFieldType extends FieldTypeBase<Date, RequiredRule | MinDateValueRule | MaxDateValueRule> {
	readonly type: "date";
	readonly baseType: "date";
}

export interface DateArrayFieldType extends FieldTypeBase<Date[], RequiredRule | MinDateValueRule | MaxDateValueRule> {
	readonly type: "date-array";
	readonly baseType: "date";
}

export interface DateTimeFieldType extends FieldTypeBase<Date, RequiredRule | MinDateValueRule | MaxDateValueRule> {
	readonly type: "datetime";
	readonly baseType: "datetime";
}

export interface DateTimeArrayFieldType extends FieldTypeBase<Date[], RequiredRule | MinDateValueRule | MaxDateValueRule> {
	readonly type: "datetime-array";
	readonly baseType: "datetime";
}

export interface FileFieldType extends FieldTypeBase<File, RequiredRule | MinSizeRule | MaxSizeRule | ContentTypeRule> {
	readonly type: "file";
	readonly baseType: "file";
}

export interface FileArrayFieldType extends FieldTypeBase<File[], RequiredRule | MinSizeRule | MaxSizeRule | ContentTypeRule> {
	readonly type: "file-array";
	readonly baseType: "file";
}

export interface ObjectFieldType extends FieldTypeBase<unknown, RequiredRule | MinSizeRule | MaxSizeRule | ContentTypeRule> {
	readonly type: "object";
	readonly baseType: "object";
}

export interface ObjectArrayFieldType extends FieldTypeBase<unknown[], RequiredRule | MinSizeRule | MaxSizeRule | ContentTypeRule> {
	readonly type: "object-array";
	readonly baseType: "object";
}

export interface CustomFieldType extends FieldTypeBase<unknown, RequiredRule | MinSizeRule | MaxSizeRule | ContentTypeRule> {
	readonly type: "custom";
	readonly baseType: "custom";
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
	| DateTimeFieldType
	| DateTimeArrayFieldType
	| FileFieldType
	| FileArrayFieldType
	| ObjectFieldType
	| ObjectArrayFieldType
	| CustomFieldType;
