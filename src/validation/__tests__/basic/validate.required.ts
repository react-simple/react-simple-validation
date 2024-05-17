import { FIELDS } from "fields";
import { RULES } from "rules";
import { validateObject } from "validation";

it('validateFields.required', () => {
	let validationResult = validateObject({
		values: {
			good: "x",
			bad: ""
		},
		types: {
			good: FIELDS.text(), // required by default
			bad: FIELDS.text(),
			ugly: FIELDS.text()
		}
	});

	expect(validationResult.isValid).toBe(false);
	
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(Object.keys(validationResult.validationResult.good.errors).join()).toBe("");

	expect(validationResult.validationResult.bad.isValid).toBe(false);
	expect(Object.keys(validationResult.validationResult.bad.errors).join()).toBe("bad");
	expect(validationResult.validationResult.bad.errors["bad"].length).toBe(1);
	expect(validationResult.validationResult.bad.errors["bad"][0].isValid).toBe(false);
	expect(validationResult.validationResult.bad.errors["bad"][0].rule.ruleType).toBe("required");

	expect(validationResult.validationResult.ugly.isValid).toBe(false);
	expect(Object.keys(validationResult.validationResult.ugly.errors).join()).toBe("ugly");
	expect(validationResult.validationResult.ugly.errors["ugly"].length).toBe(1);
	expect(validationResult.validationResult.ugly.errors["ugly"][0].isValid).toBe(false);
	expect(validationResult.validationResult.ugly.errors["ugly"][0].rule.ruleType).toBe("required");
});

it('validateFields.required.customMessage', () => {
	const rule = RULES.required({ message: "Mandatory field" });

	let validationResult = validateObject({
		values: {
			good: "x",
			bad: ""
		},
		types: {
			good: FIELDS.text([rule]), // required by default
			bad: FIELDS.text([rule]),
			ugly: FIELDS.text([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);

	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(Object.keys(validationResult.validationResult.good.errors).join()).toBe("");

	expect(validationResult.validationResult.bad.isValid).toBe(false);
	expect(Object.keys(validationResult.validationResult.bad.errors).join()).toBe("bad");
	expect(validationResult.validationResult.bad.errors["bad"].length).toBe(1);
	expect(validationResult.validationResult.bad.errors["bad"][0].isValid).toBe(false);
	expect(validationResult.validationResult.bad.errors["bad"][0].message).toBe("Mandatory field");
	expect(validationResult.validationResult.bad.errors["bad"][0].rule.ruleType).toBe("required");

	expect(validationResult.validationResult.ugly.isValid).toBe(false);
	expect(Object.keys(validationResult.validationResult.ugly.errors).join()).toBe("ugly");
	expect(validationResult.validationResult.ugly.errors["ugly"].length).toBe(1);
	expect(validationResult.validationResult.ugly.errors["ugly"][0].isValid).toBe(false);
	expect(validationResult.validationResult.ugly.errors["ugly"][0].message).toBe("Mandatory field");
	expect(validationResult.validationResult.ugly.errors["ugly"][0].rule.ruleType).toBe("required");
});
