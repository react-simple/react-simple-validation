import { FIELD_TYPES } from "fields";
import { FieldValidationRule, RULES } from "rules";
import { validateObject } from "validation";

it('validateFields.array-length-max', () => {
	const rule: FieldValidationRule = {
		ruleType: "array-length-max",
		maxLength: 3
	};

	let validationResult = validateObject(
		{
			good: [1, 2, 3],
			bad: [1, 2, 3, 4, 5]
		},
		{
			good: FIELD_TYPES.array(FIELD_TYPES.number(), [rule]),
			bad: FIELD_TYPES.array(FIELD_TYPES.number(), [rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.array-length-max.filter', () => {
	const rule: FieldValidationRule = {
		ruleType: "array-length-max",
		maxLength: 2,
		filter: RULES.number.min(2)
	};

	let validationResult = validateObject(
		{
			good: [1, 2, 3],
			bad: [1, 2, 3, 4, 5]
		},
		{
			good: FIELD_TYPES.array(FIELD_TYPES.number(), [rule]),
			bad: FIELD_TYPES.array(FIELD_TYPES.number(), [rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.array-length-min', () => {
	const rule: FieldValidationRule = {
		ruleType: "array-length-min",
		minLength: 3
	};

	let validationResult = validateObject(
		{
			good: [1, 2, 3],
			bad: [1]
		},
		{
			good: FIELD_TYPES.array(FIELD_TYPES.number(), [rule]),
			bad: FIELD_TYPES.array(FIELD_TYPES.number(), [rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.array-length-range', () => {
	const rule: FieldValidationRule = {
		ruleType: "array-length-range",
		minLength: 3,
		maxLength: 4
	};

	let validationResult = validateObject(
		{
			good1: [1, 2, 3],
			good2: [1, 2, 3, 4],
			bad1: [1],
			bad2: [1, 2, 3, 4, 5]
		},
		{
			good1: FIELD_TYPES.array(FIELD_TYPES.number(), [rule]),
			good2: FIELD_TYPES.array(FIELD_TYPES.number(), [rule]),
			bad1: FIELD_TYPES.array(FIELD_TYPES.number(), [rule]),
			bad2: FIELD_TYPES.array(FIELD_TYPES.number(), [rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good1.isValid).toBe(true);
	expect(validationResult.validationResult.good2.isValid).toBe(true);
	expect(validationResult.validationResult.bad1.isValid).toBe(false);
	expect(validationResult.validationResult.bad2.isValid).toBe(false);
});

it('validateFields.array-length', () => {
	const rule: FieldValidationRule = {
		ruleType: "array-length",
		expectedLength: 3
	};

	let validationResult = validateObject(
		{
			good: [1, 2, 3],
			bad1: [1],
			bad2: [1, 2, 3, 4, 5]
		},
		{
			good: FIELD_TYPES.array(FIELD_TYPES.number(), [rule]),
			bad1: FIELD_TYPES.array(FIELD_TYPES.number(), [rule]),
			bad2: FIELD_TYPES.array(FIELD_TYPES.number(), [rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad1.isValid).toBe(false);
	expect(validationResult.validationResult.bad2.isValid).toBe(false);
});

it('validateFields.array.valueType', () => {
	let validationResult = validateObject(
		{
			good: [1, 2, 3],
			bad: ["1", "2", "3"]
		},
		{
			good: FIELD_TYPES.array(FIELD_TYPES.number()),
			bad: FIELD_TYPES.array(FIELD_TYPES.number())
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.array-include-some', () => {
	const rule: FieldValidationRule = {
		ruleType: "array-include-some",
		item: [1, 6]
	};

	let validationResult = validateObject(
		{
			good1: [1, 2, 3],
			good2: [4, 5, 6],
			bad: [2, 3, 4, 5]
		},
		{
			good1: FIELD_TYPES.array(FIELD_TYPES.number(), [rule]),
			good2: FIELD_TYPES.array(FIELD_TYPES.number(), [rule]),
			bad: FIELD_TYPES.array(FIELD_TYPES.number(), [rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good1.isValid).toBe(true);
	expect(validationResult.validationResult.good2.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.array-include-all', () => {
	const rule: FieldValidationRule = {
		ruleType: "array-include-all",
		item: [1, 3]
	};

	let validationResult = validateObject(
		{
			good: [1, 2, 3],
			bad: [1, 2, 4, 5]
		},
		{
			good: FIELD_TYPES.array(FIELD_TYPES.number(), [rule]),
			bad: FIELD_TYPES.array(FIELD_TYPES.number(), [rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.array-include-none', () => {
	const rule: FieldValidationRule = {
		ruleType: "array-include-none",
		item: [1, 3]
	};

	let validationResult = validateObject(
		{
			good: [2, 4, 5],
			bad: [1, 2, 4, 5]
		},
		{
			good: FIELD_TYPES.array(FIELD_TYPES.number(), [rule]),
			bad: FIELD_TYPES.array(FIELD_TYPES.number(), [rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.array-predicate-some', () => {
	// some items in the array must be 1 or 6 (but we don't need both)
	const rule: FieldValidationRule = {
		ruleType: "array-predicate-some",
		predicate: {
			ruleType: "number-value",
			expectedValue: [1, 6]
		}
	};

	let validationResult = validateObject(
		{
			good1: [1, 2, 3],
			good2: [4, 5, 6],
			bad: [2, 3, 4, 5]
		},
		{
			good1: FIELD_TYPES.array(FIELD_TYPES.number(), [rule]),
			good2: FIELD_TYPES.array(FIELD_TYPES.number(), [rule]),
			bad: FIELD_TYPES.array(FIELD_TYPES.number(), [rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good1.isValid).toBe(true);
	expect(validationResult.validationResult.good2.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.array-predicate-all', () => {
	// all items in the array must be 1 or 3 (but we don't need both)
	const rule: FieldValidationRule = {
		ruleType: "array-predicate-all",
		predicate: {
			ruleType: "number-value",
			expectedValue: [1, 3]
		}
	};

	let validationResult = validateObject(
		{
			good: [1, 3],
			bad: [2, 4, 5]
		},
		{
			good: FIELD_TYPES.array(FIELD_TYPES.number(), [rule]),
			bad: FIELD_TYPES.array(FIELD_TYPES.number(), [rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.array-predicate-none', () => {
	// no items in the array should be 1 or 3
	const rule: FieldValidationRule = {
		ruleType: "array-predicate-none",
		predicate: {
			ruleType: "number-value",
			expectedValue: [1, 3]
		}
	};

	let validationResult = validateObject(
		{
			good: [2, 4, 5],
			bad: [1, 2, 4, 5]
		},
		{
			good: FIELD_TYPES.array(FIELD_TYPES.number(), [rule]),
			bad: FIELD_TYPES.array(FIELD_TYPES.number(), [rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});
