import { ValueOrArray } from "@react-simple/react-simple-util";
import {
	FieldCustomValidationRule, FieldBooleanValueRule, FieldDateValueRule, FieldNumberValueRule, FieldTextValueRule, 
	FieldFileContentTypeRule, FieldArrayMaxLengthRule, FieldDateMaxValueRule, FieldFileMaxSizeRule, FieldNumberMaxValueRule,
	FieldTextMaxLengthRule, FieldArrayMinLengthRule, FieldDateMinValueRule, FieldNumberMinValueRule, FieldTextMinLengthRule, FieldTextRegExpRule,
	FieldRequiredRule, FieldValidationRule, AllRulesValidRule, SomeRulesValidRule, FieldTextLengthRule, FieldNumberRangeRule, FieldDateRangeRule,
	FieldArrayLengthRule, FieldArrayLengthRangeRule, FieldArrayIncludeSomeRule, FieldArrayPredicateAllRule, FieldArrayPredicateSomeRule,
	FieldTextLengthRangeRule, FieldArrayIncludeAllRule, FieldArrayIncludeNoneRule, FieldIfThenElseConditionRule, FieldSwitchConditionRule,
	ArrayItemIndexMinRule, ArrayItemIndexMaxRule, ArrayItemIndexRule, ArrayItemIndexRangeRule, FieldReferenceRule
} from "./types";

export interface ValidationRuleOptions {
	readonly message?: string;
}

export const RULES: {
	readonly required: (options?: ValidationRuleOptions) => FieldRequiredRule;

	readonly text: {
		readonly value: (
			expectedValue: FieldTextValueRule["expectedValue"],
			options?: ValidationRuleOptions & { caseInsensitive?: boolean }
		) => FieldTextValueRule;

		readonly regExp: (regExp: FieldTextRegExpRule["regExp"], options?: ValidationRuleOptions) => FieldTextRegExpRule;

		readonly length: {
			readonly min: (minLength: FieldTextMinLengthRule["minLength"], options?: ValidationRuleOptions) => FieldTextMinLengthRule;
			readonly max: (maxLength: FieldTextMaxLengthRule["maxLength"], options?: ValidationRuleOptions) => FieldTextMaxLengthRule;
			readonly value: (length: FieldTextLengthRule["expectedLength"], options?: ValidationRuleOptions) => FieldTextLengthRule;
			readonly range: (
				minLength: FieldTextLengthRangeRule["minLength"],
				maxLength: FieldTextLengthRangeRule["maxLength"],
				options?: ValidationRuleOptions
			) => FieldTextLengthRangeRule;
		};
	};

	readonly number: {
		readonly min: (minValue: FieldNumberMinValueRule["minValue"], options?: { message?: string; mustBeGreater?: boolean }) => FieldNumberMinValueRule;
		readonly max: (maxValue: FieldNumberMaxValueRule["maxValue"], options?: { message?: string; mustBeLess?: boolean }) => FieldNumberMaxValueRule;
		readonly value: (expectedValue: FieldNumberValueRule["expectedValue"], options?: ValidationRuleOptions) => FieldNumberValueRule;
		readonly range: (
			minValue: FieldNumberRangeRule["minValue"],
			maxValue: FieldNumberRangeRule["maxValue"],
			options?: ValidationRuleOptions & {
				mustBeLess?: boolean;
				mustBeGreater?: boolean;
			}
		) => FieldNumberRangeRule;
	};

	readonly date: {
		readonly min: (minDate: FieldDateMinValueRule["minDate"], options?: { message?: string; mustBeGreater?: boolean }) => FieldDateMinValueRule;
		readonly max: (maxDate: FieldDateMaxValueRule["maxDate"], options?: { message?: string; mustBeLess?: boolean }) => FieldDateMaxValueRule;
		readonly value: (expectedValue: FieldDateValueRule["expectedValue"], options?: ValidationRuleOptions) => FieldDateValueRule;
		readonly range: (
			minDate: FieldDateRangeRule["minDate"],
			maxDate: FieldDateRangeRule["maxDate"],
			options?: ValidationRuleOptions & {
				mustBeLess?: boolean;
				mustBeGreater?: boolean;
			}) => FieldDateRangeRule;
	};

	readonly boolean: {
		readonly value: (expectedValue: FieldBooleanValueRule["expectedValue"], options?: ValidationRuleOptions) => FieldBooleanValueRule;
	};

	readonly file: {
		readonly size: {
			readonly max: (maxSizeBytes: FieldFileMaxSizeRule["maxFileSize"], options?: ValidationRuleOptions) => FieldFileMaxSizeRule;
		};

		readonly contentType: (contentTypes: FieldFileContentTypeRule["allowedContentTypes"], options?: ValidationRuleOptions) => FieldFileContentTypeRule;
	};

	readonly array: {
		readonly include: {
			readonly some: (
				item: FieldArrayIncludeSomeRule["item"],
				options?: ValidationRuleOptions & { filter?: FieldArrayIncludeSomeRule["filter"] }
			) => FieldArrayIncludeSomeRule;

			readonly all: (
				item: FieldArrayIncludeAllRule["item"],
				options?: ValidationRuleOptions & { filter?: FieldArrayIncludeAllRule["filter"] }
			) => FieldArrayIncludeAllRule;

			readonly none: (
				item: FieldArrayIncludeNoneRule["item"],
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

			readonly value: (
				length: FieldArrayLengthRule["expectedLength"],
				options?: ValidationRuleOptions & { filter?: FieldArrayLengthRule["filter"] }
			) => FieldArrayLengthRule;

			readonly range: (
				minLength: FieldArrayLengthRangeRule["minLength"],
				maxLength: FieldArrayLengthRangeRule["maxLength"],
				options?: ValidationRuleOptions & { filter?: FieldArrayLengthRangeRule["filter"] }
			) => FieldArrayLengthRangeRule;
		};

		readonly item: {
			readonly index: {
				readonly min: (minIndex: ArrayItemIndexMinRule["minIndex"], options?: ValidationRuleOptions) => ArrayItemIndexMinRule;
				readonly max: (maxIndex: ArrayItemIndexMaxRule["maxIndex"], options?: ValidationRuleOptions) => ArrayItemIndexMaxRule,
				readonly value: (index: ArrayItemIndexRule["index"], options?: ValidationRuleOptions) => ArrayItemIndexRule;
				readonly range: (
					minIndex: ArrayItemIndexRangeRule["minIndex"],
					maxIndex: ArrayItemIndexRangeRule["maxIndex"],
					options?: ValidationRuleOptions
				) => ArrayItemIndexRangeRule;
			};

			readonly all: (
				predicate: FieldArrayPredicateAllRule["predicate"],
				options?: ValidationRuleOptions & { filter?: FieldArrayPredicateAllRule["filter"] }
			) => FieldArrayPredicateAllRule;

			readonly some: (
				predicate: FieldArrayPredicateSomeRule["predicate"],
				options?: ValidationRuleOptions & { filter?: FieldArrayPredicateSomeRule["filter"] }
			) => FieldArrayPredicateSomeRule;
		};
	};

	readonly custom: (validate: FieldCustomValidationRule["validate"], options?: ValidationRuleOptions) => FieldCustomValidationRule;

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
		) => FieldIfThenElseConditionRule;

		readonly switch: (
			cases: FieldSwitchConditionRule["cases"],
			default_?: FieldSwitchConditionRule["default"],
			options?: ValidationRuleOptions
		) => FieldSwitchConditionRule;
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
		value: (expectedValue, options) => ({
			...options,
			ruleType: "text-value",
			expectedValue
		}),

		regExp: (regExp, options) => ({
			...options,
			ruleType: "text-regexp",
			regExp
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

			value: (expectedLength, options) => ({
				...options,
				ruleType: "text-length",
				expectedLength
			}),

			range: (minLength, maxLength, options) => ({
				...options,
				ruleType: "text-length-range",
				minLength,
				maxLength
			})
		}
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

		value: (expectedValue, options) => ({
			...options,
			ruleType: "number-value",
			expectedValue
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

		value: (expectedValue, options) => ({
			...options,
			ruleType: "date-value",
			expectedValue
		})
	},

	boolean: {
		value: (expectedValue, options) => ({
			...options,
			ruleType: "boolean-value",
			expectedValue
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
			ruleType: "file-contenttype",
			allowedContentTypes
		}),
	},

	array: {
		include: {
			some: (item, options) => ({
				...options,
				ruleType: "array-include-some",
				item
			}),

			all: (item, options) => ({
				...options,
				ruleType: "array-include-all",
				item
			}),

			none: (item, options) => ({
				...options,
				ruleType: "array-include-none",
				item
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

			value: (expectedLength, options) => ({
				...options,
				ruleType: "array-length",
				expectedLength
			}),

			range: (minLength, maxLength, options) => ({
				...options,
				ruleType: "array-length-range",
				minLength,
				maxLength
			})
		},

		item: {
			index: {
				min: (minIndex, options) => ({
					...options,
					ruleType: "array-item-index-min",
					minIndex
				}),

				max: (maxIndex, options) => ({
					...options,
					ruleType: "array-item-index-max",
					maxIndex
				}),

				value: (index, options) => ({
					...options,
					ruleType: "array-item-index",
					index
				}),

				range: (minIndex, maxIndex, options) => ({
					...options,
					ruleType: "array-item-index-range",
					minIndex,
					maxIndex
				})
			},

			all: (predicate, options) => ({
				...options,
				ruleType: "array-predicate-all",
				predicate
			}),

			some: (predicate, options) => ({
				...options,
				ruleType: "array-predicate-some",
				predicate
			})
		}
	},

	custom: (validate, options) => ({
		...options,
		ruleType: "custom",
		validate
	}),

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
