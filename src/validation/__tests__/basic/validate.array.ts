import { FIELDS } from "fields";
import { RULES } from "rules";
import { validateObject } from "validation";

it('validateFields.array-length-max', () => {
	const rule = RULES.array.length.max(3);

	const validationResult = validateObject(
		{
			good: [1, 2, 3],
			bad: [1, 2, 3, 4, 5]
		},
		{
			good: FIELDS.array(FIELDS.number(), [rule]),
			bad: FIELDS.array(FIELDS.number(), [rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});

it('validateFields.array-length-max.filter', () => {
	const rule = RULES.array.length.max(2, { filter: RULES.number.min(2) });

	const validationResult = validateObject(
		{
			good: [1, 2, 3],
			bad: [1, 2, 3, 4, 5]
		},
		{
			good: FIELDS.array(FIELDS.number(), [rule]),
			bad: FIELDS.array(FIELDS.number(), [rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});

it('validateFields.array-length-min', () => {
	const rule = RULES.array.length.min(3);

	const validationResult = validateObject(
		{
			good: [1, 2, 3],
			bad: [1]
		},
		{
			good: FIELDS.array(FIELDS.number(), [rule]),
			bad: FIELDS.array(FIELDS.number(), [rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});

it('validateFields.array-length-range', () => {
	const rule = RULES.array.length.range(3, 4);

	const validationResult = validateObject(
		{
			good1: [1, 2, 3],
			good2: [1, 2, 3, 4],
			bad1: [1],
			bad2: [1, 2, 3, 4, 5]
		},
		{
			good1: FIELDS.array(FIELDS.number(), [rule]),
			good2: FIELDS.array(FIELDS.number(), [rule]),
			bad1: FIELDS.array(FIELDS.number(), [rule]),
			bad2: FIELDS.array(FIELDS.number(), [rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good1).toBeUndefined()
	expect(validationResult.childErrors.good2).toBeUndefined()
	expect(validationResult.childErrors.bad1.isValid).toBe(false);
	expect(validationResult.childErrors.bad2.isValid).toBe(false);
});

it('validateFields.array-length', () => {
	const rule = RULES.array.length.value(3);

	const validationResult = validateObject(
		{
			good: [1, 2, 3],
			bad1: [1],
			bad2: [1, 2, 3, 4, 5]
		},
		{
			good: FIELDS.array(FIELDS.number(), [rule]),
			bad1: FIELDS.array(FIELDS.number(), [rule]),
			bad2: FIELDS.array(FIELDS.number(), [rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad1.isValid).toBe(false);
	expect(validationResult.childErrors.bad2.isValid).toBe(false);
});

it('validateFields.array.valueType', () => {
	const validationResult = validateObject(
		{
			good: [1, 2, 3],
			bad: ["1", "2", "3"]
		},
		{
			good: FIELDS.array(FIELDS.number()),
			bad: FIELDS.array(FIELDS.number())
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});

it('validateFields.array-include-some', () => {
	const rule = RULES.array.include.some([1, 6]);

	const validationResult = validateObject(
		{
			good1: [1, 2, 3],
			good2: [4, 5, 6],
			bad: [2, 3, 4, 5]
		},
		{
			good1: FIELDS.array(FIELDS.number(), [rule]),
			good2: FIELDS.array(FIELDS.number(), [rule]),
			bad: FIELDS.array(FIELDS.number(), [rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good1).toBeUndefined()
	expect(validationResult.childErrors.good2).toBeUndefined()
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});

it('validateFields.array-include-all', () => {
	const rule = RULES.array.include.all([1, 3]);

	const validationResult = validateObject(
		{
			good: [1, 2, 3],
			bad: [1, 2, 4, 5]
		},
		{
			good: FIELDS.array(FIELDS.number(), [rule]),
			bad: FIELDS.array(FIELDS.number(), [rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});

it('validateFields.array-include-none', () => {
	const rule = RULES.array.include.none([1, 3]);

	const validationResult = validateObject(
		{
			good: [2, 4, 5],
			bad: [1, 2, 4, 5]
		},
		{
			good: FIELDS.array(FIELDS.number(), [rule]),
			bad: FIELDS.array(FIELDS.number(), [rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});

it('validateFields.array-match-some', () => {
	// some items in the array must be 1 or 6 (but we don't need both)
	const rule = RULES.array.match.some(RULES.number.value([1, 6]));

	const validationResult = validateObject(
		{
			good1: [1, 2, 3],
			good2: [4, 5, 6],
			bad: [2, 3, 4, 5]
		},
		{
			good1: FIELDS.array(FIELDS.number(), [rule]),
			good2: FIELDS.array(FIELDS.number(), [rule]),
			bad: FIELDS.array(FIELDS.number(), [rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good1).toBeUndefined()
	expect(validationResult.childErrors.good2).toBeUndefined()
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});

it('validateFields.array-match-all', () => {
	// all items in the array must be 1 or 3 (but we don't need both)
	const rule = RULES.array.match.all(RULES.number.value([1, 3]));

	const validationResult = validateObject(
		{
			good: [1, 3],
			bad: [2, 4, 5]
		},
		{
			good: FIELDS.array(FIELDS.number(), [rule]),
			bad: FIELDS.array(FIELDS.number(), [rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});

it('validateFields.array-itemindex', () => {
	// item at index 2 should be 'C'
	const rule = RULES.conditions.ifThenElse(
		RULES.array.itemIndex.value(2),
		RULES.text.value("C"));

	const validationResult = validateObject(
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
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});
