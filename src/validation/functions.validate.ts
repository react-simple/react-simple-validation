import {
	compareDates, dateAdd, evaluateValueBinaryOperator, findMapped, findNonEmptyValue, getResolvedArray, isArray, isBoolean, isDate, isEmpty,
	isEmptyObject, isFile, isNullOrUndefined, isNumber, isString, isValueType, logWarning, sameDates, stringAppend, stringIndexOfAny
} from "@react-simple/react-simple-util";
import { getObjectChildValue } from "@react-simple/react-simple-mapping";
import { ArrayFieldType, FIELDS, Field, FieldType, FieldTypes, ObjectFieldType, getFieldTypeChild } from "fields";
import { FieldRuleValidationResult, FieldValidationResultDetails, FieldValidationResult, ObjectValidationResult } from "./types";
import { FieldValidationContext } from "validation/types";
import { REACT_SIMPLE_VALIDATION } from "data";
import { FieldValidationRule } from "rules";
import { getFieldRuleValidationErrorMessages } from "./functions.result";

function validateField_default(
	field: Field,
	context: FieldValidationContext
): FieldValidationResult {
	const { type, value, name, fullQualifiedName } = field;

	// this is non-local
	if (type.refName) {
		// set this object in the namedObjs collection if it has a name (see "field-reference" rules)
		context.namedObjs[type.refName] = field;
	}

	const errors: FieldValidationResult["errors"] = [
		// validate type
		validateRule({ ruleType: "type", valueType: type.baseType }, field, context),

		// validate rules
		...type.rules.map(rule => validateRule(rule, field, context))
	].filter(t => !t.isValid);

	let isValid = !errors.length;
	let children: FieldValidationResult["children"] = {};

	if (value) {
		// validate object
		if (type.baseType === "object") {
			const childContext: FieldValidationContext = {
				...context,
				currentObj: {
					value: value,
					type: type,
					name,
					fullQualifiedName
				}
			};

			for (const [childName, childType] of Object.entries<FieldType>(type.schema)) {
				const valResult = validateField(
					{
						type: childType,
						value: (value as any)[childName],
						name: childName,
						fullQualifiedName: stringAppend(fullQualifiedName, childName, ".")
					},
					childContext);

				if (!valResult.isValid) {
					children[childName] = valResult;
					isValid = false;
				}
			}
		}

		// validate array
		if (type.baseType === "array") {
			getResolvedArray(value).forEach((itemValue, itemIndex) => {
				const valResult = validateField(
					{
						value: itemValue,
						type: type.itemType,
						name: `${name}[${itemIndex}]`,
						fullQualifiedName: `${fullQualifiedName}[${itemIndex}]`
					},
					{
						...context,
						itemIndex
					}
				);

				if (!valResult.isValid) {
					children[itemIndex] = valResult;
					isValid = false;
				}
			});
		}
	}

	const result: FieldValidationResult = {
		// location
		name,
		fullQualifiedName,
		objectFullQualifiedName: context.currentObj.fullQualifiedName,
		itemIndex: context.itemIndex,

		// validated
		fieldType: type.type,
		value,

		// result
		isValid,
		errors,
		children
	};

	if (result.isValid) {
		delete context.errorsFlatList[fullQualifiedName];
	} else if (errors.some(t => !t.isValid)) {
		context.errorsFlatList[fullQualifiedName] = [
			...errors.flatMap(t => getFieldRuleValidationErrorMessages(t, context.cultureId)),

			// do not propagate child field errors to parents
			// ...Object.values(children).flatMap(t => Object.values(getFieldValidationErrorMessages(t, context.cultureId))).flat()
		];
	}

	return result;
}

REACT_SIMPLE_VALIDATION.DI.validateField = validateField_default;

// the FieldCustomValidationRule.validate() callback must have the same signature
export function validateField(
	field: Field,
	context: FieldValidationContext
): FieldValidationResult { 
	return REACT_SIMPLE_VALIDATION.DI.validateField(field, context, validateField_default);
}

// If context is not specified that is understood as a 'validate root object' call, therefore the fieldTypes tree will be first iterated
// to collect all named objects (for forward references, when an object later in the hierarchy is referred by @refName).
// Schema is not FieldType or value type, it's an object with the keys we need.
// Usually, those keys are coming from ObjectFieldType.schema.
function validateObject_default<Schema extends FieldTypes, Obj extends object = object>(
	obj: Obj,
	schema: Schema,
	options: {
		namedObjs?: FieldValidationContext["namedObjs"];
		data?: any;
	} = {}
): ObjectValidationResult<Schema> {

	const type = FIELDS.object(schema);

	const field: Field<ObjectFieldType<Schema>, Obj> = {
		type,
		value: obj,
		fullQualifiedName: "",
		name: ""
	};

	const context: FieldValidationContext = {
		currentObj: field,
		rootObj: field,
		namedObjs: options.namedObjs || {},
		refNames: { notFound: {}, resolved: {} },
		errorsFlatList: {},
		data: options.data
	};

	// root objects cannot have rules which are not on the members, therefore 'errors' can be ignored here, 'children' is sufficient
	const { isValid, children } = validateField(field, context);
	
	return {
		isValid,
		// @ts-ignore
		errors: children,
		namedObjs: context.namedObjs,
		refNames: context.refNames,
		errorsFlatList: context.errorsFlatList
	};
}

REACT_SIMPLE_VALIDATION.DI.validateObject = validateObject_default;

// If context is not specified that is understood as a 'validate root object' call, therefore the fieldTypes tree will be first iterated
// to collect all named objects (for forward references, when an object later in the hierarchy is referred by @refName).
// Schema is not FieldType or value type, it's an object with the keys we need.
// Usually, those keys are coming from ObjectFieldType.schema.
export function validateObject<Schema extends FieldTypes, Obj extends object = object>(
	obj: Obj,
	schema: Schema,
	options: {
		namedObjs?: FieldValidationContext["namedObjs"];
		data?: any;
	} = {}
): ObjectValidationResult<Schema> {
	return REACT_SIMPLE_VALIDATION.DI.validateObject(obj, schema, options, validateObject_default);
}

// can return multiple rules, if there are child rules ('switch' or 'if-then-else' for example)
function validateRule_default(
	rule: FieldValidationRule,
	field: Field,
	context: FieldValidationContext
): FieldRuleValidationResult {
	let isValid = true;
	let message = rule.message;
	let regExpMatch: RegExpMatchArray | undefined;
	let details: FieldValidationResultDetails[] = []; // custom info

	const scope = "validateRule";
	const { value, type, fullQualifiedName } = field;

	const errors: FieldRuleValidationResult[] = [];

	switch (rule.ruleType) {
		case "type":
			if (isNullOrUndefined(value)) {
				isValid = true;
			}
			else {
				switch (type.baseType) {
					case "any":
						isValid = true;
						break;
					
					case "text":
						isValid = isString(value);
						break;

					case "number":
						isValid = isNumber(value);
						break;

					case "date":
						isValid = isDate(value);
						break;

					case "boolean":
						isValid = isBoolean(value);
						break;

					case "file":
						isValid = isFile(value);
						break;

					case "object":
						// due to the nature of isFile() we don't check that here
						isValid = !isValueType(value) && !isArray(value);
						break;

					case "array":
						isValid = isArray(value);
						break;
					
					default:
						logWarning(`[validateRule]: Unsupported field type '${type}'`);
						break;
				}
			}
			break;

		case "required":
			isValid = (
				!isEmpty(value) &&
				(type.baseType !== "array" || (isArray(value) && !!value.length)) &&
				(type.baseType !== "object" || !isEmptyObject(value))
			);
			break;

		// we only validate existing values with correct type
		// if it's empty or has invalid type then those are the 'required' and 'type' roles' responsibilities to catch it

		case "text-match":
			if (type.baseType === "text" && isString(value) && value) {
				regExpMatch = (
					isArray(rule.regExp)
						? findNonEmptyValue(rule.regExp, regExp => value.match(regExp))
						: value.match(rule.regExp)
				) || undefined;

				isValid = !!regExpMatch;
			}
			break;

		case "file-content-type":
			if (type.baseType === "file" && isFile(value)) {
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

		case "text-custom":
		case "number-custom":
		case "date-custom":
		case "boolean-custom":
		case "file-custom":
		case "array-custom":
		case "object-custom":
		case "any-custom": {
			const res = rule.validate(field as any, context, customField => validateField(customField, context));

			isValid = res.isValid;
			message = res.message || message;

			if (res.details) {
				details = [...details, ...res.details];
			}

			if (res.errors) {
				errors.push(...res.errors);
			}
			break;
		}
			
		case "date-min":
			if (type.baseType === "date" && isDate(value)) {
				isValid = rule.mustBeGreater
					? compareDates(value, rule.minDate) > 0
					: compareDates(value, rule.minDate) >= 0;
			}
			break;

		case "date-max":
			if (type.baseType === "date" && isDate(value)) {
				isValid = rule.mustBeLess
					? compareDates(value, rule.maxDate) < 0
					: compareDates(value, rule.maxDate) <= 0;
			}
			break;

		case "date-range":
			if (type.baseType === "date" && isDate(value)) {
				isValid = (
					(rule.mustBeLess ? compareDates(value, rule.maxDate) < 0 : compareDates(value, rule.maxDate) <= 0) &&
					(rule.mustBeGreater ? compareDates(value, rule.minDate) > 0 : compareDates(value, rule.minDate) >= 0)
				);
			}
			break;

		case "date-value":
			if (type.baseType === "date" && isDate(value)) {
				isValid = isArray(rule.expectedValue)
					? rule.expectedValue.some(expectedValue => sameDates(value, expectedValue))
					: sameDates(value, rule.expectedValue);
			}
			break;

		case "file-size-max":
			if (type.baseType === "file" && isFile(value)) {
				isValid = value.size <= rule.maxFileSize;
			}
			break;

		case "array-length-min":
			if (type.baseType === "array" && isArray(value)) {
				const items = getFilteredArrayItems(rule, field as any, context);
				isValid = items.length >= rule.minLength;
			}
			break;

		case "array-length-max":
			if (type.baseType === "array" && isArray(value)) {
				const items = getFilteredArrayItems(rule, field as any, context);
				isValid = items.length <= rule.maxLength;
			}
			break;

		case "array-length-range":
			if (type.baseType === "array" && isArray(value)) {
				const items = getFilteredArrayItems(rule, field as any, context);
				isValid = items.length <= rule.maxLength && items.length >= rule.minLength;
			}
			break;

		case "array-length":
			if (type.baseType === "array" && isArray(value)) {
				const items = getFilteredArrayItems(rule, field as any, context);

				isValid = isArray(rule.expectedLength)
					? rule.expectedLength.includes(items.length)
					: items.length === rule.expectedLength;
			}
			break;

		case "array-include-some":
			if (type.baseType === "array" && isArray(value)) {
				const items = getFilteredArrayItems(rule, field as any, context);

				isValid = isArray(rule.items)
					? rule.items.some(expectedValue => items.includes(expectedValue))
					: items.includes(rule.items);
			}
			break;

		case "array-include-all":
			if (type.baseType === "array" && isArray(value)) {
				const items = getFilteredArrayItems(rule, field as any, context);

				isValid = isArray(rule.items)
					? rule.items.every(expectedValue => items.includes(expectedValue))
					: items.includes(rule.items);
			}
			break;

		case "array-include-none":
			if (type.baseType === "array" && isArray(value)) {
				const items = getFilteredArrayItems(rule, field as any, context);

				isValid = isArray(rule.items)
					? rule.items.every(expectedValue => !items.includes(expectedValue))
					: !items.includes(rule.items);
			}
			break;

		case "array-match-some":
			if (type.baseType === "array" && isArray(value)) {
				const items = getFilteredArrayItems(rule, field as any, context);
				const itemsResult = items.map((val, ndx) => validateRuleForArrayItem(val, ndx, rule, field as any, context));

				isValid = itemsResult.some(t => t.isValid);
				errors.push(...itemsResult.filter(t => !t.isValid));
			}
			break;

		case "array-match-all":
			if (type.baseType === "array" && isArray(value)) {
				const items = getFilteredArrayItems(rule, field as any, context);
				const itemsResult = items.map((val, ndx) => validateRuleForArrayItem(val, ndx, rule, field as any, context));

				isValid = itemsResult.every(t => t.isValid);
				errors.push(...itemsResult.filter(t => !t.isValid));
			}
			break;

		case "text-length-min":
			if (type.baseType === "text" && isString(value)) {
				isValid = value.length >= rule.minLength;
			}
			break;

		case "text-length-max":
			if (type.baseType === "text" && isString(value)) {
				isValid = value.length <= rule.maxLength;
			}
			break;

		case "text-length-range":
			if (type.baseType === "text" && isString(value)) {
				isValid = value.length >= rule.minLength && value.length <= rule.maxLength;
			}
			break;

		case "text-length":
			if (type.baseType === "text" && isString(value)) {
				isValid = isArray(rule.expectedLength)
					? rule.expectedLength.includes(value.length)
					: value.length === rule.expectedLength;
			}
			break;

		case "text-value":
			if (type.baseType === "text" && isString(value)) {
				if (rule.ignoreCase) {
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
				isValid = value === rule.expectedValue;
			}
			break;

		case "number-min":
			if (type.baseType === "number" && isNumber(value)) {
				isValid = rule.mustBeGreater ? value > rule.minValue : value >= rule.minValue;
			}
			break;

		case "number-max":
			if (type.baseType === "number" && isNumber(value)) {
				isValid = rule.mustBeLess ? value < rule.maxValue : value <= rule.maxValue;
			}
			break;

		case "number-range":
			if (type.baseType === "number" && isNumber(value)) {
				isValid = (
					(rule.mustBeLess ? value < rule.maxValue : value <= rule.maxValue) &&
					(rule.mustBeGreater ? value > rule.minValue : value >= rule.minValue)
				);
			}
			break;

		case "number-value":
			if (type.baseType === "number" && isNumber(value)) {
				isValid = isArray(rule.expectedValue)
					? rule.expectedValue.includes(value)
					: value === rule.expectedValue;
			}
			break;

		case "some-rules-valid": {
			const rulesResult = rule.rules.map(t => validateRule(t, field, context));
			isValid = rulesResult.some(t => t.isValid);
			errors.push(...rulesResult.filter(t => !t.isValid));
			break;
		}

		case "all-rules-valid": {
			const rulesResult = rule.rules.map(t => validateRule(t, field, context));
			isValid = rulesResult.every(t => t.isValid);
			errors.push(...rulesResult.filter(t => !t.isValid));
			break;
		}

		case "array-itemindex":
			isValid = context.itemIndex == rule.index;
			break;

		case "array-itemindex-min":
			isValid = !isEmpty(context.itemIndex) && context.itemIndex >= rule.minIndex;
			break;

		case "array-itemindex-max":
			isValid = !isEmpty(context.itemIndex) && context.itemIndex <= rule.maxIndex;
			break;

		case "array-itemindex-range":
			isValid = !isEmpty(context.itemIndex) && context.itemIndex >= rule.minIndex && context.itemIndex <= rule.maxIndex;
			break;

		case "if-then-else": {
			const condition = validateRule(rule.if, field, context);
			const cases = getResolvedArray(condition.isValid ? rule.then : rule.else);
			const casesResult = cases.map(t => validateRule(t, field, context));

			details.push({ key: "condition", value: condition });

			isValid = casesResult.every(t => t.isValid);
			errors.push(...casesResult.filter(t => !t.isValid));
			break;
		}

		case "switch": {
			const match = findMapped(
				rule.cases,
				([key, condition, action]) => ({
					key,
					condition,
					action,
					result: validateRule(condition, field, context)
				}),
				t => t.result.isValid
			);

			if (match) {
				details.push({ key: "found", value: match.key });
				const casesResult = getResolvedArray(match.action).map(t => validateRule(t, field, context));

				isValid = casesResult.every(t => t.isValid);
				errors.push(...casesResult.filter(t => !t.isValid));
			}
			else if (rule.default) {
				details.push({ key: "found", value: "default" });
				const casesResult = getResolvedArray(rule.default).map(t => validateRule(t, field, context));

				isValid = casesResult.every(t => t.isValid);
				errors.push(...casesResult.filter(t => !t.isValid));
			}
			else {
				details.push({ key: "not_found" });
				isValid = true;
			}

			break;
		}

		case "field-reference": {
			// resolve path starting from the closest object in hierarchy by default; using "/" or "@" in path can refer to root or named objects
			if (rule.path) {
				const refTo = resolveReference(rule.path, field, context);

				if (refTo) {
					details.push({ key: "found", path: refTo.fullQualifiedName, value: refTo.value });

					isValid = isArray(rule.rules)
						? rule.rules.every(childRule => validateRule(childRule, refTo!, context).isValid)
						: validateRule(rule.rules, refTo, context).isValid;
				} else {
					details.push({ key: "not_found" });
				}
			}

			break;
		}
			
		case "compare": {
			if (rule.path) {
				const refTo = resolveReference(rule.path, field, context);

				if (refTo) {
					details.push({ key: "found", path: refTo.fullQualifiedName, value: refTo.value });
					let refValue = refTo.value;

					if (rule.addition) {
						if (isNumber(rule.addition)) {
							if (isNumber(refValue)) {
								refValue += rule.addition;
							}
							else if (isDate(refValue)) {
								refValue = dateAdd(refValue, "day", rule.addition);
							}
						}
						else if (isDate(refValue)) {
							refValue = dateAdd(refValue, rule.addition.datePart, rule.addition.value);
						}
					}

					isValid = evaluateValueBinaryOperator(value, refValue, rule.operator, { ignoreCase: rule.ignoreCase });
				} else {
					details.push({ key: "not_found" });
				}
			}
		}
	}

	return {
		rule,
		isValid,
		message: !isValid ? message : undefined,

		regExpMatch,
		details: details.length ? details : undefined,
		errors
	};
}

REACT_SIMPLE_VALIDATION.DI.validateRule = validateRule_default;

export function validateRule(
	rule: FieldValidationRule,
	field: Field,
	context: FieldValidationContext
): FieldRuleValidationResult {
	return REACT_SIMPLE_VALIDATION.DI.validateRule(rule, field, context, validateRule_default);
}


// HELPERS


const getFilteredArrayItems = (
	rule: { filter?: FieldValidationRule },
	field: Field<ArrayFieldType, unknown[]>,
	context: FieldValidationContext
) => {
	return rule.filter
		? field.value.filter((itemValue, itemIndex) => validateRule(
			rule.filter!,
			{
				value: itemValue,
				type: field.type.itemType,
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
	field: Field<ArrayFieldType, unknown[]>,
	context: FieldValidationContext
) => {
	return validateRule(
		rule.predicate,
		{
			value: itemValue,
			type: field.type.itemType,
			name: `${field.name}[${itemIndex}]`,
			fullQualifiedName: `${field.fullQualifiedName}[${itemIndex}]`
		},
		{
			...context,
			itemIndex
		}
	)
};

const resolveReference = (path: string, field: Field, context: FieldValidationContext) => {
	let refTo: Field | undefined;
	const { fullQualifiedName } = field;

	// /root -> context.rootObj
	if (path.startsWith("/")) {
		path = path.substring(1);
		const i = path.lastIndexOf(".");

		const value = getObjectChildValue(context.rootObj.value as object, path).value;
		const type = getFieldTypeChild(context.rootObj.type, path).value;

		if (!type) {
			return undefined;
		}

		refTo = {
			value,
			type,
			name: i >= 0 ? path.substring(i + 1) : path,
			fullQualifiedName: path
		};
	}
	// @refName -> context.refNames
	else if (path[0].startsWith("@")) {
		let i = stringIndexOfAny(path, [".", "["]);
		const refName = i >= 0 ? path.substring(1, i) : path.substring(1);
		const namedObj = context.namedObjs[refName];
		path = i >= 0 ? path.substring(path[i] === "." ? i + 1 : i) : "";

		if (namedObj) {
			const value = getObjectChildValue(namedObj.value as object, path).value;
			const type = getFieldTypeChild(namedObj.type, path).value;

			if (!type) {
				return undefined;
			}

			i = path.lastIndexOf(".");

			refTo = {
				value,
				type,
				name: i >= 0 ? path.substring(i + 1) : path,
				fullQualifiedName: stringAppend(namedObj.fullQualifiedName, path, ".")
			};

			context.refNames.resolved[refName] = {
				...context.refNames.resolved[refName],
				[fullQualifiedName]: { refFrom: field, refTo }
			};
		}
		else {
			context.refNames.notFound[refName] = {
				...context.refNames.notFound[refName],
				[fullQualifiedName]: { refFrom: field }
			};
		}
	}
	// local (same obj)
	else {
		const value = getObjectChildValue(context.currentObj.value as object, path).value;
		const type = getFieldTypeChild(context.currentObj.type, path).value;

		if (!type) {
			return undefined;
		}

		const i = path.lastIndexOf(".");
		
		refTo = {
			value,
			type,
			name: i >= 0 ? path.substring(i + 1) : path,
			fullQualifiedName: stringAppend(context.currentObj.fullQualifiedName, path, ".")
		};
	}

	return refTo;
};