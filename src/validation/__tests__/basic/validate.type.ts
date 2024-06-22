import { FIELDS } from "fields";
import { validateObject } from "validation";

// validation does not parse field values by default
it('validateFields.type.number', () => {
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

it('validateFields.type.number.tryParse', () => {
	const validationResult = validateObject(
		{
			good: "1",
			bad: "a"
		},
		{
			good: FIELDS.number(), // required by default
			bad: FIELDS.number(),
			ugly: FIELDS.number()
		},
		{
			tryParseValues: true
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
	expect(validationResult.childErrors.ugly.isValid).toBe(false);
});

// validation does not parse field values by default
it('validateFields.type.date', () => {
	const validationResult = validateObject(
		{
			good: new Date(2000, 1, 1),
			bad: "2000-01-01"
		},
		{
			good: FIELDS.date(), // required by default
			bad: FIELDS.date(),
			ugly: FIELDS.date()
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
	expect(validationResult.childErrors.ugly.isValid).toBe(false);
});

it('validateFields.type.date.tryParse', () => {
	const validationResult = validateObject(
		{
			good: "2000-01-01",
			bad: "a"
		},
		{
			good: FIELDS.date(), // required by default
			bad: FIELDS.date(),
			ugly: FIELDS.date()
		},
		{
			tryParseValues: true
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good).toBeUndefined();
	expect(validationResult.childErrors.bad.isValid).toBe(false);
	expect(validationResult.childErrors.ugly.isValid).toBe(false);
});
