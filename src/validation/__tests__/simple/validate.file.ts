import { CONTENT_TYPES } from "@react-simple/react-simple-util";
import { FIELDS } from "fields";
import { RULES } from "rules";
import { validateObject } from "validation";

it('validateFields.file-contenttype', () => {
	const rule = RULES.file.contentType(CONTENT_TYPES.documents);

	let validationResult = validateObject({
		values: {
			good: { name: "dummy.docx", type: "application/msword", size: 1000 },
			bad: { name: "dummy.csv", type: "text/csv", size: 1000 },
		},
		types: {
			good: FIELDS.file([rule]),
			bad: FIELDS.file([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.file-size-max', () => {
	const rule = RULES.file.size.max(1000);

	let validationResult = validateObject({
		values: {
			good: { name: "dummy.docx", type: "application/msword", size: 1000 },
			bad: { name: "dummy.csv", type: "text/csv", size: 1001 },
		},
		types: {
			good: FIELDS.file([rule]),
			bad: FIELDS.file([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});
