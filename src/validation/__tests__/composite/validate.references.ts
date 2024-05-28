import { validateObject } from "validation";
import { FIELDS, FieldTypes } from "fields";
import { RULES } from "rules";

const REF_DATA = {
	good: [
		{ subObj1: { a: 1 }, subObj2: { b: "A" } },
		{ subObj1: { a: 2 }, subObj2: { b: "B" } },
		{ subObj1: { a: 3 }, subObj2: { b: "C" } }
	],
	bad1: [
		{ subObj1: { a: 1 }, subObj2: { b: "A" } },
		{ subObj1: { a: 2 }, subObj2: { b: "A" } },
		{ subObj1: { a: 3 }, subObj2: { b: "C" } }
	],
	bad2: [
		{ subObj1: { a: 1 }, subObj2: { b: "B" } },
		{ subObj1: { a: 2 }, subObj2: { b: "B" } },
		{ subObj1: { a: 3 }, subObj2: { b: "C" } }
	],
	bad3: [
		{ subObj1: { a: 1 }, subObj2: { b: "A" } },
		{ subObj1: { a: 2 }, subObj2: { b: "B" } },
		{ subObj1: { a: 3 }, subObj2: { b: "A" } }
	]
};

it('validateFields.field-reference.local', () => {
	// Validate that if field 'a' is 1 then field 'b' is A and if field 'a' is 2 then field 'b' is B.
	const fieldTypes = FIELDS.array(FIELDS.object({
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
	}));

	const validationResult = validateObject(
		{
			good: [{ a: 1, b: "A" }, { a: 2, b: "B" }, { a: 3, b: "C" }],
			bad1: [{ a: 1, b: "A" }, { a: 2, b: "A" }, { a: 3, b: "A" }],
			bad2: [{ a: 1, b: "B" }, { a: 2, b: "B" }, { a: 3, b: "B" }]
		},
		{
			good: fieldTypes,
			bad1: fieldTypes,
			bad2: fieldTypes
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.errors.good).toBeUndefined();
	expect(validationResult.errors.bad1.isValid).toBe(false);
	expect(validationResult.errors.bad2.isValid).toBe(false);
});

it('validateFields.field-reference.local-array', () => {
	// Validate that if field 'a' is 1 then field 'b' is A and if field 'a' is 2 then field 'b' is B.
	const fieldTypes = FIELDS.array(FIELDS.object({
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
	}));

	const validationResult = validateObject(
		{
			good: [{ a: 1, b: ["A"] }, { a: 2, b: ["B"] }, { a: 3, b: ["C"] }],
			bad1: [{ a: 1, b: ["A"] }, { a: 2, b: ["A"] }, { a: 3, b: ["A"] }],
			bad2: [{ a: 1, b: ["B"] }, { a: 2, b: ["B"] }, { a: 3, b: ["B"] }]
		},
		{
			good: fieldTypes,
			bad1: fieldTypes,
			bad2: fieldTypes
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.errors.good).toBeUndefined();
	expect(validationResult.errors.bad1.isValid).toBe(false);
	expect(validationResult.errors.bad2.isValid).toBe(false);
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

	const good1 = validateObject({ a: 1, subObj: { b: "A" } }, types);
	const good2 = validateObject({ a: 2, subObj: { b: "B" } }, types);
	const good3 = validateObject({ a: 3, subObj: { b: "C" } }, types);
	const bad1 = validateObject({ a: 1, subObj: { b: "B" } }, types);
	const bad2 = validateObject({ a: 2, subObj: { b: "A" } }, types);

	expect(good1.isValid).toBe(true);
	expect(good2.isValid).toBe(true);
	expect(good3.isValid).toBe(true);
	expect(bad1.isValid).toBe(false);
	expect(bad2.isValid).toBe(false);
});

it('validateFields.field-reference.namedObj.backwardRef.object', () => {
	// Validate that if field 'a' is 1 then field 'b' is A and if field 'a' is 2 then field 'b' is B, otherwise 'C'
	const fieldTypes = FIELDS.array(FIELDS.object({
		subObj1: FIELDS.object({ a: FIELDS.number() }, [], { refName: "refObj" }),

		subObj2: FIELDS.object({
			b: FIELDS.text([
				RULES.conditions.switch(
					[
						["case_a", RULES.references.fieldRef("@refObj.a", RULES.number.value(1)), RULES.text.value("A")],
						["case_b", RULES.references.fieldRef("@refObj.a", RULES.number.value(2)), RULES.text.value("B")]
					],
					RULES.text.value("C")
				)
			])
		})
	}));

	// in case of backwardRef the last occurence of @refObj is used, so it's not an issue 
	// that all the objects has a @refObj named object (good, bad1, bad2, bad3)
	const validationResult = validateObject(
		REF_DATA,
		{
			good: fieldTypes,
			bad1: fieldTypes,
			bad2: fieldTypes,
			bad3: fieldTypes
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.errors.good).toBeUndefined();
	expect(validationResult.errors.bad1.isValid).toBe(false);
	expect(validationResult.errors.bad2.isValid).toBe(false);
	expect(validationResult.errors.bad3.isValid).toBe(false);
});

it('validateFields.field-reference.namedObj.backwardRef.array', () => {
	// Validate that if field 'a' is 1 then field 'b' is A and if field 'a' is 2 then field 'b' is B, otherwise 'C'
	const fieldTypes = FIELDS.array(FIELDS.object({
		subObj1: FIELDS.array(FIELDS.object({ a: FIELDS.number() }), [], { refName: "refObj" }),

		subObj2: FIELDS.object({
			b: FIELDS.text([
				RULES.conditions.switch(
					[
						["case_a", RULES.references.fieldRef("@refObj[0].a", RULES.number.value(1)), RULES.text.value("A")],
						["case_b", RULES.references.fieldRef("@refObj[0].a", RULES.number.value(2)), RULES.text.value("B")]
					],
					RULES.text.value("C")
				)
			])
		})
	}));

	// in case of backwardRef the last occurence of @refObj is used, so it's not an issue 
	// that all the objects has a @refObj named object (good, bad1, bad2, bad3)
	const validationResult = validateObject(
		{
			good: [
				{ subObj1: [{ a: 1 }], subObj2: { b: "A" } },
				{ subObj1: [{ a: 2 }], subObj2: { b: "B" } },
				{ subObj1: [{ a: 3 }], subObj2: { b: "C" } }
			],
			bad1: [
				{ subObj1: [{ a: 1 }], subObj2: { b: "A" } },
				{ subObj1: [{ a: 2 }], subObj2: { b: "A" } },
				{ subObj1: [{ a: 3 }], subObj2: { b: "C" } }
			],
			bad2: [
				{ subObj1: [{ a: 1 }], subObj2: { b: "B" } },
				{ subObj1: [{ a: 2 }], subObj2: { b: "B" } },
				{ subObj1: [{ a: 3 }], subObj2: { b: "C" } }
			],
			bad3: [
				{ subObj1: [{ a: 1 }], subObj2: { b: "A" } },
				{ subObj1: [{ a: 2 }], subObj2: { b: "B" } },
				{ subObj1: [{ a: 3 }], subObj2: { b: "A" } }
			]
		},
		{
			good: fieldTypes,
			bad1: fieldTypes,
			bad2: fieldTypes,
			bad3: fieldTypes
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.errors.good).toBeUndefined();
	expect(validationResult.errors.bad1.isValid).toBe(false);
	expect(validationResult.errors.bad2.isValid).toBe(false);
	expect(validationResult.errors.bad3.isValid).toBe(false);
});

it('validateFields.field-reference.namedObj.backwardRef.value', () => {
	// Validate that if field 'a' is 1 then field 'b' is A and if field 'a' is 2 then field 'b' is B, otherwise 'C'
	const fieldTypes = FIELDS.array(FIELDS.object({
		subObj1: FIELDS.object({ a: FIELDS.number([], { refName: "refObj" }) }),

		subObj2: FIELDS.object({
			b: FIELDS.text([
				RULES.conditions.switch(
					[
						["case_a", RULES.references.fieldRef("@refObj", RULES.number.value(1)), RULES.text.value("A")],
						["case_b", RULES.references.fieldRef("@refObj", RULES.number.value(2)), RULES.text.value("B")]
					],
					RULES.text.value("C")
				)
			])
		})
	}));

	// in case of backwardRef the last occurence of @refObj is used, so it's not an issue 
	// that all the objects has a @refObj named object (good, bad1, bad2, bad3)
	const validationResult = validateObject(
		{
			good: [
				{ subObj1: { a: 1 }, subObj2: { b: "A" } },
				{ subObj1: { a: 2 }, subObj2: { b: "B" } },
				{ subObj1: { a: 3 }, subObj2: { b: "C" } }
			],
			bad1: [
				{ subObj1: { a: 1 }, subObj2: { b: "A" } },
				{ subObj1: { a: 2 }, subObj2: { b: "A" } },
				{ subObj1: { a: 3 }, subObj2: { b: "C" } }
			],
			bad2: [
				{ subObj1: { a: 1 }, subObj2: { b: "B" } },
				{ subObj1: { a: 2 }, subObj2: { b: "B" } },
				{ subObj1: { a: 3 }, subObj2: { b: "C" } }
			],
			bad3: [
				{ subObj1: { a: 1 }, subObj2: { b: "A" } },
				{ subObj1: { a: 2 }, subObj2: { b: "B" } },
				{ subObj1: { a: 3 }, subObj2: { b: "A" } }
			]
		},
		{
			good: fieldTypes,
			bad1: fieldTypes,
			bad2: fieldTypes,
			bad3: fieldTypes
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.errors.good).toBeUndefined();
	expect(validationResult.errors.bad1.isValid).toBe(false);
	expect(validationResult.errors.bad2.isValid).toBe(false);
	expect(validationResult.errors.bad3.isValid).toBe(false);
});

// Validation of the schema is sequential, therefore, @refName references can only refer to objects/values
// which were already processed; parent objects or preceeding siblings (backward reference).
// Forward referenes are not allowed to avoid confusing behaviors. Members in the schema must be ordered correctly for references to work.
it('validateFields.field-reference.namedObj.forwardRef.notSupported', () => {
	// Validate that if field 'a' is 1 then field 'b' is A and if field 'a' is 2 then field 'b' is B and otherwise 'C'
	const fieldTypes: (refName: string) => FieldTypes = refName => ({
		subObj2: FIELDS.object({
			b: FIELDS.text([
				RULES.conditions.switch(
					[
						["case_a", RULES.references.fieldRef(`@${refName}.a`, RULES.number.value(1)), RULES.text.value("A")],
						["case_b", RULES.references.fieldRef(`@${refName}.a`, RULES.number.value(2)), RULES.text.value("B")]
					],
					RULES.text.value("C")
				)
			])
		}),

		subObj1: FIELDS.object({ a: FIELDS.number() }, [], { refName })
	});

	const validationResult = validateObject(
		REF_DATA,
		{
			good: FIELDS.array(FIELDS.object(fieldTypes("refGood"))),
			bad1: FIELDS.array(FIELDS.object(fieldTypes("refBad1"))),
			bad2: FIELDS.array(FIELDS.object(fieldTypes("refBad2"))),
			bad3: FIELDS.array(FIELDS.object(fieldTypes("refBad3")))
		}
	);

	// all tests will faill since forward references are not enabled, so @refObj won't be found
	expect(validationResult.isValid).toBe(false);
	expect(validationResult.errors.good.isValid).toBe(false);
	expect(validationResult.errors.bad1.isValid).toBe(false);
	expect(validationResult.errors.bad2.isValid).toBe(false);
	expect(validationResult.errors.bad3.isValid).toBe(false);
});

it('validateFields.field-reference.external-parameter', () => {
	// Validate that if field 'a' is 1 then field 'b' is A and if field 'a' is 2 then field 'b' is B.
	const fieldTypes = FIELDS.object({
		b: FIELDS.text([
			// [a] == 1 -> [b] == "A"
			RULES.conditions.ifThenElse(
				RULES.references.fieldRef("@a", RULES.number.value(1)),
				RULES.text.value("A")
			),
			// [a] == 2 -> [b] == "B"
			RULES.conditions.ifThenElse(
				RULES.references.fieldRef("@a", RULES.number.value(2)),
				RULES.text.value("B")
			)
		])
	});

	const validationResult = validateObject(
		{
			good: { b: "A" },
			bad: {  b: "B" }
		},
		{
			good: fieldTypes,
			bad: fieldTypes
		},
		{
			namedObjs: {
				a: { value: 1, type: FIELDS.number() }
			}
		}
	);
	console.log(JSON.stringify(validationResult, null, 2));
	expect(validationResult.isValid).toBe(false);
	expect(validationResult.errors.good).toBeUndefined();
	expect(validationResult.errors.bad.isValid).toBe(false);
});
