import { FIELDS } from "fields";
import { RULES } from "rules";
import { validateObject } from "validation";

it('validateFields.if-then-else.then', () => {
	// item at index 2 should be 'C'
	const rule = RULES.conditions.ifThenElse(
		RULES.array.itemIndex.equals(2),
		RULES.text.equals("C")
	);

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

it('validateFields.if-then-else.else', () => {
	// item at index 0 should be 'A' otherwise 'B'
	const rule = RULES.conditions.ifThenElse(
		RULES.array.itemIndex.equals(0),
		RULES.text.equals("A"),
		RULES.text.equals("B")
	);

	const validationResult = validateObject(
		{
			good: ["A", "B"],
			bad: ["A", "C"]
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

it('validateFields.if-then-else.else.inverted', () => {
	// if item is 'A' index should be 0 otherwise 1
	const rule = RULES.conditions.ifThenElse(
		RULES.text.equals("A"),
		RULES.array.itemIndex.equals(0),
		RULES.array.itemIndex.equals(1)
	);

	const validationResult = validateObject(
		{
			good: ["A", "B"],
			bad: ["B", "A"]
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

it('validateFields.switch', () => {
	// item at index 0 should be 'A', item at index 1 should be 'B', otherwise 'C'
	const rule = RULES.conditions.switch(
		[
			["case_0", RULES.array.itemIndex.equals(0), RULES.text.equals("A")],
			["case_1", RULES.array.itemIndex.equals(1), RULES.text.equals("B")],
		],
		RULES.text.equals("C")
	);

	const validationResult = validateObject(
		{
			good: ["A", "B", "C"],
			bad1: ["B", "B", "C"],
			bad2: ["A", "A", "C"],
			bad3: ["A", "B", "A"],
		},
		{
			good: FIELDS.array(FIELDS.text([rule])),
			bad1: FIELDS.array(FIELDS.text([rule])),
			bad2: FIELDS.array(FIELDS.text([rule])),
			bad3: FIELDS.array(FIELDS.text([rule]))
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad1.isValid).toBe(false);
	expect(validationResult.childErrors.bad2.isValid).toBe(false);
	expect(validationResult.childErrors.bad3.isValid).toBe(false);
});

it('validateFields.compare.number', () => {
	// a > b + 10?
	const fieldTypes = FIELDS.object(
		{
			a: FIELDS.number([RULES.conditions.compare("greater", "b", { addition: 10 })]),
			b: FIELDS.number()
		}
	);

	const validationResult = validateObject(
		{
			good: { a: 20, b: 1 },
			bad1: { a: 20, b: 12 },
			bad2: { a: 10, b: 20 }
		},
		{
			good: fieldTypes,
			bad1: fieldTypes,
			bad2: fieldTypes
		}
	);
	
	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad1.isValid).toBe(false);
	expect(validationResult.childErrors.bad2.isValid).toBe(false);
});

it('validateFields.compare.date.day', () => {
	// a > b + 10 days?
	const fieldTypes = FIELDS.object(
		{
			a: FIELDS.date([RULES.conditions.compare("greater", "b", { addition: 10 })]),
			b: FIELDS.date()
		}
	);

	const validationResult = validateObject(
		{
			good: { a: new Date(2000, 1, 20), b: new Date(2000, 1, 1) },
			bad1: { a: new Date(2000, 1, 20), b: new Date(2000, 1, 12) },
			bad2: { a: new Date(2000, 1, 10), b: new Date(2000, 1, 20) }
		},
		{
			good: fieldTypes,
			bad1: fieldTypes,
			bad2: fieldTypes
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad1.isValid).toBe(false);
	expect(validationResult.childErrors.bad2.isValid).toBe(false);
});

it('validateFields.compare.date.month', () => {
	// a > b + 10 months?
	const fieldTypes = FIELDS.object(
		{
			a: FIELDS.date([RULES.conditions.compare("greater", "b", { addition: { datePart: "month", value: 10 } })]),
			b: FIELDS.date()
		}
	);

	const validationResult = validateObject(
		{
			good: { a: new Date(2000, 12, 1), b: new Date(2000, 1, 1) },
			bad1: { a: new Date(2000, 12, 1), b: new Date(2000, 4, 1) },
			bad2: { a: new Date(2000, 1, 1), b: new Date(2000, 12, 1) }
		},
		{
			good: fieldTypes,
			bad1: fieldTypes,
			bad2: fieldTypes
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad1.isValid).toBe(false);
	expect(validationResult.childErrors.bad2.isValid).toBe(false);
});

it('validateFields.compare.text', () => {
	// a > b case insensitive?
	const fieldTypes = FIELDS.object(
		{
			a: FIELDS.text([RULES.conditions.compare("greater", "b", { ignoreCase: true })]),
			b: FIELDS.text()
		}
	);

	const validationResult = validateObject(
		{
			good1: { a: "b", b: "A" },
			good2: { a: "B", b: "a" },
			bad1: { a: "a", b: "B" },
			bad2: { a: "A", b: "b" }
		},
		{
			good1: fieldTypes,
			good2: fieldTypes,
			bad1: fieldTypes,
			bad2: fieldTypes
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good1).toBeUndefined();
	expect(validationResult.childErrors.good2).toBeUndefined();
	expect(validationResult.childErrors.bad1.isValid).toBe(false);
	expect(validationResult.childErrors.bad2.isValid).toBe(false);
});
