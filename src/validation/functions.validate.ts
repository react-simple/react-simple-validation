import {
	compareDates, dateAdd, evaluateValueBinaryOperator, findMapped, findNonEmptyValue, getResolvedArray, isArray, isBoolean, isDate, isEmpty,
	isEmptyObject, isFile, isNullOrUndefined, isNumber, isObject, isString, logTrace, logWarning, mapDictionaryValues, sameDates,
	stringAppend, stringIndexOfAny
} from "@react-simple/react-simple-util";
import {
	REACT_SIMPLE_LOCALIZATION, formatValue, getCulture, tryParseBoolean, tryParseDateAnyFormat, tryParseFloat
} from "@react-simple/react-simple-localization";
import { getChildMemberValue, isFullQualifiedMemberNameParentChild } from "@react-simple/react-simple-mapping";
import {
	ArrayFieldType, ArrayFieldTypeBase, FIELDS, Field, FieldType, FieldTypes, ObjectFieldType, ObjectFieldTypeBase, getChildFieldType
 } from "fields";
import {
	FieldRuleValidationResult, FieldValidationResultDetails, FieldValidationResult, ObjectValidationResult, FieldValidationOptions
 } from "./types";
import { FieldValidationContext } from "validation/types";
import { REACT_SIMPLE_VALIDATION } from "data";
import { FieldValidationRule } from "rules";
import { getFieldRuleValidationErrorMessages } from "./functions.result";

function validateField_default(
	field: Field,
	context: FieldValidationContext,
	previousResult?: FieldValidationResult
): FieldValidationResult {
	const { type, value, name, fullQualifiedName } = field;
	const { incrementalValidation, cultureId, callbacks } = context.options || {};

	// this is non-local
	if (type.refName) {
		// set this object in the namedObjs collection if it has a name (see "field-reference" rules)
		context.namedFields[type.refName] = field;
	}

	const errors: FieldValidationResult["errors"] = [
		// validate type
		validateRule({ ruleType: "type", valueType: type.baseType }, field, context),

		// validate rules
		...(type.rules || []).map(rule => validateRule(rule, field, context))
	].filter(t => !t.isValid);

	let isValid = !errors.length;
	const childErrors: FieldValidationResult["childErrors"] = {}; // errors only
	const childResult: FieldValidationResult["childErrors"] = {}; // errors + valid

	if (value) {
		// validate object
		if (type.baseType === "object") {
			const childContext: FieldValidationContext = {
				...context,
				parentObj: field as Field<ObjectFieldTypeBase, object>
			};

			for (const [childName, childType] of Object.entries<FieldType>(type.schema)) {
				const childField: Field = {
					type: childType,
					value: (value as any)[childName],
					name: childName,
					fullQualifiedName: stringAppend(fullQualifiedName, childName, ".")
				};

				let valResult: FieldValidationResult | undefined;
				const prevResult = previousResult?.childResult?.[childName];

				if (!incrementalValidation ||
					(isArray(incrementalValidation.filter)
						? incrementalValidation.filter.some(t => isFullQualifiedMemberNameParentChild(t, childField.fullQualifiedName, true))
						: incrementalValidation.filter(childField, childContext)
					)
				) {
					// validate it, it's not incremental validation
					valResult = validateField(childField, childContext, prevResult);
				}
				else if (prevResult) {
					// it's incremental validation and we can use previous validation result, we skip this field
					valResult = prevResult;
					callbacks?.onFieldSkipped?.(childField, prevResult, childContext);
				}
				else {
					// it's incremental validation but there is no previous validation result, so we need to validate this field anyway
					valResult = validateField(childField, childContext);
				}

				childResult[childName] = valResult;

				if (!valResult.isValid) {
					childErrors[childName] = valResult;
					isValid = false;
				}
			}
		}

		// validate array
		if (type.baseType === "array") {
			getResolvedArray(value).forEach((itemValue, itemIndex) => {
				const childField: Field = {
					value: itemValue,
					type: type.itemType,
					name: `${name}[${itemIndex}]`,
					fullQualifiedName: `${fullQualifiedName}[${itemIndex}]`
				};

				const childContext: FieldValidationContext = {
					...context,
					parentArray: {
						field: field as Field<ArrayFieldTypeBase, unknown[]>,
						itemIndex
					}
				};

				let valResult: FieldValidationResult | undefined;
				const prevResult = previousResult?.childResult?.[itemIndex];

				if (!incrementalValidation ||
					(isArray(incrementalValidation.filter)
					? incrementalValidation.filter.some(t => isFullQualifiedMemberNameParentChild(t, childField.fullQualifiedName, true))
						: incrementalValidation.filter(childField, childContext)
					)) {
					// validate it, it's not incremental validation
					valResult = validateField(childField, childContext, prevResult);
				}
				else if (prevResult) {
					// it's incremental validation and we can use previous validation result, we skip this field
					valResult = prevResult;
					callbacks?.onFieldSkipped?.(childField, prevResult, childContext);
				}
				else {
					// it's incremental validation but there is no previous validation result, so we need to validate this field anyway
					valResult = validateField(childField, childContext);
				}
					
				childResult[itemIndex] = valResult;

				if (!valResult.isValid) {
					childErrors[itemIndex] = valResult;
					isValid = false;
				}
			});
		}
	}

	let result: FieldValidationResult = {
		// location
		name,
		fullQualifiedName,

		// validated
		fieldType: type.type,
		value,

		// result
		isValid,
		errors,
		childErrors,
		childResult
	};

	if (callbacks?.onFieldValidated) {
		result = callbacks.onFieldValidated(result, context) || result;
	}

	if (result.isValid) {
		delete context.errorsFlatList[fullQualifiedName];
	} else if (errors.some(t => !t.isValid)) {
		context.errorsFlatList[fullQualifiedName] = [
			...errors.flatMap(t => getFieldRuleValidationErrorMessages(t, cultureId)),

			// do not propagate child field errors to parents
			// ...Object.values(children).flatMap(t => Object.values(getFieldValidationErrorMessages(t, context.cultureId))).flat()
		];
	}

	logTrace(log => log(
		`[validateField]: Field validated, isValid: ${result.isValid}, field: ${field.fullQualifiedName}`,
		{ args: { field, context, result } }
	), { logLevel: REACT_SIMPLE_VALIDATION.LOGGING.logLevel });

	return result;
}

REACT_SIMPLE_VALIDATION.DI.validation.validateField = validateField_default;

// the FieldCustomValidationRule.validate() callback must have the same signature
export function validateField(
	field: Field,
	context: FieldValidationContext,
	previousResult?: FieldValidationResult
): FieldValidationResult { 
	return REACT_SIMPLE_VALIDATION.DI.validation.validateField(field, context, previousResult, validateField_default);
}

// If context is not specified that is understood as a 'validate root object' call, therefore the fieldTypes tree will be first iterated
// to collect all named objects (for forward references, when an object later in the hierarchy is referred by @refName).
// Schema is not FieldType or value type, it's an object with the keys we need.
// Usually, those keys are coming from ObjectFieldType.schema.
function validateObject_default<Schema extends FieldTypes, Obj extends object = object>(
	obj: Obj,
	schema: Schema | ObjectFieldType<Schema>,
	options: FieldValidationOptions
): ObjectValidationResult<Schema> {

	const type = (schema as ObjectFieldType).baseType === "object" && (schema as ObjectFieldType).type === "object"
		? schema as ObjectFieldType<Schema>
		: FIELDS.object(schema as Schema);

	const field: Field<ObjectFieldType<Schema>, Obj> = {
		type,
		value: obj,
		fullQualifiedName: "",
		name: ""
	};

	const context: FieldValidationContext = {
		parentObj: field,
		rootObj: field,
		namedFields: mapDictionaryValues(options.namedObjs || {}, ({ value, type }, name) => ({
			value,
			type,
			name: `@${name}`,
			fullQualifiedName: `@${name}`
		})),
		namedFieldsNotFound: {},
		errorsFlatList: {},
		options
	};

	const { isValid, childErrors, childResult } = validateField(field, context,
		options?.incrementalValidation && {
			fullQualifiedName: "",
			name: "",
			fieldType: field.type.type,
			value: obj,
			isValid: options.incrementalValidation.previousResult.isValid,
			errors: [],
			childErrors: options.incrementalValidation.previousResult.childErrors,
			childResult: options.incrementalValidation.previousResult.childResult
		});
	
	let result: ObjectValidationResult = {
		isValid,
		childErrors,
		childResult,
		namedFields: context.namedFields,
		namedFieldsNotFound: context.namedFieldsNotFound,
		errorsFlatList: context.errorsFlatList
	};

	if (context.options?.callbacks?.onObjectValidated) {
		result = context.options.callbacks.onObjectValidated(result, context) || result;
	}

	logTrace(log => log(
		`[validateObject]: Object validated, isValid: ${result.isValid}`,
		{ args: { obj, schema, context, result } }
	), { logLevel: REACT_SIMPLE_VALIDATION.LOGGING.logLevel });

	return result;
}

REACT_SIMPLE_VALIDATION.DI.validation.validateObject = validateObject_default;

// If context is not specified that is understood as a 'validate root object' call, therefore the fieldTypes tree will be first iterated
// to collect all named objects (for forward references, when an object later in the hierarchy is referred by @refName).
// Schema is not FieldType or value type, it's an object with the keys we need.
// Usually, those keys are coming from ObjectFieldType.schema.
export function validateObject<Schema extends FieldTypes, Obj extends object = object>(
	obj: Obj,
	schema: Schema | ObjectFieldType<Schema>,
	options?: FieldValidationOptions
): ObjectValidationResult<Schema> {
	return REACT_SIMPLE_VALIDATION.DI.validation.validateObject(obj, schema, options || {}, validateObject_default);
}

const validateFieldType_default = (value: unknown, type: FieldType) => {
	switch (type.baseType) {
		case "any":
			return true;

		case "text":
			return isString(value);

		case "number":
			return isNumber(value);

		case "date":
			return isDate(value);

		case "boolean":
			return isBoolean(value);

		case "file":
			return isFile(value);

		case "object":
			// due to the nature of isFile() we don't check that here
			return isObject(value);

		case "array":
			return isArray(value);

		default:
			logWarning(`[validateRule]: Unsupported field type '${type}'`, { logLevel: REACT_SIMPLE_VALIDATION.LOGGING.logLevel });
			return false;
	}
};

REACT_SIMPLE_VALIDATION.DI.validation.validateFieldType = validateFieldType_default;

export const validateFieldType = (value: unknown, type: FieldType) => {
	return REACT_SIMPLE_VALIDATION.DI.validation.validateFieldType(value, type, validateFieldType_default);
};

function tryParseFieldType_default<Value = unknown>(value: unknown, type: FieldType, cultureId?: string): Value | undefined {
	cultureId ||= REACT_SIMPLE_LOCALIZATION.CULTURE_INFO.current.cultureId;

	switch (type.baseType) {
		case "text":
			return (isString(value) ? value : formatValue(value, getCulture(cultureId))) as Value;

		case "number":
			return (isNumber(value) ? value : (tryParseFloat(value, getCulture(cultureId).numberFormat) || value)) as Value;

		case "date":
			return (isDate(value) ? value : (tryParseDateAnyFormat(value, getCulture(cultureId).dateFormat) || value)) as Value;

		case "boolean":
			return (isBoolean(value) ? value : (tryParseBoolean(value, getCulture(cultureId).booleanFormat) || value)) as Value;

		// any, file, object, array
		default:
			return value as Value;
	}
}

REACT_SIMPLE_VALIDATION.DI.validation.tryParseFieldType = tryParseFieldType_default;

export function tryParseFieldType<Value = unknown>(value: unknown, type: FieldType, cultureId?: string): Value | undefined {
	return REACT_SIMPLE_VALIDATION.DI.validation.tryParseFieldType(value, type, cultureId, tryParseFieldType_default);
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

	let { value } = field;
	const { type } = field;
	const errors: FieldRuleValidationResult[] = [];

	// try parse type if it's allowed and it's needed
	if (context.options?.tryParseValues && !isNullOrUndefined(value)) {
		value = tryParseFieldType(value, type, context.options.cultureId);
	}

	switch (rule.ruleType) {
		case "type":
			isValid = isNullOrUndefined(value) || validateFieldType(value, type);
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

		case "date-equals":
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

		case "array-length-equals":
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

		case "text-length-equals":
			if (type.baseType === "text" && isString(value)) {
				isValid = isArray(rule.expectedLength)
					? rule.expectedLength.includes(value.length)
					: value.length === rule.expectedLength;
			}
			break;

		case "text-equals":
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

		case "boolean-equals":
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

		case "number-equals":
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

		case "array-itemindex-equals":
			isValid = context.parentArray?.itemIndex == rule.index;
			break;

		case "array-itemindex-min":
			isValid = !!context.parentArray && context.parentArray.itemIndex >= rule.minIndex;
			break;

		case "array-itemindex-max":
			isValid = !!context.parentArray && context.parentArray.itemIndex <= rule.maxIndex;
			break;

		case "array-itemindex-range":
			isValid = (
				!!context.parentArray &&
				context.parentArray.itemIndex >= rule.minIndex &&
				context.parentArray.itemIndex <= rule.maxIndex
			);
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
				details.push({ key: "case_not_found", value });
				isValid = true;
			}

			break;
		}

		case "field-reference": {
			// resolve path starting from the closest object in hierarchy by default; using "/" or "@" in path can refer to root or named objects
			if (rule.path) {
				const refTo = getResolveReference(rule.path, field, context);

				if (refTo) {
					details.push({ key: "found", path: refTo.fullQualifiedName, value: refTo.value });

					isValid = isArray(rule.rules)
						? rule.rules.every(childRule => validateRule(childRule, refTo!, context).isValid)
						: validateRule(rule.rules, refTo, context).isValid;
				} else {
					details.push({ key: "ref_not_found", path: rule.path });
				}
			}

			break;
		}
			
		case "compare": {
			if (rule.path) {
				const refTo = getResolveReference(rule.path, field, context);

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
					details.push({ key: "ref_not_found", path: rule.path });
				}
			}
		}
	}

	let result: FieldRuleValidationResult = {
		rule,
		isValid,
		message: !isValid ? message : undefined,

		regExpMatch,
		details: details.length ? details : undefined,
		errors
	};

	if (context.options?.callbacks?.onFieldRuleValidated) {
		result = context.options.callbacks.onFieldRuleValidated(result, field, context) || result;
	}

	logTrace(log => log(
		`[validateRule]: Rule validated, isValid: ${result.isValid}, rule: ${rule.ruleType}, field: ${field.fullQualifiedName}`,
		{ args: { rule, field, context, result } }
	), { logLevel: REACT_SIMPLE_VALIDATION.LOGGING.logLevel });

	return result;
}

REACT_SIMPLE_VALIDATION.DI.validation.validateRule = validateRule_default;

export function validateRule(
	rule: FieldValidationRule,
	field: Field,
	context: FieldValidationContext
): FieldRuleValidationResult {
	return REACT_SIMPLE_VALIDATION.DI.validation.validateRule(rule, field, context, validateRule_default);
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
				parentArray: {
					field,
					itemIndex
				}
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
			parentArray: {
				field,
				itemIndex
			}
		}
	)
};

const getResolveReference = (path: string, field: Field, context: FieldValidationContext) => {
	let refTo: Field | undefined;
	const { fullQualifiedName } = field;
	
	// /root -> context.rootObj
	if (path.startsWith("/")) {
		path = path.substring(1);
		const type = getChildFieldType(context.rootObj.type, path);

		if (type) {
			const value = getChildMemberValue(context.rootObj.value as object, path);
			const i = path.lastIndexOf(".");

			refTo = {
				value,
				type,
				name: i >= 0 ? path.substring(i + 1) : path,
				fullQualifiedName: path
			};
		}
	}
	// @refName -> context.refNames
	else if (path[0] === "@") {
		let i = stringIndexOfAny(path, [".", "["]);
		const refName = i >= 0 ? path.substring(1, i) : path.substring(1);
		const namedObj = context.namedFields[refName];
		path = i >= 0 ? path.substring(path[i] === "." ? i + 1 : i) : "";

		if (namedObj) {
			const type = getChildFieldType(namedObj.type, path);

			if (type) {
				const value = getChildMemberValue(namedObj.value as object, path);
				i = path.lastIndexOf(".");

				refTo = {
					value,
					type,
					name: i >= 0 ? path.substring(i + 1) : path,
					fullQualifiedName: stringAppend(namedObj.fullQualifiedName, path, ".")
				};
			}
		}		
	}
	// local (same obj)
	else {
		const type = getChildFieldType(context.parentObj.type, path);
		
		if (type) {
			const value = getChildMemberValue(context.parentObj.value as object, path);
			const i = path.lastIndexOf(".");
		
			refTo = {
				value,
				type,
				name: i >= 0 ? path.substring(i + 1) : path,
				fullQualifiedName: stringAppend(context.parentObj.fullQualifiedName, path, ".")
			};
		}
	}

	if (!refTo) {
		context.namedFieldsNotFound[path] = {
			...context.namedFieldsNotFound[path],
			[fullQualifiedName]: { refFrom: field }
		};
	}

	return refTo;
};
