import { CONTENT_TYPE, CONTENT_TYPES } from "@react-simple/react-simple-util";
import { FIELD_TYPES, FieldType } from "fields";
import { FieldValidationRule, RULES } from "rules";
import { validateObject } from "./functions";

const OBJ = {
	text: "text",
	number: 1,
	date: new Date(2001, 1, 1),
	boolean: true,
	file: { name: "dummy.csv", type: "text/csv", size: 10000 },
	array: [10, 11, 12],
	object: {
		text2: "text2",
		number2: 2
	},
	arrayOfObj: [
		{
			text3: "text30",
			array3: [300, 301, 302]
		},
		{
			text3: "text31",
			array3: [310, 311, 312]
		}
	]
};

const TYPE: Record<keyof typeof OBJ, FieldType> = {
	text: FIELD_TYPES.text([
		RULES.required(),
		RULES.regExp(/^t.*t$/)
	]),

	number: FIELD_TYPES.number([
		RULES.required(),
		RULES.minNumberValue(1),
		RULES.maxNumberValue(10)
	]),

	date: FIELD_TYPES.date([
		RULES.required(),
		RULES.minDateValue(new Date(2000, 1, 1)),
		RULES.maxDateValue(new Date(2099, 12, 31))
	]),

	boolean: FIELD_TYPES.boolean([
		RULES.required(),
		RULES.expectedBooleanValue(true)
	]),

	file: FIELD_TYPES.file([
		RULES.fileContentType(CONTENT_TYPES.spreadsheets),
		RULES.fileExtension(["csv"]),
		RULES.fileContentTypeAndExtension(CONTENT_TYPES.spreadsheets),
		RULES.maxFileSize(20000)
	]),

	array: FIELD_TYPES.array(FIELD_TYPES.number()),

	object: FIELD_TYPES.object({
		text2: FIELD_TYPES.text(),
		number2: FIELD_TYPES.number(),
	}),

	arrayOfObj: FIELD_TYPES.array(FIELD_TYPES.object({
		text3: FIELD_TYPES.text(),
		array3: FIELD_TYPES.array(FIELD_TYPES.number()),
	}))
};

it('validateFields.validateObject', () => {
//	const validationResult = validateObject(OBJ, TYPE);

//	expect(validationResult.isValid).toBe(true);
//	expect(validationResult.fieldTypes).toBe(TYPE);
//	expect(validationResult.fieldValues).toBe(OBJ);
});

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

// validation does not parse field values
it('validateFields.valueType', () => {
	let validationResult = validateObject(
		{
			good: 1,
			bad: "1"
		},
		{
			good: FIELD_TYPES.number(), // required by default
			bad: FIELD_TYPES.number(),
			ugly: FIELD_TYPES.number()
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
	expect(validationResult.validationResult["ugly"].isValid).toBe(false);
});

it('validateFields.minTextLength', () => {
	const rule: FieldValidationRule = {
		ruleType: "minTextLength",
		minLength: 3 
	};

	let validationResult = validateObject(
		{
			good: "123",
			bad: "1"
		},
		{
			good: FIELD_TYPES.text([rule]),
			bad: FIELD_TYPES.text([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.maxTextLength', () => {
	const rule: FieldValidationRule = {
		ruleType: "maxTextLength",
		maxLength: 3
	};

	let validationResult = validateObject(
		{
			good: "123",
			bad: "12345"
		},
		{
			good: FIELD_TYPES.text([rule]),
			bad: FIELD_TYPES.text([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.regExp', () => {
	const rule: FieldValidationRule = {
		ruleType: "regExp",
		regExp: /^\w{3}$/ 
	};

	let validationResult = validateObject(
		{
			good: "123",
			bad: "1"
		},
		{
			good: FIELD_TYPES.text([rule]),
			bad: FIELD_TYPES.text([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.expectedTextValue', () => {
	const rule: FieldValidationRule = {
		ruleType: "expectedTextValue",
		expectedValue: "ABC",
		caseInsensitive: true
	};

	let validationResult = validateObject(
		{
			good: "abc",
			bad: "1"
		},
		{
			good: FIELD_TYPES.text([rule]),
			bad: FIELD_TYPES.text([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.customValidation', () => {
	const rule: FieldValidationRule = {
		ruleType: "customValidation",
		validate: t => t === "123"
	};

	let validationResult = validateObject(
		{
			good: "123",
			bad: "1"
		},
		{
			good: FIELD_TYPES.text([rule]),
			bad: FIELD_TYPES.text([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.maxArrayLength', () => {
	const rule: FieldValidationRule = {
		ruleType: "maxArrayLength",
		maxLength: 3
	};

	let validationResult = validateObject(
		{
			good: [1, 2, 3],
			bad: [1, 2, 3, 4, 5]
		},
		{
			good: FIELD_TYPES.array(FIELD_TYPES.number(), [rule]),
			bad: FIELD_TYPES.array(FIELD_TYPES.number(), [rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.minArrayLength', () => {
	const rule: FieldValidationRule = {
		ruleType: "minArrayLength",
		minLength: 3
	};

	let validationResult = validateObject(
		{
			good: [1, 2, 3],
			bad: [1]
		},
		{
			good: FIELD_TYPES.array(FIELD_TYPES.number(), [rule]),
			bad: FIELD_TYPES.array(FIELD_TYPES.number(), [rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.array.valueType', () => {
	let validationResult = validateObject(
		{
			good: [1, 2, 3],
			bad: ["1", "2", "3"]
		},
		{
			good: FIELD_TYPES.array(FIELD_TYPES.number()),
			bad: FIELD_TYPES.array(FIELD_TYPES.number())
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.maxNumberValue', () => {
	const rule: FieldValidationRule = {
		ruleType: "maxNumberValue",
		maxValue: 3
	};

	let validationResult = validateObject(
		{
			good: 3,
			bad: 4
		},
		{
			good: FIELD_TYPES.number([rule]),
			bad: FIELD_TYPES.number([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.maxNumberValue.mustBeLess', () => {
	const rule: FieldValidationRule = {
		ruleType: "maxNumberValue",
		maxValue: 3,
		mustBeLess: true
	};

	let validationResult = validateObject(
		{
			good: 2,
			bad: 3
		},
		{
			good: FIELD_TYPES.number([rule]),
			bad: FIELD_TYPES.number([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.minNumberValue', () => {
	const rule: FieldValidationRule = {
		ruleType: "minNumberValue",
		minValue: 3
	};

	let validationResult = validateObject(
		{
			good: 3,
			bad: 2
		},
		{
			good: FIELD_TYPES.number([rule]),
			bad: FIELD_TYPES.number([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.minNumberValue', () => {
	const rule: FieldValidationRule = {
		ruleType: "minNumberValue",
		minValue: 3,
		mustBeGreater: true
	};

	let validationResult = validateObject(
		{
			good: 4,
			bad: 3
		},
		{
			good: FIELD_TYPES.number([rule]),
			bad: FIELD_TYPES.number([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.expectedNumberValue', () => {
	const rule: FieldValidationRule = {
		ruleType: "expectedNumberValue",
		expectedValue: 3
	};

	let validationResult = validateObject(
		{
			good: 3,
			bad: 2
		},
		{
			good: FIELD_TYPES.number([rule]),
			bad: FIELD_TYPES.number([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.minDateValue', () => {
	const rule: FieldValidationRule = {
		ruleType: "minDateValue",
		minDate: new Date(2000, 1, 1)
	};

	let validationResult = validateObject(
		{
			good: new Date(2000, 1, 1),
			bad: new Date(1999, 12, 31, 23, 59, 59)
		},
		{
			good: FIELD_TYPES.date([rule]),
			bad: FIELD_TYPES.date([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.minDateValue.mustBeGreater', () => {
	const rule: FieldValidationRule = {
		ruleType: "minDateValue",
		minDate: new Date(2000, 1, 1),
		mustBeGreater: true
	};

	let validationResult = validateObject(
		{
			good: new Date(2000, 1, 1, 0, 0, 1),
			bad: new Date(2000, 1, 1)
		},
		{
			good: FIELD_TYPES.date([rule]),
			bad: FIELD_TYPES.date([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.maxDateValue', () => {
	const rule: FieldValidationRule = {
		ruleType: "maxDateValue",
		maxDate: new Date(2000, 1, 1)
	};

	let validationResult = validateObject(
		{
			good: new Date(2000, 1, 1),
			bad: new Date(2000, 1, 1, 0, 0, 1)
		},
		{
			good: FIELD_TYPES.date([rule]),
			bad: FIELD_TYPES.date([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.maxDateValue.mustBeLess', () => {
	const rule: FieldValidationRule = {
		ruleType: "maxDateValue",
		maxDate: new Date(2000, 1, 1),
		mustBeLess: true
	};

	let validationResult = validateObject(
		{
			good: new Date(1999, 12, 31, 23, 59, 59),
			bad: new Date(2000, 1, 1)
		},
		{
			good: FIELD_TYPES.date([rule]),
			bad: FIELD_TYPES.date([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.expectedBooleanValue', () => {
	const rule: FieldValidationRule = {
		ruleType: "expectedBooleanValue",
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

it('validateFields.fileContentTypeAndExtension', () => {
	const rule: FieldValidationRule = {
		ruleType: "fileContentTypeAndExtension",
		allowedContentTypes: CONTENT_TYPES.documents
	};

	let validationResult = validateObject(
		{
			good: { name: "dummy.docx", type: "application/msword", size: 1000 },
			badExtension: { name: "dummy.xlsx", type: "application/msword", size: 1000 },
			badContentType: { name: "dummy.docx", type: "text/csv", size: 1000 },
			badEverything: { name: "dummy.csv", type: "text/csv", size: 1000 },
		},
		{
			good: FIELD_TYPES.file([rule]),
			badExtension: FIELD_TYPES.file([rule]),
			badContentType: FIELD_TYPES.file([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);	
	expect(validationResult.validationResult["badExtension"].isValid).toBe(false);
	expect(validationResult.validationResult["badContentType"].isValid).toBe(false);
});

it('validateFields.fileContentType', () => {
	const rule: FieldValidationRule = {
		ruleType: "fileContentType",
		allowedContentTypes: CONTENT_TYPES.documents
	};

	let validationResult = validateObject(
		{
			good: { name: "dummy.docx", type: "application/msword", size: 1000 },
			bad: { name: "dummy.csv", type: "text/csv", size: 1000 },
		},
		{
			good: FIELD_TYPES.file([rule]),
			bad: FIELD_TYPES.file([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.fileContentType.string[]', () => {
	const rule: FieldValidationRule = {
		ruleType: "fileContentType",
		allowedContentTypes: CONTENT_TYPE.doc.allowedContentTypes
	};

	let validationResult = validateObject(
		{
			good: { name: "dummy.docx", type: "application/msword", size: 1000 },
			bad: { name: "dummy.csv", type: "text/csv", size: 1000 },
		},
		{
			good: FIELD_TYPES.file([rule]),
			bad: FIELD_TYPES.file([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.fileExtension', () => {
	const rule: FieldValidationRule = {
		ruleType: "fileExtension",
		allowedExtensions: CONTENT_TYPE.doc.allowedExtensions
	};

	let validationResult = validateObject(
		{
			good: { name: "dummy.docx", type: "application/msword", size: 1000 },
			bad: { name: "dummy.csv", type: "text/csv", size: 1000 },
		},
		{
			good: FIELD_TYPES.file([rule]),
			bad: FIELD_TYPES.file([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});

it('validateFields.maxFileSize', () => {
	const rule: FieldValidationRule = {
		ruleType: "maxFileSize",
		maxFileSize: 1000
	};

	let validationResult = validateObject(
		{
			good: { name: "dummy.docx", type: "application/msword", size: 1000 },
			bad: { name: "dummy.csv", type: "text/csv", size: 1001 },
		},
		{
			good: FIELD_TYPES.file([rule]),
			bad: FIELD_TYPES.file([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult["good"].isValid).toBe(true);
	expect(validationResult.validationResult["bad"].isValid).toBe(false);
});
