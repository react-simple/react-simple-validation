import { FieldSet, FieldType } from "fields";
import { ValidationRule } from "rules";

export interface RuleValidationResult {
	isValid: boolean;
	isChecked: boolean; // certain rules work for certain field types only; if incompatible it's isValid but !isChecked
	rule: ValidationRule;

	fieldType: FieldType;
	fieldValue: unknown;

	name?: string;
	message?: string; // custom message
	regExpMatch?: RegExpMatchArray;
}

export interface FieldValidationResult {
	name: string;
	isValid: boolean; // === rules.every(t => t.isValid)

	fieldType: FieldType;
	fieldValue: unknown;

	rules: RuleValidationResult[]; // valid and non-valid too
}

export interface ValidationResult {
	isValid: boolean;
	input: FieldSet;
	output: { [name: string]: FieldValidationResult };
} 
