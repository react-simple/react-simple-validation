import { ContentType } from "@react-simple/react-simple-util";
import {
	FieldCustomValidationRule, FieldBooleanValueRule, FieldDateValueRule, FieldNumberValueRule, FieldTextValueRule, FieldFileContentTypeAndExtensionRule,
	FieldFileContentTypeRule, FieldFileExtensionRule, FieldArrayMaxLengthRule, FieldDateMaxValueRule, FieldFileMaxSizeRule, FieldNumberMaxValueRule,
	FieldTextMaxLengthRule, FieldArrayMinLengthRule, FieldDateMinValueRule, FieldNumberMinValueRule, FieldTextMinLengthRule, FieldTextRegExpRule,
	FieldRequiredRule, FieldValidationRule, FieldAllValidationRules, FieldSomeValidationRules, FieldNoValidationRules, FieldTextLengthRule,
	FieldNumberRangeRule, FieldDateRangeRule, FieldArrayLengthRule, FieldArrayLengthRangeRule, FieldArrayIncludeRule, FieldArrayEveryRule,
	FieldArraySomeRule, FieldArrayNoneRule, FieldTextLengthRangeRule
} from "./types";
import { FieldType } from "fields/types";

export interface ValidationRuleOptions {
	readonly message?: string;
	readonly expectFailure?: boolean;
}

export const RULES: {
	readonly required: (required?: boolean, options?: ValidationRuleOptions) => FieldRequiredRule,

	readonly text: {
		readonly value: (expectedValue: string | string[], options?: ValidationRuleOptions) => FieldTextValueRule,
		readonly regExp: (regExp: RegExp, options?: ValidationRuleOptions) => FieldTextRegExpRule

		readonly length: {
			readonly min: (minLength: number, options?: ValidationRuleOptions) => FieldTextMinLengthRule,
			readonly max: (maxLength: number, options?: ValidationRuleOptions) => FieldTextMaxLengthRule,
			readonly exact: (length: number | number[], options?: ValidationRuleOptions) => FieldTextLengthRule,
			readonly range: (minLength: number, maxLength: number, options?: ValidationRuleOptions & { mustBeLess?: boolean; mustBeGreater?: boolean; }) => FieldTextLengthRangeRule,
		}
	},

	readonly number: {
		readonly min: (minValue: number, options?: { message?: string; mustBeGreater?: boolean }) => FieldNumberMinValueRule,
		readonly max: (maxValue: number, options?: { message?: string; mustBeLess?: boolean }) => FieldNumberMaxValueRule,
		readonly value: (expectedValue: number | number[], options?: ValidationRuleOptions) => FieldNumberValueRule,
		readonly range: (minValue: number, maxValue: number, options?: ValidationRuleOptions & { mustBeLess?: boolean; mustBeGreater?: boolean; }) => FieldNumberRangeRule
	},

	readonly date: {
		readonly min: (minDate: Date, options?: { message?: string; mustBeGreater?: boolean }) => FieldDateMinValueRule,
		readonly max: (maxDate: Date, options?: { message?: string; mustBeLess?: boolean }) => FieldDateMaxValueRule,
		readonly value: (expectedValue: Date | Date[], options?: ValidationRuleOptions) => FieldDateValueRule,
		readonly range: (minDate: Date, maxDate: Date, options?: ValidationRuleOptions & { mustBeLess?: boolean; mustBeGreater?: boolean; }) => FieldDateRangeRule
	},

	readonly boolean: {
		readonly value: (expectedValue: boolean, options?: ValidationRuleOptions) => FieldBooleanValueRule
	},

	readonly file: {
		readonly maxSize: (maxSizeBytes: number, options?: ValidationRuleOptions) => FieldFileMaxSizeRule,
		readonly contentType: (contentTypes: string[] | ContentType[], options?: ValidationRuleOptions) => FieldFileContentTypeRule,
		readonly extension: (extensions: string[], options?: ValidationRuleOptions) => FieldFileExtensionRule,
		readonly contentTypeAndExtension: (contentTypes: ContentType[], options?: ValidationRuleOptions) => FieldFileContentTypeAndExtensionRule
	},

	readonly array: {
		readonly include: (item: unknown, options?: ValidationRuleOptions) => FieldArrayIncludeRule,

		readonly length: {
			readonly min: (minLength: number, options?: ValidationRuleOptions) => FieldArrayMinLengthRule,
			readonly max: (maxLength: number, options?: ValidationRuleOptions) => FieldArrayMaxLengthRule,
			readonly exact: (length: number | number[], options?: ValidationRuleOptions) => FieldArrayLengthRule,
			readonly range: (minLength: number, maxLength: number, options?: ValidationRuleOptions & { mustBeLess?: boolean; mustBeGreater?: boolean; }) => FieldArrayLengthRangeRule
		},

		readonly operators: {
			readonly every: (predicate: FieldValidationRule, options?: ValidationRuleOptions) => FieldArrayEveryRule,
			readonly some: (predicate: FieldValidationRule, options?: ValidationRuleOptions) => FieldArraySomeRule,
			readonly none: (predicate: FieldValidationRule, options?: ValidationRuleOptions) => FieldArrayNoneRule
		}
	},

	readonly custom: (validate: (fieldValue: unknown, fieldType: FieldType) => boolean, options?: ValidationRuleOptions) => FieldCustomValidationRule

	readonly operators: {
		readonly some: (rules: FieldValidationRule[], options?: ValidationRuleOptions) => FieldSomeValidationRules,
		readonly all: (rules: FieldValidationRule[], options?: ValidationRuleOptions) => FieldAllValidationRules,
		readonly none: (rules: FieldValidationRule[], options?: ValidationRuleOptions) => FieldNoValidationRules
	}
} = {
	required: (required, options) => ({
		...options,
		ruleType: "required",
		required: required !== false
	}),

	text: {
		value: (expectedValue, options) => ({
			...options,
			ruleType: "text-value",
			expectedValue
		}),

		regExp: (regExp, options) => ({
			...options,
			ruleType: "text-regexp",
			regExp
		}),

		length: {
			min: (minLength, options) => ({
				...options,
				ruleType: "text-length-min",
				minLength
			}),

			max: (maxLength, options) => ({
				...options,
				ruleType: "text-length-max",
				maxLength
			}),

			exact: (expectedLength, options) => ({
				...options,
				ruleType: "text-length",
				expectedLength
			}),

			range: (minLength, maxLength, options) => ({
				...options,
				ruleType: "text-length-range",
				minLength,
				maxLength
			})
		}
	},

	number: {
		min: (minValue, options) => ({
			...options,
			ruleType: "number-min",
			minValue
		}),

		max: (maxValue, options) => ({
			...options,
			ruleType: "number-max",
			maxValue
		}),

		range: (minValue, maxValue, options) => ({
			...options,
			ruleType: "number-range",
			minValue,
			maxValue
		}),

		value: (expectedValue, options) => ({
			...options,
			ruleType: "number-value",
			expectedValue
		})
	},

	date: {
		min: (minDate, options) => ({
			...options,
			ruleType: "date-min",
			minDate
		}),

		max: (maxDate, options) => ({
			...options,
			ruleType: "date-max",
			maxDate
		}),

		range: (minDate, maxDate, options) => ({
			...options,
			ruleType: "date-range",
			minDate,
			maxDate
		}),

		value: (expectedValue, options) => ({
			...options,
			ruleType: "date-value",
			expectedValue
		})
	},

	boolean: {
		value: (expectedValue, options) => ({
			...options,
			ruleType: "boolean-value",
			expectedValue
		})
	},

	file: {
		maxSize: (maxFileSize, options) => ({
			...options,
			ruleType: "file-size-max",
			maxFileSize
		}),

		contentType: (allowedContentTypes, options) => ({
			...options,
			ruleType: "file-contenttype",
			allowedContentTypes
		}),

		extension: (allowedExtensions, options) => ({
			...options,
			ruleType: "file-extension",
			allowedExtensions
		}),

		contentTypeAndExtension: (allowedContentTypes, options) => ({
			...options,
			ruleType: "file-contenttype-extension",
			allowedContentTypes
		})
	},

	array: {
		include: (item, options) => ({
			...options,
			ruleType: "array-include",
			item
		}),

		length: {
			min: (minLength, options) => ({
				...options,
				ruleType: "array-length-min",
				minLength
			}),

			max: (maxLength, options) => ({
				...options,
				ruleType: "array-length-max",
				maxLength
			}),

			exact: (expectedLength, options) => ({
				...options,
				ruleType: "array-length",
				expectedLength
			}),

			range: (minLength, maxLength, options) => ({
				...options,
				ruleType: "array-length-range",
				minLength,
				maxLength
			})
		},

		operators: {
			every: (predicate, options) => ({
				...options,
				ruleType: "array-every",
				predicate
			}),

			some: (predicate, options) => ({
				...options,
				ruleType: "array-some",
				predicate
			}),

			none: (predicate, options) => ({
				...options,
				ruleType: "array-none",
				predicate
			})
		}
	},

	custom: (validate, options) => ({
		...options,
		ruleType: "custom",
		validate
	}),

	operators: {
		some: (rules, options) => ({
			...options,
			ruleType: "some-rules",
			rules
		}),

		all: (rules, options) => ({
			...options,
			ruleType: "all-rules",
			rules
		}),

		none: (rules, options) => ({
			...options,
			ruleType: "no-rules",
			rules
		})
	}
};
