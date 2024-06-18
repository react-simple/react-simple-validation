import {
	AnyFieldValidationRules, ArrayFieldValidationRules, BooleanFieldValidationRules, DateFieldValidationRules, FieldValidationRule, FileFieldValidationRules,
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

export interface FieldTypeBase<ValueType, RulesType extends FieldValidationRule> {
	readonly type: string;
	readonly baseType: BaseFieldType;
	readonly rules?: RulesType[];
	readonly refName?: string; // named value, can be referred to by using '@refName' in "field-reference" rules
	readonly defaultValue?: ValueType;
}

export interface AnyFieldTypeBase extends FieldTypeBase<string, AnyFieldValidationRules> {
	readonly baseType: "any";
}

export interface AnyFieldType extends AnyFieldTypeBase {
	readonly type: "any";
}

export interface TextFieldTypeBase extends FieldTypeBase<string, TextFieldValidationRules> {
	readonly baseType: "text";
}

export interface TextFieldType extends TextFieldTypeBase {
	readonly type: "text";
}

export interface NumberFieldTypeBase extends FieldTypeBase<number, NumberFieldValidationRules> {
	readonly baseType: "number";
}

export interface NumberFieldType extends NumberFieldTypeBase {
	readonly type: "number";
}

export interface BooleanFieldTypeBase extends FieldTypeBase<boolean, BooleanFieldValidationRules> {
	readonly baseType: "boolean";
}

export interface BooleanFieldType extends BooleanFieldTypeBase {
	readonly type: "boolean";
}

export interface DateFieldTypeBase extends FieldTypeBase<Date, DateFieldValidationRules> {
	readonly baseType: "date";
}

export interface DateFieldType extends DateFieldTypeBase {
	readonly type: "date";
}

export interface FileFieldTypeBase extends FieldTypeBase<File, FileFieldValidationRules> {
	readonly baseType: "file";
}

export interface FileFieldType extends FileFieldTypeBase {
	readonly type: "file";
}

// embedded objects to be validated
export interface ObjectFieldTypeBase<Schema extends FieldTypes = FieldTypes> extends FieldTypeBase<unknown, ObjectFieldValidationRules> {
	readonly baseType: "object";
	readonly schema: FieldTypes<Schema>; // to validate child members
}

// embedded objects to be validated
export interface ObjectFieldType<Schema extends FieldTypes = FieldTypes> extends ObjectFieldTypeBase<Schema> {
	readonly type: "object";
}

// array of embedded values to be validated
export interface ArrayFieldTypeBase extends FieldTypeBase<unknown[], ArrayFieldValidationRules> {
	readonly baseType: "array";
	readonly itemType: FieldType; // to validate child members of array items	
}

// array of embedded values to be validated
export interface ArrayFieldType extends ArrayFieldTypeBase {
	readonly type: "array";
}

export type FieldType =
	| AnyFieldTypeBase
	| TextFieldTypeBase
	| NumberFieldTypeBase
	| BooleanFieldTypeBase
	| DateFieldTypeBase
	| FileFieldTypeBase
	| ObjectFieldTypeBase
	| ArrayFieldTypeBase;

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
