import { FIELDS } from "fields";
import { RULES } from "rules";
import { validateObject } from "validation";

it('validateFields.array-length-max', () => {
	const rule = RULES.array.length.max(3);

	let validationResult = validateObject({
		values: {
			good: [1, 2, 3],
			bad: [1, 2, 3, 4, 5]
		},
		types: {
			good: FIELDS.array(FIELDS.number(), [rule]),
			bad: FIELDS.array(FIELDS.number(), [rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.array-length-max.filter', () => {
	const rule = RULES.array.length.max(2, { filter: RULES.number.min(2) });

	let validationResult = validateObject({
		values: {
			good: [1, 2, 3],
			bad: [1, 2, 3, 4, 5]
		},
		types: {
			good: FIELDS.array(FIELDS.number(), [rule]),
			bad: FIELDS.array(FIELDS.number(), [rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.array-length-min', () => {
	const rule = RULES.array.length.min(3);

	let validationResult = validateObject({
		values: {
			good: [1, 2, 3],
			bad: [1]
		},
		types: {
			good: FIELDS.array(FIELDS.number(), [rule]),
			bad: FIELDS.array(FIELDS.number(), [rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.array-length-range', () => {
	const rule = RULES.array.length.range(3, 4);

	let validationResult = validateObject({
		values: {
			good1: [1, 2, 3],
			good2: [1, 2, 3, 4],
			bad1: [1],
			bad2: [1, 2, 3, 4, 5]
		},
		types: {
			good1: FIELDS.array(FIELDS.number(), [rule]),
			good2: FIELDS.array(FIELDS.number(), [rule]),
			bad1: FIELDS.array(FIELDS.number(), [rule]),
			bad2: FIELDS.array(FIELDS.number(), [rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good1.isValid).toBe(true);
	expect(validationResult.validationResult.good2.isValid).toBe(true);
	expect(validationResult.validationResult.bad1.isValid).toBe(false);
	expect(validationResult.validationResult.bad2.isValid).toBe(false);
});

it('validateFields.array-length', () => {
	const rule = RULES.array.length.value(3);

	let validationResult = validateObject({
		values: {
			good: [1, 2, 3],
			bad1: [1],
			bad2: [1, 2, 3, 4, 5]
		},
		types: {
			good: FIELDS.array(FIELDS.number(), [rule]),
			bad1: FIELDS.array(FIELDS.number(), [rule]),
			bad2: FIELDS.array(FIELDS.number(), [rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad1.isValid).toBe(false);
	expect(validationResult.validationResult.bad2.isValid).toBe(false);
});

it('validateFields.array.valueType', () => {
	let validationResult = validateObject({
		values: {
			good: [1, 2, 3],
			bad: ["1", "2", "3"]
		},
		types: {
			good: FIELDS.array(FIELDS.number()),
			bad: FIELDS.array(FIELDS.number())
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.array-include-some', () => {
	const rule = RULES.array.include.some([1, 6]);

	let validationResult = validateObject({
		values: {
			good1: [1, 2, 3],
			good2: [4, 5, 6],
			bad: [2, 3, 4, 5]
		},
		types: {
			good1: FIELDS.array(FIELDS.number(), [rule]),
			good2: FIELDS.array(FIELDS.number(), [rule]),
			bad: FIELDS.array(FIELDS.number(), [rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good1.isValid).toBe(true);
	expect(validationResult.validationResult.good2.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.array-include-all', () => {
	const rule = RULES.array.include.all([1, 3]);

	let validationResult = validateObject({
		values: {
			good: [1, 2, 3],
			bad: [1, 2, 4, 5]
		},
		types: {
			good: FIELDS.array(FIELDS.number(), [rule]),
			bad: FIELDS.array(FIELDS.number(), [rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.array-include-none', () => {
	const rule = RULES.array.include.none([1, 3]);

	let validationResult = validateObject({
		values: {
			good: [2, 4, 5],
			bad: [1, 2, 4, 5]
		},
		types: {
			good: FIELDS.array(FIELDS.number(), [rule]),
			bad: FIELDS.array(FIELDS.number(), [rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.array-predicate-some', () => {
	// some items in the array must be 1 or 6 (but we don't need both)
	const rule = RULES.array.item.some(RULES.number.value([1, 6]));

	let validationResult = validateObject({
		values: {
			good1: [1, 2, 3],
			good2: [4, 5, 6],
			bad: [2, 3, 4, 5]
		},
		types: {
			good1: FIELDS.array(FIELDS.number(), [rule]),
			good2: FIELDS.array(FIELDS.number(), [rule]),
			bad: FIELDS.array(FIELDS.number(), [rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good1.isValid).toBe(true);
	expect(validationResult.validationResult.good2.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.array-predicate-all', () => {
	// all items in the array must be 1 or 3 (but we don't need both)
	const rule = RULES.array.item.all(RULES.number.value([1, 3]));

	let validationResult = validateObject({
		values: {
			good: [1, 3],
			bad: [2, 4, 5]
		},
		types: {
			good: FIELDS.array(FIELDS.number(), [rule]),
			bad: FIELDS.array(FIELDS.number(), [rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.array-item-index', () => {
	// item at index 2 should be 'C'
	const rule = RULES.conditions.ifThenElse(
		RULES.array.item.index.value(2),
		RULES.text.value("C"));

	let validationResult = validateObject({
		values: {
			good: ["A", "B", "C"],
			bad: ["A", "B", "D"]
		},
		types: {
			good: FIELDS.array(FIELDS.text([rule])),
			bad: FIELDS.array(FIELDS.text([rule]))
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});
