import { FIELDS } from "fields";
import { RULES } from "rules";
import { validateObject } from "validation";

it('validateFields.date-min', () => {
	const rule = RULES.date.min(new Date(2000, 1, 1));

	const validationResult = validateObject(
		{
			good: new Date(2000, 1, 1),
			bad: new Date(1999, 12, 31, 23, 59, 59)
		},
		{
			good: FIELDS.date([rule]),
			bad: FIELDS.date([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});

it('validateFields.date-min.mustBeGreater', () => {
	const rule = RULES.date.min(new Date(2000, 1, 1), { mustBeGreater: true });

	const validationResult = validateObject(
		{
			good: new Date(2000, 1, 1, 0, 0, 1),
			bad: new Date(2000, 1, 1)
		},
		{
			good: FIELDS.date([rule]),
			bad: FIELDS.date([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});

it('validateFields.date-max', () => {
	const rule = RULES.date.max(new Date(2000, 1, 1));

	const validationResult = validateObject(
		{
			good: new Date(2000, 1, 1),
			bad: new Date(2000, 1, 1, 0, 0, 1)
		},
		{
			good: FIELDS.date([rule]),
			bad: FIELDS.date([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});

it('validateFields.date-max.mustBeLess', () => {
	const rule = RULES.date.max(new Date(2000, 1, 1), { mustBeLess: true });

	const validationResult = validateObject(
		{
			good: new Date(1999, 12, 31, 23, 59, 59),
			bad: new Date(2000, 1, 1)
		},
		{
			good: FIELDS.date([rule]),
			bad: FIELDS.date([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});

it('validateFields.date-range', () => {
	const rule = RULES.date.range(new Date(2000, 1, 1), new Date(2000, 12, 31));

	const validationResult = validateObject(
		{
			good: new Date(2000, 1, 1),
			bad1: new Date(2001, 1, 1),
			bad2: new Date(1999, 1, 1),
		},
		{
			good: FIELDS.date([rule]),
			bad1: FIELDS.date([rule]),
			bad2: FIELDS.date([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad1.isValid).toBe(false);
	expect(validationResult.childErrors.bad2.isValid).toBe(false);
});

it('validateFields.date-value', () => {
	const rule = RULES.date.value(new Date(2000, 1, 2, 3, 4, 5, 6));

	const validationResult = validateObject(
		{
			good: new Date(2000, 1, 2, 3, 4, 5, 6),
			bad: new Date(2000, 1, 1),
		},
		{
			good: FIELDS.date([rule]),
			bad: FIELDS.date([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});

it('validateFields.date-value.array', () => {
	const rule = RULES.date.value([new Date(2000, 1, 2, 3, 4, 5, 6), new Date(2001, 1, 2, 3, 4, 5, 6)]);

	const validationResult = validateObject(
		{
			good1: new Date(2000, 1, 2, 3, 4, 5, 6),
			good2: new Date(2001, 1, 2, 3, 4, 5, 6),
			bad: new Date(2000, 1, 1),
		},
		{
			good1: FIELDS.date([rule]),
			good2: FIELDS.date([rule]),
			bad: FIELDS.date([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good1).toBeUndefined()
	expect(validationResult.childErrors.good2).toBeUndefined()
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});
