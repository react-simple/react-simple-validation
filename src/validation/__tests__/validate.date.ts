import { FIELD_TYPES } from "fields";
import { FieldValidationRule } from "rules";
import { validateObject } from "validation";

it('validateFields.date-min', () => {
	const rule: FieldValidationRule = {
		ruleType: "date-min",
		minDate: new Date(2000, 1, 1)
	};

	let validationResult = validateObject(
		{
			good: new Date(2000, 1, 1),
			bad: new Date(1999, 12, 31, 23, 59, 59)
		},
		{
			good: FIELD_TYPES.date([rule]),
			bad: FIELD_TYPES.date([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.date-min.mustBeGreater', () => {
	const rule: FieldValidationRule = {
		ruleType: "date-min",
		minDate: new Date(2000, 1, 1),
		mustBeGreater: true
	};

	let validationResult = validateObject(
		{
			good: new Date(2000, 1, 1, 0, 0, 1),
			bad: new Date(2000, 1, 1)
		},
		{
			good: FIELD_TYPES.date([rule]),
			bad: FIELD_TYPES.date([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.date-max', () => {
	const rule: FieldValidationRule = {
		ruleType: "date-max",
		maxDate: new Date(2000, 1, 1)
	};

	let validationResult = validateObject(
		{
			good: new Date(2000, 1, 1),
			bad: new Date(2000, 1, 1, 0, 0, 1)
		},
		{
			good: FIELD_TYPES.date([rule]),
			bad: FIELD_TYPES.date([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.date-max.mustBeLess', () => {
	const rule: FieldValidationRule = {
		ruleType: "date-max",
		maxDate: new Date(2000, 1, 1),
		mustBeLess: true
	};

	let validationResult = validateObject(
		{
			good: new Date(1999, 12, 31, 23, 59, 59),
			bad: new Date(2000, 1, 1)
		},
		{
			good: FIELD_TYPES.date([rule]),
			bad: FIELD_TYPES.date([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});
