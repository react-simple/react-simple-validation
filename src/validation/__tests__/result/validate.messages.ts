import { sameArrays } from "@react-simple/react-simple-util";
import { FIELDS } from "fields";
import { RULES } from "rules";
import { getFieldRuleValidationErrorMessages, getValidationResultChild, validateObject } from "validation";

const OBJ = {
	text: "ABC",
	number: 123,
	date: new Date(2000, 1, 1),
	boolean: false,
	file: { name: "dummy.docx", type: "application/msword", size: 1000 },
	array: ["a", "b", "c"],
	object: {
		array: [
			{
				text: "ABC",
				number: 123
			}
		]
	}
};

const TEXT_RULES = [
	RULES.text.length.min(4),
	RULES.text.length.max(2),
	RULES.text.match(/^\d*$/, "digits"),
	RULES.text.custom(t => ({ isValid: t.value === "X" }), { message: "Custom text error" })
];

const NUMBER_RULES = [
	RULES.number.min(1000),
	RULES.number.max(100),
	RULES.number.range(200, 300),
	RULES.number.value(5),
	RULES.number.custom(t => ({ isValid: t.value === 5 }), { message: "Custom number error" })
];

const OBJ_RULES = {
	text: FIELDS.text(TEXT_RULES),
	number: FIELDS.number(NUMBER_RULES),
	object: FIELDS.object({
		array: FIELDS.array(FIELDS.object({
			text: FIELDS.text(TEXT_RULES),
			number: FIELDS.number(NUMBER_RULES),
		}))
	})
};

const TEXT_ERRORS = [
	'Minimum 4 characters',
	'Maximum 2 characters',
	'Must match format (digits)',
	'Custom text error'
];

const NUMBER_ERRORS = [
	'Must be greater or equal than 1,000',
	'Must be less or equal than 100',
	'Must be greater or equal than 200 and less or equal than 300',
	'Must be 5',
	'Custom number error'
];

it('validateFields.messages.errors-hierarchical-dom', () => {
	const validationResult = validateObject(OBJ, OBJ_RULES);

	// hierarchical errors object - errors DOM is returned
	expect(sameArrays(getFieldRuleValidationErrorMessages(validationResult.childErrors.text.errors), TEXT_ERRORS)).toBe(true);
	expect(sameArrays(getFieldRuleValidationErrorMessages(validationResult.childErrors.number.errors), NUMBER_ERRORS)).toBe(true);
	
	expect(sameArrays(
		getFieldRuleValidationErrorMessages(validationResult.childErrors.object.childErrors["array"].childErrors[0].childErrors["text"].errors),
		TEXT_ERRORS
	)).toBe(true);

	expect(sameArrays(
		getFieldRuleValidationErrorMessages(validationResult.childErrors.object.childErrors["array"].childErrors[0].childErrors["number"].errors),
		NUMBER_ERRORS
	)).toBe(true);

	expect(sameArrays(
		getFieldRuleValidationErrorMessages(getValidationResultChild(validationResult, "object.array[0].text")?.value?.errors || []),
		TEXT_ERRORS
	)).toBe(true);
	
	expect(sameArrays(
		getFieldRuleValidationErrorMessages(getValidationResultChild(validationResult, "object.array[0].number")?.value?.errors || []),
		NUMBER_ERRORS
	)).toBe(true);
});

it('validateFields.messages.errorsFlatList', () => {
	const validationResult = validateObject(OBJ, OBJ_RULES);

	// flat list of errors by full qualified name - errorsFlatList is also returned by validateObject()
	expect(sameArrays(validationResult.errorsFlatList["text"], TEXT_ERRORS)).toBe(true);
	expect(sameArrays(validationResult.errorsFlatList["number"], NUMBER_ERRORS)).toBe(true);

	expect(sameArrays(validationResult.errorsFlatList["object.array[0].text"], TEXT_ERRORS)).toBe(true);
	expect(sameArrays(validationResult.errorsFlatList["object.array[0].number"], NUMBER_ERRORS)).toBe(true);
});
