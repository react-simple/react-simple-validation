import { getToday } from "@react-simple/react-simple-util";
import {
	AnyFieldType, ArrayFieldType, BooleanFieldType, DateFieldType, FieldType, FieldTypeBase, FieldTypes, FileFieldType, NumberFieldType,
	ObjectFieldType, TextFieldType
} from "./types/types";
import {
	AnyFieldValidationRules, ArrayFieldValidationRules, BooleanFieldValidationRules, DateFieldValidationRules, FieldValidationRule, FileFieldValidationRules,
	NumberFieldValidationRules, ObjectFieldValidationRules, TextFieldValidationRules
} from "rules/types";
import { REACT_SIMPLE_VALIDATION } from "data";
import { EmailTextFieldType, LongTextFieldType, NotesTextFieldType, ShortTextFieldType, TelTextFieldType } from "./types";
import { PercentNumberFieldType } from "./types/custom.number";

// Specified rules will overwrite default rules by using 'ruleType'. 
// Default rules should only contain basic rules (required, max value, max length, regex etc.)
const getUniqueRules = <Rule extends FieldValidationRule>(defaultRules: Rule[], rules?: Rule[]) => {
	return rules
		? [...defaultRules.filter(t => !rules.some(t2 => t.ruleType === t2.ruleType)), ...rules]
		: defaultRules;
};

export type FieldTypeInitOptions<ValueType> = Pick<FieldTypeBase<ValueType, any>, "refName" | "defaultValue">;

// Factory methods for field types. Will automatically pick up default rules from REACT_SIMPLE_VALIDATION.DEFAULT_RULES.
export const FIELDS: {
	// base
	readonly any: (rules?: AnyFieldValidationRules[], options?: FieldTypeInitOptions<any>) => AnyFieldType;
	readonly text: (rules?: TextFieldValidationRules[], options?: FieldTypeInitOptions<string>) => TextFieldType;
	readonly number: (rules?: NumberFieldValidationRules[], options?: FieldTypeInitOptions<number>) => NumberFieldType;
	readonly boolean: (rules?: BooleanFieldValidationRules[], options?: FieldTypeInitOptions<boolean>) => BooleanFieldType;
	readonly date: (rules?: DateFieldValidationRules[], options?: FieldTypeInitOptions<Date>) => DateFieldType;
	readonly file: (rules?: FileFieldValidationRules[], options?: FieldTypeInitOptions<File>) => FileFieldType;
	
	readonly object: <Schema extends FieldTypes>(
		schema: Schema,
		rules?: ObjectFieldValidationRules[],
		options?: FieldTypeInitOptions<object>
	) => ObjectFieldType<Schema>;

	readonly array: (
		itemFieldType: FieldType,
		rules?: ArrayFieldValidationRules[],
		options?: FieldTypeInitOptions<unknown[]>
	) => ArrayFieldType;

	// custom
	readonly textShort: (rules?: TextFieldValidationRules[], options?: FieldTypeInitOptions<string>) => ShortTextFieldType;
	readonly textLong: (rules?: TextFieldValidationRules[], options?: FieldTypeInitOptions<string>) => LongTextFieldType;
	readonly textNotes: (rules?: TextFieldValidationRules[], options?: FieldTypeInitOptions<string>) => NotesTextFieldType;
	readonly textTel: (rules?: TextFieldValidationRules[], options?: FieldTypeInitOptions<string>) => TelTextFieldType;
	readonly textEmail: (rules?: TextFieldValidationRules[], options?: FieldTypeInitOptions<string>) => EmailTextFieldType;

	readonly numberPercent: (rules?: NumberFieldValidationRules[], options?: FieldTypeInitOptions<number>) => PercentNumberFieldType;
} = {
	// base
	any: (rules, options) => ({
		type: "any",
		baseType: "any",
		baseValue: "",
		rules: getUniqueRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.any.any, rules),
		...options
	}),

	text: (rules, options) => ({
		type: "text",
		baseType: "text",
		baseValue: "",
		rules: getUniqueRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.text.text, rules),
		...options
	}),

	number: (rules, options) => ({
		type: "number",
		baseType: "number",
		baseValue: 0,
		rules: getUniqueRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.number.number, rules),
		...options
	}),

	boolean: (rules, options) => ({
		type: "boolean",
		baseType: "boolean",
		baseValue: false,
		rules: getUniqueRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.boolean.boolean, rules),
		...options
	}),

	date: (rules, options) => ({
		type: "date",
		baseType: "date",
		baseValue: getToday(),
		rules: getUniqueRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.date.date, rules),
		...options
	}),

	file: (rules, options) => ({
		type: "file",
		baseType: "file",
		baseValue: new File([], ""),
		rules: getUniqueRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.file.file, rules),
		...options
	}),

	object: (schema, rules, options) => ({
		type: "object",
		baseType: "object",
		baseValue: {},
		rules: getUniqueRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.object.object, rules),
		schema,
		...options
	}),

	array: (itemFieldType, rules, options) => ({
		type: "array",
		baseType: "array",
		baseValue: [],
		rules: getUniqueRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.array.array, rules),
		itemType: itemFieldType,
		...options
	}),

	// custom
	textShort: (rules, options) => ({
		type: "text-short",
		baseType: "text",
		baseValue: "",
		rules: getUniqueRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.text["text-short"], rules),
		...options
	}),

	textLong: (rules, options) => ({
		type: "text-long",
		baseType: "text",
		baseValue: "",
		rules: getUniqueRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.text["text-long"], rules),
		...options
	}),

	textNotes: (rules, options) => ({
		type: "text-notes",
		baseType: "text",
		baseValue: "",
		rules: getUniqueRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.text["text-notes"], rules),
		...options
	}),

	textTel:
		(rules, options) => ({
			type: "text-tel",
			baseType: "text",
			baseValue: "",
			rules: getUniqueRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.text["text-tel"], rules),
			...options
		}),

	textEmail: (rules, options) => ({
		type: "text-email",
		baseType: "text",
		baseValue: "",
		rules: getUniqueRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.text["text-email"], rules),
		...options
	}),

	numberPercent: (rules, options) => ({
		type: "number-percent",
		baseType: "number",
		baseValue: 0,
		rules: getUniqueRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.number["number-percent"], rules),
		...options
	})
};
