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
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
	expect(validationResult.childErrors.ugly.isValid).toBe(false);
});
