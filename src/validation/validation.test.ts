import { FIELD_TYPES, FieldType } from "fields";
import { RULES } from "rules";
import { validateObject } from "./functions";
import { CONTENT_TYPES } from "@react-simple/react-simple-util";

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

it('validateFields.validateAll', () => {
	console.log(validateObject(OBJ, TYPE));
});
