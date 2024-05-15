import { FieldValidationRule } from "rules";
import { validateObject } from "validation";
import { FIELDS } from "fields";

it('validateFields.some-rules-valid', () => {
	const rule: FieldValidationRule = {
		ruleType: "some-rules-valid",
		// this actually could be done using the number-value rule with array of numbers in expectedValue
		rules: [
			{ ruleType: "number-value", expectedValue: 1 },
			{ ruleType: "number-value", expectedValue: 2 }
		]
	};

	const validationResult = validateObject(
		{
			good: [1, 2],
			bad: [1, 3]
		},
		{
			good: FIELDS.array(FIELDS.number([rule])),
			bad: FIELDS.array(FIELDS.number([rule])),
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.all-rules-valid', () => {
	const rule: FieldValidationRule = {
		ruleType: "all-rules-valid",
		// this actually could be done using the number-range rule
		rules: [
			{ ruleType: "number-min", minValue: 1 },
			{ ruleType: "number-max", maxValue: 10 }
		]
	};

	const validationResult = validateObject(
		{
			good: [1, 2],
			bad1: [1, 11],
			bad2: [0, 2]
		},
		{
			good: FIELDS.array(FIELDS.number([rule])),
			bad1: FIELDS.array(FIELDS.number([rule])),
			bad2: FIELDS.array(FIELDS.number([rule]))
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad1.isValid).toBe(false);
	expect(validationResult.validationResult.bad2.isValid).toBe(false);
});

//it('validateFields.no-rules-valid', () => {
//	const rule: FieldValidationRule = {
//		ruleType: "no-rules-valid",
//		// this actually could be done using the number-range rule
//		rules: [
//			{ ruleType: "number-value", expectedValue: 1 },
//			{ ruleType: "number-value", expectedValue: 2 }
//		]
//	};

//	const validationResult = validateObject(
//		{
//			good: [3, 4],
//			bad: [1, 3]
//		},
//		{
//			good: FIELDS.array(FIELDS.number([rule])),
//			bad: FIELDS.array(FIELDS.number([rule])),
//		}
//	);

//	expect(validationResult.isValid).toBe(false);
//	expect(validationResult.validationResult.good.isValid).toBe(true);
//	expect(validationResult.validationResult.bad.isValid).toBe(false);
//});

it('validateFields.is-valid', () => {
	const rule: FieldValidationRule = {
		ruleType: "is-valid",
		rule: { ruleType: "number-value", expectedValue: 1 }
	};

	const validationResult = validateObject(
		{
			good: 1,
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

it('validateFields.is-valid.false', () => {
	const rule: FieldValidationRule = {
		ruleType: "is-valid",
		rule: { ruleType: "number-value", expectedValue: 1 },
		isValid: false
	};

	const validationResult = validateObject(
		{
			good: 2,
			bad: 1
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

//it('validateFields.is-not-valid', () => {
//	const rule: FieldValidationRule = {
//		ruleType: "is-not-valid",
//		rule: { ruleType: "number-value", expectedValue: 1 }
//	};

//	const validationResult = validateObject(
//		{
//			good: 2,
//			bad: 1
//		},
//		{
//			good: FIELDS.number([rule]),
//			bad: FIELDS.number([rule])
//		}
//	);

//	expect(validationResult.isValid).toBe(false);
//	expect(validationResult.validationResult.good.isValid).toBe(true);
//	expect(validationResult.validationResult.bad.isValid).toBe(false);
//});

//it('validateFields.is-not-valid.false', () => {
//	const rule: FieldValidationRule = {
//		ruleType: "is-not-valid",
//		rule: { ruleType: "number-value", expectedValue: 1 },
//		isNotValid: false
//	};

//	const validationResult = validateObject(
//		{
//			good: 1,
//			bad: 2
//		},
//		{
//			good: FIELDS.number([rule]),
//			bad: FIELDS.number([rule])
//		}
//	);

//	expect(validationResult.isValid).toBe(false);
//	expect(validationResult.validationResult.good.isValid).toBe(true);
//	expect(validationResult.validationResult.bad.isValid).toBe(false);
//});
