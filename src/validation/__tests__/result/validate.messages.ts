import { sameArrays } from "@react-simple/react-simple-util";
import { FIELDS } from "fields";
import { RULES } from "rules";
import { getFieldRuleValidationErrorMessages, getObjectValidationErrorMessages, getValidationResultChild, validateObject } from "validation";

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

const textRules = [
	RULES.text.length.min(4),
	RULES.text.length.max(2),
	RULES.text.match(/^\d*$/, "digits"),
	RULES.text.custom(t => ({ isValid: t.value === "X" }), { message: "Custom text error" })
];

const numberRules = [
	RULES.number.min(1000),
	RULES.number.max(100),
	RULES.number.range(200, 300),
	RULES.number.value(5),
	RULES.number.custom(t => ({ isValid: t.value === 5 }), { message: "Custom number error" })
];

const OBJRULES = {
	text: FIELDS.text(textRules),
	number: FIELDS.number(numberRules),
	object: FIELDS.object({
		array: FIELDS.array(FIELDS.object({
			text: FIELDS.text(textRules),
			number: FIELDS.number(numberRules),
		}))
	})
};

it('validateFields.messages', () => {
	const validationResult = validateObject(OBJ, OBJRULES);
	const errors = getObjectValidationErrorMessages(validationResult);

	const textErrors = [
		'Minimum 4 characters',
		'Maximum 2 characters',
		'Must match format (digits)',
		'Custom text error'
	];

	const numberErrors = [
		'Must be greater or equal than 1,000',
		'Must be less or equal than 100',
		'Must be greater or equal than 200 and less or equal than 300',
		'Must be 5',
		'Custom number error'
	];

	// hierarchical errors object - errors DOM is returned
	expect(sameArrays(getFieldRuleValidationErrorMessages(validationResult.errors.text.errors), textErrors)).toBe(true);
	expect(sameArrays(getFieldRuleValidationErrorMessages(validationResult.errors.number.errors), numberErrors)).toBe(true);
	
	expect(sameArrays(getFieldRuleValidationErrorMessages(validationResult.errors.object.children["array"].children[0].children["text"].errors), textErrors)).toBe(true);
	expect(sameArrays(getFieldRuleValidationErrorMessages(validationResult.errors.object.children["array"].children[0].children["number"].errors), numberErrors)).toBe(true);

	expect(sameArrays(getFieldRuleValidationErrorMessages(getValidationResultChild(validationResult, "object.array[0].text")?.value?.errors || []), textErrors)).toBe(true);
	expect(sameArrays(getFieldRuleValidationErrorMessages(getValidationResultChild(validationResult, "object.array[0].number")?.value?.errors || []), numberErrors)).toBe(true);

	// flat list of errors by full qualified name - errorsFlatList is also returned by validateObject()
	expect(sameArrays(validationResult.errorsFlatList["text"], textErrors)).toBe(true);
	expect(sameArrays(validationResult.errorsFlatList["number"], numberErrors)).toBe(true);	

	expect(sameArrays(validationResult.errorsFlatList["object.array[0].text"], textErrors)).toBe(true);
	expect(sameArrays(validationResult.errorsFlatList["object.array[0].number"], numberErrors)).toBe(true);
});
