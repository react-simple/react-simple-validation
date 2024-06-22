import { BaseFieldType } from "./types";

const EN_US: Record<BaseFieldType, string> = {
	any: "any",
	array: "array",
	boolean: "boolean",
	date: "date",
	file: "file",
	number: "number",
	object: "object",
	text: "text"
};

const HU: Record<BaseFieldType, string> = {
	any: "tetszőleges",
	array: "lista",
	boolean: "igen/nem",
	date: "dátum",
	file: "csatolmány",
	number: "szám",
	object: "objektum",
	text: "szöveg"
};

export const getFieldTypeMessages = () => ({
	'EN-US': EN_US,
	HU
});
