import { CONTENT_TYPES } from "@react-simple/react-simple-util";
import { FIELD_TYPES, FieldType } from "fields";
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
	text: FIELD_TYPES.text([
		RULES.required(),
		RULES.text.regExp(/^t.*t$/)
	]),

	number: FIELD_TYPES.number([
		RULES.required(),
		RULES.number.min(1),
		RULES.number.max(10)
	]),

	date: FIELD_TYPES.date([
		RULES.required(),
		RULES.date.min(new Date(2000, 1, 1)),
		RULES.date.max(new Date(2099, 12, 31))
	]),

	boolean: FIELD_TYPES.boolean([
		RULES.required(),
		RULES.boolean.value(true)
	]),

	file: FIELD_TYPES.file([
		RULES.file.contentType(CONTENT_TYPES.spreadsheets),
		RULES.file.extension(["csv"]),
		RULES.file.contentTypeAndExtension(CONTENT_TYPES.spreadsheets),
		RULES.file.maxSize(20000)
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

export const TEST_DATA = { OBJ, TYPE };
