import { FIELDS } from "fields";
import { RULES } from "rules";
import { validateObject } from "validation";

it('validateFields.number-max', () => {
	const rule = RULES.number.max(3);

	let validationResult = validateObject({
		values: {
			good: 3,
			bad: 4
		},
		types: {
			good: FIELDS.number([rule]),
			bad: FIELDS.number([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.number-max.mustBeLess', () => {
	const rule = RULES.number.max(3, { mustBeLess: true });

	let validationResult = validateObject({
		values: {
			good: 2,
			bad: 3
		},
		types: {
			good: FIELDS.number([rule]),
			bad: FIELDS.number([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.number-min', () => {
	const rule = RULES.number.min(3);

	let validationResult = validateObject({
		values: {
			good: 3,
			bad: 2
		},
		types: {
			good: FIELDS.number([rule]),
			bad: FIELDS.number([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.number-min', () => {
	const rule = RULES.number.min(3, { mustBeGreater: true });

	let validationResult = validateObject({
		values: {
			good: 4,
			bad: 3
		},
		types: {
			good: FIELDS.number([rule]),
			bad: FIELDS.number([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.number-value', () => {
	const rule = RULES.number.value(3);

	let validationResult = validateObject({
		values: {
			good: 3,
			bad: 2
		},
		types: {
			good: FIELDS.number([rule]),
			bad: FIELDS.number([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.number-range', () => {
	const rule = RULES.number.range(3, 4, { mustBeGreater: true, mustBeLess: true });

	let validationResult = validateObject({
		values: {
			good: 3.5,
			bad1: 3,
			bad2: 4
		},
		types: {
			good: FIELDS.number([rule]),
			bad1: FIELDS.number([rule]),
			bad2: FIELDS.number([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad1.isValid).toBe(false);
	expect(validationResult.validationResult.bad2.isValid).toBe(false);
});

it('validateFields.number-value.array', () => {
	const rule = RULES.number.value([3, 4]);

	let validationResult = validateObject({
		values: {
			good1: 3,
			good2: 4,
			bad: 2
		},
		types: {
			good1: FIELDS.number([rule]),
			good2: FIELDS.number([rule]),
			bad: FIELDS.number([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good1.isValid).toBe(true);
	expect(validationResult.validationResult.good2.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});