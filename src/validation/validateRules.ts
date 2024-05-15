import {
	compareDates, isArray, isBoolean, isDate, isEmpty, isEmptyObject, isFile, isNumber, isString, isNullOrUndefined, sameDates, isValueType,
	findNonEmptyValue, getObjectChildMemberValue
} from "@react-simple/react-simple-util";
import { FieldType } from "fields";
import { FieldValidationRule } from "rules";
import { FieldRuleValidationResult, FieldValidationContext } from "./types";

// returns errors
export function validateRule(
	rule: FieldValidationRule,
	fieldValue: unknown,
	fieldType: FieldType,
	context: FieldValidationContext
): FieldRuleValidationResult {
	let isChecked = false;
	let isValid = false;
	let regExpMatch: RegExpMatchArray | undefined;

	switch (rule.ruleType) {
		case "type":
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

		case "text-regexp":
			if (fieldType.baseType === "text" && isString(fieldValue) && fieldValue) {
				isChecked = true;
				regExpMatch = (
					isArray(rule.regExp)
						? findNonEmptyValue(rule.regExp, t => fieldValue.match(t))
						: fieldValue.match(rule.regExp)
				) || undefined;

				isValid = !!regExpMatch;
			}
			break;

		case "file-contenttype":
			if (fieldType.baseType === "file" && isFile(fieldValue)) {
				isChecked = true;

				if (fieldValue.type && rule.allowedContentTypes.length) {
					isValid = rule.allowedContentTypes.some(contentType => contentType.allowedContentTypes.includes(fieldValue.type));
				}
			}
			break;

		case "custom":
			isChecked = true;
			isValid = rule.validate(fieldValue, fieldType);
			break;

		case "date-min":
			if (fieldType.baseType === "date" && isDate(fieldValue)) {
				isChecked = true;
				isValid = rule.mustBeGreater
					? compareDates(fieldValue, rule.minDate) > 0
					: compareDates(fieldValue, rule.minDate) >= 0;
			}
			break;

		case "date-max":
			if (fieldType.baseType === "date" && isDate(fieldValue)) {
				isChecked = true;
				isValid = rule.mustBeLess
					? compareDates(fieldValue, rule.maxDate) < 0
					: compareDates(fieldValue, rule.maxDate) <= 0;
			}
			break;

		case "date-range":
			if (fieldType.baseType === "date" && isDate(fieldValue)) {
				isChecked = true;
				isValid = (
					(rule.mustBeLess ? compareDates(fieldValue, rule.maxDate) < 0 : compareDates(fieldValue, rule.maxDate) <= 0) &&
					(rule.mustBeGreater ? compareDates(fieldValue, rule.minDate) > 0 : compareDates(fieldValue, rule.minDate) >= 0)
				);
			}
			break;

		case "date-value":
			if (fieldType.baseType === "date" && isDate(fieldValue)) {
				isChecked = true;
				isValid = isArray(rule.expectedValue)
					? rule.expectedValue.some(t => sameDates(fieldValue, t))
					: sameDates(fieldValue, rule.expectedValue);
			}
			break;

		case "file-size-max":
			if (fieldType.baseType === "file" && isFile(fieldValue)) {
				isChecked = true;
				isValid = fieldValue.size <= rule.maxFileSize;
			}
			break;

		case "array-length-min":
			if (fieldType.baseType === "array" && isArray(fieldValue)) {
				const items = rule.filter
					? fieldValue.filter((itemValue, arrayIndex) => validateRule(rule.filter!, itemValue, fieldType.itemFieldType, { ...context, arrayIndex }).isValid)
					: fieldValue;

				isChecked = true;
				isValid = items.length >= rule.minLength;
			}
			break;

		case "array-length-max":
			if (fieldType.baseType === "array" && isArray(fieldValue)) {

				const items = rule.filter
					? fieldValue.filter((itemValue, arrayIndex) => validateRule(rule.filter!, itemValue, fieldType.itemFieldType, { ...context, arrayIndex }).isValid)
					: fieldValue;

				isChecked = true;
				isValid = items.length <= rule.maxLength;
			}
			break;

		case "array-length-range":
			if (fieldType.baseType === "array" && isArray(fieldValue)) {

				const items = rule.filter
					? fieldValue.filter((itemValue, arrayIndex) => validateRule(rule.filter!, itemValue, fieldType.itemFieldType, { ...context, arrayIndex }).isValid)
					: fieldValue;

				isChecked = true;
				isValid = items.length <= rule.maxLength && items.length >= rule.minLength;
			}
			break;

		case "array-length":
			if (fieldType.baseType === "array" && isArray(fieldValue)) {

				const items = rule.filter
					? fieldValue.filter((itemValue, arrayIndex) => validateRule(rule.filter!, itemValue, fieldType.itemFieldType, { ...context, arrayIndex }).isValid)
					: fieldValue;

				isChecked = true;
				isValid = isArray(rule.expectedLength)
					? rule.expectedLength.includes(items.length)
					: items.length === rule.expectedLength;
			}
			break;

		case "array-include-some":
			if (fieldType.baseType === "array" && isArray(fieldValue)) {
				const items = rule.filter
					? fieldValue.filter((itemValue, arrayIndex) => validateRule(rule.filter!, itemValue, fieldType.itemFieldType, { ...context, arrayIndex }).isValid)
					: fieldValue;

				isChecked = true;
				isValid = isArray(rule.item)
					? rule.item.some(t => items.includes(t))
					: items.includes(rule.item);
			}
			break;

		case "array-include-all":
			if (fieldType.baseType === "array" && isArray(fieldValue)) {
				const items = rule.filter
					? fieldValue.filter((itemValue, arrayIndex) => validateRule(rule.filter!, itemValue, fieldType.itemFieldType, { ...context, arrayIndex }).isValid)
					: fieldValue;

				isChecked = true;
				isValid = isArray(rule.item)
					? rule.item.every(t => items.includes(t))
					: items.includes(rule.item);
			}
			break;

		case "array-include-none":
			if (fieldType.baseType === "array" && isArray(fieldValue)) {
				const items = rule.filter
					? fieldValue.filter((itemValue, arrayIndex) => validateRule(rule.filter!, itemValue, fieldType.itemFieldType, { ...context, arrayIndex }).isValid)
					: fieldValue;

				isChecked = true;
				isValid = isArray(rule.item)
					? rule.item.every(t => !items.includes(t))
					: !items.includes(rule.item);
			}
			break;

		case "array-predicate-some":
			if (fieldType.baseType === "array" && isArray(fieldValue)) {
				isChecked = true;
				isValid = fieldValue.some((itemValue, arrayIndex) => validateRule(rule.predicate, itemValue, fieldType.itemFieldType, { ...context, arrayIndex }).isValid);
			}
			break;

		case "array-predicate-all":
			if (fieldType.baseType === "array" && isArray(fieldValue)) {
				isChecked = true;
				isValid = fieldValue.every((itemValue, arrayIndex) => validateRule(rule.predicate, itemValue, fieldType.itemFieldType, { ...context, arrayIndex }).isValid);
			}
			break;

		case "array-predicate-none":
			if (fieldType.baseType === "array" && isArray(fieldValue)) {
				isChecked = true;
				isValid = fieldValue.every((itemValue, arrayIndex) => !validateRule(rule.predicate, itemValue, fieldType.itemFieldType, { ...context, arrayIndex }).isValid);
			}
			break;

		case "text-length-min":
			if (fieldType.baseType === "text" && isString(fieldValue)) {
				isChecked = true;
				isValid = fieldValue.length >= rule.minLength;
			}
			break;

		case "text-length-max":
			if (fieldType.baseType === "text" && isString(fieldValue)) {
				isChecked = true;
				isValid = fieldValue.length <= rule.maxLength;
			}
			break;

		case "text-length-range":
			if (fieldType.baseType === "text" && isString(fieldValue)) {
				isChecked = true;
				isValid = fieldValue.length >= rule.minLength && fieldValue.length <= rule.maxLength;
			}
			break;

		case "text-length":
			if (fieldType.baseType === "text" && isString(fieldValue)) {
				isChecked = true;
				isValid = isArray(rule.expectedLength)
					? rule.expectedLength.includes(fieldValue.length)
					: fieldValue.length === rule.expectedLength;
			}
			break;

		case "text-value":
			if (fieldType.baseType === "text" && isString(fieldValue)) {
				isChecked = true;

				if (rule.caseInsensitive) {
					const value = fieldValue?.toLocaleLowerCase();

					isValid = isArray(rule.expectedValue)
						? rule.expectedValue.some(t => t?.toLocaleLowerCase() === value)
						: value === rule.expectedValue?.toLocaleLowerCase();
				} else {
					isValid = isArray(rule.expectedValue)
						? rule.expectedValue.includes(fieldValue)
						: fieldValue === rule.expectedValue;
				}
			}
			break;

		case "boolean-value":
			if (fieldType.baseType === "boolean" && isBoolean(fieldValue)) {
				isChecked = true;
				isValid = fieldValue === rule.expectedValue;
			}
			break;

		case "number-min":
			if (fieldType.baseType === "number" && isNumber(fieldValue)) {
				isChecked = true;
				isValid = rule.mustBeGreater ? fieldValue > rule.minValue : fieldValue >= rule.minValue;
			}
			break;

		case "number-max":
			if (fieldType.baseType === "number" && isNumber(fieldValue)) {
				isChecked = true;
				isValid = rule.mustBeLess ? fieldValue < rule.maxValue : fieldValue <= rule.maxValue;
			}
			break;

		case "number-range":
			if (fieldType.baseType === "number" && isNumber(fieldValue)) {
				isChecked = true;
				isValid = (
					(rule.mustBeLess ? fieldValue < rule.maxValue : fieldValue <= rule.maxValue) &&
					(rule.mustBeGreater ? fieldValue > rule.minValue : fieldValue >= rule.minValue)
				);
			}
			break;

		case "number-value":
			if (fieldType.baseType === "number" && isNumber(fieldValue)) {
				isChecked = true;
				isValid = isArray(rule.expectedValue)
					? rule.expectedValue.includes(fieldValue)
					: fieldValue === rule.expectedValue;
			}
			break;

		case "some-rules-valid":
			isChecked = true;
			isValid = rule.rules.some(t => validateRule(t, fieldValue, fieldType, context).isValid);
			break;

		case "all-rules-valid":
			isChecked = true;
			isValid = rule.rules.every(t => validateRule(t, fieldValue, fieldType, context).isValid);
			break;

		case "array-index":
			isChecked = true;
			isValid = context.arrayIndex == rule.index;
			break;

		case "array-index-min":
			isChecked = true;
			isValid = !isEmpty(context.arrayIndex) && context.arrayIndex >= rule.minIndex;
			break;

		case "array-index-max":
			isChecked = true;
			isValid = !isEmpty(context.arrayIndex) && context.arrayIndex <= rule.maxIndex;
			break;

		case "array-index-range":
			isChecked = true;
			isValid = !isEmpty(context.arrayIndex) && context.arrayIndex >= rule.minIndex && context.arrayIndex <= rule.maxIndex;
			break;

		case "if-then-else":
			isChecked = true;

			if (validateRule(rule.if, fieldValue, fieldType, context).isValid) {
				isValid = isArray(rule.then)
					? rule.then.every(t => validateRule(t, fieldValue, fieldType, context).isValid)
					: validateRule(rule.then, fieldValue, fieldType, context).isValid;
			}
			else if (rule.else) {
				isValid = isArray(rule.else)
					? rule.else.every(t => validateRule(t, fieldValue, fieldType, context).isValid)
					: validateRule(rule.else, fieldValue, fieldType, context).isValid;
			}
			else {
				isValid = true;
			}
			break;

		case "field-reference":
			// resolve path starting from the closest object in hierarchy by default; using "/" or "@" in path can refer to root or named objects
			const referredValue = getObjectChildMemberValue(
				context.currentObj,
				rule.path,
				{
					rootObj: context.rootObj,
					namedObjs: context.namedObjs
				}
			);

			const referredType = getObjectChildMemberValue(
				context.currentType,
				rule.path,
				{
					rootObj: context.rootType,
					namedObjs: context.namedTypes
				}
			);

			isChecked = !!referredType; // the type of the referred field must be defined

			isValid = isChecked && (
				isArray(rule.rules)
					? rule.rules.every(t => validateRule(t, referredValue, referredType, context).isValid)
					: validateRule(rule.rules, referredValue, referredType, context).isValid
			);

			break;
	}

	return {
		isValid,
		isChecked,
		rule,
		regExpMatch,
		message: !isValid ? rule.message : undefined
	};
}
