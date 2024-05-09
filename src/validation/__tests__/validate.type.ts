import { FIELD_TYPES } from "fields";
import { validateObject } from "validation";

// validation does not parse field values
it('validateFields.type', () => {
	let validationResult = validateObject(
		{
			good: 1,
			bad: "1"
		},
		{
			good: FIELD_TYPES.number(), // required by default
			bad: FIELD_TYPES.number(),
			ugly: FIELD_TYPES.number()
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
	expect(validationResult.validationResult.ugly.isValid).toBe(false);
});
