import { FieldType, TypedFieldNamed, TypedFieldSetNamed } from "fields";
import { FieldValidationRule } from "rules";

export interface FieldRuleValidationResult<TFieldType extends FieldType = FieldType, Value = unknown> {
	readonly field: TypedFieldNamed<TFieldType, Value>;
	readonly rule: FieldValidationRule;
	readonly isChecked: boolean; // certain rules work for certain field types only; if incompatible it's isValid but !isChecked
	readonly isValid: boolean;

	readonly message?: string; // custom message
	readonly regExpMatch?: RegExpMatchArray;
}

export interface FieldValidationResult<TFieldType extends FieldType = FieldType, Value = unknown> {
	readonly field: TypedFieldNamed<TFieldType, Value>;
	readonly isValid: boolean;
	readonly errors: { [fullQualifiedName: string]: FieldRuleValidationResult[] }; // failed rules only

	// details with all evaluated rules
	readonly ruleValidationResult: FieldRuleValidationResult[];
	readonly objectValidationResult?: ObjectValidationResult; // if baseType is 'object'
	readonly arrayValidationResult?: FieldValidationResult[]; // if baseType is 'array'	
}

export interface ObjectValidationResult<TypeObj = unknown, ValueObj = unknown> {
	readonly fieldSet: TypedFieldSetNamed<TypeObj, ValueObj>;
	readonly isValid: boolean;
	readonly errors: { [fullQualifiedName: string]: FieldRuleValidationResult[] }; // failed rules only

	// details with all evaluated rules
	readonly validationResult: { [name in keyof TypeObj]: FieldValidationResult };
}

// rootObj to resolve field references starting with "/", see the "reference" rule
// namedObjs to resolve field references starting with "@refName", see the "field-reference" rules
export interface FieldValidationContext {
	readonly arrayIndex: number | undefined; // index in the array (closest in hierarchy)

	// if specified and full qualified member name starts with "/" then the evaluation will start at the root object, not the parameter object
	readonly rootObj: TypedFieldSetNamed;
	readonly currentObj: TypedFieldSetNamed; // closest object in the hierarchy where references are resolved by default (unless referring to root or named obj)

	// if specified and full qualified member name starts with "@refName" then the evaluation will start at the named object found here, not the parameter object
	readonly namedObjs: { [refName: string]: TypedFieldSetNamed };

	readonly customData?: unknown; // for custom validation, whatever is needed will be passed over
}
