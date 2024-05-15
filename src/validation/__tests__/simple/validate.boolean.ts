import { FIELDS } from "fields";
import { FieldValidationRule } from "rules";
import { validateObject } from "validation";

it('validateFields.boolean-value', () => {
	const rule: FieldValidationRule = {
		ruleType: "boolean-value",
		expectedValue: false
	};

	let validationResult = validateObject({
		values: {
			good: false,
			bad: true
		},
		types: {
			good: FIELDS.boolean([rule]),
			bad: FIELDS.boolean([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});
