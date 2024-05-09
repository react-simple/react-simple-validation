import { TEST_DATA, validateObject } from "validation";

const { OBJ, TYPE } = TEST_DATA;

it('validateFields.object', () => {
	const validationResult = validateObject(OBJ, TYPE);

	expect(validationResult.isValid).toBe(true);
	expect(validationResult.fieldTypes).toBe(TYPE);
	expect(validationResult.fieldValues).toBe(OBJ);
});
