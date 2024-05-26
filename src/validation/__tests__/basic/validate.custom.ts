import { FIELDS } from "fields";
import { RULES } from "rules";
import { validateObject } from "validation";

it('validateFields.custom.text', () => {
	const rule = RULES.text.custom(field => ({ isValid: field.value === "123" }));

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
	expect(validationResult.errors.good).toBeUndefined();
	expect(validationResult.errors.bad.isValid).toBe(false);
});

it('validateFields.custom.array', () => {
	const itemType1 = FIELDS.object({ a: FIELDS.number() });
	const itemType2 = FIELDS.object({ a: FIELDS.text() });

	const rule = RULES.object.custom((field, context, validateField) => {
		// change field type dynamically and call default implementation
		return validateField({ ...field, type: context.itemIndex! % 2 === 0 ? itemType1 : itemType2 });
	});

	const itemType = FIELDS.object({ a: FIELDS.any() }, [rule]);

	const validationResult = validateObject(
		{
			good: [{ a: 123 }, { a: "123" }],
			bad: [{ a: "123" }, { a: 123 }]
		},
		{
			good: FIELDS.array(itemType),
			bad: FIELDS.array(itemType)
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.errors.good).toBeUndefined();
	expect(validationResult.errors.bad.isValid).toBe(false);
});
