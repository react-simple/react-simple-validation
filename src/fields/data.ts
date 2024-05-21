import { getToday } from "@react-simple/react-simple-util";
import {
	AnyFieldType, ArrayFieldType, BooleanFieldType, DateFieldType, FieldType, FieldTypes, FileFieldType, NumberFieldType, ObjectFieldType,
	TextFieldType
} from "./types";
import {
	AnyFieldValidationRules, ArrayFieldValidationRules, BooleanFieldValidationRules, DateFieldValidationRules, FieldValidationRule,
	FileFieldValidationRules, NumberFieldValidationRules, ObjectFieldValidationRules, TextFieldValidationRules
} from "rules/types";
import { RULES } from "rules/data";

const DEFAULT_RULES: FieldValidationRule[] = [
	RULES.required()
];

// it's actually FIELD_TYPES
export const FIELDS: {
	readonly any: (rules?: AnyFieldValidationRules[], refName?: string) => AnyFieldType;
	readonly text: (rules?: TextFieldValidationRules[], refName?: string) => TextFieldType;
	readonly number: (rules?: NumberFieldValidationRules[], refName?: string) => NumberFieldType;
	readonly boolean: (rules?: BooleanFieldValidationRules[], refName?: string) => BooleanFieldType;
	readonly date: (rules?: DateFieldValidationRules[], refName?: string) => DateFieldType;
	readonly file: (rules?: FileFieldValidationRules[], refName?: string) => FileFieldType;
	readonly object: <Schema extends FieldTypes>(schema: Schema, rules?: ObjectFieldValidationRules[], refName?: string) => ObjectFieldType<Schema>;
	readonly array: (itemFieldType: FieldType, rules?: ArrayFieldValidationRules[], refName?: string) => ArrayFieldType;
} = {
	any: (rules, refName) => ({
		type: "any",
		baseType: "any",
		baseValue: "",
		rules: rules || DEFAULT_RULES as TextFieldValidationRules[],
		refName
	}),

	text: (rules, refName) => ({
		type: "text",
		baseType: "text",
		baseValue: "",
		rules: rules || DEFAULT_RULES as TextFieldValidationRules[],
		refName
	}),

	number: (rules, refName) => ({
		type: "number",
		baseType: "number",
		baseValue: 0,
		rules: rules || DEFAULT_RULES as NumberFieldValidationRules[],
		refName
	}),

	boolean: (rules, refName) => ({
		type: "boolean",
		baseType: "boolean",
		baseValue: false,
		rules: rules || DEFAULT_RULES as BooleanFieldValidationRules[],
		refName
	}),

	date: (rules, refName) => ({
		type: "date",
		baseType: "date",
		baseValue: getToday(),
		rules: rules || DEFAULT_RULES as DateFieldValidationRules[],
		refName
	}),

	file: (rules, refName) => ({
		type: "file",
		baseType: "file",
		baseValue: new File([], ""),
		rules: rules || DEFAULT_RULES as FileFieldValidationRules[],
		refName
	}),

	object: (schema, rules, refName) => ({
		type: "object",
		baseType: "object",
		baseValue: {},
		rules: rules || DEFAULT_RULES as ObjectFieldValidationRules[],
		schema,
		refName
	}),

	array: (itemFieldType, rules, refName) => ({
		type: "array",
		baseType: "array",
		baseValue: [],
		rules: rules || DEFAULT_RULES as ArrayFieldValidationRules[],
		itemType: itemFieldType,
		refName
	})
};
