import { FIELDS } from "fields";
import { validateObject } from "validation";

// validation does not parse field values
it('validateFields.type', () => {
	let validationResult = validateObject({
		values: {
			good: 1,
			bad: "1"
		},
		types: {
			good: FIELDS.number(), // required by default
			bad: FIELDS.number(),
			ugly: FIELDS.number()
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
	expect(validationResult.validationResult.ugly.isValid).toBe(false);
});
