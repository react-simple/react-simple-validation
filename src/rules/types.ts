import { ContentType, DatePart, ValueBinaryOperator, ValueOrArray } from "@react-simple/react-simple-util";
import { BaseFieldType, Field, FieldType  } from "fields";
import { FieldRuleValidationResult, FieldValidationContext } from "validation/types";

// no negative rules!
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
	["text-match"]: "text-match", // only for 'text'

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

	// array
	["array-length-min"]: "array-length-min",
	["array-length-max"]: "array-length-max",
	["array-length-range"]: "array-length-range",
	["array-length"]: "array-length",
	["array-include-some"]: "array-include-some",
	["array-include-all"]: "array-include-all",
	["array-include-none"]: "array-include-none",
	["array-match-some"]: "array-match-some",
	["array-match-all"]: "array-match-all",
	["array-item-index"]: "array-item-index",
	["array-item-index-min"]: "array-item-index-min",
	["array-item-index-max"]: "array-item-index-min",
	["array-item-index-range"]: "array-item-index-min",

	// rule collection, operators
	["some-rules-valid"]: "some-rules-valid", // at least one rule must be valid
	["all-rules-valid"]: "all-rules-valid", // all rules must be valid

	// conditions
	["if-then-else"]: "if-then-else", // conditional validation
	["switch"]: "switch",  // conditional validation
	["compare"]: "compare", // compare field value with another field, use various operators

	// references
	["field-reference"]: "field-reference"	
};

export type FieldValidationRuleType = keyof typeof FIELD_VALIDATION_RULE_TYPES;

export interface FieldValidationRuleBase {
	readonly ruleType: FieldValidationRuleType;
	readonly message?: string;
}

export interface FieldTypeRule extends FieldValidationRuleBase {
	readonly ruleType: "type";
	readonly valueType: BaseFieldType;
}

export interface FieldRequiredRule extends FieldValidationRuleBase {
	readonly ruleType: "required";
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
	readonly expectedLength: ValueOrArray<number>;
}

export interface FieldTextLengthRangeRule extends FieldValidationRuleBase {
	readonly ruleType: "text-length-range";
	readonly minLength: number;
	readonly maxLength: number;
}

export interface FieldTextValueRule extends FieldValidationRuleBase {
	readonly ruleType: "text-value";
	readonly expectedValue: ValueOrArray<string>;
	readonly ignoreCase?: boolean;
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
	readonly expectedValue: ValueOrArray<number>;
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
	readonly expectedValue: ValueOrArray<Date>;
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

export interface FieldTextMatchRule extends FieldValidationRuleBase {
	readonly ruleType: "text-match";
	readonly regExp: ValueOrArray<RegExp>;
}

export interface FieldFileMaxSizeRule extends FieldValidationRuleBase {
	readonly ruleType: "file-size-max";
	readonly maxFileSize: number; // bytes
}

export interface FieldFileContentTypeRule extends FieldValidationRuleBase {
	readonly ruleType: "file-contenttype";
	readonly allowedContentTypes: ValueOrArray<ContentType>;
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
	readonly expectedLength: ValueOrArray<number>;
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
	readonly item: ValueOrArray<unknown>;
	readonly filter?: FieldValidationRule; // inspect only matching items
}

export interface FieldArrayIncludeAllRule extends FieldValidationRuleBase {
	readonly ruleType: "array-include-all";
	readonly item: ValueOrArray<unknown>;
	readonly filter?: FieldValidationRule; // inspect only matching items
}

export interface FieldArrayIncludeNoneRule extends FieldValidationRuleBase {
	readonly ruleType: "array-include-none";
	readonly item: ValueOrArray<unknown>;
	readonly filter?: FieldValidationRule; // inspect only matching items
}

export interface FieldArrayMatchSomeRule extends FieldValidationRuleBase {
	readonly ruleType: "array-match-some";
	readonly predicate: FieldValidationRule;
	readonly filter?: FieldValidationRule; // inspect only matching items
}

export interface FieldArrayMatchAllRule extends FieldValidationRuleBase {
	readonly ruleType: "array-match-all";
	readonly predicate: FieldValidationRule;
	readonly filter?: FieldValidationRule; // inspect only matching items
}

export interface FieldCustomValidationRule extends FieldValidationRuleBase {
	readonly ruleType: "custom";
	readonly validate: (
		field: Field,
		context: FieldValidationContext,
		validateField: (fieldType: FieldType) => Omit<FieldRuleValidationResult, "rule"> // call built-in validation
	) => Omit<FieldRuleValidationResult, "rule">;
}

export interface SomeRulesValidRule extends FieldValidationRuleBase {
	readonly ruleType: "some-rules-valid";
	readonly rules: FieldValidationRule[]; // some rules must be valid
}

export interface AllRulesValidRule extends FieldValidationRuleBase {
	readonly ruleType: "all-rules-valid";
	readonly rules: FieldValidationRule[]; // all rules must be valid
}

export interface ArrayItemIndexRule extends FieldValidationRuleBase {
	readonly ruleType: "array-item-index";
	readonly index: ValueOrArray<number>;
}

export interface ArrayItemIndexMinRule extends FieldValidationRuleBase {
	readonly ruleType: "array-item-index-min";
	readonly minIndex: number;
}

export interface ArrayItemIndexMaxRule extends FieldValidationRuleBase {
	readonly ruleType: "array-item-index-max";
	readonly maxIndex: number;
}

export interface ArrayItemIndexRangeRule extends FieldValidationRuleBase {
	readonly ruleType: "array-item-index-range";
	readonly minIndex: number;
	readonly maxIndex: number;
}

// if 'if' is valid then 'then' must be also valid (it's an implication)
// if 'if' is not valid then 'else' must be valid
export interface FieldIfThenElseConditionalRule extends FieldValidationRuleBase {
	readonly ruleType: "if-then-else";
	readonly if: FieldValidationRule;
	readonly then: ValueOrArray<FieldValidationRule>;
	readonly else?: ValueOrArray<FieldValidationRule>;
}

export interface FieldSwitchConditionalRule extends FieldValidationRuleBase {
	readonly ruleType: "switch";
	readonly cases: [string, FieldValidationRule, ValueOrArray<FieldValidationRule>][];
	readonly default?: ValueOrArray<FieldValidationRule>;
}

export interface FieldReferenceRule extends FieldValidationRuleBase {
	readonly ruleType: "field-reference";
	// path in the format of "fieldName.fieldName[index].fieldName"
	// can start with "/" to refer to the root validated object ("/fieldName.fieldName[index].fieldName")
	// can start with "@refName" to refer to a named parent value ("@partner.fieldName.fieldName[index].fieldName")
	readonly path: string;
	readonly rules: ValueOrArray<FieldValidationRule>;
}

export interface FieldComparisonConditionalRule extends FieldValidationRuleBase {
	readonly ruleType: "compare";
	readonly operator: ValueBinaryOperator;	
	
	// see 'field-reference' rule; right hand operand, the left hand operand is the field value
	readonly path: string; 

	// number to add to the right hand operand; number value or number of days, if date
	readonly addition?: number | { datePart: DatePart; value: number };

	readonly ignoreCase?: boolean;
}

export type CommonFieldValidationRules =
	| FieldRequiredRule
	| FieldCustomValidationRule;

export type OperatorValidationRules =
	| AllRulesValidRule
	| SomeRulesValidRule;

export type ConditionValidationRules =
	| FieldIfThenElseConditionalRule
	| FieldSwitchConditionalRule
	| FieldComparisonConditionalRule;

export type ReferenceValidationRules =
	| FieldReferenceRule;

export type CompositeValidationRules =
	| OperatorValidationRules
	| ConditionValidationRules
	| ReferenceValidationRules;

export type SimpleAnyFieldValidationRules =
	| CommonFieldValidationRules;

export type AnyFieldValidationRules = SimpleAnyFieldValidationRules | CompositeValidationRules;

export type SimpleTextFieldValidationRules =
	| CommonFieldValidationRules
	| FieldTextMinLengthRule
	| FieldTextMaxLengthRule
	| FieldTextLengthRule
	| FieldTextLengthRangeRule
	| FieldTextValueRule
	| FieldTextMatchRule;

export type TextFieldValidationRules = SimpleTextFieldValidationRules | CompositeValidationRules;	

export type SimpleNumberFieldValidationRules =
	| CommonFieldValidationRules
	| FieldNumberMinValueRule
	| FieldNumberMaxValueRule
	| FieldNumberValueRule
	| FieldNumberRangeRule;

export type NumberFieldValidationRules = SimpleNumberFieldValidationRules | CompositeValidationRules;

export type SimpleBooleanFieldValidationRules =
	| CommonFieldValidationRules
	| FieldBooleanValueRule;

export type BooleanFieldValidationRules = SimpleBooleanFieldValidationRules | CompositeValidationRules;

export type SimpleDateFieldValidationRules =
	| CommonFieldValidationRules
	| FieldDateMinValueRule
	| FieldDateMaxValueRule
	| FieldDateValueRule
	| FieldDateRangeRule;

export type DateFieldValidationRules = SimpleDateFieldValidationRules | CompositeValidationRules;

export type SimpleFileFieldValidationRules =
	| CommonFieldValidationRules
	| FieldFileMaxSizeRule
	| FieldFileContentTypeRule;

export type FileFieldValidationRules = SimpleFileFieldValidationRules | CompositeValidationRules;

export type SimpleObjectFieldValidationRules =
	| CommonFieldValidationRules;

export type ObjectFieldValidationRules = SimpleObjectFieldValidationRules | CompositeValidationRules;

export type SimpleArrayFieldValidationRules =
	| CommonFieldValidationRules
	| FieldArrayMinLengthRule
	| FieldArrayMaxLengthRule
	| FieldArrayLengthRule
	| FieldArrayLengthRangeRule
	| FieldArrayMatchAllRule
	| FieldArrayMatchSomeRule
	| FieldArrayIncludeSomeRule
	| FieldArrayIncludeAllRule
	| FieldArrayIncludeNoneRule
	| ArrayItemIndexRule
	| ArrayItemIndexMinRule
	| ArrayItemIndexMaxRule
	| ArrayItemIndexRangeRule;

export type ArrayFieldValidationRules = SimpleArrayFieldValidationRules | CompositeValidationRules;

export type FieldValidationRule =
	| FieldTypeRule
	| CommonFieldValidationRules
	| OperatorValidationRules 

	// types
	| TextFieldValidationRules
	| NumberFieldValidationRules
	| DateFieldValidationRules
	| BooleanFieldValidationRules
	| FileFieldValidationRules
	| ObjectFieldValidationRules
	| ArrayFieldValidationRules;
