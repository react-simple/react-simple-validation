import { FIELD_TYPES } from "fields";
import { FieldValidationRule } from "rules";
import { validateObject } from "validation";

it('validateFields.text-length-min', () => {
	const rule: FieldValidationRule = {
		ruleType: "text-length-min",
		minLength: 3
	};

	let validationResult = validateObject(
		{
			good: "123",
			bad: "1"
		},
		{
			good: FIELD_TYPES.text([rule]),
			bad: FIELD_TYPES.text([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.text-length-max', () => {
	const rule: FieldValidationRule = {
		ruleType: "text-length-max",
		maxLength: 3
	};

	let validationResult = validateObject(
		{
			good: "123",
			bad: "12345"
		},
		{
			good: FIELD_TYPES.text([rule]),
			bad: FIELD_TYPES.text([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.text-regexp', () => {
	const rule: FieldValidationRule = {
		ruleType: "text-regexp",
		regExp: /^\w{3}$/
	};

	let validationResult = validateObject(
		{
			good: "123",
			bad: "1"
		},
		{
			good: FIELD_TYPES.text([rule]),
			bad: FIELD_TYPES.text([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.text-value', () => {
	const rule: FieldValidationRule = {
		ruleType: "text-value",
		expectedValue: "ABC",
		caseInsensitive: true
	};

	let validationResult = validateObject(
		{
			good: "abc",
			bad: "1"
		},
		{
			good: FIELD_TYPES.text([rule]),
			bad: FIELD_TYPES.text([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});
