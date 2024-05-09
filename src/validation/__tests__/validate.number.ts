import { FIELDS } from "fields";
import { FieldValidationRule } from "rules";
import { validateObject } from "validation";

it('validateFields.number-max', () => {
	const rule: FieldValidationRule = {
		ruleType: "number-max",
		maxValue: 3
	};

	let validationResult = validateObject(
		{
			good: 3,
			bad: 4
		},
		{
			good: FIELDS.number([rule]),
			bad: FIELDS.number([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.number-max.mustBeLess', () => {
	const rule: FieldValidationRule = {
		ruleType: "number-max",
		maxValue: 3,
		mustBeLess: true
	};

	let validationResult = validateObject(
		{
			good: 2,
			bad: 3
		},
		{
			good: FIELDS.number([rule]),
			bad: FIELDS.number([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.number-min', () => {
	const rule: FieldValidationRule = {
		ruleType: "number-min",
		minValue: 3
	};

	let validationResult = validateObject(
		{
			good: 3,
			bad: 2
		},
		{
			good: FIELDS.number([rule]),
			bad: FIELDS.number([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.number-min', () => {
	const rule: FieldValidationRule = {
		ruleType: "number-min",
		minValue: 3,
		mustBeGreater: true
	};

	let validationResult = validateObject(
		{
			good: 4,
			bad: 3
		},
		{
			good: FIELDS.number([rule]),
			bad: FIELDS.number([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.number-value', () => {
	const rule: FieldValidationRule = {
		ruleType: "number-value",
		expectedValue: 3
	};

	let validationResult = validateObject(
		{
			good: 3,
			bad: 2
		},
		{
			good: FIELDS.number([rule]),
			bad: FIELDS.number([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.number-range', () => {
	const rule: FieldValidationRule = {
		ruleType: "number-range",
		minValue: 3,
		mustBeGreater: true,
		maxValue: 4,
		mustBeLess: true
	};

	let validationResult = validateObject(
		{
			good: 3.5,
			bad1: 3,
			bad2: 4
		},
		{
			good: FIELDS.number([rule]),
			bad1: FIELDS.number([rule]),
			bad2: FIELDS.number([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad1.isValid).toBe(false);
	expect(validationResult.validationResult.bad2.isValid).toBe(false);
});

it('validateFields.number-value.array', () => {
	const rule: FieldValidationRule = {
		ruleType: "number-value",
		expectedValue: [3, 4]
	};

	let validationResult = validateObject(
		{
			good1: 3,
			good2: 4,
			bad: 2
		},
		{
			good1: FIELDS.number([rule]),
			good2: FIELDS.number([rule]),
			bad: FIELDS.number([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good1.isValid).toBe(true);
	expect(validationResult.validationResult.good2.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});
