import { getToday } from "@react-simple/react-simple-util";
import {
	BooleanArrayFieldType, BooleanFieldType, CustomFieldType, DateArrayFieldType, DateFieldType, DateTimeArrayFieldType, DateTimeFieldType,
	FileArrayFieldType, FileFieldType, NumberArrayFieldType, NumberFieldType, ObjectArrayFieldType, ObjectFieldType, TextArrayFieldType, TextFieldType
} from "./types";

export const BASE_FIELDS: {
	readonly text: TextFieldType;
	readonly textArray: TextArrayFieldType;
	readonly number: NumberFieldType;
	readonly numberArray: NumberArrayFieldType;
	readonly boolean: BooleanFieldType;
	readonly booleanArray: BooleanArrayFieldType;
	readonly date: DateFieldType;
	readonly dateArray: DateArrayFieldType;
	readonly dateTime: DateTimeFieldType;
	readonly dateTimeArray: DateTimeArrayFieldType;
	readonly file: FileFieldType;
	readonly fileArray: FileArrayFieldType;
	readonly object: ObjectFieldType;
	readonly objectArray: ObjectArrayFieldType;
	readonly custom: CustomFieldType;
} = {
	text: {
		type: "text",
		baseType: "text",
		isArray: false,
		baseValue: "",
		defaultRules: [
			{ type: "required", required: true }
		]
	},
	textArray: {
		type: "text-array",
		baseType: "text",
		isArray: true,
		baseValue: [],
		defaultRules: [
			{ type: "required", required: true }
		]
	},
	number: {
		type: "number",
		baseType: "number",
		isArray: false,
		baseValue: 0,
		defaultRules: [
			{ type: "required", required: true }
		]
	},
	numberArray: {
		type: "number-array",
		baseType: "number",
		isArray: true,
		baseValue: [],
		defaultRules: [
			{ type: "required", required: true }
		]
	},
	boolean: {
		type: "boolean",
		baseType: "boolean",
		isArray: false,
		baseValue: false,
		defaultRules: [
			{ type: "required", required: true }
		]
	},
	booleanArray: {
		type: "boolean-array",
		baseType: "boolean",
		isArray: true,
		baseValue: [],
		defaultRules: [
			{ type: "required", required: true }
		]
	},
	date: {
		type: "date",
		baseType: "date",
		isArray: false,
		baseValue: getToday(),
		defaultRules: [
			{ type: "required", required: true }
		]
	},
	dateArray: {
		type: "date-array",
		baseType: "date",
		isArray: true,
		baseValue: [],
		defaultRules: [
			{ type: "required", required: true }
		]
	},
	dateTime: {
		type: "datetime",
		baseType: "datetime",
		isArray: false,
		baseValue: new Date(),
		defaultRules: [
			{ type: "required", required: true }
		]
	},
	dateTimeArray: {
		type: "datetime-array",
		baseType: "datetime",
		isArray: true,
		baseValue: [],
		defaultRules: [
			{ type: "required", required: true }
		]
	},
	file: {
		type: "file",
		baseType: "file",
		isArray: false,
		baseValue: new File([], ""),
		defaultRules: [
			{ type: "required", required: true }
		]
	},
	fileArray: {
		type: "file-array",
		baseType: "file",
		isArray: true,
		baseValue: [],
		defaultRules: [
			{ type: "required", required: true }
		]
	},
	object: {
		type: "object",
		baseType: "object",
		isArray: false,
		baseValue: {},
		defaultRules: [
			{ type: "required", required: true }
		]
	},
	objectArray: {
		type: "object-array",
		baseType: "object",
		isArray: true,
		baseValue: [],
		defaultRules: [
			{ type: "required", required: true }
		]
	},
	custom: {
		type: "custom",
		baseType: "custom",
		isArray: true,
		baseValue: {},
		defaultRules: [
			{ type: "required", required: true }
		]
	}
};
