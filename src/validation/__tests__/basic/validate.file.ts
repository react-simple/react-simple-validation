import { CONTENT_TYPES } from "@react-simple/react-simple-util";
import { FIELDS } from "fields";
import { RULES } from "rules";
import { validateObject } from "validation";

it('validateFields.file-content-type', () => {
	const rule = RULES.file.contentType(CONTENT_TYPES.documents);

	const validationResult = validateObject(
		{
			good: { name: "dummy.docx", type: "application/msword", size: 1000 },
			bad: { name: "dummy.csv", type: "text/csv", size: 1000 },
		},
		{
			good: FIELDS.file([rule]),
			bad: FIELDS.file([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.errors.good).toBeUndefined();
	expect(validationResult.errors.bad.isValid).toBe(false);
});

it('validateFields.file-size-max', () => {
	const rule = RULES.file.size.max(1000);

	const validationResult = validateObject(
		{
			good: { name: "dummy.docx", type: "application/msword", size: 1000 },
			bad: { name: "dummy.csv", type: "text/csv", size: 1001 },
		},
		{
			good: FIELDS.file([rule]),
			bad: FIELDS.file([rule])
		}
	);

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.errors.good).toBeUndefined();
	expect(validationResult.errors.bad.isValid).toBe(false);
});
