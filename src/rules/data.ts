import { ContentType } from "@react-simple/react-simple-util";
import {
	FieldCustomValidationRule, FieldExpectedBooleanValueRule, FieldExpectedDateValueRule, FieldExpectedNumberValueRule, FieldExpectedTextValueRule,
	FieldFileContentAndExtensionTypeRule,
	FieldFileContentTypeRule, FieldFileExtensionRule, FieldMaxArrayLengthRule, FieldMaxDateValueRule, FieldMaxFileSizeRule, FieldMaxNumberValueRule,
	FieldMaxTextLengthRule, FieldMinArrayLengthRule, FieldMinDateValueRule, FieldMinNumberValueRule, FieldMinTextLengthRule, FieldRegExpRule, FieldRequiredRule
} from "./types";
import { FieldType } from "fields/types";

export const RULES: {
	readonly required: (required?: boolean, options?: { message?: string }) => FieldRequiredRule,

	readonly minTextLength: (minLength: number, options?: { message?: string }) => FieldMinTextLengthRule,
	readonly maxTextLength: (maxLength: number, options?: { message?: string }) => FieldMaxTextLengthRule,
	readonly expectedTextValue: (expectedValue: string, options?: { message?: string }) => FieldExpectedTextValueRule,

	readonly minNumberValue: (minValue: number, options?: { message?: string; mustBeGreater?: boolean }) => FieldMinNumberValueRule,
	readonly maxNumberValue: (maxValue: number, options?: { message?: string; mustBeLess?: boolean }) => FieldMaxNumberValueRule,
	readonly expectedNumberValue: (expectedValue: number, options?: { message?: string }) => FieldExpectedNumberValueRule,

	readonly minDateValue: (minDate: Date, options?: { message?: string; mustBeGreater?: boolean }) => FieldMinDateValueRule,
	readonly maxDateValue: (maxDate: Date, options?: { message?: string; mustBeLess?: boolean }) => FieldMaxDateValueRule,
	readonly expectedDateValue: (expectedValue: Date, options?: { message?: string }) => FieldExpectedDateValueRule,

	readonly expectedBooleanValue: (expectedValue: boolean, options?: { message?: string }) => FieldExpectedBooleanValueRule,

	readonly maxFileSize: (maxSizeBytes: number, options?: { message?: string }) => FieldMaxFileSizeRule,
	readonly fileContentType: (contentTypes: string[] | ContentType[], options?: { message?: string }) => FieldFileContentTypeRule,
	readonly fileExtension: (extensions: string[], options?: { message?: string }) => FieldFileExtensionRule,
	readonly fileContentTypeAndExtension: (contentTypes: ContentType[], options?: { message?: string }) => FieldFileContentAndExtensionTypeRule,

	readonly minArrayLength: (minLength: number, options?: { message?: string }) => FieldMinArrayLengthRule,
	readonly maxArrayLength: (maxLength: number, options?: { message?: string }) => FieldMaxArrayLengthRule,

	readonly regExp: (regExp: RegExp, options?: { message?: string }) => FieldRegExpRule,
	readonly customValidation: (validate: (fieldValue: unknown, fieldType: FieldType) => boolean, options?: { message?: string }) => FieldCustomValidationRule,
} = {
	required: (required, options) => ({
		ruleType: "required",
		required: required !== false,
		message: options?.message
	}),

	minTextLength: (minLength, options) => ({
		ruleType: "minTextLength",
		minLength,
		message: options?.message
	}),

	maxTextLength: (maxLength, options) => ({
		ruleType: "maxTextLength",
		maxLength,
		message: options?.message
	}),

	expectedTextValue: (expectedValue, options) => ({
		ruleType: "expectedTextValue",
		expectedValue,
		message: options?.message
	}),

	minNumberValue: (minValue, options) => ({
		ruleType: "minNumberValue",
		minValue,
		message: options?.message,
		mustBeGreater: options?.mustBeGreater
	}),

	maxNumberValue: (maxValue, options) => ({
		ruleType: "maxNumberValue",
		maxValue,
		message: options?.message,
		mustBeLess: options?.mustBeLess
	}),

	expectedNumberValue: (expectedValue, options) => ({
		ruleType: "expectedNumberValue",
		expectedValue,
		message: options?.message
	}),

	minDateValue: (minDate, options) => ({
		ruleType: "minDateValue",
		minDate,
		message: options?.message,
		mustBeGreater: options?.mustBeGreater
	}),

	maxDateValue: (maxDate, options) => ({
		ruleType: "maxDateValue",
		maxDate,
		message: options?.message,
		mustBeLess: options?.mustBeLess
	}),

	expectedDateValue: (expectedValue, options) => ({
		ruleType: "expectedDateValue",
		expectedValue,
		message: options?.message
	}),

	expectedBooleanValue: (expectedValue, options) => ({
		ruleType: "expectedBooleanValue",
		expectedValue,
		message: options?.message
	}),

	maxFileSize: (maxFileSize, options) => ({
		ruleType: "maxFileSize",
		maxFileSize,
		message: options?.message
	}),

	fileContentType: (allowedContentTypes, options) => ({
		ruleType: "fileContentType",
		allowedContentTypes,
		message: options?.message
	}),

	fileExtension: (allowedExtensions, options) => ({
		ruleType: "fileExtension",
		allowedExtensions,
		message: options?.message
	}),

	fileContentTypeAndExtension: (allowedContentTypes, options) => ({
		ruleType: "fileContentTypeAndExtension",
		allowedContentTypes,
		message: options?.message
	}),

	minArrayLength: (minLength, options) => ({
		ruleType: "minArrayLength",
		minLength,
		message: options?.message
	}),

	maxArrayLength: (maxLength, options) => ({
		ruleType: "maxArrayLength",
		maxLength,
		message: options?.message
	}),

	regExp: (regExp, options) => ({
		ruleType: "regExp",
		regExp,
		message: options?.message
	}),

	customValidation: (validate, options) => ({
		ruleType: "customValidation",
		validate,
		message: options?.message
	})
};
