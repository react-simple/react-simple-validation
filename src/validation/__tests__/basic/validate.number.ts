import { FIELDS } from "fields";
import { RULES } from "rules";
import { validateObject } from "validation";

it('validateFields.number-max', () => {
	const rule = RULES.number.max(3);

	const validationResult = validateObject(
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
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});

it('validateFields.number-max.mustBeLess', () => {
	const rule = RULES.number.max(3, { mustBeLess: true });

	const validationResult = validateObject(
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
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});

it('validateFields.number-min', () => {
	const rule = RULES.number.min(3);

	const validationResult = validateObject(
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
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});

it('validateFields.number-min', () => {
	const rule = RULES.number.min(3, { mustBeGreater: true });

	const validationResult = validateObject(
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
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});

it('validateFields.number-value', () => {
	const rule = RULES.number.value(3);

	const validationResult = validateObject(
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
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});

it('validateFields.number-range', () => {
	const rule = RULES.number.range(3, 4, { mustBeGreater: true, mustBeLess: true });

	const validationResult = validateObject(
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
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad1.isValid).toBe(false);
	expect(validationResult.childErrors.bad2.isValid).toBe(false);
});

it('validateFields.number-value.array', () => {
	const rule = RULES.number.value([3, 4]);

	const validationResult = validateObject(
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
	expect(validationResult.childErrors.good1).toBeUndefined()
	expect(validationResult.childErrors.good2).toBeUndefined()
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});
