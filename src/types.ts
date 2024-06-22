import { LogLevel } from "@react-simple/react-simple-util";
import { BaseFieldType } from "fields";
import {
	AnyFieldValidationRules, ArrayFieldValidationRules, BooleanFieldValidationRules, DateFieldValidationRules, FileFieldValidationRules,
	NumberFieldValidationRules, ObjectFieldValidationRules, TextFieldValidationRules,	ValidationRuleMessages
} from "rules";
import { ReactSimpleValidationDependencyInjection } from "types.di";

export interface ReactSimpleValidation {
	LOGGING: {
		logLevel: LogLevel; // for functions in react-simple-validation
	};

	// Field instance default values by [baseType, type]. Base types are fixed, but any custom types can be added here (text -> short-text, tel, email etc.)
	// Specified rules will overwrite default rules by using 'ruleType'. 
	// Default rules should only contain basic rules (required, max value, max length, regex etc.)
	DEFAULT_RULES: {
		any: {
			any: AnyFieldValidationRules[];
			[customType: string]: AnyFieldValidationRules[];
		};
		text: {
			text: TextFieldValidationRules[];
			[customType: string]: TextFieldValidationRules[];
		};
		number: {
			number: NumberFieldValidationRules[];
			[customType: string]: NumberFieldValidationRules[];
		};
		date: {
			date: DateFieldValidationRules[];
			[customType: string]: DateFieldValidationRules[];
		};
		boolean: {
			boolean: BooleanFieldValidationRules[];
			[customType: string]: BooleanFieldValidationRules[];
		};
		file: {
			file: FileFieldValidationRules[];
			[customType: string]: FileFieldValidationRules[];
		};
		array: {
			array: ArrayFieldValidationRules[];
			[customType: string]: ArrayFieldValidationRules[];
		};
		object: {
			object: ObjectFieldValidationRules[];
			[customType: string]: ObjectFieldValidationRules[];
		};
	};

	MESSAGES: {
		validationRuleMessages: { [cultureId: string]: ValidationRuleMessages };
		fieldTypeNames: { [cultureId: string]: Record<BaseFieldType, string> };
	},

	DI: ReactSimpleValidationDependencyInjection;
}
