import { CULTURE_INFO, NumberFormatOptions, formatDateOrDateTime, formatNumber, isArray } from "@react-simple/react-simple-util";
import {
	AllRulesValidRule, FieldArrayIncludeAllRule, FieldArrayIncludeNoneRule, FieldArrayIncludeSomeRule, FieldArrayLengthRangeRule, FieldArrayLengthRule,
	FieldArrayMaxLengthRule, FieldArrayMinLengthRule, FieldArrayPredicateAllRule, FieldArrayPredicateNoneRule, FieldArrayPredicateSomeRule,
	FieldBooleanValueRule, FieldCustomValidationRule, FieldDateMaxValueRule, FieldDateMinValueRule, FieldDateRangeRule, FieldDateValueRule,
	FieldFileContentTypeRule, FieldFileMaxSizeRule, FieldNumberMaxValueRule, FieldNumberMinValueRule, FieldNumberRangeRule, FieldNumberValueRule,
	FieldRequiredRule, FieldTextLengthRangeRule, FieldTextLengthRule, FieldTextMaxLengthRule, FieldTextMinLengthRule, FieldTextRegExpRule,
	FieldTextValueRule, FieldTypeRule, NoRulesValidRule, RuleIsNotValidRule, RuleIsValidRule, SomeRulesValidRule
} from "./types";

const BLANK = {
	"all-rules-valid": (_: AllRulesValidRule) => "",
	"array-include-all": (_: FieldArrayIncludeAllRule) => "",
	"array-include-none": (_: FieldArrayIncludeNoneRule) => "",
	"array-include-some": (_: FieldArrayIncludeSomeRule) => "",
	"array-length": (_: FieldArrayLengthRule) => "",
	"array-length-max": (_: FieldArrayMaxLengthRule) => "",
	"array-length-min": (_: FieldArrayMinLengthRule) => "",
	"array-length-range": (_: FieldArrayLengthRangeRule) => "",
	"array-predicate-all": (_: FieldArrayPredicateAllRule) => "",
	"array-predicate-none": (_: FieldArrayPredicateNoneRule) => "",
	"array-predicate-some": (_: FieldArrayPredicateSomeRule) => "",
	"boolean-value": (_: FieldBooleanValueRule) => "",
	"custom": (_: FieldCustomValidationRule) => "",
	"date-max": (_: FieldDateMaxValueRule) => "",
	"date-min": (_: FieldDateMinValueRule) => "",
	"date-range": (_: FieldDateRangeRule) => "",
	"date-value": (_: FieldDateValueRule) => "",
	"file-contenttype": (_: FieldFileContentTypeRule) => "",
	"file-size-max": (_: FieldFileMaxSizeRule) => "",
	"is-not-valid": (_: RuleIsNotValidRule) => "",
	"is-valid": (_: RuleIsValidRule) => "",
	"no-rules-valid": (_: NoRulesValidRule) => "",
	"number-max": (_: FieldNumberMaxValueRule) => "",
	"number-min": (_: FieldNumberMinValueRule) => "",
	"number-range": (_: FieldNumberRangeRule) => "",
	"number-value": (_: FieldNumberValueRule) => "",
	"required": (_: FieldRequiredRule) => "",
	"some-rules-valid": (_: SomeRulesValidRule) => "",
	"text-length": (_: FieldTextLengthRule) => "",
	"text-length-max": (_: FieldTextMaxLengthRule) => "",
	"text-length-min": (_: FieldTextMinLengthRule) => "",
	"text-length-range": (_: FieldTextLengthRangeRule) => "",
	"text-regexp": (_: FieldTextRegExpRule) => "",
	"text-value": (_: FieldTextValueRule) => "",
	"type": (_: FieldTypeRule) => ""
};

export type ValidationRuleMessages = typeof BLANK;

const dateToStr = (d: Date) => formatDateOrDateTime(d, CULTURE_INFO.DATE_FORMATS["EN-US"]);
const floatToStr = (n: number, options?: NumberFormatOptions) => formatNumber(n, CULTURE_INFO.NUMBER_FORMATS["EN-US"], options);

// not all validation rules have default messages
const EN_US: ValidationRuleMessages = {
	...BLANK,
	"array-length": ({ expectedLength }) => `Must have ${expectedLength} items`,
	"array-length-max": ({ maxLength }) => `Must have ${maxLength} items at most`,
	"array-length-min": ({ minLength }) => `Must have ${minLength} items at least`,
	"array-length-range": ({ minLength, maxLength }) => `Must have ${minLength} to ${maxLength} items`,
	"boolean-value": ({ expectedValue }) => `Must be ${expectedValue ? "checked" : "unchecked"}`,

	"date-min": ({ minDate, mustBeGreater }) => `Must be ${mustBeGreater ? "after" : "not earler than"} ${dateToStr(minDate)}`,
	"date-max": ({ maxDate, mustBeLess }) => `Must be ${mustBeLess ? "before" : "not later than"} ${dateToStr(maxDate)}`,

	"date-range": ({ minDate, mustBeGreater, maxDate, mustBeLess }) =>
		`Must be ${mustBeGreater ? "after" : "not earler than"} ${dateToStr(minDate)} and ` +
		`${mustBeLess ? "before" : "not later than"} ${dateToStr(maxDate)}`,

	"date-value": ({ expectedValue }) => isArray(expectedValue)
		? `Must be one of the following dates: ${expectedValue.map(t => dateToStr(t), ", ").join(", ")}`
		: `Must be ${dateToStr(expectedValue)}`,

	"file-contenttype": ({ allowedContentTypes }) => `Allowed content: ${allowedContentTypes.map(t => t.name).join(", ")}`,
	"file-size-max": ({ maxFileSize }) => maxFileSize >= 0x100000
		? `Maximum size is ${floatToStr(maxFileSize / 0x100000, { maxDecimalDigits: 1 })} Mb`
		: `Maximum size is ${floatToStr(maxFileSize / 0x400, { maxDecimalDigits: 1 })} Kb`,

	"number-min": ({ minValue, mustBeGreater }) => `Must be ${mustBeGreater ? "greater" : "greater or equal"} than ${floatToStr(minValue)}`,
	"number-max": ({ maxValue, mustBeLess }) => `Must be ${mustBeLess ? "less" : "less or equal"} than ${floatToStr(maxValue)}`,

	"number-range": ({ minValue, mustBeGreater, maxValue, mustBeLess }) =>
		`Must be ${mustBeGreater ? "greater" : "greater or equal"} than ${floatToStr(minValue)} and ` +
		`${mustBeLess ? "less" : "less or equal"} than ${floatToStr(maxValue)}`,

	"number-value": ({ expectedValue }) => isArray(expectedValue)
		? `Must be one of the following values: ${expectedValue.map(t => floatToStr(t), ", ").join(", ")}`
		: `Must be ${floatToStr(expectedValue)}`,

	"required": ({ required }) => required ? "Required" : "Not required",
	"text-length": ({ expectedLength }) => expectedLength === 1 ? "Must be a single character" : `Must be ${expectedLength} characters long`,
	"text-length-min": ({ minLength }) => minLength === 1 ? "Minimum 1 character" : `Minimum ${minLength} characters`,
	"text-length-max": ({ maxLength }) => maxLength === 1 ? "Maximum 1 character" : `Maximum ${maxLength} characters`,

	"text-length-range": ({ minLength, maxLength }) => (
		minLength !== maxLength ? `Minimum ${minLength} and maximum ${maxLength} characters` :
			minLength === 1 ? "Must be a single character" :
				`Must be ${minLength} characters`
	),

	"text-value": ({ expectedValue }) => isArray(expectedValue)
		? `Must be one of the following values: ${expectedValue.join(", ")}`
		: `Must be '${expectedValue}'`
};

export const VALIDATION_RULE_MESSAGES: { readonly [cultureId: string]: ValidationRuleMessages } = {
	BLANK,
	DEFAULT: EN_US, 
	"EN-US": EN_US
};
