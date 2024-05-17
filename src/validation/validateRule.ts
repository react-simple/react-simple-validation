import {
	compareDates, isArray, isBoolean, isDate, isEmpty, isEmptyObject, isFile, isNumber, isString, isNullOrUndefined, sameDates, isValueType,
	findNonEmptyValue, getObjectChildMemberValue, joinNonEmptyValues, getResolvedArray
} from "@react-simple/react-simple-util";
import { FieldType, TypedFieldNamed } from "fields";
import { FieldValidationRule } from "rules";
import { FieldRuleValidationResult, FieldValidationContext } from "./types";

const getFilteredArrayItems = (
	rule: { filter?: FieldValidationRule },
	field: TypedFieldNamed<{ itemFieldType: FieldType }, unknown[]>,
	context: FieldValidationContext
) => {
	return rule.filter
		? field.value.filter((itemValue, itemIndex) => validateRule(
			rule.filter!,
			{
				value: itemValue,
				type: field.type.itemFieldType,
				name: `${field.name}[${itemIndex}]`,
				fullQualifiedName: `${field.fullQualifiedName}[${itemIndex}]`
			},
			{
				...context,
				itemIndex
			}
		).isValid)
		: field.value;
};

const validateRuleForArrayItem = (
	itemValue: unknown,
	itemIndex: number,
	rule: { predicate: FieldValidationRule },
	field: TypedFieldNamed<{ itemFieldType: FieldType }, unknown[]>,
	context: FieldValidationContext
) => {
	return validateRule(
		rule.predicate,
		{
			value: itemValue,
			type: field.type.itemFieldType,
			name: `${field.name}[${itemIndex}]`,
			fullQualifiedName: `${field.fullQualifiedName}[${itemIndex}]`
		},
		{
			...context,
			itemIndex
		}
	)
};

// can return multiple rules, if there are child rules ('switch' or 'if-then-else' for example)
export function validateRule(
	rule: FieldValidationRule,
	field: TypedFieldNamed,
	context: FieldValidationContext
): FieldRuleValidationResult {
	let isChecked = false;
	let isValid = false;
	let message = rule.message;
	let regExpMatch: RegExpMatchArray | undefined;
	let customResult: unknown;

	const scope = "validateRule";
	const { value, type, name, fullQualifiedName } = field;
	let childRules: FieldRuleValidationResult[] = [];

	switch (rule.ruleType) {
		case "type":
			if (isNullOrUndefined(value)) {
				isChecked = true;
				isValid = true;
			}
			else {
				switch (type.baseType) {
					case "text":
						isChecked = true;
						isValid = isString(value);
						break;

					case "number":
						isChecked = true;
						isValid = isNumber(value);
						break;

					case "date":
						isChecked = true;
						isValid = isDate(value);
						break;

					case "boolean":
						isChecked = true;
						isValid = isBoolean(value);
						break;

					case "file":
						isChecked = true;
						isValid = isFile(value);
						break;

					case "object":
						isChecked = true;
						// due to the nature of isFile() we don't check that here
						isValid = !isValueType(value) && !isArray(value);
						break;

					case "array":
						isChecked = true;
						isValid = isArray(value);
						break;
				}
			}
			break;

		case "required":
			isChecked = true;
			isValid = (
				!isEmpty(value) &&
				(type.baseType !== "array" || (isArray(value) && !!value.length)) &&
				(type.baseType !== "object" || !isEmptyObject(value))
			);
			break;

		case "text-regexp":
			if (type.baseType === "text" && isString(value) && value) {
				isChecked = true;
				regExpMatch = (
					isArray(rule.regExp)
						? findNonEmptyValue(rule.regExp, regExp => value.match(regExp))
						: value.match(rule.regExp)
				) || undefined;

				isValid = !!regExpMatch;
			}
			break;

		case "file-contenttype":
			if (type.baseType === "file" && isFile(value)) {
				isChecked = true;

				if (value.type && rule.allowedContentTypes) {
					if (!isArray(rule.allowedContentTypes)) {
						isValid = rule.allowedContentTypes.allowedContentTypes.includes(value.type);
					}
					else if (rule.allowedContentTypes.length) {
						isValid = rule.allowedContentTypes.some(contentType => contentType.allowedContentTypes.includes(value.type));
					}
				}
			}
			break;

		case "custom":
			const res = rule.validate(field, context);
			isValid = res.isValid;
			isChecked = res.isChecked !== false;
			message = res.message || message;
			customResult = res.customResult || customResult;
			break;

		case "date-min":
			if (type.baseType === "date" && isDate(value)) {
				isChecked = true;
				isValid = rule.mustBeGreater
					? compareDates(value, rule.minDate) > 0
					: compareDates(value, rule.minDate) >= 0;
			}
			break;

		case "date-max":
			if (type.baseType === "date" && isDate(value)) {
				isChecked = true;
				isValid = rule.mustBeLess
					? compareDates(value, rule.maxDate) < 0
					: compareDates(value, rule.maxDate) <= 0;
			}
			break;

		case "date-range":
			if (type.baseType === "date" && isDate(value)) {
				isChecked = true;
				isValid = (
					(rule.mustBeLess ? compareDates(value, rule.maxDate) < 0 : compareDates(value, rule.maxDate) <= 0) &&
					(rule.mustBeGreater ? compareDates(value, rule.minDate) > 0 : compareDates(value, rule.minDate) >= 0)
				);
			}
			break;

		case "date-value":
			if (type.baseType === "date" && isDate(value)) {
				isChecked = true;
				isValid = isArray(rule.expectedValue)
					? rule.expectedValue.some(expectedValue => sameDates(value, expectedValue))
					: sameDates(value, rule.expectedValue);
			}
			break;

		case "file-size-max":
			if (type.baseType === "file" && isFile(value)) {
				isChecked = true;
				isValid = value.size <= rule.maxFileSize;
			}
			break;

		case "array-length-min":
			if (type.baseType === "array" && isArray(value)) {
				const items = getFilteredArrayItems(rule, field as any, context);

				isChecked = true;
				isValid = items.length >= rule.minLength;
			}
			break;

		case "array-length-max":
			if (type.baseType === "array" && isArray(value)) {
				const items = getFilteredArrayItems(rule, field as any, context);

				isChecked = true;
				isValid = items.length <= rule.maxLength;
			}
			break;

		case "array-length-range":
			if (type.baseType === "array" && isArray(value)) {
				const items = getFilteredArrayItems(rule, field as any, context);

				isChecked = true;
				isValid = items.length <= rule.maxLength && items.length >= rule.minLength;
			}
			break;

		case "array-length":
			if (type.baseType === "array" && isArray(value)) {
				const items = getFilteredArrayItems(rule, field as any, context);

				isChecked = true;
				isValid = isArray(rule.expectedLength)
					? rule.expectedLength.includes(items.length)
					: items.length === rule.expectedLength;
			}
			break;

		case "array-include-some":
			if (type.baseType === "array" && isArray(value)) {
				const items = getFilteredArrayItems(rule, field as any, context);

				isChecked = true;
				isValid = isArray(rule.item)
					? rule.item.some(expectedValue => items.includes(expectedValue))
					: items.includes(rule.item);
			}
			break;

		case "array-include-all":
			if (type.baseType === "array" && isArray(value)) {
				const items = getFilteredArrayItems(rule, field as any, context);

				isChecked = true;
				isValid = isArray(rule.item)
					? rule.item.every(expectedValue => items.includes(expectedValue))
					: items.includes(rule.item);
			}
			break;

		case "array-include-none":
			if (type.baseType === "array" && isArray(value)) {
				const items = getFilteredArrayItems(rule, field as any, context);

				isChecked = true;
				isValid = isArray(rule.item)
					? rule.item.every(expectedValue => !items.includes(expectedValue))
					: !items.includes(rule.item);
			}
			break;

		case "array-predicate-some":
			if (type.baseType === "array" && isArray(value)) {
				const items = getFilteredArrayItems(rule, field as any, context);
				childRules = items.map((val, ndx) => validateRuleForArrayItem(val, ndx, rule, field as any, context));

				isChecked = true;
				isValid = childRules.some(t => t.isValid);
			}
			break;

		case "array-predicate-all":
			if (type.baseType === "array" && isArray(value)) {
				const items = getFilteredArrayItems(rule, field as any, context);
				childRules = items.map((val, ndx) => validateRuleForArrayItem(val, ndx, rule, field as any, context));

				isChecked = true;
				isValid = childRules.every(t => t.isValid);
			}
			break;

		case "text-length-min":
			if (type.baseType === "text" && isString(value)) {
				isChecked = true;
				isValid = value.length >= rule.minLength;
			}
			break;

		case "text-length-max":
			if (type.baseType === "text" && isString(value)) {
				isChecked = true;
				isValid = value.length <= rule.maxLength;
			}
			break;

		case "text-length-range":
			if (type.baseType === "text" && isString(value)) {
				isChecked = true;
				isValid = value.length >= rule.minLength && value.length <= rule.maxLength;
			}
			break;

		case "text-length":
			if (type.baseType === "text" && isString(value)) {
				isChecked = true;
				isValid = isArray(rule.expectedLength)
					? rule.expectedLength.includes(value.length)
					: value.length === rule.expectedLength;
			}
			break;

		case "text-value":
			if (type.baseType === "text" && isString(value)) {
				isChecked = true;

				if (rule.caseInsensitive) {
					const valueToLower = value?.toLocaleLowerCase();

					isValid = isArray(rule.expectedValue)
						? rule.expectedValue.some(expectedValue => expectedValue?.toLocaleLowerCase() === valueToLower)
						: valueToLower === rule.expectedValue?.toLocaleLowerCase();
				} else {
					isValid = isArray(rule.expectedValue)
						? rule.expectedValue.includes(value)
						: value === rule.expectedValue;
				}
			}
			break;

		case "boolean-value":
			if (type.baseType === "boolean" && isBoolean(value)) {
				isChecked = true;
				isValid = value === rule.expectedValue;
			}
			break;

		case "number-min":
			if (type.baseType === "number" && isNumber(value)) {
				isChecked = true;
				isValid = rule.mustBeGreater ? value > rule.minValue : value >= rule.minValue;
			}
			break;

		case "number-max":
			if (type.baseType === "number" && isNumber(value)) {
				isChecked = true;
				isValid = rule.mustBeLess ? value < rule.maxValue : value <= rule.maxValue;
			}
			break;

		case "number-range":
			if (type.baseType === "number" && isNumber(value)) {
				isChecked = true;
				isValid = (
					(rule.mustBeLess ? value < rule.maxValue : value <= rule.maxValue) &&
					(rule.mustBeGreater ? value > rule.minValue : value >= rule.minValue)
				);
			}
			break;

		case "number-value":
			if (type.baseType === "number" && isNumber(value)) {
				isChecked = true;
				isValid = isArray(rule.expectedValue)
					? rule.expectedValue.includes(value)
					: value === rule.expectedValue;
			}
			break;

		case "some-rules-valid":
			childRules = rule.rules.map(t => validateRule(t, field, context));

			isChecked = true;
			isValid = childRules.some(t => t.isValid);
			break;

		case "all-rules-valid":
			childRules = rule.rules.map(t => validateRule(t, field, context));

			isChecked = true;
			isValid = childRules.every(t => t.isValid);
			break;

		case "array-item-index":
			isChecked = true;
			isValid = context.itemIndex == rule.index;
			break;

		case "array-item-index-min":
			isChecked = true;
			isValid = !isEmpty(context.itemIndex) && context.itemIndex >= rule.minIndex;
			break;

		case "array-item-index-max":
			isChecked = true;
			isValid = !isEmpty(context.itemIndex) && context.itemIndex <= rule.maxIndex;
			break;

		case "array-item-index-range":
			isChecked = true;
			isValid = !isEmpty(context.itemIndex) && context.itemIndex >= rule.minIndex && context.itemIndex <= rule.maxIndex;
			break;

		case "if-then-else":
			const ifResult = validateRule(rule.if, field, context);
			const caseRules = getResolvedArray(ifResult.isValid ? rule.then : rule.else);
			childRules = caseRules.map(t => validateRule(t, field, context));

			isChecked = true;
			isValid = childRules.every(t => t.isValid);
			break;

		case "switch":
			isChecked = true;
			let done = false;

			for (const [if_, then_] of rule.cases) {
				if (validateRule(if_, field, context).isValid) {
					const caseResult = getResolvedArray(then_).map(t => validateRule(t, field, context));
					childRules.push(...caseResult);

					isValid = caseResult.every(t => t.isValid);
					done = true;
					break;
				}
			}

			if (!done) {
				if (rule.default) {
					const caseResult = getResolvedArray(rule.default).map(t => validateRule(t, field, context));
					childRules.push(...caseResult);

					isValid = caseResult.every(t => t.isValid);
				}
				else {
					isValid = true;
				}
			}
			break;

		case "field-reference":
			// resolve path starting from the closest object in hierarchy by default; using "/" or "@" in path can refer to root or named objects
			if (rule.path) {
				let referred: TypedFieldNamed | undefined;
				let path = rule.path;

				// root path?
				if (path.startsWith("/")) {
					path = path.substring(1);
					const i = path.lastIndexOf(".");

					referred = {
						value: getObjectChildMemberValue(context.rootObj.values, path),
						type: getObjectChildMemberValue(context.rootObj.types, path),
						name: i >= 0 ? path.substring(i + 1) : path,
						fullQualifiedName: path
					};
				}
				else if (path[0].startsWith("@")) {
					let i = path.indexOf(".", 1);
					const refName = i >= 0 ? path.substring(1, i) : path.substring(1);
					const namedObj = context.namedObjs[refName];
					path = i >= 0 ? path.substring(i + 1) : "";

					if (namedObj) {
						i = path.lastIndexOf(".");

						referred = {
							value: getObjectChildMemberValue(namedObj.values, path),
							type: getObjectChildMemberValue(namedObj.types, path),
							name: i >= 0 ? path.substring(i + 1) : path,
							fullQualifiedName: joinNonEmptyValues([namedObj.fullQualifiedName, path], ".")
						};
					}
					else {
						context.notFoundRefNames[refName] = {
							...context.notFoundRefNames[refName],
							[fullQualifiedName]: { field, rule }
						};
					}
				}
				else {
					const i = path.lastIndexOf(".");

					referred = {
						value: getObjectChildMemberValue(context.currentObj.values, path),
						type: getObjectChildMemberValue(context.currentObj.types, path),
						name: i >= 0 ? path.substring(i + 1) : path,
						fullQualifiedName: joinNonEmptyValues([context.currentObj.fullQualifiedName, path], ".")
					};
				}

				if (referred) {
					isChecked = true; // the type of the referred field must be defined

					isValid = isChecked && (
						isArray(rule.rules)
							? rule.rules.every(childRule => validateRule(childRule, referred!, context,).isValid)
							: validateRule(rule.rules, referred, context).isValid
					);
				}
			}

			break;
	}

	return {
		name,
		fullQualifiedName,
		objectFullQualifiedName: context.currentObj.fullQualifiedName,
		itemIndex: context.itemIndex,

		rule,
		fieldType: field.type.type,
		value,		

		isValid,
		isChecked,
		message: !isValid ? message : undefined,

		regExpMatch,
		customResult,
		childRules
	};
}
