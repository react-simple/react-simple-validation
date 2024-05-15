import { getResolvedArray } from "@react-simple/react-simple-util";
import { FieldType, FieldTypes } from "fields";
import { FieldValidationResult, ObjectValidationResult } from "./types";
import { validateRule, validateRules } from "./validateRules";

export function validateField<TFieldType extends FieldType = FieldType, Value = unknown>(
	fieldValue: Value,
	fieldType: TFieldType,
	arrayIndex: number | undefined
): FieldValidationResult<TFieldType, Value> {
	const ruleValidationResult = [
		// validate type
		validateRule(
			{
				ruleType: "type",
				valueType: fieldType.baseType
			},
			fieldValue,
			fieldType,
			arrayIndex),

		// validate rules
		...validateRules(fieldType.rules, fieldValue, fieldType, arrayIndex)
	];

	// validate object
	const objectValidationResult = fieldType.baseType === "object"
		? validateObject(fieldValue, fieldType.objectFieldTypes)
		: undefined;

	// validate array
	const arrayValidationResult = fieldType.baseType === "array"
		? getResolvedArray(fieldValue).map((itemValue, itemIndex) => validateField(itemValue, fieldType.itemFieldType, itemIndex))
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

export function validateObject<TypeObj, ValueObj>(
	fieldValues: ValueObj,
	fieldTypes: FieldTypes<TypeObj>
): ObjectValidationResult<TypeObj, ValueObj> {
	const validationResult: { [name in keyof TypeObj]: FieldValidationResult } = {} as any;
	const errors: { [name in keyof TypeObj]: FieldValidationResult } = {} as any;
	let isValid = true;

	for (const [name, fieldType] of Object.entries(fieldTypes)) {
		const fieldValue = (fieldValues as any)[name];

		// index is arrayIndex here, not object member index, hence we pass undefined
		const fieldValidationResult = validateField(fieldValue, fieldType as FieldType, undefined); 

		(validationResult as any)[name] = fieldValidationResult;

		if (!fieldValidationResult.isValid) {
			errors[name as keyof TypeObj] = fieldValidationResult;
			isValid = false;
		}
	}

	return {
		fieldTypes, fieldValues, isValid, validationResult, errors
	};
}
