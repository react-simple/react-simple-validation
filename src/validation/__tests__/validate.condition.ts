import { FIELDS } from "fields";
import { FieldValidationRule, RULES } from "rules";
import { validateObject } from "validation";

it('validateFields.condition.then', () => {
	// item at index 2 should be 'C'
	const rule: FieldValidationRule = {
		ruleType: "condition",
		if: {
			ruleType: "array-index",
			index: 2
		},
		then: {
			ruleType: "text-value",
			expectedValue: "C"
		}
	};

	let validationResult = validateObject(
		{
			good: ["A", "B", "C"],
			bad: ["A", "B", "D"]
		},
		{
			good: FIELDS.array(FIELDS.text([rule])),
			bad: FIELDS.array(FIELDS.text([rule]))
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.condition.else', () => {
	// item at index 0 should be 'A' otherwise 'B'
	const rule: FieldValidationRule = {
		ruleType: "condition",
		if: {
			ruleType: "array-index",
			index: 0
		},
		then: {
			ruleType: "text-value",
			expectedValue: "A"
		},
		else: {
			ruleType: "text-value",
			expectedValue: "B"
		}
	};

	let validationResult = validateObject(
		{
			good: ["A", "B"],
			bad: ["A", "C"]
		},
		{
			good: FIELDS.array(FIELDS.text([rule])),
			bad: FIELDS.array(FIELDS.text([rule]))
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.condition.else.inverted', () => {
	// item at index 0 should be 'A' otherwise 'B'
	const rule: FieldValidationRule = {
		ruleType: "condition",
		if: {
			ruleType: "text-value",
			expectedValue: "A"
		},
		then: {
			ruleType: "array-index",
			index: 0
		},
		else: {
			ruleType: "array-index",
			index: 1
		}
	};

	let validationResult = validateObject(
		{
			good: ["A", "B"],
			bad: ["B", "A"]
		},
		{
			good: FIELDS.array(FIELDS.text([rule])),
			bad: FIELDS.array(FIELDS.text([rule]))
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});
