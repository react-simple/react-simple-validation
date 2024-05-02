import { ContentType } from "@react-simple/react-simple-util";
import { BaseFieldType, FieldType } from "fields";

export const FIELD_VALIDATION_RULE_TYPES = {
	valueType: "valueType", // this rule is automatically validated based on fieldType.baseType
	required: "required",
	minTextLength: "minTextLength", // only for 'text'
	maxTextLength: "maxTextLength", // only for 'text'
	expectedTextValue: "expectedTextValue", // only for 'text'
	minNumberValue: "minNumberValue", // only for 'number'
	maxNumberValue: "minNumberValue", // only for 'number'
	expectedNumberValue: "expectedNumberValue", // only for 'number'
	minDateValue: "minDateValue", // only for 'date'
	maxDateValue: "minDateValue", // only for 'date'
	expectedDateValue: "expectedDateValue", // only for 'date'
	expectedBooleanValue: "expectedBooleanValue", // only for 'boolean'
	regExp: "regExp", // only for 'text'
	maxFileSize: "maxFileSize", // only for 'file'
	fileContentType: "fileContentType", // only for 'file'
	fileExtension: "fileExtension", // only for 'file'
	fileContentTypeAndExtension: "fileContentTypeAndExtension", // only for 'file'
	minArrayLength: "minArrayLength", // only for arrays
	maxArrayLength: "maxArrayLength", // only for arrays
	customValidation: "customValidation"
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
