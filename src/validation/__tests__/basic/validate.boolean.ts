import { FIELDS } from "fields";
import { RULES } from "rules";
import { validateObject } from "validation";

it('validateFields.boolean-value', () => {
	const rule = RULES.boolean.value(false);

	const validationResult = validateObject(
		{
			good: false,
			bad: true
		},
		{
			good: FIELDS.boolean([rule]),
			bad: FIELDS.boolean([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
});
