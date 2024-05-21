import { ReactSimpleValidation } from "types";

// For depndency injection references. All stub references are set by the respective util files.
const stub: any = () => { };

export const REACT_SIMPLE_VALIDATION: ReactSimpleValidation = {
	FIELD_DEFAULTS: {
		validation: {
			defaultRules: {
				required: true
			}
		},
		shortText: {
			maxLength: 50
		},
		text: {
			maxLength: 200
		},
		longText: {
			maxLength: 500
		},
		textArea: {
			maxLength: 3000
		},
		percent: {
			minValue: 0,
			maxValue: 100
		},
		tel: {
			maxLength: 20,
			regExp: /^[\(\d+][\(\)-\d]*$/
		},
		email: {
			maxLength: 50,
			regExp: /^\w.+@\w.+\.\w+$/
		}
	},

	DI: {
		validateRule: stub,
		validateField: stub,
		validateObject: stub
	}
};
