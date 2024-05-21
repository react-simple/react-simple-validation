import { FIELDS } from "fields";
import { RULES } from "rules";
import { validateObject } from "validation";

it('validateFields.text-length-min', () => {
	const rule = RULES.text.length.min(3);

	const validationResult = validateObject(
		{
			good: "123",
			bad: "1"
		},
		{
			good: FIELDS.text([rule]),
			bad: FIELDS.text([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.errors.good).toBeUndefined();
	expect(validationResult.errors.bad.isValid).toBe(false);
});

it('validateFields.text-length-max', () => {
	const rule = RULES.text.length.max(3);

	const validationResult = validateObject(
		{
			good: "123",
			bad: "12345"
		},
		{
			good: FIELDS.text([rule]),
			bad: FIELDS.text([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.errors.good).toBeUndefined();
	expect(validationResult.errors.bad.isValid).toBe(false);
});

it('validateFields.text-length', () => {
	const rule = RULES.text.length.value(3);

	const validationResult = validateObject(
		{
			good: "123",
			bad: "12345"
		},
		{
			good: FIELDS.text([rule]),
			bad: FIELDS.text([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.errors.good).toBeUndefined();
	expect(validationResult.errors.bad.isValid).toBe(false);
});

it('validateFields.text-length-range', () => {
	const rule = RULES.text.length.range(3, 4);

	const validationResult = validateObject(
		{
			good1: "123",
			good2: "1234",
			bad1: "12",
			bad2: "12345"
		},
		{
			good1: FIELDS.text([rule]),
			good2: FIELDS.text([rule]),
			bad1: FIELDS.text([rule]),
			bad2: FIELDS.text([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.errors.good1).toBeUndefined()
	expect(validationResult.errors.good2).toBeUndefined()
	expect(validationResult.errors.bad1.isValid).toBe(false);
	expect(validationResult.errors.bad2.isValid).toBe(false);
});

it('validateFields.text-regexp', () => {
	const rule = RULES.text.regExp(/^\w{3}$/);

	const validationResult = validateObject(
		{
			good: "123",
			bad: "1"
		},
		{
			good: FIELDS.text([rule]),
			bad: FIELDS.text([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.errors.good).toBeUndefined();
	expect(validationResult.errors.bad.isValid).toBe(false);
});

it('validateFields.text-regexp.array', () => {
	const rule = RULES.text.regExp([/^\w{3}$/, /^\w{4}$/]);

	const validationResult = validateObject(
		{
			good1: "123",
			good2: "1234",
			bad1: "12",
			bad2: "12345",
		},
		{
			good1: FIELDS.text([rule]),
			good2: FIELDS.text([rule]),
			bad1: FIELDS.text([rule]),
			bad2: FIELDS.text([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.errors.good1).toBeUndefined()
	expect(validationResult.errors.good2).toBeUndefined()
	expect(validationResult.errors.bad1.isValid).toBe(false);
	expect(validationResult.errors.bad2.isValid).toBe(false);
});

it('validateFields.text-value', () => {
	const rule = RULES.text.value("ABC", { caseInsensitive: true });

	const validationResult = validateObject(
		{
			good: "abc",
			bad: "1"
		},
		{
			good: FIELDS.text([rule]),
			bad: FIELDS.text([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.errors.good).toBeUndefined();
	expect(validationResult.errors.bad.isValid).toBe(false);
});

it('validateFields.text-value.array', () => {
	const rule = RULES.text.value(["ABC", "123"], { caseInsensitive: true });

	const validationResult = validateObject(
		{
			good1: "abc",
			good2: "123",
			bad: "1"
		},
		{
			good1: FIELDS.text([rule]),
			good2: FIELDS.text([rule]),
			bad: FIELDS.text([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.errors.good1).toBeUndefined()
	expect(validationResult.errors.good2).toBeUndefined()
	expect(validationResult.errors.bad.isValid).toBe(false);
});
