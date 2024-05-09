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
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
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
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
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
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
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
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});
