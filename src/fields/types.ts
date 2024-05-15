import {
	ArrayFieldValidationRules, BooleanFieldValidationRules, DateFieldValidationRules, FieldValidationRule, FileFieldValidationRules,
	NumberFieldValidationRules, ObjectFieldValidationRules, TextFieldValidationRules
} from "rules";

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

export interface TextFieldType extends FieldTypeBase<string, TextFieldValidationRules> {
	readonly type: "text";
	readonly baseType: "text";
}

export interface NumberFieldType extends FieldTypeBase<number, NumberFieldValidationRules> {
	readonly type: "number";
	readonly baseType: "number";
}

export interface BooleanFieldType extends FieldTypeBase<boolean, BooleanFieldValidationRules> {
	readonly type: "boolean";
	readonly baseType: "boolean";
}

export interface DateFieldType extends FieldTypeBase<Date, DateFieldValidationRules> {
	readonly type: "date";
	readonly baseType: "date";
}

export interface FileFieldType extends FieldTypeBase<File, FileFieldValidationRules> {
	readonly type: "file";
	readonly baseType: "file";
}

// embedded objects to be validated
export interface ObjectFieldType extends FieldTypeBase<unknown, ObjectFieldValidationRules> {
	readonly type: "object";
	readonly baseType: "object";
	readonly objectFieldTypes: FieldTypes; // to validate child members
	readonly name?: string; // named value in the validated object tree which can be referred to by using the '@name' format in "field-reference" rules
}

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

export type FieldTypes<Obj = unknown> = {
	[name in keyof Obj]: FieldType;
};
