import { ReactSimpleValidationDependencyInjection } from "types.di";

export interface ReactSimpleValidation {
	FIELD_DEFAULTS: {
		validation: {
			defaultRules: {
				required: boolean;
			}
		};
		shortText: {
			maxLength: number;
		};
		text: {
			maxLength: number;
		};
		longText: {
			maxLength: number;
		};
		textArea: {
			maxLength: number;
		};
		percent: {
			minValue: number;
			maxValue: number;
		};
		tel: {
			maxLength: number;
			regExp: RegExp;
		};
		email: {
			maxLength: number;
			regExp: RegExp;
		};
	};

	DI: ReactSimpleValidationDependencyInjection;
}
