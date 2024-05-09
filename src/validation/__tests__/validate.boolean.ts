import { FIELD_TYPES } from "fields";
import { FieldValidationRule } from "rules";
import { validateObject } from "validation";

it('validateFields.boolean-value', () => {
	const rule: FieldValidationRule = {
		ruleType: "boolean-value",
		expectedValue: false
	};

	let validationResult = validateObject(
		{
			good: false,
			bad: true
		},
		{
			good: FIELD_TYPES.boolean([rule]),
			bad: FIELD_TYPES.boolean([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});
