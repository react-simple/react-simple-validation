import { TextFieldValidationRules } from "rules";
import { FieldTypeBase, TextFieldTypeBase } from "./types";
import { REACT_SIMPLE_VALIDATION } from "data";

// Custom text field types

export interface ShortTextFieldType extends TextFieldTypeBase {
	readonly type: "text-short";
}

REACT_SIMPLE_VALIDATION.DEFAULT_RULES.text["text-short"] = [
	{ ruleType: "required" },
	{ ruleType: "text-length-max", maxLength: 50 }
];

export interface LongTextFieldType extends TextFieldTypeBase {
	readonly type: "text-long";
}

REACT_SIMPLE_VALIDATION.DEFAULT_RULES.text["text-long"] = [
	{ ruleType: "required" },
	{ ruleType: "text-length-max", maxLength: 500 }
];

export interface NotesTextFieldType extends TextFieldTypeBase {
	readonly type: "text-notes";
}

REACT_SIMPLE_VALIDATION.DEFAULT_RULES.text["text-notes"] = [
	{ ruleType: "required" },
	{ ruleType: "text-length-max", maxLength: 3000 }
];

export interface TelTextFieldType extends FieldTypeBase<string, TextFieldValidationRules> {
	readonly type: "text-tel";
}

REACT_SIMPLE_VALIDATION.DEFAULT_RULES.text["text-tel"] = [
	{ ruleType: "required" },
	{ ruleType: "text-length-max", maxLength: 20 },
	{ ruleType: "text-match", regExp: /^[\(\d+][\(\)-\d]*$/ }
];

export interface EmailTextFieldType extends FieldTypeBase<string, TextFieldValidationRules> {
	readonly type: "text-email";
}

REACT_SIMPLE_VALIDATION.DEFAULT_RULES.text["text-email"] = [
	{ ruleType: "required" },
	{ ruleType: "text-length-max", maxLength: 50 },
	{ ruleType: "text-match", regExp: /^\w.+@\w.+\.\w+$/ }
];
