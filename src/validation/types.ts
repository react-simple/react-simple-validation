import { Field, FieldTypes } from "fields";
import { FieldValidationRule } from "rules/types";

// rootObj to resolve field references starting with "/", see the "reference" rule
// namedObjs to resolve field references starting with "@refName", see the "field-reference" rules
export interface FieldValidationContext {
	readonly itemIndex?: number; // index in the array (closest in hierarchy)

	// if specified and full qualified member name starts with "/" then the evaluation will start at the root object, not the parameter object
	readonly rootObj: Field;
	readonly currentObj: Field; // closest object in the hierarchy where references are resolved by default (unless referring to root or named obj)

	// if specified and full qualified member name starts with "@refName" then the evaluation will start at the named object found here, not the parameter object
	readonly namedObjs: { [refName: string]: Field };

	readonly refNames: {
		readonly notFound: {
			[refName: string]: {
				// referrer -> target not found
				[referrerFullQualifiedName: string]: {
					readonly refFrom: Field;
				}
			}
		};

		readonly resolved: {
			[refName: string]: {
				// referrer -> referred
				[referrerFullQualifiedName: string]: {
					readonly refFrom: Field;
					readonly refTo: Field;
				}
			}
		};
	};

	readonly data?: any; // for custom validation, whatever is needed will be passed over
}

// custom info, provided by the 'custom' rule, but other rules also put info here ('switch' puts the value)
export interface FieldRuleValidationResultReason {
	readonly key: string;
	readonly value?: unknown;
	readonly message?: string;
}

export interface FieldRuleValidationResult {
	// validated
	readonly rule: FieldValidationRule;

	// result
	readonly isValid: boolean;
	readonly message?: string; // custom message
	readonly errors?: FieldRuleValidationResult[];
	readonly children?: { [name: string]: FieldValidationResult };

	// meta
	readonly regExpMatch?: RegExpMatchArray;
	readonly reasons?: FieldRuleValidationResultReason[];
}

export interface FieldValidationResult {
	// location
	readonly name: string;
	readonly fullQualifiedName: string; // use this to get the FieldType from the schema or the value from the validated object
	readonly objectFullQualifiedName: string; // closest parent object in the hierarchy
	readonly itemIndex?: number; // closest last array index in the hierarchy

	// validated
	readonly fieldType: string;
	readonly value: unknown;

	// result
	readonly isValid: boolean;
	readonly errors: FieldRuleValidationResult[];
	readonly children: { [name: string]: FieldValidationResult };
}

// Schema is not FieldType or value type, it's an object with the keys we need.
// Usually, those keys are coming from ObjectFieldType.schema.
export interface ObjectValidationResult<Schema extends FieldTypes = any> {
	readonly isValid: boolean;

	// details with all evaluated rules
	// we only have this at the root level in basic validation; use detailed validation to get it for the whole hierarchy
	readonly errors: { [name in keyof Schema]: FieldValidationResult };

	// meta
	readonly namedObjs: FieldValidationContext["namedObjs"]; // collected named objs
	readonly refNames: FieldValidationContext["refNames"];
}
