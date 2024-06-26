import { REACT_SIMPLE_LOCALIZATION } from "@react-simple/react-simple-localization";
import { getChildMemberValue } from "@react-simple/react-simple-mapping";
import { FieldRuleValidationErrors, FieldRuleValidationResult, FieldValidationResult, ObjectValidationResult } from "./types";
import { ValueOrArray, getResolvedCallbackValueWithArgs, isArray, mergeDictionaries } from "@react-simple/react-simple-util";
import { REACT_SIMPLE_VALIDATION } from "data";

function getChildValidationResult_default(
	result: ObjectValidationResult | FieldValidationResult | FieldRuleValidationResult,
	fullQualifiedName: string
) :FieldValidationResult | undefined {
	return getChildMemberValue<FieldValidationResult>(
		result,
		fullQualifiedName,
		{
			getMemberValue: (res, name) =>
				(res as FieldValidationResult)["childErrors"]?.[name.name] ||
				(res as any)[name.name]
		}
	);
}

REACT_SIMPLE_VALIDATION.DI.validationResult.getChildValidationResult = getChildValidationResult_default;

export function getChildValidationResult(
	result: ObjectValidationResult | FieldValidationResult | FieldRuleValidationResult,
	fullQualifiedName: string
): FieldValidationResult | undefined {
	return REACT_SIMPLE_VALIDATION.DI.validationResult.getChildValidationResult(result, fullQualifiedName, getChildValidationResult_default);
}

function getFieldRuleValidationErrorMessage_default(result: Pick<FieldRuleValidationResult, "message" | "rule">, cultureId?: string): string {
	cultureId ||= REACT_SIMPLE_LOCALIZATION.CULTURE_INFO.current.cultureId;
	const defaultId = REACT_SIMPLE_LOCALIZATION.CULTURE_INFO.default.cultureId;

	return result.message ||
		getResolvedCallbackValueWithArgs(
			REACT_SIMPLE_VALIDATION.MESSAGES.validationRuleMessages[cultureId]?.[result.rule.ruleType] ||
			REACT_SIMPLE_VALIDATION.MESSAGES.validationRuleMessages[defaultId]?.[result.rule.ruleType] as any,
			result.rule
		)
		|| `${result.rule.ruleType} error`;
}

REACT_SIMPLE_VALIDATION.DI.validationResult.getFieldRuleValidationErrorMessage = getFieldRuleValidationErrorMessage_default;

export function getFieldRuleValidationErrorMessage(result: Pick<FieldRuleValidationResult, "message" | "rule">, cultureId?: string): string {
	return REACT_SIMPLE_VALIDATION.DI.validationResult.getFieldRuleValidationErrorMessage(
		result, cultureId, getFieldRuleValidationErrorMessage_default
	);
}

function getFieldRuleValidationErrorMessages_default(result: ValueOrArray<FieldRuleValidationResult>, cultureId?: string): string[] {
	if (isArray(result)) {
		return result.flatMap(t => getFieldRuleValidationErrorMessages(t, cultureId));
	} else {
		return result.isValid
			? []
			: [
				getFieldRuleValidationErrorMessage(result, cultureId),
				...(result.errors || []).flatMap(t => getFieldRuleValidationErrorMessages(t, cultureId))
			];
	}
}

REACT_SIMPLE_VALIDATION.DI.validationResult.getFieldRuleValidationErrorMessages = getFieldRuleValidationErrorMessages_default;

export function getFieldRuleValidationErrorMessages(result: ValueOrArray<FieldRuleValidationResult>, cultureId?: string): string[] {
	return REACT_SIMPLE_VALIDATION.DI.validationResult.getFieldRuleValidationErrorMessages(
		result, cultureId, getFieldRuleValidationErrorMessages_default
	);
}

function getFieldValidationErrorMessages_default(result: ValueOrArray<FieldValidationResult>, cultureId?: string): FieldRuleValidationErrors {
	if (isArray(result)) {
		return mergeDictionaries(result.map(t => getFieldValidationErrorMessages(t, cultureId)));
	}
	else {
		return result.isValid
			? {}
			: mergeDictionaries([
				...result.errors?.length
					? [{
						[result.fullQualifiedName]: result.errors.flatMap(t => getFieldRuleValidationErrorMessages(t, cultureId))
					}]
					: [],
			
				...Object.values(result.childErrors || {}).map(t => getFieldValidationErrorMessages(t, cultureId))
			]);
	}
}

REACT_SIMPLE_VALIDATION.DI.validationResult.getFieldValidationErrorMessages = getFieldValidationErrorMessages_default;

export function getFieldValidationErrorMessages(result: ValueOrArray<FieldValidationResult>, cultureId?: string): FieldRuleValidationErrors {
	return REACT_SIMPLE_VALIDATION.DI.validationResult.getFieldValidationErrorMessages(
		result, cultureId, getFieldValidationErrorMessages_default
	);
}

function getObjectValidationErrorMessages_default(result: ValueOrArray<ObjectValidationResult>, cultureId?: string): FieldRuleValidationErrors {
	if (isArray(result)) {
		return mergeDictionaries(result.map(t => getObjectValidationErrorMessages(t, cultureId)));
	}
	else {
		return result.isValid
			? {}
			: mergeDictionaries(Object.values(result.childErrors || {}).map(t => getFieldValidationErrorMessages(t, cultureId)))
	}
}

REACT_SIMPLE_VALIDATION.DI.validationResult.getObjectValidationErrorMessages = getObjectValidationErrorMessages_default;

export function getObjectValidationErrorMessages(result: ValueOrArray<ObjectValidationResult>, cultureId?: string): FieldRuleValidationErrors {
	return REACT_SIMPLE_VALIDATION.DI.validationResult.getObjectValidationErrorMessages(
		result, cultureId, getObjectValidationErrorMessages_default
	);
}

export function getEmptyFieldRuleValidationResult(
	{ rule, ...rest }: Pick<FieldRuleValidationResult, "rule"> & Partial<FieldRuleValidationResult>
): FieldRuleValidationResult {
	return {
		rule,
		isValid: true,

		// override defaults
		...rest
	};
}

export function getEmptyFieldValidationResult(
	{ fieldType, ...rest }: Pick<FieldValidationResult, "fieldType"> & Partial<FieldValidationResult>
): FieldValidationResult {
	return {
		name: "",
		fullQualifiedName: "",
		fieldType,
		value: undefined,
		isValid: true,
		errors: [],
		childErrors: {},
		childResult: {},

		// override defaults
		...rest
	};
}

export function getEmptyObjectValidationResult(values?: Partial<ObjectValidationResult>): ObjectValidationResult {
	return {
		isValid: true,
		childErrors: {},
		childResult: {},
		errorsFlatList: {},
		namedFields: {},
		namedFieldsNotFound: {},

		// override defaults
		...values
	};
}
