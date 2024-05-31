import { ValueOrArray } from "@react-simple/react-simple-util";
import {
	FieldBooleanEqualsRule, FieldDateEqualsRule, FieldNumberEqualsRule, FieldTextEqualsRule, FieldFileContentTypeRule, FieldArrayMaxLengthRule,
	FieldDateMaxValueRule, FieldFileMaxSizeRule, FieldNumberMaxValueRule, FieldTextMaxLengthRule, FieldArrayMinLengthRule, FieldDateMinValueRule,
	FieldNumberMinValueRule, FieldTextMinLengthRule, FieldTextMatchRule, FieldRequiredRule, FieldValidationRule, AllRulesValidRule, SomeRulesValidRule,
	FieldTextLengthEqualsRule, FieldNumberRangeRule, FieldDateRangeRule, FieldArrayLengthEqualsRule, FieldArrayLengthRangeRule, FieldArrayIncludeSomeRule,
	FieldArrayMatchAllRule, FieldArrayMatchSomeRule, FieldTextLengthRangeRule, FieldArrayIncludeAllRule, FieldArrayIncludeNoneRule,
	FieldIfThenElseConditionalRule, FieldSwitchConditionalRule, ArrayItemIndexMinRule, ArrayItemIndexMaxRule, ArrayItemIndexEqualsRule, ArrayItemIndexRangeRule,
	FieldReferenceRule, FieldComparisonConditionalRule, FieldTextCustomValidationRule, FieldNumberCustomValidationRule, FieldDateCustomValidationRule,
	FieldBooleanCustomValidationRule, FieldFileCustomValidationRule, FieldArrayCustomValidationRule, FieldObjectCustomValidationRule, FieldAnyCustomValidationRule
} from "./types";

export interface ValidationRuleOptions {
	readonly message?: string;
}

// Factory methods for rules
export const RULES: {
	readonly required: (options?: ValidationRuleOptions) => FieldRequiredRule;

	readonly text: {
		readonly equals: (
			expectedValue: FieldTextEqualsRule["expectedValue"],
			options?: ValidationRuleOptions & { ignoreCase?: boolean }
		) => FieldTextEqualsRule;

		readonly match: (regExp: FieldTextMatchRule["regExp"], regExpName?: FieldTextMatchRule["regExpName"], options?: ValidationRuleOptions) => FieldTextMatchRule;

		readonly length: {
			readonly min: (minLength: FieldTextMinLengthRule["minLength"], options?: ValidationRuleOptions) => FieldTextMinLengthRule;
			readonly max: (maxLength: FieldTextMaxLengthRule["maxLength"], options?: ValidationRuleOptions) => FieldTextMaxLengthRule;
			readonly equals: (length: FieldTextLengthEqualsRule["expectedLength"], options?: ValidationRuleOptions) => FieldTextLengthEqualsRule;
			readonly range: (
				minLength: FieldTextLengthRangeRule["minLength"],
				maxLength: FieldTextLengthRangeRule["maxLength"],
				options?: ValidationRuleOptions
			) => FieldTextLengthRangeRule;
		};

		readonly custom: (validate: FieldTextCustomValidationRule["validate"], options?: ValidationRuleOptions) => FieldTextCustomValidationRule;
	};

	readonly number: {
		readonly min: (minValue: FieldNumberMinValueRule["minValue"], options?: { message?: string; mustBeGreater?: boolean }) => FieldNumberMinValueRule;
		readonly max: (maxValue: FieldNumberMaxValueRule["maxValue"], options?: { message?: string; mustBeLess?: boolean }) => FieldNumberMaxValueRule;
		readonly equals: (expectedValue: FieldNumberEqualsRule["expectedValue"], options?: ValidationRuleOptions) => FieldNumberEqualsRule;
		readonly range: (
			minValue: FieldNumberRangeRule["minValue"],
			maxValue: FieldNumberRangeRule["maxValue"],
			options?: ValidationRuleOptions & {
				mustBeLess?: boolean;
				mustBeGreater?: boolean;
			}
		) => FieldNumberRangeRule;

		readonly custom: (validate: FieldNumberCustomValidationRule["validate"], options?: ValidationRuleOptions) => FieldNumberCustomValidationRule;
	};

	readonly date: {
		readonly min: (minDate: FieldDateMinValueRule["minDate"], options?: { message?: string; mustBeGreater?: boolean }) => FieldDateMinValueRule;
		readonly max: (maxDate: FieldDateMaxValueRule["maxDate"], options?: { message?: string; mustBeLess?: boolean }) => FieldDateMaxValueRule;
		readonly equals: (expectedValue: FieldDateEqualsRule["expectedValue"], options?: ValidationRuleOptions) => FieldDateEqualsRule;
		readonly range: (
			minDate: FieldDateRangeRule["minDate"],
			maxDate: FieldDateRangeRule["maxDate"],
			options?: ValidationRuleOptions & {
				mustBeLess?: boolean;
				mustBeGreater?: boolean;
			}) => FieldDateRangeRule;

		readonly custom: (validate: FieldDateCustomValidationRule["validate"], options?: ValidationRuleOptions) => FieldDateCustomValidationRule;
	};

	readonly boolean: {
		readonly equals: (expectedValue: FieldBooleanEqualsRule["expectedValue"], options?: ValidationRuleOptions) => FieldBooleanEqualsRule;
		readonly custom: (validate: FieldBooleanCustomValidationRule["validate"], options?: ValidationRuleOptions) => FieldBooleanCustomValidationRule;
	};

	readonly file: {
		readonly size: {
			readonly max: (maxSizeBytes: FieldFileMaxSizeRule["maxFileSize"], options?: ValidationRuleOptions) => FieldFileMaxSizeRule;
		};

		readonly contentType: (contentTypes: FieldFileContentTypeRule["allowedContentTypes"], options?: ValidationRuleOptions) => FieldFileContentTypeRule;
		readonly custom: (validate: FieldFileCustomValidationRule["validate"], options?: ValidationRuleOptions) => FieldFileCustomValidationRule;
	};

	readonly array: {
		readonly include: {
			readonly some: (
				item: FieldArrayIncludeSomeRule["items"],
				options?: ValidationRuleOptions & { filter?: FieldArrayIncludeSomeRule["filter"] }
			) => FieldArrayIncludeSomeRule;

			readonly all: (
				item: FieldArrayIncludeAllRule["items"],
				options?: ValidationRuleOptions & { filter?: FieldArrayIncludeAllRule["filter"] }
			) => FieldArrayIncludeAllRule;

			readonly none: (
				item: FieldArrayIncludeNoneRule["items"],
				options?: ValidationRuleOptions & { filter?: FieldArrayIncludeNoneRule["filter"] }
			) => FieldArrayIncludeNoneRule;
		};

		readonly length: {
			readonly min: (
				minLength: FieldArrayMinLengthRule["minLength"],
				options?: ValidationRuleOptions & { filter?: FieldArrayMinLengthRule["filter"] }
			) => FieldArrayMinLengthRule;

			readonly max: (
				maxLength: FieldArrayMaxLengthRule["maxLength"],
				options?: ValidationRuleOptions & { filter?: FieldArrayMaxLengthRule["filter"] }
			) => FieldArrayMaxLengthRule;

			readonly equals: (
				length: FieldArrayLengthEqualsRule["expectedLength"],
				options?: ValidationRuleOptions & { filter?: FieldArrayLengthEqualsRule["filter"] }
			) => FieldArrayLengthEqualsRule;

			readonly range: (
				minLength: FieldArrayLengthRangeRule["minLength"],
				maxLength: FieldArrayLengthRangeRule["maxLength"],
				options?: ValidationRuleOptions & { filter?: FieldArrayLengthRangeRule["filter"] }
			) => FieldArrayLengthRangeRule;
		};

		readonly itemIndex: {
			readonly min: (minIndex: ArrayItemIndexMinRule["minIndex"], options?: ValidationRuleOptions) => ArrayItemIndexMinRule;
			readonly max: (maxIndex: ArrayItemIndexMaxRule["maxIndex"], options?: ValidationRuleOptions) => ArrayItemIndexMaxRule,
			readonly equals: (index: ArrayItemIndexEqualsRule["index"], options?: ValidationRuleOptions) => ArrayItemIndexEqualsRule;
			readonly range: (
				minIndex: ArrayItemIndexRangeRule["minIndex"],
				maxIndex: ArrayItemIndexRangeRule["maxIndex"],
				options?: ValidationRuleOptions
			) => ArrayItemIndexRangeRule;
		};

		readonly match: {
			readonly all: (
				predicate: FieldArrayMatchAllRule["predicate"],
				options?: ValidationRuleOptions & { filter?: FieldArrayMatchAllRule["filter"] }
			) => FieldArrayMatchAllRule;

			readonly some: (
				predicate: FieldArrayMatchSomeRule["predicate"],
				options?: ValidationRuleOptions & { filter?: FieldArrayMatchSomeRule["filter"] }
			) => FieldArrayMatchSomeRule;
		};

		readonly custom: (validate: FieldArrayCustomValidationRule["validate"], options?: ValidationRuleOptions) => FieldArrayCustomValidationRule;
	};

	readonly object: {
		readonly custom: (validate: FieldObjectCustomValidationRule["validate"], options?: ValidationRuleOptions) => FieldObjectCustomValidationRule;
	};

	readonly any: {
		readonly custom: (validate: FieldAnyCustomValidationRule["validate"], options?: ValidationRuleOptions) => FieldAnyCustomValidationRule;
	};

	readonly operators: {
		readonly some: (rules: SomeRulesValidRule["rules"], options?: ValidationRuleOptions) => SomeRulesValidRule;
		readonly all: (rules: AllRulesValidRule["rules"], options?: ValidationRuleOptions) => AllRulesValidRule;
	};

	readonly conditions: {
		readonly ifThenElse: (
			if_: FieldValidationRule,
			then_: ValueOrArray<FieldValidationRule>,
			else_?: ValueOrArray<FieldValidationRule>,
			options?: ValidationRuleOptions
		) => FieldIfThenElseConditionalRule;

		readonly switch: (
			cases: FieldSwitchConditionalRule["cases"],
			default_?: FieldSwitchConditionalRule["default"],
			options?: ValidationRuleOptions
		) => FieldSwitchConditionalRule;

		readonly compare: (
			operator: FieldComparisonConditionalRule["operator"],
			path: FieldComparisonConditionalRule["path"], // right hand operand; field value is the left hand operand			
			options?: ValidationRuleOptions & {
				ignoreCase?: boolean;
				// number to add to the right hand operand; number value or number of days if date
				addition?: FieldComparisonConditionalRule["addition"];
			}
		) => FieldComparisonConditionalRule;
	};

	readonly references: {
		readonly fieldRef: (
			path: FieldReferenceRule["path"],
			rules: FieldReferenceRule["rules"],
			options?: ValidationRuleOptions
		) => FieldReferenceRule;
	};
} = {
	required: (options) => ({
		...options,
		ruleType: "required"
	}),

	text: {
		equals: (expectedValue, options) => ({
			...options,
			ruleType: "text-equals",
			expectedValue
		}),

		match: (regExp, regExpName, options) => ({
			...options,
			ruleType: "text-match",
			regExp,
			regExpName
		}),

		length: {
			min: (minLength, options) => ({
				...options,
				ruleType: "text-length-min",
				minLength
			}),

			max: (maxLength, options) => ({
				...options,
				ruleType: "text-length-max",
				maxLength
			}),

			equals: (expectedLength, options) => ({
				...options,
				ruleType: "text-length-equals",
				expectedLength
			}),

			range: (minLength, maxLength, options) => ({
				...options,
				ruleType: "text-length-range",
				minLength,
				maxLength
			})
		},

		custom: (validate, options) => ({
			...options,
			ruleType: "text-custom",
			validate
		})
	},

	number: {
		min: (minValue, options) => ({
			...options,
			ruleType: "number-min",
			minValue
		}),

		max: (maxValue, options) => ({
			...options,
			ruleType: "number-max",
			maxValue
		}),

		range: (minValue, maxValue, options) => ({
			...options,
			ruleType: "number-range",
			minValue,
			maxValue
		}),

		equals: (expectedValue, options) => ({
			...options,
			ruleType: "number-equals",
			expectedValue
		}),

		custom: (validate, options) => ({
			...options,
			ruleType: "number-custom",
			validate
		})
	},

	date: {
		min: (minDate, options) => ({
			...options,
			ruleType: "date-min",
			minDate
		}),

		max: (maxDate, options) => ({
			...options,
			ruleType: "date-max",
			maxDate
		}),

		range: (minDate, maxDate, options) => ({
			...options,
			ruleType: "date-range",
			minDate,
			maxDate
		}),

		equals: (expectedValue, options) => ({
			...options,
			ruleType: "date-equals",
			expectedValue
		}),

		custom: (validate, options) => ({
			...options,
			ruleType: "date-custom",
			validate
		})
	},

	boolean: {
		equals: (expectedValue, options) => ({
			...options,
			ruleType: "boolean-equals",
			expectedValue
		}),

		custom: (validate, options) => ({
			...options,
			ruleType: "boolean-custom",
			validate
		})
	},

	file: {
		size: {
			max: (maxFileSize, options) => ({
				...options,
				ruleType: "file-size-max",
				maxFileSize
			})
		},

		contentType: (allowedContentTypes, options) => ({
			...options,
			ruleType: "file-content-type",
			allowedContentTypes
		}),

		custom: (validate, options) => ({
			...options,
			ruleType: "file-custom",
			validate
		})
	},

	array: {
		include: {
			some: (items, options) => ({
				...options,
				ruleType: "array-include-some",
				items
			}),

			all: (items, options) => ({
				...options,
				ruleType: "array-include-all",
				items
			}),

			none: (items, options) => ({
				...options,
				ruleType: "array-include-none",
				items
			})
		},

		length: {
			min: (minLength, options) => ({
				...options,
				ruleType: "array-length-min",
				minLength
			}),

			max: (maxLength, options) => ({
				...options,
				ruleType: "array-length-max",
				maxLength
			}),

			equals: (expectedLength, options) => ({
				...options,
				ruleType: "array-length-equals",
				expectedLength
			}),

			range: (minLength, maxLength, options) => ({
				...options,
				ruleType: "array-length-range",
				minLength,
				maxLength
			})
		},

		itemIndex: {
			min: (minIndex, options) => ({
				...options,
				ruleType: "array-itemindex-min",
				minIndex
			}),

			max: (maxIndex, options) => ({
				...options,
				ruleType: "array-itemindex-max",
				maxIndex
			}),

			equals: (index, options) => ({
				...options,
				ruleType: "array-itemindex-equals",
				index
			}),

			range: (minIndex, maxIndex, options) => ({
				...options,
				ruleType: "array-itemindex-range",
				minIndex,
				maxIndex
			})
		},

		match: {
			all: (predicate, options) => ({
				...options,
				ruleType: "array-match-all",
				predicate
			}),

			some: (predicate, options) => ({
				...options,
				ruleType: "array-match-some",
				predicate
			})
		},

		custom: (validate, options) => ({
			...options,
			ruleType: "array-custom",
			validate
		})
	},

	object: {
		custom: (validate, options) => ({
			...options,
			ruleType: "object-custom",
			validate
		})
	},

	any: {
		custom: (validate, options) => ({
			...options,
			ruleType: "any-custom",
			validate
		})
	},

	operators: {
		some: (rules, options) => ({
			...options,
			ruleType: "some-rules-valid",
			rules
		}),

		all: (rules, options) => ({
			...options,
			ruleType: "all-rules-valid",
			rules
		})
	},

	conditions: {
		ifThenElse: (if_, then_, else_, options) => ({
			...options,
			ruleType: "if-then-else",
			if: if_,
			then: then_,
			else: else_
		}),

		switch: (cases, default_, options) => ({
			...options,
			ruleType: "switch",
			cases,
			default: default_
		}),

		compare: (operator, path, options) => ({
			...options,
			ruleType: "compare",
			operator,
			path
		})
	},

	references: {
		fieldRef: (path, rules, options) => ({
			...options,
			ruleType: "field-reference",
			path,
			rules
		})
	}
};
