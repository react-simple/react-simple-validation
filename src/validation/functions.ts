import { Optional, getResolvedArray, joinNonEmptyValues, mergeDictionaries } from "@react-simple/react-simple-util";
import { FieldType, TypedFieldNamed, TypedFieldSetNamed } from "fields";
import { FieldRuleValidationResult, FieldValidationContext, FieldValidationResult, ObjectValidationResult } from "./types";
import { validateRule } from "./functions.validateRule";

export function validateField<TFieldType extends FieldType = FieldType, Value = unknown>(
	field: TypedFieldNamed<TFieldType, Value>,
	context: FieldValidationContext
): FieldValidationResult<TFieldType, Value> {
	const { type, value, fullQualifiedName } = field;

	const ruleValidationResult = [
		// validate type
		validateRule({ ruleType: "type", valueType: type.baseType }, field, context),

		// validate rules
		...type.rules.map(rule => validateRule(rule, field, context))
	];

	let objectValidationResult: ObjectValidationResult<unknown, Value> | undefined;
	let arrayValidationResult: FieldValidationResult<FieldType, Value>[] | undefined;

	// validate object
	if (type.baseType === "object") {
		const currentObj: TypedFieldSetNamed<unknown, Value> = {
			values: value,
			types: type.objectFieldTypes,
			fullQualifiedName
		};

		objectValidationResult = validateObject(
			currentObj,
			{
				...context,

				// set this object as the closest object for field reference evaluation (see "field-reference" rules)
				currentObj,

				// set this object in the namedObjs collection if it has a name (see "field-reference" rules)
				...type.refName
					? {
						namedObjs: {
							...context.namedObjs,
							[type.refName]: currentObj
						}
					}
					: {}
			}
		);
	}

	// validate array
	if (type.baseType === "array") {
		arrayValidationResult = getResolvedArray(value).map((itemValue, arrayIndex) =>
			validateField(
				{
					value: itemValue,
					type: type.itemFieldType,
					fullQualifiedName: `${fullQualifiedName}[${arrayIndex}]`
				},
				{
					...context,
					arrayIndex
				}
			)
		);
	}

	const ruleValidationResultInvalid = ruleValidationResult.filter(t => !t.isValid);

	return {
		field,
		isValid: (
			ruleValidationResult.every(rule => rule.isValid) &&
			(!objectValidationResult || objectValidationResult.isValid) &&
			(!arrayValidationResult || arrayValidationResult.every(itemRule => itemRule.isValid))
		),
		errors: {
			...ruleValidationResultInvalid.length ? { [fullQualifiedName]: ruleValidationResultInvalid } : {},
			...arrayValidationResult ? mergeDictionaries(arrayValidationResult.filter(t => !t.isValid).map(t => t.errors)) : {},
			...objectValidationResult?.isValid === false ? objectValidationResult.errors : {}
		},

		ruleValidationResult,
		arrayValidationResult,
		objectValidationResult
	};
}

export function validateObject<TypeObj, ValueObj>(
	{ types, values, fullQualifiedName = "" }: Optional<TypedFieldSetNamed<TypeObj, ValueObj>, "fullQualifiedName">,
	context?: FieldValidationContext
): ObjectValidationResult<TypeObj, ValueObj> {
	const currentObj: TypedFieldSetNamed<TypeObj, ValueObj> = { types, values, fullQualifiedName };

	context ||= {
		arrayIndex: undefined,
		currentObj,
		rootObj: currentObj,
		namedObjs: {}
	};

	const validationResult: { [name in keyof TypeObj]: FieldValidationResult } = {} as any;
	let errors: { [fullQualifiedName: string]: FieldRuleValidationResult[] } = {};
	let isValid = true;

	for (const [name, type] of Object.entries(types)) {
		const value = (values as any)[name];
		const fullQualifiedName = joinNonEmptyValues([currentObj.fullQualifiedName, name], ".");

		// index is arrayIndex here, not object member index, hence we pass undefined
		const fieldValidationResult = validateField(
			{
				value,
				type: type as FieldType,
				fullQualifiedName
			},
			context
		);

		(validationResult as any)[name] = fieldValidationResult;

		if (!fieldValidationResult.isValid) {
			errors = mergeDictionaries([errors, fieldValidationResult.errors]);
			isValid = false;
		}
	}

	return { fieldSet: currentObj, isValid, validationResult, errors };
}
