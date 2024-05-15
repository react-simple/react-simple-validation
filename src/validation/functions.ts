import { getResolvedArray } from "@react-simple/react-simple-util";
import { FieldType, FieldTypes } from "fields";
import { FieldValidationContext, FieldValidationResult, ObjectValidationResult } from "./types";
import { validateRule } from "./validateRules";

export function validateField<TFieldType extends FieldType = FieldType, Value = unknown>(
	fieldValue: Value,
	fieldType: TFieldType,
	context: FieldValidationContext
): FieldValidationResult<TFieldType, Value> {
	const ruleValidationResult = [
		// validate type
		validateRule({ ruleType: "type", valueType: fieldType.baseType }, fieldValue, fieldType, context),

		// validate rules
		...fieldType.rules.map(t => validateRule(t, fieldValue, fieldType, context))
	];

	// validate object
	const objectValidationResult = fieldType.baseType === "object"
		? validateObject(
			fieldValue,
			fieldType.objectFieldTypes,
			{
				...context,

				// set this object as the closest object for field reference evaluation (see "field-reference" rules)
				currentObj: fieldValue,
				currentType: fieldType.objectFieldTypes,

				// set this object in the namedObjs collection if it has a name (see "field-reference" rules)
				...fieldType.name
					? {
						namedObjs: {
							...context.namedObjs,
							[fieldType.name]: fieldValue
						},

						namedTypes: {
							...context.namedTypes,
							[fieldType.name]: fieldType.objectFieldTypes
						}
					}
					: {}
			}
		)
		: undefined;

	// validate array
	const arrayValidationResult = fieldType.baseType === "array"
		? getResolvedArray(fieldValue).map((itemValue, arrayIndex) =>
			validateField(itemValue, fieldType.itemFieldType, { ...context, arrayIndex })
		)
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
	fieldTypes: FieldTypes<TypeObj>,
	context?: FieldValidationContext
): ObjectValidationResult<TypeObj, ValueObj> {
	context ||= {
		arrayIndex: undefined,
		currentObj: fieldValues,
		currentType: fieldTypes,
		rootObj: fieldValues,
		rootType: fieldTypes,
		namedObjs: {},
		namedTypes: {}
	};

	const validationResult: { [name in keyof TypeObj]: FieldValidationResult } = {} as any;
	const errors: { [name in keyof TypeObj]: FieldValidationResult } = {} as any;
	let isValid = true;

	for (const [name, fieldType] of Object.entries(fieldTypes)) {
		const fieldValue = (fieldValues as any)[name];

		// index is arrayIndex here, not object member index, hence we pass undefined
		const fieldValidationResult = validateField(fieldValue, fieldType as FieldType, context); 

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
