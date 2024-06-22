import { getResolvedArray, isArray } from "@react-simple/react-simple-util";
import { NumberFormatOptions, formatDateOrDateTime, formatNumber, getCulture } from "@react-simple/react-simple-localization";
import { ValidationRuleMessages } from "rules/types";
import { BaseFieldType } from "fields/types";

const CULTURE_ID = "EN-US";

const dateToStr = (d: Date) => {
	return formatDateOrDateTime(d, getCulture(CULTURE_ID).dateFormat);
};

const floatToStr = (n: number, options?: NumberFormatOptions) => {
	return formatNumber(n, getCulture(CULTURE_ID).numberFormat, options);
};

// not all validation rules have default messages
export const getValidationRuleMessagesENUS: (
	fieldTypeNames: () => ({ [cultureId: string]: Record<BaseFieldType, string> })
) => ValidationRuleMessages = fieldTypeNames => ({
	"all-rules-valid": undefined,
	"any-custom": undefined,

	"array-custom": undefined,
	"array-include-all": ({ items }) => isArray(items)
		? `Must contain all values: ${items.join(", ")}`
		: `Must contain value: ${items}`,

	"array-include-none": ({ items }) => isArray(items)
		? `Must not contain values: ${items.join(", ")}`
		: `Must not contain value: ${items}`,

	"array-include-some": ({ items }) => isArray(items)
		? `Must contain some of the following values: ${items.join(", ")}`
		: `Must contain value: ${items}`,

	"array-itemindex-equals": undefined,
	"array-itemindex-max": undefined,
	"array-itemindex-min": undefined,
	"array-itemindex-range": undefined,

	"array-length-equals": ({ expectedLength }) => `Must have ${expectedLength} items`,
	"array-length-max": ({ maxLength }) => `Must have ${maxLength} items at most`,
	"array-length-min": ({ minLength }) => `Must have ${minLength} items at least`,
	"array-length-range": ({ minLength, maxLength }) => `Must have ${minLength} to ${maxLength} items`,

	"array-match-all": undefined,
	"array-match-some": undefined,

	"boolean-custom": undefined,
	"boolean-equals": ({ expectedValue }) => expectedValue ? "Must be checked" : "Must be unchecked",
	"compare": undefined,

	"date-custom": undefined,
	
	"date-min": ({ minDate, mustBeGreater }) => mustBeGreater
		? `Must be after ${dateToStr(minDate)}`
		: `Must be not earler than ${dateToStr(minDate)}`,
	
	"date-max": ({ maxDate, mustBeLess }) => mustBeLess
		? `Must be before ${dateToStr(maxDate)}`
		: `Must be not later than ${dateToStr(maxDate)}`,

	"date-range": ({ minDate, mustBeGreater, maxDate, mustBeLess }) =>
		`Must be ${mustBeGreater ? "after" : "not earler than"} ${dateToStr(minDate)} and ` +
		`${mustBeLess ? "before" : "not later than"} ${dateToStr(maxDate)}`,

	"date-equals": ({ expectedValue }) => isArray(expectedValue)
		? `Must be one of the following dates: ${expectedValue.map(t => dateToStr(t), ", ").join(", ")}`
		: `Must be ${dateToStr(expectedValue)}`,

	"field-reference": undefined,
	"file-content-type": ({ allowedContentTypes }) => `Allowed content: ${getResolvedArray(allowedContentTypes).map(t => t.name).join(", ")}`,
	"file-custom": undefined,
	"file-size-max": ({ maxFileSize }) => maxFileSize >= 0x100000
		? `Maximum size is ${floatToStr(maxFileSize / 0x100000, { maxDecimalDigits: 1 })} Mb`
		: `Maximum size is ${floatToStr(maxFileSize / 0x400, { maxDecimalDigits: 1 })} Kb`,

	"if-then-else": undefined,

	"number-custom": undefined,
	"number-min": ({ minValue, mustBeGreater }) => mustBeGreater
		? `Must be greater than ${floatToStr(minValue)}`
		: `Must be greater or equal than ${floatToStr(minValue)}`,
	
	"number-max": ({ maxValue, mustBeLess }) => mustBeLess
		? `Must be less than ${floatToStr(maxValue)}`
		: `Must be less or equal than ${floatToStr(maxValue)}`,

	"number-range": ({ minValue, mustBeGreater, maxValue, mustBeLess }) =>
		`Must be ${mustBeGreater ? "greater" : "greater or equal"} than ${floatToStr(minValue)} and ` +
		`${mustBeLess ? "less" : "less or equal"} than ${floatToStr(maxValue)}`,

	"number-equals": ({ expectedValue }) => isArray(expectedValue)
		? `Must be one of the following values: ${expectedValue.map(t => floatToStr(t), ", ").join(", ")}`
		: `Must be ${floatToStr(expectedValue)}`,

	"object-custom": undefined,
	"required": () => "Required",
	"some-rules-valid": undefined,
	"switch": undefined,

	"text-custom": undefined,
	"text-length-equals": ({ expectedLength }) => expectedLength === 1
		? "Must be a single character"
		: `Must be ${expectedLength} characters long`,
	
	"text-length-min": ({ minLength }) => minLength === 1
		? "Minimum 1 character"
		: `Minimum ${minLength} characters`,
	
	"text-length-max": ({ maxLength }) => maxLength === 1
		? "Maximum 1 character"
		: `Maximum ${maxLength} characters`,

	"text-length-range": ({ minLength, maxLength }) => (
		minLength !== maxLength ? `Minimum ${minLength} and maximum ${maxLength} characters` :
			minLength === 1 ? "Must be a single character" :
				`Must be ${minLength} characters`
	),

	"text-match": ({ regExpName }) => regExpName
		? `Must match format (${regExpName})`
		: "Must match format",

	"text-equals": ({ expectedValue }) => isArray(expectedValue)
		? `Must be one of the following values: ${expectedValue.join(", ")}`
		: `Must be '${expectedValue}'`,

	"type": ({ valueType }) => {
		const typeName = fieldTypeNames()["EN-US"]?.[valueType];
		return typeName ? `Must be a ${typeName} value` : 'Invalid type';
	}
});
