import { ContentType } from "@react-simple/react-simple-util";
import { BaseFieldType, FieldType } from "fields";

export const FIELD_VALIDATION_RULE_TYPES = {
	type: "type", // this rule is automatically validated based on fieldType.baseType
	required: "required",
	custom: "custom",

	// text
	["text-length-min"]: "text-length-min",
	["text-length-max"]: "text-length-max",
	["text-length-range"]: "text-length-range",
	["text-length"]: "text-length", // exact length
	["text-value"]: "text-value", // exact value or values
	["text-regexp"]: "text-regexp", // only for 'text'

	// number
	["number-min"]: "number-min",
	["number-max"]: "number-max",
	["number-range"]: "number-range",
	["number-value"]: "number-value",

	// date
	["date-min"]: "date-min",
	["date-max"]: "date-max",
	["date-range"]: "date-range",
	["date-value"]: "date-value",

	// boolean
	["boolean-value"]: "boolen-value",

	// file
	["file-size-max"]: "file-size-max",
	["file-contenttype"]: "file-contenttype",
	["file-extension"]: "file-extension",
	["file-contenttype-extension"]: "file-contenttype-extension",

	// array
	["array-length-min"]: "array-length-min",
	["array-length-max"]: "array-length-max",
	["array-length-range"]: "array-length-range",
	["array-length"]: "array-length",
	["array-include-some"]: "array-include-some",
	["array-include-all"]: "array-include-all",
	["array-include-none"]: "array-include-none",
	["array-predicate-some"]: "array-predicate-some",
	["array-predicate-all"]: "array-predicate-all",
	["array-predicate-none"]: "array-predicate-none",

	// rule collection, operators
	["some-rules-valid"]: "some-rules-valid", // at least one rule must be valid
	["all-rules-valid"]: "all-rules-valid", // all rules must be valid
	["no-rules-valid"]: "no-rules-valid" // none of the rules should be valid
};

export type FieldValidationRuleType = keyof typeof FIELD_VALIDATION_RULE_TYPES;

export interface FieldValidationRuleBase {
	readonly ruleType: FieldValidationRuleType;
	readonly message?: string;
	readonly expectFailure?: boolean;  // the rule is valid if it fails
}

export interface FieldTypeRule extends FieldValidationRuleBase {
	readonly ruleType: "type";
	readonly valueType: BaseFieldType;
}

export interface FieldRequiredRule extends FieldValidationRuleBase {
	readonly ruleType: "required";
	readonly required: boolean;
}

export interface FieldTextMinLengthRule extends FieldValidationRuleBase {
	readonly ruleType: "text-length-min";
	readonly minLength: number;
}

export interface FieldTextMaxLengthRule extends FieldValidationRuleBase {
	readonly ruleType: "text-length-max";
	readonly maxLength: number;
}

export interface FieldTextLengthRule extends FieldValidationRuleBase {
	readonly ruleType: "text-length";
	readonly expectedLength: number | number[];
}

export interface FieldTextLengthRangeRule extends FieldValidationRuleBase {
	readonly ruleType: "text-length-range";
	readonly minLength: number;
	readonly maxLength: number;
}

export interface FieldTextValueRule extends FieldValidationRuleBase {
	readonly ruleType: "text-value";
	readonly expectedValue: string | string[];
	readonly caseInsensitive?: boolean;
}

export interface FieldNumberMinValueRule extends FieldValidationRuleBase {
	readonly ruleType: "number-min";
	readonly minValue: number;
	readonly mustBeGreater?: boolean; // by default great-or-equal is checked
}

export interface FieldNumberMaxValueRule extends FieldValidationRuleBase {
	readonly ruleType: "number-max";
	readonly maxValue: number;
	readonly mustBeLess?: boolean; // by default less-or-equal is checked
}

export interface FieldNumberValueRule extends FieldValidationRuleBase {
	readonly ruleType: "number-value";
	readonly expectedValue: number | number[];
}

export interface FieldNumberRangeRule extends FieldValidationRuleBase {
	readonly ruleType: "number-range";
	readonly minValue: number;
	readonly mustBeGreater?: boolean; // by default great-or-equal is checked
	readonly maxValue: number;
	readonly mustBeLess?: boolean; // by default less-or-equal is checked
}

export interface FieldDateMinValueRule extends FieldValidationRuleBase {
	readonly ruleType: "date-min";
	readonly minDate: Date;
	readonly mustBeGreater?: boolean; // by default great-or-equal is checked
}

export interface FieldDateMaxValueRule extends FieldValidationRuleBase {
	readonly ruleType: "date-max";
	readonly maxDate: Date;
	readonly mustBeLess?: boolean; // by default less-or-equal is checked
}

export interface FieldDateValueRule extends FieldValidationRuleBase {
	readonly ruleType: "date-value";
	readonly expectedValue: Date | Date[];
}

export interface FieldDateRangeRule extends FieldValidationRuleBase {
	readonly ruleType: "date-range";
	readonly minDate: Date;
	readonly mustBeGreater?: boolean; // by default great-or-equal is checked
	readonly maxDate: Date;
	readonly mustBeLess?: boolean; // by default less-or-equal is checked
}

export interface FieldBooleanValueRule extends FieldValidationRuleBase {
	readonly ruleType: "boolean-value";
	readonly expectedValue: boolean;
}

export interface FieldTextRegExpRule extends FieldValidationRuleBase {
	readonly ruleType: "text-regexp";
	readonly regExp: RegExp | RegExp[];
}

export interface FieldFileMaxSizeRule extends FieldValidationRuleBase {
	readonly ruleType: "file-size-max";
	readonly maxFileSize: number; // bytes
}

export interface FieldFileContentTypeRule extends FieldValidationRuleBase {
	readonly ruleType: "file-contenttype";
	readonly allowedContentTypes: string[] | ContentType[];
}

export interface FieldFileExtensionRule extends FieldValidationRuleBase {
	readonly ruleType: "file-extension";
	readonly allowedExtensions: string[];
}

export interface FieldFileContentTypeAndExtensionRule extends FieldValidationRuleBase {
	readonly ruleType: "file-contenttype-extension";
	readonly allowedContentTypes: ContentType[];
}

export interface FieldArrayMinLengthRule extends FieldValidationRuleBase {
	readonly ruleType: "array-length-min";
	readonly minLength: number;
	readonly filter?: FieldValidationRule; // count only matching items
}

export interface FieldArrayMaxLengthRule extends FieldValidationRuleBase {
	readonly ruleType: "array-length-max";
	readonly maxLength: number;
	readonly filter?: FieldValidationRule; // count only matching items
}

export interface FieldArrayLengthRule extends FieldValidationRuleBase {
	readonly ruleType: "array-length";
	readonly expectedLength: number | number[];
	readonly filter?: FieldValidationRule; // count only matching items
}

export interface FieldArrayLengthRangeRule extends FieldValidationRuleBase {
	readonly ruleType: "array-length-range";
	readonly minLength: number;
	readonly maxLength: number;
	readonly filter?: FieldValidationRule; // count only matching items
}

export interface FieldArrayIncludeSomeRule extends FieldValidationRuleBase {
	readonly ruleType: "array-include-some";
	readonly item: unknown | unknown[];
	readonly filter?: FieldValidationRule; // inspect only matching items
}

export interface FieldArrayIncludeAllRule extends FieldValidationRuleBase {
	readonly ruleType: "array-include-all";
	readonly item: unknown | unknown[];
	readonly filter?: FieldValidationRule; // inspect only matching items
}

export interface FieldArrayIncludeNoneRule extends FieldValidationRuleBase {
	readonly ruleType: "array-include-none";
	readonly item: unknown | unknown[];
	readonly filter?: FieldValidationRule; // inspect only matching items
}

export interface FieldArrayPredicateSomeRule extends FieldValidationRuleBase {
	readonly ruleType: "array-predicate-some";
	readonly predicate: FieldValidationRule;
}

export interface FieldArrayPredicateAllRule extends FieldValidationRuleBase {
	readonly ruleType: "array-predicate-all";
	readonly predicate: FieldValidationRule;
}

export interface FieldArrayPredicateNoneRule extends FieldValidationRuleBase {
	readonly ruleType: "array-predicate-none";
	readonly predicate: FieldValidationRule;
}

export interface FieldCustomValidationRule extends FieldValidationRuleBase {
	readonly ruleType: "custom";
	readonly validate: (fieldValue: unknown, fieldType: FieldType) => boolean;
}

export interface FieldSomeRulesValidRule extends FieldValidationRuleBase {
	readonly ruleType: "some-rules-valid";
	readonly rules: FieldValidationRule[]; // some rules must be valid
}

export interface FieldAllRulesValidRule extends FieldValidationRuleBase {
	readonly ruleType: "all-rules-valid";
	readonly rules: FieldValidationRule[]; // all rules must be valid
}

export interface FieldNoRulesValidRule extends FieldValidationRuleBase {
	readonly ruleType: "no-rules-valid";
	readonly rules: FieldValidationRule[]; // no rules should be valid
}

export type TextFieldValidationRules =
	| FieldRequiredRule
	| FieldCustomValidationRule
	| FieldTextMinLengthRule
	| FieldTextMaxLengthRule
	| FieldTextLengthRule
	| FieldTextLengthRangeRule
	| FieldTextValueRule
	| FieldTextRegExpRule;

export type NumberFieldValidationRules =
	| FieldRequiredRule
	| FieldCustomValidationRule
	| FieldNumberMinValueRule
	| FieldNumberMaxValueRule
	| FieldNumberValueRule
	| FieldNumberRangeRule;

export type BooleanFieldValidationRules =
	| FieldRequiredRule
	| FieldCustomValidationRule
	| FieldBooleanValueRule;

export type DateFieldValidationRules =
	| FieldRequiredRule
	| FieldCustomValidationRule
	| FieldDateMinValueRule
	| FieldDateMaxValueRule
	| FieldDateValueRule
	| FieldDateRangeRule;

export type FileFieldValidationRules =
	| FieldRequiredRule
	| FieldCustomValidationRule
	| FieldFileMaxSizeRule
	| FieldFileContentTypeRule
	| FieldFileExtensionRule
	| FieldFileContentTypeAndExtensionRule;

export type ObjectFieldValidationRules =
	| FieldRequiredRule
	| FieldCustomValidationRule;

export type ArrayFieldValidationRules =
	| FieldRequiredRule
	| FieldCustomValidationRule
	| FieldArrayMinLengthRule
	| FieldArrayMaxLengthRule
	| FieldArrayLengthRule
	| FieldArrayLengthRangeRule
	| FieldArrayPredicateAllRule
	| FieldArrayPredicateSomeRule
	| FieldArrayPredicateNoneRule
	| FieldArrayIncludeSomeRule
	| FieldArrayIncludeAllRule
	| FieldArrayIncludeNoneRule;

export type FieldValidationRule =
	| FieldTypeRule
	| FieldAllRulesValidRule
	| FieldSomeRulesValidRule
	| FieldNoRulesValidRule

	// types
	| TextFieldValidationRules
	| NumberFieldValidationRules
	| DateFieldValidationRules
	| BooleanFieldValidationRules
	| FileFieldValidationRules
	| ObjectFieldValidationRules
	| ArrayFieldValidationRules;
