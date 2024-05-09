import { CONTENT_TYPES } from "@react-simple/react-simple-util";
import { FIELDS, FieldType } from "fields";
import { RULES } from "rules";

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
	text: FIELDS.text([
		RULES.required(),
		RULES.text.regExp(/^t.*t$/)
	]),

	number: FIELDS.number([
		RULES.required(),
		RULES.number.min(1),
		RULES.number.max(10)
	]),

	date: FIELDS.date([
		RULES.required(),
		RULES.date.min(new Date(2000, 1, 1)),
		RULES.date.max(new Date(2099, 12, 31))
	]),

	boolean: FIELDS.boolean([
		RULES.required(),
		RULES.boolean.value(true)
	]),

	file: FIELDS.file([
		RULES.file.contentType(CONTENT_TYPES.spreadsheets),
		RULES.file.extension(["csv"]),
		RULES.file.contentTypeAndExtension(CONTENT_TYPES.spreadsheets),
		RULES.file.maxSize(20000)
	]),

	array: FIELDS.array(FIELDS.number()),

	object: FIELDS.object({
		text2: FIELDS.text(),
		number2: FIELDS.number(),
	}),

	arrayOfObj: FIELDS.array(FIELDS.object({
		text3: FIELDS.text(),
		array3: FIELDS.array(FIELDS.number()),
	}))
};

export const TEST_DATA = { OBJ, TYPE };
