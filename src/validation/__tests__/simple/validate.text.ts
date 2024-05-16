import { FIELDS } from "fields";
import { RULES } from "rules";
import { validateObject } from "validation";

it('validateFields.text-length-min', () => {
	const rule = RULES.text.length.min(3);

	let validationResult = validateObject({
		values: {
			good: "123",
			bad: "1"
		},
		types: {
			good: FIELDS.text([rule]),
			bad: FIELDS.text([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.text-length-max', () => {
	const rule = RULES.text.length.max(3);

	let validationResult = validateObject({
		values: {
			good: "123",
			bad: "12345"
		},
		types: {
			good: FIELDS.text([rule]),
			bad: FIELDS.text([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.text-length', () => {
	const rule = RULES.text.length.value(3);

	let validationResult = validateObject({
		values: {
			good: "123",
			bad: "12345"
		},
		types: {
			good: FIELDS.text([rule]),
			bad: FIELDS.text([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.text-length-range', () => {
	const rule = RULES.text.length.range(3, 4);

	let validationResult = validateObject({
		values: {
			good1: "123",
			good2: "1234",
			bad1: "12",
			bad2: "12345"
		},
		types: {
			good1: FIELDS.text([rule]),
			good2: FIELDS.text([rule]),
			bad1: FIELDS.text([rule]),
			bad2: FIELDS.text([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good1.isValid).toBe(true);
	expect(validationResult.validationResult.good2.isValid).toBe(true);
	expect(validationResult.validationResult.bad1.isValid).toBe(false);
	expect(validationResult.validationResult.bad2.isValid).toBe(false);
});

it('validateFields.text-regexp', () => {
	const rule = RULES.text.regExp(/^\w{3}$/);

	let validationResult = validateObject({
		values: {
			good: "123",
			bad: "1"
		},
		types: {
			good: FIELDS.text([rule]),
			bad: FIELDS.text([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.text-regexp.array', () => {
	const rule = RULES.text.regExp([/^\w{3}$/, /^\w{4}$/]);

	let validationResult = validateObject({
		values: {
			good1: "123",
			good2: "1234",
			bad1: "12",
			bad2: "12345",
		},
		types: {
			good1: FIELDS.text([rule]),
			good2: FIELDS.text([rule]),
			bad1: FIELDS.text([rule]),
			bad2: FIELDS.text([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good1.isValid).toBe(true);
	expect(validationResult.validationResult.good2.isValid).toBe(true);
	expect(validationResult.validationResult.bad1.isValid).toBe(false);
	expect(validationResult.validationResult.bad2.isValid).toBe(false);
});

it('validateFields.text-value', () => {
	const rule = RULES.text.value("ABC", { caseInsensitive: true });

	let validationResult = validateObject({
		values: {
			good: "abc",
			bad: "1"
		},
		types: {
			good: FIELDS.text([rule]),
			bad: FIELDS.text([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.text-value.array', () => {
	const rule = RULES.text.value(["ABC", "123"], { caseInsensitive: true });

	let validationResult = validateObject({
		values: {
			good1: "abc",
			good2: "123",
			bad: "1"
		},
		types: {
			good1: FIELDS.text([rule]),
			good2: FIELDS.text([rule]),
			bad: FIELDS.text([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good1.isValid).toBe(true);
	expect(validationResult.validationResult.good2.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});