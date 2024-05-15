import { TEST_DATA, validateObject } from "validation";

const { OBJ, TYPE } = TEST_DATA;

it('validateFields.object', () => {
	const validationResult = validateObject({
		values: OBJ,
		types: TYPE,
		fullQualifiedName: "test1.test2"
	});

	expect(validationResult.isValid).toBe(true);
	expect(validationResult.fieldSet.types).toBe(TYPE);
	expect(validationResult.fieldSet.values).toBe(OBJ);
	expect(validationResult.fieldSet.fullQualifiedName).toBe("test1.test2");
});
