import { FieldType, FieldTypes } from "fields";
import { FieldValidationRule } from "rules";

export interface FieldRuleValidationResult {
	readonly rule: FieldValidationRule;
	readonly isChecked: boolean; // certain rules work for certain field types only; if incompatible it's isValid but !isChecked
	readonly isValid: boolean;

	readonly message?: string; // custom message
	readonly regExpMatch?: RegExpMatchArray;
}

export interface FieldValidationResult<TFieldType extends FieldType = FieldType, Value = unknown> {
	readonly fieldType: TFieldType;
	readonly fieldValue: Value;
	readonly isValid: boolean;

	readonly ruleValidationResult: FieldRuleValidationResult[]; // valid and non-valid too
	readonly objectValidationResult?: ObjectValidationResult; // if baseType is 'object'
	readonly arrayValidationResult?: FieldValidationResult[]; // if baseType is 'array'
}

export interface ObjectValidationResult<TypeObj = unknown, ValueObj = unknown> {
	readonly fieldTypes: FieldTypes<TypeObj>;
	readonly fieldValues: ValueObj;
	readonly isValid: boolean;
	readonly validationResult: { [name in keyof TypeObj]: FieldValidationResult }; // all evaluated rules
	readonly errors: { [name in keyof TypeObj]: FieldValidationResult }; // failed rules only
}

// rootObj to resolve field references starting with "/", see the "reference" rule
// namedObjs to resolve field references starting with "@name", see the "field-reference" rules
export interface FieldValidationContext {
	readonly arrayIndex: number | undefined; // index in the array (closest in hierarchy)

	// if specified and memberNamesPath starts with "/" then the evaluation will start at the root object, not the parameter object
	readonly rootObj: unknown;
	readonly rootType: FieldTypes;

	// if specified and memberNamesPath starts with "@name" then the evaluation will start at the named object found here, not the parameter object
	readonly namedObjs: { [name: string]: unknown };
	readonly namedTypes: { [name: string]: FieldTypes };

	readonly currentObj: unknown; // closest object in the hierarchy where references are resolved by default (unless referring to root or named obj)
	readonly currentType: FieldTypes;
}
