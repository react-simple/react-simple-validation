import { REACT_SIMPLE_LOCALIZATION } from "@react-simple/react-simple-localization";
import { getObjectChildValue } from "@react-simple/react-simple-mapping";
import { FieldRuleValidationErrors, FieldRuleValidationResult, FieldValidationResult, ObjectValidationResult } from "./types";
import { FIELD_VALIDATION_RULE_MESSAGES } from "rules";
import { ValueOrArray, isArray, mergeDictionaries } from "@react-simple/react-simple-util";

export const getValidationResultChild = (
	result: ObjectValidationResult | FieldValidationResult | FieldRuleValidationResult,
	fullQualifiedName: string
) => {
	return getObjectChildValue<FieldRuleValidationResult>(
		result,
		fullQualifiedName,
		{
			getValue: (res, name) => res["children"]?.[name] || res["errors"]?.[name] || res[name]
		}
	);
};

function getFieldRuleValidationErrorMessage(rule: FieldRuleValidationResult, cultureId?: string): string {
	return rule.message ||
		(
			FIELD_VALIDATION_RULE_MESSAGES[cultureId || REACT_SIMPLE_LOCALIZATION.CULTURE_INFO.current.cultureId]?.[rule.rule.ruleType] ||
			FIELD_VALIDATION_RULE_MESSAGES.DEFAULT[rule.rule.ruleType]
		)?.(rule.rule as any) as string
		|| `${rule.rule.ruleType} error`;
}

export function getFieldRuleValidationErrorMessages(result: ValueOrArray<FieldRuleValidationResult>, cultureId?: string): string[] {
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

export function getFieldValidationErrorMessages(result: ValueOrArray<FieldValidationResult>, cultureId?: string): FieldRuleValidationErrors {
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
			
				...Object.values(result.children || {}).map(t => getFieldValidationErrorMessages(t, cultureId))
			]);
	}
}

export function getObjectValidationErrorMessages(result: ValueOrArray<ObjectValidationResult>, cultureId?: string): FieldRuleValidationErrors {
	if (isArray(result)) {
		return mergeDictionaries(result.map(t => getObjectValidationErrorMessages(t, cultureId)));
	}
	else {
		return result.isValid
			? {}
			: mergeDictionaries(Object.values(result.errors || {}).map(t => getFieldValidationErrorMessages(t, cultureId)))
	}
}
