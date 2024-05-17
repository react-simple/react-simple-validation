import { FIELDS } from "fields";
import { RULES } from "rules";
import { validateObject } from "validation";

it('validateFields.if-then-else.then', () => {
	// item at index 2 should be 'C'
	const rule = RULES.conditions.ifThenElse(
		RULES.array.item.index.value(2),
		RULES.text.value("C")
	);

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

it('validateFields.if-then-else.else', () => {
	// item at index 0 should be 'A' otherwise 'B'
	const rule = RULES.conditions.ifThenElse(
		RULES.array.item.index.value(0),
		RULES.text.value("A"),
		RULES.text.value("B")
	);

	let validationResult = validateObject({
		values: {
			good: ["A", "B"],
			bad: ["A", "C"]
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

it('validateFields.if-then-else.else.inverted', () => {
	// item at index 0 should be 'A' otherwise 'B'
	const rule = RULES.conditions.ifThenElse(
		RULES.text.value("A"),
		RULES.array.item.index.value(0),
		RULES.array.item.index.value(1)
	);

	let validationResult = validateObject({
		values: {
			good: ["A", "B"],
			bad: ["B", "A"]
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

it('validateFields.switch', () => {
	// item at index 0 should be 'A', item at index 1 should be 'B', otherwise 'C'
	const rule = RULES.conditions.switch(
		[
			[RULES.array.item.index.value(0), RULES.text.value("A")],
			[RULES.array.item.index.value(1), RULES.text.value("B")],
		],
		RULES.text.value("C")
	);

	let validationResult = validateObject({
		values: {
			good: ["A", "B", "C"],
			bad1: ["B", "B", "C"],
			bad2: ["A", "A", "C"],
			bad3: ["A", "B", "A"],
		},
		types: {
			good: FIELDS.array(FIELDS.text([rule])),
			bad1: FIELDS.array(FIELDS.text([rule])),
			bad2: FIELDS.array(FIELDS.text([rule])),
			bad3: FIELDS.array(FIELDS.text([rule]))
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad1.isValid).toBe(false);
	expect(validationResult.validationResult.bad2.isValid).toBe(false);
	expect(validationResult.validationResult.bad3.isValid).toBe(false);
});
