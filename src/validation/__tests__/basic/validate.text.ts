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
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
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
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});

it('validateFields.text-length', () => {
	const rule = RULES.text.length.equals(3);

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
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
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
	expect(validationResult.childErrors.good1).toBeUndefined()
	expect(validationResult.childErrors.good2).toBeUndefined()
	expect(validationResult.childErrors.bad1.isValid).toBe(false);
	expect(validationResult.childErrors.bad2.isValid).toBe(false);
});

it('validateFields.text-match', () => {
	const rule = RULES.text.match(/^\w{3}$/);

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
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});

it('validateFields.text-match.array', () => {
	const rule = RULES.text.match([/^\w{3}$/, /^\w{4}$/]);

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
	expect(validationResult.childErrors.good1).toBeUndefined()
	expect(validationResult.childErrors.good2).toBeUndefined()
	expect(validationResult.childErrors.bad1.isValid).toBe(false);
	expect(validationResult.childErrors.bad2.isValid).toBe(false);
});

it('validateFields.text-equals', () => {
	const rule = RULES.text.equals("ABC", { ignoreCase: true });

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
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});

it('validateFields.text-equals.array', () => {
	const rule = RULES.text.equals(["ABC", "123"], { ignoreCase: true });

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
	expect(validationResult.childErrors.good1).toBeUndefined()
	expect(validationResult.childErrors.good2).toBeUndefined()
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});
