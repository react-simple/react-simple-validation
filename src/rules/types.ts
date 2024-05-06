import { ContentType } from "@react-simple/react-simple-util";
import { BaseFieldType, FieldType } from "fields";

export const FIELD_VALIDATION_RULE_TYPES = {
	valueType: "valueType", // this rule is automatically validated based on fieldType.baseType
	required: "required",
	customValidation: "customValidation",

	// text
	minTextLength: "minTextLength",
	maxTextLength: "maxTextLength",
	expectedTextValue: "expectedTextValue",
	regExp: "regExp", // only for 'text'

	// number
	minNumberValue: "minNumberValue",
	maxNumberValue: "minNumberValue",
	expectedNumberValue: "expectedNumberValue",

	// date
	minDateValue: "minDateValue",
	maxDateValue: "minDateValue",
	expectedDateValue: "expectedDateValue",

	// boolean
	expectedBooleanValue: "expectedBooleanValue",

	// file
	maxFileSize: "maxFileSize",
	fileContentType: "fileContentType",
	fileExtension: "fileExtension",
	fileContentTypeAndExtension: "fileContentTypeAndExtension",

	// array
	minArrayLength: "minArrayLength",
	maxArrayLength: "maxArrayLength"
};

export type FieldValidationRuleType = keyof typeof FIELD_VALIDATION_RULE_TYPES;

export interface FieldValidationRuleBase {
	readonly ruleType: FieldValidationRuleType;
	readonly message?: string;
}

export interface FieldValueTypeRule extends FieldValidationRuleBase {
	readonly ruleType: "valueType";
	readonly valueType: BaseFieldType;
}

export interface FieldRequiredRule extends FieldValidationRuleBase {
	readonly ruleType: "required";
	readonly required: boolean;
}

export interface FieldMinTextLengthRule extends FieldValidationRuleBase {
	readonly ruleType: "minTextLength";
	readonly minLength: number;
}

export interface FieldMaxTextLengthRule extends FieldValidationRuleBase {
	readonly ruleType: "maxTextLength";
	readonly maxLength: number;
}

export interface FieldExpectedTextValueRule extends FieldValidationRuleBase {
	readonly ruleType: "expectedTextValue";
	readonly expectedValue: string;
	readonly caseInsensitive?: boolean;
}

export interface FieldMinNumberValueRule extends FieldValidationRuleBase {
	readonly ruleType: "minNumberValue";
	readonly minValue: number;
	readonly mustBeGreater?: boolean; // by default great-or-equal is checked
}

export interface FieldMaxNumberValueRule extends FieldValidationRuleBase {
	readonly ruleType: "maxNumberValue";
	readonly maxValue: number;
	readonly mustBeLess?: boolean; // by default less-or-equal is checked
}

export interface FieldExpectedNumberValueRule extends FieldValidationRuleBase {
	readonly ruleType: "expectedNumberValue";
	readonly expectedValue: number;
}

export interface FieldMinDateValueRule extends FieldValidationRuleBase {
	readonly ruleType: "minDateValue";
	readonly minDate: Date;
	readonly mustBeGreater?: boolean; // by default great-or-equal is checked
}

export interface FieldMaxDateValueRule extends FieldValidationRuleBase {
	readonly ruleType: "maxDateValue";
	readonly maxDate: Date;
	readonly mustBeLess?: boolean; // by default less-or-equal is checked
}

export interface FieldExpectedDateValueRule extends FieldValidationRuleBase {
	readonly ruleType: "expectedDateValue";
	readonly expectedValue: Date;
}

export interface FieldExpectedBooleanValueRule extends FieldValidationRuleBase {
	readonly ruleType: "expectedBooleanValue";
	readonly expectedValue: boolean;
}

export interface FieldRegExpRule extends FieldValidationRuleBase {
	readonly ruleType: "regExp";
	readonly regExp: RegExp;
}

export interface FieldMaxFileSizeRule extends FieldValidationRuleBase {
	readonly ruleType: "maxFileSize";
	readonly maxFileSize: number; // bytes
}

export interface FieldFileContentTypeRule extends FieldValidationRuleBase {
	readonly ruleType: "fileContentType";
	readonly allowedContentTypes: string[] | ContentType[];
}

export interface FieldFileExtensionRule extends FieldValidationRuleBase {
	readonly ruleType: "fileExtension";
	readonly allowedExtensions: string[];
}

export interface FieldFileContentAndExtensionTypeRule extends FieldValidationRuleBase {
	readonly ruleType: "fileContentTypeAndExtension";
	readonly allowedContentTypes: ContentType[];
}

export interface FieldMinArrayLengthRule extends FieldValidationRuleBase {
	readonly ruleType: "minArrayLength";
	readonly minLength: number;
	readonly filter?: FieldValidationRule[]; // count only matching items
}

export interface FieldMaxArrayLengthRule extends FieldValidationRuleBase {
	readonly ruleType: "maxArrayLength";
	readonly maxLength: number;
	readonly filter?: FieldValidationRule[]; // count only matching items
}

export interface FieldCustomValidationRule extends FieldValidationRuleBase {
	readonly ruleType: "customValidation";
	readonly validate: (fieldValue: unknown, fieldType: FieldType) => boolean;
}

export type FieldValidationRule =
	| FieldValueTypeRule
	| FieldRequiredRule
	| FieldMinTextLengthRule
	| FieldMaxTextLengthRule
	| FieldExpectedTextValueRule
	| FieldMinNumberValueRule
	| FieldMaxNumberValueRule
	| FieldExpectedNumberValueRule
	| FieldMinDateValueRule
	| FieldMaxDateValueRule
	| FieldExpectedDateValueRule
	| FieldExpectedBooleanValueRule
	| FieldRegExpRule
	| FieldMaxFileSizeRule
	| FieldFileContentTypeRule
	| FieldFileExtensionRule
	| FieldFileContentAndExtensionTypeRule
	| FieldMinArrayLengthRule
	| FieldMaxArrayLengthRule
	| FieldCustomValidationRule;
