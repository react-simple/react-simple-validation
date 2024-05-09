import { FIELD_TYPES } from "fields";
import { FieldValidationRule } from "rules";
import { validateObject } from "validation";

it('validateFields.required', () => {
	let validationResult = validateObject(
		{
			good: "x",
			bad: ""
		},
		{
			good: FIELD_TYPES.text(), // required by default
			bad: FIELD_TYPES.text(),
			ugly: FIELD_TYPES.text()
		}
	);

	expect(validationResult.isValid).toBe(false);

	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["good"].ruleValidationResult.find(t => t.rule.ruleType === "required")).not.toBeUndefined();
	expect(validationResult.validationResult["good"].ruleValidationResult.find(t => t.rule.ruleType === "required")?.isValid).toBe(true);
	expect(validationResult.validationResult["good"].ruleValidationResult.find(t => t.rule.ruleType === "required")?.isChecked).toBe(true);
	expect(validationResult.validationResult["good"].ruleValidationResult.find(t => t.rule.ruleType === "required")?.message).toBeUndefined();

	expect(validationResult.validationResult["bad"].isValid).toBe(false);
	expect(validationResult.validationResult["bad"].ruleValidationResult.find(t => t.rule.ruleType === "required")).not.toBeUndefined();
	expect(validationResult.validationResult["bad"].ruleValidationResult.find(t => t.rule.ruleType === "required")?.isValid).toBe(false);
	expect(validationResult.validationResult["bad"].ruleValidationResult.find(t => t.rule.ruleType === "required")?.isChecked).toBe(true);
	expect(validationResult.validationResult["bad"].ruleValidationResult.find(t => t.rule.ruleType === "required")?.message).toBeUndefined();

	expect(validationResult.validationResult["ugly"].isValid).toBe(false);
	expect(validationResult.validationResult["ugly"].ruleValidationResult.find(t => t.rule.ruleType === "required")).not.toBeUndefined();
	expect(validationResult.validationResult["ugly"].ruleValidationResult.find(t => t.rule.ruleType === "required")?.isValid).toBe(false);
	expect(validationResult.validationResult["ugly"].ruleValidationResult.find(t => t.rule.ruleType === "required")?.isChecked).toBe(true);
	expect(validationResult.validationResult["ugly"].ruleValidationResult.find(t => t.rule.ruleType === "required")?.message).toBeUndefined();
});

it('validateFields.required.customMessage', () => {
	const rule: FieldValidationRule = {
		ruleType: "required",
		required: true,
		message: "Mandatory field"
	};

	let validationResult = validateObject(
		{
			good: "x",
			bad: ""
		},
		{
			good: FIELD_TYPES.text([rule]), // required by default
			bad: FIELD_TYPES.text([rule]),
			ugly: FIELD_TYPES.text([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);

	expect(validationResult.validationResult["bad"].isValid).toBe(false);
	expect(validationResult.validationResult["bad"].ruleValidationResult.find(t => t.rule.ruleType === "required")).not.toBeUndefined();
	expect(validationResult.validationResult["bad"].ruleValidationResult.find(t => t.rule.ruleType === "required")?.message).toBe("Mandatory field");

	expect(validationResult.validationResult["ugly"].isValid).toBe(false);
	expect(validationResult.validationResult["ugly"].ruleValidationResult.find(t => t.rule.ruleType === "required")).not.toBeUndefined();
	expect(validationResult.validationResult["ugly"].ruleValidationResult.find(t => t.rule.ruleType === "required")?.message).toBe("Mandatory field");
});
