import { ArrayFieldTypeBase, Field, FieldTypes, ObjectFieldTypeBase } from "fields";
import { FieldValidationRule } from "rules/types";

export type FieldRuleValidationErrors = { [fullQualifiedName: string]: string[] };

export interface FieldValidationOptions {
	// parameters which are accessible using "@refName" references (@refName can also be used to access fields with refName property set)
	readonly namedObjs?: { [refName: string]: Pick<Field, "value" | "type"> };
	readonly data?: any; // for custom validation, whatever is needed will be passed over
	readonly cultureId?: string; /// if not REACT_SIMPLE_LOCALIZATION.CULTURE_INFO.current

	readonly incrementalValidation?: {
		readonly filter: string[] | ((field: Field, context: FieldValidationContext) => boolean); // full qualified names or filter callback
		readonly previousResult: ObjectValidationResult;		
	};

	readonly callbacks?: {
		readonly onFieldRuleValidated?: (result: FieldRuleValidationResult, field: Field, context: FieldValidationContext) => FieldRuleValidationResult | void;
		readonly onFieldValidated?: (result: FieldValidationResult, context: FieldValidationContext) => FieldValidationResult | void;
		readonly onFieldSkipped?: (field: Field, prevResult: FieldValidationResult | undefined, context: FieldValidationContext) => void;
		readonly onObjectValidated?: (result: ObjectValidationResult, context: FieldValidationContext) => ObjectValidationResult | void;
	};
}

// rootObj to resolve field references starting with "/", see the "reference" rule
// namedObjs to resolve field references starting with "@refName", see the "field-reference" rules
export interface FieldValidationContext {

	// if specified and full qualified member name starts with "/" then the evaluation will start at the root object, not the parameter object
	readonly rootObj: Field<ObjectFieldTypeBase, object>;
	readonly parentObj: Field<ObjectFieldTypeBase, object>; // closest object in the hierarchy where references are resolved by default (unless referring to root or named obj)

	readonly parentArray?: {
		readonly field: Field<ArrayFieldTypeBase, unknown[]>;
		readonly itemIndex: number;
	};

	// if specified and full qualified member name starts with "@refName" then the evaluation will start at the named object found here, not the parameter object
	readonly namedFields: { [refName: string]: Field };
	readonly namedFieldsNotFound: {
		[refName: string]: {
			// referrer -> target not found
			[referrerFullQualifiedName: string]: {
				readonly refFrom: Field;
			}
		}
	};

	readonly errorsFlatList: FieldRuleValidationErrors;
	readonly options?: FieldValidationOptions;
}

// custom info, provided by the 'custom' rule, but other rules also put info here ('switch' puts the value)
export interface FieldValidationResultDetails {
	readonly key: string;
	readonly value?: unknown;
	readonly message?: string;
	readonly path?: unknown;
}

export interface FieldRuleValidationResult {
	// validated
	readonly rule: FieldValidationRule;

	// result
	readonly isValid: boolean;
	readonly message?: string; // custom message
	readonly errors?: FieldRuleValidationResult[];

	// meta
	readonly regExpMatch?: RegExpMatchArray;
	readonly details?: FieldValidationResultDetails[];
}

export interface FieldValidationResult {
	// location
	readonly name: string;
	readonly fullQualifiedName: string; // use this to get the FieldType from the schema or the value from the validated object
	readonly objectFullQualifiedName: string; // closest parent object in the hierarchy

	// validated
	readonly fieldType: string;
	readonly value: unknown;

	// result
	readonly isValid: boolean;
	readonly errors: FieldRuleValidationResult[];
	readonly childErrors: { [name: string]: FieldValidationResult }; // errors only
	readonly childResult: { [name: string]: FieldValidationResult }; // all validation result (errors + valid)
}

// Schema is not FieldType or value type, it's an object with the keys we need.
// Usually, those keys are coming from ObjectFieldType.schema.
export interface ObjectValidationResult<Schema extends FieldTypes = any> {
	readonly isValid: boolean;

	// details with all evaluated rules
	// we only have this at the root level in basic validation; use detailed validation to get it for the whole hierarchy
	readonly childErrors: { [name in keyof Schema]: FieldValidationResult }; // errors only
	readonly childResult: { [name in keyof Schema]: FieldValidationResult }; // all validation result (errors + valid)
	
	readonly errorsFlatList: FieldValidationContext["errorsFlatList"];

	// meta
	readonly namedFields: FieldValidationContext["namedFields"]; // collected named objs
	readonly namedFieldsNotFound: FieldValidationContext["namedFieldsNotFound"];	
}
