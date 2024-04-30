import { ContentType } from "@react-simple/react-simple-util";
import { FieldType } from "../fields";

export const VALIDATION_RULES_TYPES = {
	required: "required",
	minLength: "minLength", // only for 'text'
	maxLength: "maxLength", // only for 'text'
	minNumberValue: "minNumberValue", // only for 'number'
	maxNumberValue: "minNumberValue", // only for 'number'
	minDateValue: "minDateValue", // only for 'date'
	maxDateValue: "minDateValue", // only for 'date'
	regExp: "regExp", // only for 'text'
	minSize: "minSize", // only for 'file'
	maxSize: "maxSize", // only for 'file'
	contentType: "contentType", // only for 'file'
	minItems: "minItems", // only for arrays
	maxItems: "maxItems", // only for arrays
	custom: "custom"
};

export type ValidationRuleType = keyof typeof VALIDATION_RULES_TYPES;

export interface ValidationRuleBase {
	readonly type: ValidationRuleType;
	readonly message?: string;
}

export interface RequiredRule extends ValidationRuleBase {
	readonly type: "required";
	readonly required: boolean;
}

export interface MinLengthRule extends ValidationRuleBase {
	readonly type: "minLength";
	readonly minLength: number;
}

export interface MaxLengthRule extends ValidationRuleBase {
	readonly type: "maxLength";
	readonly maxLength: number;
}

export interface MinNumberValueRule extends ValidationRuleBase {
	readonly type: "minNumberValue";
	readonly minValue: number;
	readonly mustBeGreater?: boolean; // by default great-or-equal is checked
}

export interface MaxNumberValueRule extends ValidationRuleBase {
	readonly type: "maxNumberValue";
	readonly maxValue: number;
	readonly mustBeLess?: boolean; // by default less-or-equal is checked
}

export interface MinDateValueRule extends ValidationRuleBase {
	readonly type: "minDateValue";
	readonly minDate: Date;
	readonly mustBeGreater?: boolean; // by default great-or-equal is checked
}

export interface MaxDateValueRule extends ValidationRuleBase {
	readonly type: "maxDateValue";
	readonly maxDate: Date;
	readonly mustBeLess?: boolean; // by default less-or-equal is checked
}

export interface RegExpRule extends ValidationRuleBase {
	readonly type: "regExp";
	readonly regExp: RegExp;
}

export interface MinSizeRule extends ValidationRuleBase {
	readonly type: "minSize";
	readonly minSize: number; // bytes
}

export interface MaxSizeRule extends ValidationRuleBase {
	readonly type: "maxSize";
	readonly maxSize: number; // bytes
}

export interface ContentTypeRule extends ValidationRuleBase {
	readonly type: "contentType";
	readonly allowedTypes: ContentType[];
}

export interface MinItemsRule extends ValidationRuleBase {
	readonly type: "minItems";
	readonly minItems: number;
}

export interface MaxItemsRule extends ValidationRuleBase {
	readonly type: "maxItems";
	readonly maxItems: number;
}

export interface CustomRule extends ValidationRuleBase {
	readonly type: "custom";
	readonly validate: (value: unknown, fieldType: FieldType, name?: string) => boolean;
}

export type ValidationRule =
	| RequiredRule
	| MinLengthRule
	| MaxLengthRule
	| MinNumberValueRule
	| MaxNumberValueRule
	| MinDateValueRule
	| MaxDateValueRule
	| RegExpRule
	| MinSizeRule
	| MaxSizeRule
	| ContentTypeRule
	| MinItemsRule
	| MaxItemsRule
	| CustomRule;
