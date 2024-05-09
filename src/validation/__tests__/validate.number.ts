import { FIELD_TYPES } from "fields";
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
			good: FIELD_TYPES.number([rule]),
			bad: FIELD_TYPES.number([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
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
			good: FIELD_TYPES.number([rule]),
			bad: FIELD_TYPES.number([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
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
			good: FIELD_TYPES.number([rule]),
			bad: FIELD_TYPES.number([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
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
			good: FIELD_TYPES.number([rule]),
			bad: FIELD_TYPES.number([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
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
			good: FIELD_TYPES.number([rule]),
			bad: FIELD_TYPES.number([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});
