import { getToday } from "@react-simple/react-simple-util";
import {
	BooleanArrayFieldType, BooleanFieldType, DateArrayFieldType, DateFieldType, FileArrayFieldType, FileFieldType, NumberArrayFieldType, NumberFieldType,
	TextArrayFieldType, TextFieldType
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
	readonly file: FileFieldType;
	readonly fileArray: FileArrayFieldType;
} = {
	text: {
		type: "text",
		baseType: "text",
		isArray: false,
		baseValue: "",
		rules: [
			{ type: "required", required: true }
		]
	},
	textArray: {
		type: "text-array",
		baseType: "text",
		isArray: true,
		baseValue: [],
		rules: [
			{ type: "required", required: true }
		]
	},
	number: {
		type: "number",
		baseType: "number",
		isArray: false,
		baseValue: 0,
		rules: [
			{ type: "required", required: true }
		]
	},
	numberArray: {
		type: "number-array",
		baseType: "number",
		isArray: true,
		baseValue: [],
		rules: [
			{ type: "required", required: true }
		]
	},
	boolean: {
		type: "boolean",
		baseType: "boolean",
		isArray: false,
		baseValue: false,
		rules: [
			{ type: "required", required: true }
		]
	},
	booleanArray: {
		type: "boolean-array",
		baseType: "boolean",
		isArray: true,
		baseValue: [],
		rules: [
			{ type: "required", required: true }
		]
	},
	date: {
		type: "date",
		baseType: "date",
		isArray: false,
		baseValue: getToday(),
		rules: [
			{ type: "required", required: true }
		]
	},
	dateArray: {
		type: "date-array",
		baseType: "date",
		isArray: true,
		baseValue: [],
		rules: [
			{ type: "required", required: true }
		]
	},
	file: {
		type: "file",
		baseType: "file",
		isArray: false,
		baseValue: new File([], ""),
		rules: [
			{ type: "required", required: true }
		]
	},
	fileArray: {
		type: "file-array",
		baseType: "file",
		isArray: true,
		baseValue: [],
		rules: [
			{ type: "required", required: true }
		]
	}
};
