import { FieldSet, FieldType } from "fields";
import { ValidationRule } from "rules";
import { FieldValidationResult, RuleValidationResult, ValidationResult } from "./types";
import { compareDates, isArray, isDate, isFile, isNumber, isString } from "@react-simple/react-simple-util";

export function validateRule(rule: ValidationRule, fieldType: FieldType, fieldValue: unknown, name?: string): RuleValidationResult {
	let isValid = true;
	let isChecked = false;
	let regExpMatch: RegExpMatchArray | undefined;

	switch (rule.type) {
		case "regExp":
			if (fieldType.baseType === "text" && isString(fieldValue) && fieldValue) {
				isChecked = true;
				regExpMatch = fieldValue.match(rule.regExp) || undefined;
				isValid = !!regExpMatch;
			}
			break;

		case "required":
			break;

		case "contentType":
			if (fieldType.baseType === "file" && isFile(fieldValue)) {
				isChecked = true;
				isValid = !!fieldValue.type && rule.allowedTypes.some(t => t.allowedContentTypes.includes(fieldValue.type));
			}
			break;

		case "custom":
			isChecked = true;
			isValid = rule.validate(fieldValue, fieldType, name);
			break;

		case "maxDateValue":
			if (fieldType.baseType === "date" && isDate(fieldValue)) {
				isChecked = true;
				isValid = rule.mustBeLess
					? compareDates(fieldValue, rule.maxDate) < 0
					: compareDates(fieldValue, rule.maxDate) <= 0;
			}
			break;

		case "maxItems":
			if (fieldType.isArray && isArray(fieldValue)) {
				isChecked = true;
				isValid = fieldValue.length <= rule.maxItems;
			}
			break;

		case "maxLength":
			if (fieldType.baseType === "text" && isString(fieldValue)) {
				isChecked = true;
				isValid = fieldValue.length <= rule.maxLength;
			}
			break;

		case "maxNumberValue":
			if (fieldType.baseType === "number" && isNumber(fieldValue)) {
				isChecked = true;
				isValid = rule.mustBeLess ? fieldValue < rule.maxValue : fieldValue <= rule.maxValue;
			}
			break;

		case "maxSize":
			if (fieldType.baseType === "file" && isFile(fieldValue)) {
				isChecked = true;
				isValid = fieldValue.size <= rule.maxSize;
			}
			break;

		case "minDateValue":
			if (fieldType.baseType === "date" && isDate(fieldValue)) {
				isChecked = true;
				isValid = rule.mustBeGreater
					? compareDates(fieldValue, rule.minDate) > 0
					: compareDates(fieldValue, rule.minDate) >= 0;
			}
			break;

		case "minItems":
			if (fieldType.isArray && isArray(fieldValue)) {
				isChecked = true;
				isValid = fieldValue.length >= rule.minItems;
			}
			break;

		case "minLength":
			if (fieldType.baseType === "text" && isString(fieldValue)) {
				isChecked = true;
				isValid = fieldValue.length >= rule.minLength;
			}
			break;

		case "minNumberValue":
			if (fieldType.baseType === "number" && isNumber(fieldValue)) {
				isChecked = true;
				isValid = rule.mustBeGreater ? fieldValue > rule.minValue : fieldValue >= rule.minValue;
			}
			break;

		case "minSize":
			if (fieldType.baseType === "file" && isFile(fieldValue)) {
				isChecked = true;
				isValid = fieldValue.size >= rule.minSize;
			}
			break;
	}

	return {
		isValid, isChecked, fieldType, fieldValue, rule, name, regExpMatch,
		message: !isValid ? rule.message : undefined
	};
}

export function validateRules(rules: ValidationRule[], fieldType: FieldType, fieldValue: unknown): RuleValidationResult[] {
	return rules.map(t => validateRule(t, fieldType, fieldValue));
}

export function validateField(name: string, fieldType: FieldType, fieldValue: unknown): FieldValidationResult {
	const rules = validateRules(fieldType.rules, fieldType, fieldValue);

	return {
		fieldType,
		fieldValue,
		name,
		rules,
		isValid: rules.every(t => t.isValid)
	};
}

export function validateFieldSet(input: FieldSet): ValidationResult {
	const output: { [name: string]: FieldValidationResult } = {};
	let isValid = true;

	for (const [name, fieldType] of Object.entries(input.fieldDefs)) {
		const fieldValue = input.fieldValues[name];
		const fieldValidationResult = validateField(name, fieldType, fieldValue);

		output[name] = fieldValidationResult;

		if (!fieldValidationResult.isValid) {
			isValid = false;
		}
	}

	return {
		input, output, isValid
	};
}
