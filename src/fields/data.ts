import { getToday } from "@react-simple/react-simple-util";
import {
	ArrayFieldType, BooleanFieldType, DateFieldType, FieldType, FieldTypes, FileFieldType, NumberFieldType, ObjectFieldType, TextFieldType
} from "./types";
import { REACT_SIMPLE_VALIDATION } from "data";
import {
	ArrayFieldValidationRules, BooleanFieldValidationRules, DateFieldValidationRules, FieldValidationRule, FileFieldValidationRules,
	NumberFieldValidationRules, ObjectFieldValidationRules, TextFieldValidationRules
} from "rules/types";

function getDefaultRules(): FieldValidationRule[] {
	return [{
		ruleType: "required",
		required: REACT_SIMPLE_VALIDATION.FIELD_DEFAULTS.validation.defaultRules.required
	}];
}

export const FIELD_TYPES: {
	readonly text: (rules?: TextFieldValidationRules[]) => TextFieldType;
	readonly number: (rules?: NumberFieldValidationRules[]) => NumberFieldType;
	readonly boolean: (rules?: BooleanFieldValidationRules[]) => BooleanFieldType;
	readonly date: (rules?: DateFieldValidationRules[]) => DateFieldType;
	readonly file: (rules?: FileFieldValidationRules[]) => FileFieldType;
	readonly object: (objectFieldTypes: FieldTypes, rules?: ObjectFieldValidationRules[]) => ObjectFieldType;
	readonly array: (itemFieldType: FieldType, rules?: ArrayFieldValidationRules[]) => ArrayFieldType;
} = {
	text: rules => ({
		type: "text",
		baseType: "text",
		baseValue: "",
		rules: rules || getDefaultRules() as TextFieldValidationRules[]
	}),

	number: rules => ({
		type: "number",
		baseType: "number",
		baseValue: 0,
		rules: rules || getDefaultRules() as NumberFieldValidationRules[]
	}),

	boolean: rules => ({
		type: "boolean",
		baseType: "boolean",
		baseValue: false,
		rules: rules || getDefaultRules() as BooleanFieldValidationRules[]
	}),

	date: rules => ({
		type: "date",
		baseType: "date",
		baseValue: getToday(),
		rules: rules || getDefaultRules() as DateFieldValidationRules[]
	}),

	file: rules => ({
		type: "file",
		baseType: "file",
		baseValue: new File([], ""),
		rules: rules || getDefaultRules() as FileFieldValidationRules[]
	}),

	object: (objectFieldTypes, rules) => ({
		type: "object",
		baseType: "object",
		baseValue: {},
		rules: rules || getDefaultRules() as ObjectFieldValidationRules[],
		objectFieldTypes
	}),

	array: (itemFieldType, rules) => ({
		type: "array",
		baseType: "array",
		baseValue: [],
		rules: rules || getDefaultRules() as ArrayFieldValidationRules[],
		itemFieldType
	})
};
