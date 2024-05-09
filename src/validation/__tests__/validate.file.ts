import { CONTENT_TYPE, CONTENT_TYPES } from "@react-simple/react-simple-util";
import { FIELD_TYPES } from "fields";
import { FieldValidationRule } from "rules";
import { validateObject } from "validation";

it('validateFields.file-contenttype-extension', () => {
	const rule: FieldValidationRule = {
		ruleType: "file-contenttype-extension",
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
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.badExtension.isValid).toBe(false);
	expect(validationResult.validationResult.badContentType.isValid).toBe(false);
});

it('validateFields.file-contenttype', () => {
	const rule: FieldValidationRule = {
		ruleType: "file-contenttype",
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
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.file-contenttype.string[]', () => {
	const rule: FieldValidationRule = {
		ruleType: "file-contenttype",
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
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.file-extension', () => {
	const rule: FieldValidationRule = {
		ruleType: "file-extension",
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
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.file-size-max', () => {
	const rule: FieldValidationRule = {
		ruleType: "file-size-max",
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
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});
