import { FIELDS } from "fields";
import { FieldValidationRule } from "rules";
import { validateObject } from "validation";

it('validateFields.custom', () => {
	const rule: FieldValidationRule = {
		ruleType: "custom",
		validate: t => t === "123"
	};

	let validationResult = validateObject(
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
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});
