import { RULES } from "rules";
import { validateObject } from "validation";
import { FIELDS } from "fields";

it('validateFields.some-rules-valid', () => {
	// this actually could be done using the number-value rule with array of numbers in expectedValue
	const rule = RULES.operators.some([
		RULES.number.value(1),
		RULES.number.value(2)
	]);

	const validationResult = validateObject({
		values: {
			good: [1, 2],
			bad: [1, 3]
		},
		types: {
			good: FIELDS.array(FIELDS.number([rule])),
			bad: FIELDS.array(FIELDS.number([rule])),
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.all-rules-valid', () => {
	// this actually could be done using the number-range rule
	const rule = RULES.operators.all([
		RULES.number.min(1),
		RULES.number.max(10)
	]);

	const validationResult = validateObject({
		values: {
			good: [1, 2],
			bad1: [1, 11],
			bad2: [0, 2]
		},
		types: {
			good: FIELDS.array(FIELDS.number([rule])),
			bad1: FIELDS.array(FIELDS.number([rule])),
			bad2: FIELDS.array(FIELDS.number([rule]))
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad1.isValid).toBe(false);
	expect(validationResult.validationResult.bad2.isValid).toBe(false);
});
