import { ValueOrCallback, getToday } from "@react-simple/react-simple-util";
import {
	AnyFieldType, ArrayFieldType, BaseFieldType, BooleanFieldType, DateFieldType, FieldType, FieldTypeBase, FieldTypes, FileFieldType, NumberFieldType,
	ObjectFieldType, TextFieldType
} from "./types/types";
import {
	AnyFieldValidationRules, ArrayFieldValidationRules, BooleanFieldValidationRules, DateFieldValidationRules, FieldValidationRule, FileFieldValidationRules,
	NumberFieldValidationRules, ObjectFieldValidationRules, TextFieldValidationRules
} from "rules/types";
import { REACT_SIMPLE_VALIDATION } from "data";
import { EmailTextFieldType, LongTextFieldType, NotesTextFieldType, ShortTextFieldType, TelTextFieldType } from "./types";
import { PercentNumberFieldType } from "./types/custom.number";
import { RULES } from "rules/data";

// this is the 'empty' value, the default value is always undefined
export const BASE_FIELD_TYPE_EMPTY_VALUES: Record<BaseFieldType, ValueOrCallback<unknown>> = {
	any: {},
	text: "",
	number: 0,
	boolean: false,
	date: () => new Date(),
	file: new File([], ""),
	array: [],
	object: {}
};

// Specified rules will overwrite default rules by using 'ruleType'. 
// Default rules should only contain basic rules (required, max value, max length, regex etc.)
const getResolvedRules = <Rule extends FieldValidationRule>(
	defaultRules: Rule[],
	rules: Rule[] | undefined,
	required: boolean | undefined 
) => {
	if (required !== false) {
		const result = rules
			? [...defaultRules.filter(t => !rules.some(t2 => t.ruleType === t2.ruleType)), ...rules]
			: defaultRules;
	
		if (!result.some(t => t.ruleType === "required")) {
			result.push(RULES.required() as Rule);
		}

		return result;
	}
	else {
		return rules
			? [
				...defaultRules.filter(t => t.ruleType !== "required" && !rules.some(t2 => t.ruleType === t2.ruleType)),
				...rules.filter(t => t.ruleType !== "required")
			]
			: defaultRules.filter(t => t.ruleType !== "required");
	}
};

export type FieldTypeInitOptions<ValueType> = Pick<FieldTypeBase<ValueType, any>, "refName" | "defaultValue"> & {
	readonly required?: boolean;
};

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
		rules: getResolvedRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.any.any, rules, options?.required),
		...options
	}),

	text: (rules, options) => ({
		type: "text",
		baseType: "text",
		rules: getResolvedRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.text.text, rules, options?.required),
		...options
	}),

	number: (rules, options) => ({
		type: "number",
		baseType: "number",
		rules: getResolvedRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.number.number, rules, options?.required),
		...options
	}),

	boolean: (rules, options) => ({
		type: "boolean",
		baseType: "boolean",
		rules: getResolvedRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.boolean.boolean, rules, options?.required),
		...options
	}),

	date: (rules, options) => ({
		type: "date",
		baseType: "date",
		rules: getResolvedRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.date.date, rules, options?.required),
		...options
	}),

	file: (rules, options) => ({
		type: "file",
		baseType: "file",
		rules: getResolvedRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.file.file, rules, options?.required),
		...options
	}),

	object: (schema, rules, options) => ({
		type: "object",
		baseType: "object",
		rules: getResolvedRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.object.object, rules, options?.required),
		schema,
		...options
	}),

	array: (itemFieldType, rules, options) => ({
		type: "array",
		baseType: "array",
		rules: getResolvedRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.array.array, rules, options?.required),
		itemType: itemFieldType,
		...options
	}),

	// custom
	textShort: (rules, options) => ({
		type: "text-short",
		baseType: "text",
		rules: getResolvedRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.text["text-short"], rules, options?.required),
		...options
	}),

	textLong: (rules, options) => ({
		type: "text-long",
		baseType: "text",
		rules: getResolvedRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.text["text-long"], rules, options?.required),
		...options
	}),

	textNotes: (rules, options) => ({
		type: "text-notes",
		baseType: "text",
		rules: getResolvedRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.text["text-notes"], rules, options?.required),
		...options
	}),

	textTel:
		(rules, options) => ({
			type: "text-tel",
			baseType: "text",
			rules: getResolvedRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.text["text-tel"], rules, options?.required),
			...options
		}),

	textEmail: (rules, options) => ({
		type: "text-email",
		baseType: "text",
		rules: getResolvedRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.text["text-email"], rules, options?.required),
		...options
	}),

	numberPercent: (rules, options) => ({
		type: "number-percent",
		baseType: "number",
		rules: getResolvedRules(REACT_SIMPLE_VALIDATION.DEFAULT_RULES.number["number-percent"], rules, options?.required),
		...options
	})
};
