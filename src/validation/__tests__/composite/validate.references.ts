import { validateObject } from "validation";
import { FIELDS, FieldTypes } from "fields";
import { RULES } from "rules";

it('validateFields.field-reference.local', () => {
	// Validate that if field 'a' is 1 then field 'b' is A and if field 'a' is 2 then field 'b' is B.
	const fieldTypes: FieldTypes = {
		a: FIELDS.number(),

		b: FIELDS.text([
			// [a] == 1 -> [b] == "A"
			RULES.conditions.ifThenElse(
				RULES.references.fieldRef("a", RULES.number.value(1)),
				RULES.text.value("A")
			),
			// [a] == 2 -> [b] == "B"
			RULES.conditions.ifThenElse(
				RULES.references.fieldRef("a", RULES.number.value(2)),
				RULES.text.value("B")
			)
		])
	};

	const validationResult = validateObject({
		values: {
			good: [{ a: 1, b: "A" }, { a: 2, b: "B" }, { a: 3, b: "C" }],
			bad1: [{ a: 1, b: "A" }, { a: 2, b: "A" }, { a: 3, b: "A" }],
			bad2: [{ a: 1, b: "B" }, { a: 2, b: "B" }, { a: 3, b: "B" }],
		},
		types: {
			good: FIELDS.array(FIELDS.object(fieldTypes)),
			bad1: FIELDS.array(FIELDS.object(fieldTypes)),
			bad2: FIELDS.array(FIELDS.object(fieldTypes))
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad1.isValid).toBe(false);
	expect(validationResult.validationResult.bad2.isValid).toBe(false);

	expect(Object.keys(validationResult.validationResult.bad1.errors)).toContain("bad1[1].b");
	expect(Object.keys(validationResult.validationResult.bad2.errors)).toContain("bad2[0].b");
});

it('validateFields.field-reference.local-array', () => {
	// Validate that if field 'a' is 1 then field 'b' is A and if field 'a' is 2 then field 'b' is B.
	const fieldTypes: FieldTypes = {
		a: FIELDS.number(),

		b: FIELDS.array(FIELDS.text([
			// [a] == 1 -> [b] == "A"
			RULES.conditions.ifThenElse(
				RULES.references.fieldRef("a", RULES.number.value(1)),
				RULES.text.value("A")
			),
			// [a] == 2 -> [b] == "B"
			RULES.conditions.ifThenElse(
				RULES.references.fieldRef("a", RULES.number.value(2)),
				RULES.text.value("B")
			)
		]))
	};

	const validationResult = validateObject({
		values: {
			good: [{ a: 1, b: ["A"] }, { a: 2, b: ["B"] }, { a: 3, b: ["C"] }],
			bad1: [{ a: 1, b: ["A"] }, { a: 2, b: ["A"] }, { a: 3, b: ["A"] }],
			bad2: [{ a: 1, b: ["B"] }, { a: 2, b: ["B"] }, { a: 3, b: ["B"] }],
		},
		types: {
			good: FIELDS.array(FIELDS.object(fieldTypes)),
			bad1: FIELDS.array(FIELDS.object(fieldTypes)),
			bad2: FIELDS.array(FIELDS.object(fieldTypes))
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad1.isValid).toBe(false);
	expect(validationResult.validationResult.bad2.isValid).toBe(false);
});

it('validateFields.field-reference.root', () => {
	// Validate that if field 'a' is 1 then field 'b' is A and if field 'a' is 2 then field 'b' is B.
	const types: FieldTypes = {
		a: FIELDS.number(),

		subObj: FIELDS.object({
			b: FIELDS.text([
				// [a] == 1 -> [b] == "A"
				RULES.conditions.ifThenElse(
					RULES.references.fieldRef("/a", RULES.number.value(1)),
					RULES.text.value("A")
				),
				// [a] == 2 -> [b] == "B"
				RULES.conditions.ifThenElse(
					RULES.references.fieldRef("/a", RULES.number.value(2)),
					RULES.text.value("B")
				)
			])
		})
	};

	const good1 = validateObject({ values: { a: 1, subObj: { b: "A" } }, types });
	const good2 = validateObject({ values: { a: 2, subObj: { b: "B" } }, types });
	const good3 = validateObject({ values: { a: 3, subObj: { b: "C" } }, types });
	const bad1 = validateObject({ values: { a: 1, subObj: { b: "B" } }, types });
	const bad2 = validateObject({ values: { a: 2, subObj: { b: "A" } }, types });

	expect(good1.isValid).toBe(true);
	expect(good2.isValid).toBe(true);
	expect(good3.isValid).toBe(true);
	expect(bad1.isValid).toBe(false);
	expect(bad2.isValid).toBe(false);

	expect(Object.keys(bad1.errors)).toContain("subObj.b");
	expect(Object.keys(bad2.errors)).toContain("subObj.b");
});

it('validateFields.field-reference.namedObj.backwardRef', () => {
	// Validate that if field 'a' is 1 then field 'b' is A and if field 'a' is 2 then field 'b' is B.
	const fieldTypes: FieldTypes = {
		a: FIELDS.number(),

		subObj: FIELDS.object({
			b: FIELDS.text([
				// [a] == 1 -> [b] == "A"
				RULES.conditions.ifThenElse(
					RULES.references.fieldRef(
						"@refObj.a", // the root object is { good, bad1, bad2 } so we need to refer exactly to the object with member 'a'
						RULES.number.value(1)
					),
					RULES.text.value("A")
				),
				// [a] == 2 -> [b] == "B"
				RULES.conditions.ifThenElse(
					RULES.references.fieldRef("@refObj.a", RULES.number.value(2)),
					RULES.text.value("B")
				)
			])
		})
	};

	const validationResult = validateObject({
		values: {
			good: [{ a: 1, subObj: { b: "A" } }, { a: 2, subObj: { b: "B" } }, { a: 3, subObj: { b: "C" } }],
			bad1: [{ a: 1, subObj: { b: "A" } }, { a: 2, subObj: { b: "A" } }, { a: 3, subObj: { b: "A" } }],
			bad2: [{ a: 1, subObj: { b: "B" } }, { a: 2, subObj: { b: "B" } }, { a: 3, subObj: { b: "B" } }],
		},
		types: {
			good: FIELDS.array(FIELDS.object(fieldTypes, [], "refObj")),
			bad1: FIELDS.array(FIELDS.object(fieldTypes, [], "refObj")),
			bad2: FIELDS.array(FIELDS.object(fieldTypes, [], "refObj"))
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad1.isValid).toBe(false);
	expect(validationResult.validationResult.bad2.isValid).toBe(false);

	expect(Object.keys(validationResult.validationResult.bad1.errors)).toContain("bad1[1].subObj.b");
	expect(Object.keys(validationResult.validationResult.bad2.errors)).toContain("bad2[0].subObj.b");
});

it('validateFields.field-reference.namedObj.forwardRef', () => {
	// Validate that if field 'a' is 1 then field 'b' is A and if field 'a' is 2 then field 'b' is B.
	const fieldTypes: FieldTypes = {
		subObj: FIELDS.object({
			b: FIELDS.text([
				// [a] == 1 -> [b] == "A"
				RULES.conditions.ifThenElse(
					RULES.references.fieldRef(
						"@refObj.a", // the root object is { good, bad1, bad2 } so we need to refer exactly to the object with member 'a'
						RULES.number.value(1)
					),
					RULES.text.value("A")
				),
				// [a] == 2 -> [b] == "B"
				RULES.conditions.ifThenElse(
					RULES.references.fieldRef("@refObj.a", RULES.number.value(2)),
					RULES.text.value("B")
				)
			])
		}),

		a: FIELDS.number()
	};

	const validationResult = validateObject({
		values: {
			good: [{ a: 1, subObj: { b: "A" } }, { a: 2, subObj: { b: "B" } }, { a: 3, subObj: { b: "C" } }],
			bad1: [{ a: 1, subObj: { b: "A" } }, { a: 2, subObj: { b: "A" } }, { a: 3, subObj: { b: "A" } }],
			bad2: [{ a: 1, subObj: { b: "B" } }, { a: 2, subObj: { b: "B" } }, { a: 3, subObj: { b: "B" } }],
		},
		types: {
			good: FIELDS.array(FIELDS.object(fieldTypes, [], "refObj")),
			bad1: FIELDS.array(FIELDS.object(fieldTypes, [], "refObj")),
			bad2: FIELDS.array(FIELDS.object(fieldTypes, [], "refObj"))
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad1.isValid).toBe(false);
	expect(validationResult.validationResult.bad2.isValid).toBe(false);

	expect(Object.keys(validationResult.validationResult.bad1.errors)).toContain("bad1[1].subObj.b");
	expect(Object.keys(validationResult.validationResult.bad2.errors)).toContain("bad2[0].subObj.b");
});
