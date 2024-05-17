import { TypedFieldNamed, TypedFieldSetNamed } from "fields";
import { FieldValidationRule } from "rules/types";

export interface FieldRuleValidationResult {
	// location
	readonly name: string;
	readonly fullQualifiedName: string; // use this to get the FieldType from the schema or the value from the validated object
	readonly objectFullQualifiedName: string; // closest parent object in the hierarchy
	readonly itemIndex?: number; // closest last array index in the hierarchy

	// validated
	readonly rule: FieldValidationRule;
	readonly fieldType: string;
	readonly value: unknown;

	// result
	readonly isChecked: boolean; // certain rules work for certain field types only; if incompatible it's isValid but !isChecked
	readonly isValid: boolean;
	readonly message?: string; // custom message

	// meta
	readonly regExpMatch?: RegExpMatchArray;
	readonly customResult?: unknown; // provided by the 'custom' rule

	// validated children
	readonly childRules: FieldRuleValidationResult[];
}

export interface FieldValidationResult {
	readonly isValid: boolean;
	readonly errors: { [fullQualifiedName: string]: FieldRuleValidationResult[] }; // failed rules only
}

export interface ObjectValidationResult<TypeObj = unknown> {
	readonly isValid: boolean;
	readonly errors: { [fullQualifiedName: string]: FieldRuleValidationResult[] }; // failed rules only

	readonly namedObjs: FieldValidationContext["namedObjs"]; // collected named objs
	readonly notFoundRefNames: { [refName: string]: string[] }; // [refName, fullQualifiedName[]]

	// details with all evaluated rules
	// we only have this at the root level in basic validation; use detailed validation to get it for the whole hierarchy
	readonly validationResult: { [name in keyof TypeObj]: FieldValidationResult };
}

// rootObj to resolve field references starting with "/", see the "reference" rule
// namedObjs to resolve field references starting with "@refName", see the "field-reference" rules
export interface FieldValidationContext {
	readonly itemIndex?: number; // index in the array (closest in hierarchy)

	// if specified and full qualified member name starts with "/" then the evaluation will start at the root object, not the parameter object
	readonly rootObj: TypedFieldSetNamed;
	readonly currentObj: TypedFieldSetNamed; // closest object in the hierarchy where references are resolved by default (unless referring to root or named obj)

	// if specified and full qualified member name starts with "@refName" then the evaluation will start at the named object found here, not the parameter object
	readonly namedObjs: { [refName: string]: TypedFieldSetNamed };
	readonly customData?: unknown; // for custom validation, whatever is needed will be passed over

	readonly notFoundRefNames: {
		[refName: string]: {
			[fullQualifiedName: string]: {
				readonly field: TypedFieldNamed;
				readonly rule: FieldValidationRule;
			}
		}
	};
}
