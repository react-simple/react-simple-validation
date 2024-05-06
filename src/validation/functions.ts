import { FieldType, FieldTypes, FieldValues } from "fields";
import { FieldValidationRule } from "rules";
import { FieldRuleValidationResult, FieldValidationResult, ObjectValidationResult } from "./types";
import {
	compareDates, getResolvedArray, isArray, isBoolean, isDate, isEmpty, isEmptyObject, isFile, isNumber, isString, isNullOrUndefined, sameDates,
	isValueType, ContentType
} from "@react-simple/react-simple-util";

// returns errors
export function validateFieldRule(
	rule: FieldValidationRule,
	fieldValue: unknown,
	fieldType: FieldType
): FieldRuleValidationResult {
	let isChecked = false;
	let isValid = false;
	let regExpMatch: RegExpMatchArray | undefined;

	switch (rule.ruleType) {
		case "valueType":
			if (isNullOrUndefined(fieldValue)) {
				isChecked = true;
				isValid = true;
			}
			else {
				switch (fieldType.baseType) {
					case "text":
						isChecked = true;
						isValid = isString(fieldValue);
						break;

					case "number":
						isChecked = true;
						isValid = isNumber(fieldValue);
						break;

					case "date":
						isChecked = true;
						isValid = isDate(fieldValue);
						break;

					case "boolean":
						isChecked = true;
						isValid = isBoolean(fieldValue);
						break;

					case "file":
						isChecked = true;
						isValid = isFile(fieldValue);
						break;

					case "object":
						isChecked = true;
						// due to the nature of isFile() we don't check that here
						isValid = !isValueType(fieldValue) && !isArray(fieldValue);
						break;

					case "array":
						isChecked = true;
						isValid = isArray(fieldValue);
						break;
				}
			}
			break;

		case "required":
			isChecked = true;
			isValid = (
				!isEmpty(fieldValue) &&
				(fieldType.baseType !== "array" || (isArray(fieldValue) && !!fieldValue.length)) &&
				(fieldType.baseType !== "object" || !isEmptyObject(fieldValue))
			);
			break;

		case "regExp":
			if (fieldType.baseType === "text" && isString(fieldValue) && fieldValue) {
				isChecked = true;
				regExpMatch = fieldValue.match(rule.regExp) || undefined;
				isValid = !!regExpMatch;
			}
			break;

		case "fileContentType":
			if (fieldType.baseType === "file" && isFile(fieldValue)) {
				isChecked = true;

				if (fieldValue.type && rule.allowedContentTypes.length) {
					isValid = (rule.allowedContentTypes[0] as ContentType).allowedContentTypes
						? (rule.allowedContentTypes as ContentType[]).some(contentType => contentType.allowedContentTypes.includes(fieldValue.type))
						: (rule.allowedContentTypes as string[]).includes(fieldValue.type);
				}
			}
			break;

		case "fileExtension":
			if (fieldType.baseType === "file" && isFile(fieldValue)) {
				isChecked = true;

				if (fieldValue.name) {
					const i = fieldValue.name.lastIndexOf(".");
					isValid = i >= 0 && rule.allowedExtensions.includes(fieldValue.name.substring(i + 1));
				}
			}
			break;

		case "fileContentTypeAndExtension":
			if (fieldType.baseType === "file" && isFile(fieldValue)) {
				isChecked = true;

				if (fieldValue.name && fieldValue.type && rule.allowedContentTypes.length) {
					const i = fieldValue.name.lastIndexOf(".");

					if (i >= 0) {
						const extension = fieldValue.name.substring(i + 1);

						isValid = rule.allowedContentTypes.some(contentType =>
							contentType.allowedContentTypes.includes(fieldValue.type) &&
							contentType.allowedExtensions.includes(extension)
						);
					}
				}
			}
			break;

		case "customValidation":
			isChecked = true;
			isValid = rule.validate(fieldValue, fieldType);
			break;

		case "minDateValue":
			if (fieldType.baseType === "date" && isDate(fieldValue)) {
				isChecked = true;
				isValid = rule.mustBeGreater
					? compareDates(fieldValue, rule.minDate) > 0
					: compareDates(fieldValue, rule.minDate) >= 0;
			}
			break;

		case "maxDateValue":
			if (fieldType.baseType === "date" && isDate(fieldValue)) {
				isChecked = true;
				isValid = rule.mustBeLess
					? compareDates(fieldValue, rule.maxDate) < 0
					: compareDates(fieldValue, rule.maxDate) <= 0;
			}
			break;

		case "expectedDateValue":
			if (fieldType.baseType === "date" && isDate(fieldValue)) {
				isChecked = true;
				isValid = sameDates(fieldValue, rule.expectedValue);
			}
			break;

		case "maxFileSize":
			if (fieldType.baseType === "file" && isFile(fieldValue)) {
				isChecked = true;
				isValid = fieldValue.size <= rule.maxFileSize;
			}
			break;

		case "minArrayLength":
			if (fieldType.baseType === "array" && isArray(fieldValue)) {
				isChecked = true;

				if (rule.filter) {
					isValid = fieldValue.filter(itemValue => validateField(fieldType.itemFieldType, itemValue).isValid).length >= rule.minLength;
				} else {
					isValid = fieldValue.length >= rule.minLength;
				}
			}
			break;

		case "maxArrayLength":
			if (fieldType.baseType === "array" && isArray(fieldValue)) {
				isChecked = true;

				if (rule.filter) {
					isValid = fieldValue.filter(itemValue => validateField(fieldType.itemFieldType, itemValue).isValid).length <= rule.maxLength;
				} else {
					isValid = fieldValue.length <= rule.maxLength;
				}
			}
			break;

		case "minTextLength":
			if (fieldType.baseType === "text" && isString(fieldValue)) {
				isChecked = true;
				isValid = fieldValue.length >= rule.minLength;
			}
			break;

		case "maxTextLength":
			if (fieldType.baseType === "text" && isString(fieldValue)) {
				isChecked = true;
				isValid = fieldValue.length <= rule.maxLength;
			}
			break;

		case "expectedTextValue":
			if (fieldType.baseType === "text" && isString(fieldValue)) {
				isChecked = true;
				isValid = rule.caseInsensitive
					? fieldValue?.toLocaleLowerCase() === rule.expectedValue?.toLocaleLowerCase()
					: fieldValue === rule.expectedValue;
			}
			break;

		case "expectedBooleanValue":
			if (fieldType.baseType === "boolean" && isBoolean(fieldValue)) {
				isChecked = true;
				isValid = fieldValue === rule.expectedValue;
			}
			break;

		case "minNumberValue":
			if (fieldType.baseType === "number" && isNumber(fieldValue)) {
				isChecked = true;
				isValid = rule.mustBeGreater ? fieldValue > rule.minValue : fieldValue >= rule.minValue;
			}
			break;

		case "maxNumberValue":
			if (fieldType.baseType === "number" && isNumber(fieldValue)) {
				isChecked = true;
				isValid = rule.mustBeLess ? fieldValue < rule.maxValue : fieldValue <= rule.maxValue;
			}
			break;

		case "expectedNumberValue":
			if (fieldType.baseType === "number" && isNumber(fieldValue)) {
				isChecked = true;
				isValid = fieldValue === rule.expectedValue;
			}
			break;
	}

	return {
		isValid, isChecked, rule, regExpMatch,
		message: !isValid ? rule.message : undefined
	};
}

export function validateRules(rules: FieldValidationRule[], fieldValue: unknown, fieldType: FieldType): FieldRuleValidationResult[] {
	return rules.map(rule => validateFieldRule(rule, fieldValue, fieldType));
}

export function validateField(fieldValue: unknown, fieldType: FieldType): FieldValidationResult {
	const ruleValidationResult = [
		// validate type
		validateFieldRule(
			{
				ruleType: "valueType",
				valueType: fieldType.baseType
			},
			fieldValue,
			fieldType),

		// validate rules
		...validateRules(fieldType.rules, fieldValue, fieldType)
	];

	// validate object
	const objectValidationResult = fieldType.baseType === "object"
		? validateObject(fieldValue as FieldValues, fieldType.objectFieldTypes)
		: undefined;

	// validate array
	const arrayValidationResult = fieldType.baseType === "array"
		? getResolvedArray(fieldValue).map(itemValue => validateField(itemValue, fieldType.itemFieldType))
		: undefined;

	return {
		fieldType,
		fieldValue,
		ruleValidationResult,
		arrayValidationResult,
		objectValidationResult,

		isValid: (
			ruleValidationResult.every(rule => rule.isValid) &&
			(!objectValidationResult || objectValidationResult.isValid) &&
			(!arrayValidationResult || arrayValidationResult.every(itemRule => itemRule.isValid))
		)
	};
}

export function validateObject<TFieldValues extends FieldValues>(
	fieldValues: TFieldValues,
	fieldTypes: FieldTypes
): ObjectValidationResult<TFieldValues> {
	const validationResult: { [name: string]: FieldValidationResult } = {};
	let isValid = true;

	for (const [name, fieldType] of Object.entries(fieldTypes)) {
		const fieldValue = (fieldValues as any)[name];
		const fieldValidationResult = validateField(fieldValue, fieldType);

		(validationResult as any)[name] = fieldValidationResult;

		if (!fieldValidationResult.isValid) {
			isValid = false;
		}
	}

	return {
		fieldTypes, fieldValues, isValid, validationResult
	};
}
