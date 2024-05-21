import { FIELDS } from "fields";
import { validateObject } from "validation";

// validation does not parse field values
it('validateFields.type', () => {
	const validationResult = validateObject(
		{
			good: 1,
			bad: "1"
		},
		{
			good: FIELDS.number(), // required by default
			bad: FIELDS.number(),
			ugly: FIELDS.number()
		}
	);
	
	expect(validationResult.isValid).toBe(false);
	expect(validationResult.errors.good).toBeUndefined();
	expect(validationResult.errors.bad.isValid).toBe(false);
	expect(validationResult.errors.ugly.isValid).toBe(false);
});
