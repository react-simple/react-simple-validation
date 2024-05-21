import {
	ArrayFieldValidationRules, BooleanFieldValidationRules, DateFieldValidationRules, FieldValidationRule, FileFieldValidationRules,
	NumberFieldValidationRules, ObjectFieldValidationRules, TextFieldValidationRules
} from "rules";

export const BASE_FIELD_TYPES = {
	any: "any", // no type check
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
	readonly refName?: string; // named value, can be referred to by using '@refName' in "field-reference" rules
}

export interface AnyFieldType extends FieldTypeBase<string, TextFieldValidationRules> {
	readonly type: "any";
	readonly baseType: "any";
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
export interface ObjectFieldType<Schema extends FieldTypes = FieldTypes> extends FieldTypeBase<unknown, ObjectFieldValidationRules> {
	readonly type: "object";
	readonly baseType: "object";
	readonly schema: FieldTypes<Schema>; // to validate child members
}

// array of embedded values to be validated
export interface ArrayFieldType extends FieldTypeBase<unknown[], ArrayFieldValidationRules> {
	readonly type: "array";
	readonly baseType: "array";
	readonly itemType: FieldType; // to validate child members of array items	
}

export type FieldType =
	| AnyFieldType
	| TextFieldType
	| NumberFieldType
	| BooleanFieldType
	| DateFieldType
	| FileFieldType
	| ObjectFieldType
	| ArrayFieldType;

// Schema is not FieldType or value type, it's an object with the keys we need.
// Usually, those keys are coming from ObjectFieldType.schema.
export type FieldTypes<Schema extends FieldTypes = any> = {
	[name in keyof Schema]: FieldType;
};

export interface Field<TFieldType extends FieldType = FieldType, Value = unknown> {
	readonly value: Value;
	readonly type: TFieldType;
	readonly name: string;
	readonly fullQualifiedName: string;
}
