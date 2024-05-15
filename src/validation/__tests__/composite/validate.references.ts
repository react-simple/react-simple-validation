import { validateObject } from "validation";
import { FIELDS, FieldTypes } from "fields";

it('validateFields.field-reference.local', () => {
	// Validate that if field 'a' is 1 then field 'b' is A and if field 'a' is 2 then field 'b' is B.
	const fieldTypes: FieldTypes = {
		a: FIELDS.number(),

		b: FIELDS.text([
			// [a] == 1 -> [b] == "A"
			{
				ruleType: "if-then-else",
				if: {
					ruleType: "field-reference",
					path: "a",
					rules: { ruleType: "number-value", expectedValue: 1 }
				},
				then: {
					ruleType: "text-value",
					expectedValue: "A"
				}
			},
			// [a] == 2 -> [b] == "B"
			{
				ruleType: "if-then-else",
				if: {
					ruleType: "field-reference",
					path: "a",
					rules: { ruleType: "number-value", expectedValue: 2 }
				},
				then: {
					ruleType: "text-value",
					expectedValue: "B"
				}
			}
		])
	};

	const validationResult = validateObject(
		{
			good: [{ a: 1, b: "A" }, { a: 2, b: "B" }, { a: 3, b: "C" }],
			bad1: [{ a: 1, b: "A" }, { a: 2, b: "A" }, { a: 3, b: "A" }],
			bad2: [{ a: 1, b: "B" }, { a: 2, b: "B" }, { a: 3, b: "B" }],
		},
		{
			good: FIELDS.array(FIELDS.object(fieldTypes)),
			bad1: FIELDS.array(FIELDS.object(fieldTypes)),
			bad2: FIELDS.array(FIELDS.object(fieldTypes))
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad1.isValid).toBe(false);
	expect(validationResult.validationResult.bad2.isValid).toBe(false);
});
