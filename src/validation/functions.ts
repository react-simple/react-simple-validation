import { Optional, getResolvedArray, joinNonEmptyValues, mapDictionaryValues, mergeDictionaries } from "@react-simple/react-simple-util";
import { FieldType, TypedFieldNamed, TypedFieldSetNamed } from "fields";
import { FieldRuleValidationResult, FieldValidationResult, ObjectValidationResult } from "./types";
import { FieldValidationContext } from "validation/types";
import { validateRule } from "./validateRule";

export function validateField(
	field: TypedFieldNamed,
	context: FieldValidationContext
): FieldValidationResult {
	const { type, value, name, fullQualifiedName } = field;

	const ruleValidationResult = [
		// validate type
		validateRule({ ruleType: "type", valueType: type.baseType }, field, context),

		// validate rules
		...type.rules.map(rule => validateRule(rule, field, context))
	];

	let objectValidationResult: ObjectValidationResult | undefined;
	let arrayValidationResult: FieldValidationResult[] | undefined;

	if (value) {
		// validate object
		if (type.baseType === "object") {
			const currentObj: TypedFieldSetNamed = {
				values: value,
				types: type.objectFieldTypes,
				fullQualifiedName
			};

			if (type.refName) {
				// set this object in the namedObjs collection if it has a name (see "field-reference" rules)
				context.namedObjs[type.refName] = currentObj;
			}

			objectValidationResult = validateObject(currentObj, {
				...context,
				// set this object as the closest object for field reference evaluation (see "field-reference" rules)
				currentObj
			});
		}

		// validate array
		if (type.baseType === "array") {
			arrayValidationResult = getResolvedArray(value).map((itemValue, itemIndex) => validateField(
				{
					value: itemValue,
					type: type.itemFieldType,
					name: `${name}[${itemIndex}]`,
					fullQualifiedName: `${fullQualifiedName}[${itemIndex}]`
				},
				{
					...context,
					itemIndex
				}
			));
		}
	}

	const ruleValidationResultInvalid = ruleValidationResult.filter(t => !t.isValid);

	return {
		isValid: (
			ruleValidationResult.every(rule => rule.isValid) &&
			(!objectValidationResult || objectValidationResult.isValid) &&
			(!arrayValidationResult || arrayValidationResult.every(itemRule => itemRule.isValid))
		),
		errors: {
			...ruleValidationResultInvalid.length ? { [fullQualifiedName]: ruleValidationResultInvalid } : {},
			...arrayValidationResult ? mergeDictionaries(arrayValidationResult.filter(t => !t.isValid).map(t => t.errors)) : {},
			...objectValidationResult?.isValid === false ? objectValidationResult.errors : {}
		}
	};
}

// if context is not specified that is understood as a 'validate root object' call, therefore the fieldTypes tree will be first iterated
// to collect all named objects (for forward references, when an object later in the hierarchy is referred by @refName)
export function validateObject<TypeObj>(
	{ types, values, fullQualifiedName = "" }: Optional<TypedFieldSetNamed<TypeObj>, "fullQualifiedName">,
	context?: Partial<FieldValidationContext>
): ObjectValidationResult<TypeObj> {	
	const currentObj: TypedFieldSetNamed = { types, values, fullQualifiedName };

	let contextResolved: FieldValidationContext = {
		// defaults
		currentObj,
		rootObj: currentObj,
		namedObjs: {},
		notFoundRefNames: {},

		// overwrite defaults
		...context
	};

	const validationResult: { [name in keyof TypeObj]: FieldValidationResult } = {} as any;
	let errors: { [fullQualifiedName: string]: FieldRuleValidationResult[] } = {};
	let isValid = true;

	for (const [name, type] of Object.entries<FieldType>(types)) {
		const fieldValidationResult = validateField(
			{
				type,
				value: (values as any)[name],
				name,
				fullQualifiedName: joinNonEmptyValues([currentObj.fullQualifiedName, name], ".")
			},
			contextResolved);

		(validationResult as any)[name] = fieldValidationResult;

		if (!fieldValidationResult.isValid) {
			errors = mergeDictionaries([errors, fieldValidationResult.errors]);
			isValid = false;
		}
	}

	return {
		isValid,
		validationResult,
		errors,
		namedObjs: contextResolved.namedObjs,
		notFoundRefNames: mapDictionaryValues(contextResolved.notFoundRefNames, t => Object.keys(t))
	};
}
