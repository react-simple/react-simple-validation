import { FIELDS } from "fields";
import { RULES } from "rules";
import { validateObject } from "validation";

it('validateFields.required', () => {
	const validationResult = validateObject(
		{
			good: "x",
			bad: ""
		},
		{
			good: FIELDS.text(), // required by default
			bad: FIELDS.text(),
			ugly: FIELDS.text()
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good).toBeUndefined();

	expect(validationResult.childErrors.bad.isValid).toBe(false);
	expect(validationResult.childErrors.bad.errors.length).toBe(1);
	expect(validationResult.childErrors.bad.errors[0].isValid).toBe(false);

	expect(validationResult.childErrors.ugly.isValid).toBe(false);
	expect(validationResult.childErrors.ugly.errors.length).toBe(1);
	expect(validationResult.childErrors.ugly.errors[0].isValid).toBe(false);
});

it('validateFields.required.customMessage', () => {
	const rule = RULES.required({ message: "Mandatory field" });

	const validationResult = validateObject(
		{
			good: "x",
			bad: ""
		},
		{
			good: FIELDS.text([rule]), // required by default
			bad: FIELDS.text([rule]),
			ugly: FIELDS.text([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.childErrors.good).toBeUndefined();

	expect(validationResult.childErrors.bad.isValid).toBe(false);
	expect(validationResult.childErrors.bad.errors.length).toBe(1);
	expect(validationResult.childErrors.bad.errors[0].isValid).toBe(false);
	expect(validationResult.childErrors.bad.errors[0].message).toBe("Mandatory field");

	expect(validationResult.childErrors.ugly.isValid).toBe(false);
	expect(validationResult.childErrors.ugly.errors.length).toBe(1);
	expect(validationResult.childErrors.ugly.errors[0].isValid).toBe(false);
	expect(validationResult.childErrors.ugly.errors[0].message).toBe("Mandatory field");
});
