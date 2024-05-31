import { ReactSimpleValidation } from "types";

// For depndency injection references. All stub references are set by the respective util files.
const stub: any = () => { };

// Custom types are set in types.custom.ts and can be set by the client code if more types are defined.
export const REACT_SIMPLE_VALIDATION: ReactSimpleValidation = {
	LOGGING: {
		logLevel: "error" // for functions in react-simple-validation
	},

	// Field instance default values by [baseType, type]. Base types are fixed, but any custom types can be added here (text -> short-text, tel, email etc.)
	// Specified rules will overwrite default rules by using 'ruleType'.
	// Default rules should only contain basic rules (required, max value, max length, regex etc.)
	DEFAULT_RULES: {
		any: {
			any: [{ ruleType: "required" }]
		},
		text: {
			text: [
				{ ruleType: "required" },
				{ ruleType: "text-length-max", maxLength: 200 }
			]
		},
		number: {
			number: [{ ruleType: "required" }],
			percent: [
				{ ruleType: "number-min", minValue: 0 },
				{ ruleType: "number-max", maxValue: 100 }
			]
		},
		date: {
			date: [{ ruleType: "required" }]
		},
		boolean: {
			boolean: [{ ruleType: "required" }]
		},
		file: {
			file: [{ ruleType: "required" }]
		},
		array: {
			array: [{ ruleType: "required" }]
		},
		object: {
			object: [{ ruleType: "required" }]
		}
	},

	DI: {
		fields: {
			getChildFieldTypeByName: stub,			
			getChildFieldTypeByFullQualifiedName: stub,
			getChildFieldTypeInfoByFullQualifiedName: stub
		},

		validation: {
			validateRule: stub,
			validateField: stub,
			validateObject: stub
		},

		validationResult: {
			getChildValidationResult: stub,
			getFieldRuleValidationErrorMessage: stub,
			getFieldRuleValidationErrorMessages: stub,
			getFieldValidationErrorMessages: stub,
			getObjectValidationErrorMessages: stub
		}
	}
};
