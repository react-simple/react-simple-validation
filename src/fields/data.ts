import { getToday } from "@react-simple/react-simple-util";
import {
	ArrayFieldType, BooleanFieldType, DateFieldType, FieldType, FieldTypes, FileFieldType, NumberFieldType, ObjectFieldType, TextFieldType
} from "./types";
import {
	ArrayFieldValidationRules, BooleanFieldValidationRules, DateFieldValidationRules, FieldValidationRule, FileFieldValidationRules,
	NumberFieldValidationRules, ObjectFieldValidationRules, TextFieldValidationRules
} from "rules/types";
import { RULES } from "rules/data";

const DEFAULT_RULES: FieldValidationRule[] = [
	RULES.required()
];

// it's actually FIELD_TYPES
export const FIELDS: {
	readonly text: (rules?: TextFieldValidationRules[]) => TextFieldType;
	readonly number: (rules?: NumberFieldValidationRules[]) => NumberFieldType;
	readonly boolean: (rules?: BooleanFieldValidationRules[]) => BooleanFieldType;
	readonly date: (rules?: DateFieldValidationRules[]) => DateFieldType;
	readonly file: (rules?: FileFieldValidationRules[]) => FileFieldType;
	readonly object: (objectFieldTypes: FieldTypes, rules?: ObjectFieldValidationRules[], refName?: string) => ObjectFieldType;
	readonly array: (itemFieldType: FieldType, rules?: ArrayFieldValidationRules[]) => ArrayFieldType;
} = {
	text: rules => ({
		type: "text",
		baseType: "text",
		baseValue: "",
		rules: rules || DEFAULT_RULES as TextFieldValidationRules[]
	}),

	number: rules => ({
		type: "number",
		baseType: "number",
		baseValue: 0,
		rules: rules || DEFAULT_RULES as NumberFieldValidationRules[]
	}),

	boolean: rules => ({
		type: "boolean",
		baseType: "boolean",
		baseValue: false,
		rules: rules || DEFAULT_RULES as BooleanFieldValidationRules[]
	}),

	date: rules => ({
		type: "date",
		baseType: "date",
		baseValue: getToday(),
		rules: rules || DEFAULT_RULES as DateFieldValidationRules[]
	}),

	file: rules => ({
		type: "file",
		baseType: "file",
		baseValue: new File([], ""),
		rules: rules || DEFAULT_RULES as FileFieldValidationRules[]
	}),

	object: (objectFieldTypes, rules, refName) => ({
		type: "object",
		baseType: "object",
		baseValue: {},
		rules: rules || DEFAULT_RULES as ObjectFieldValidationRules[],
		objectFieldTypes,
		refName
	}),

	array: (itemFieldType, rules) => ({
		type: "array",
		baseType: "array",
		baseValue: [],
		rules: rules || DEFAULT_RULES as ArrayFieldValidationRules[],
		itemFieldType
	})
};
