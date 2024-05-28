import { fullQualifiedMemberNameMatchSubTree } from "@react-simple/react-simple-mapping";
import { deepCopyObject, sameArrays } from "@react-simple/react-simple-util";
import { FIELDS } from "fields";
import { validateObject } from "validation";

const OBJ = {
	obj1: { text: "ABC" },
	obj2: { text: "ABC" },
	obj3: { text: "" }, // invalid
	array: ["ABC", "ABC"]
};

const SCHEMA = {
	obj1: FIELDS.object({ text: FIELDS.text() }),
	obj2: FIELDS.object({ text: FIELDS.text() }),
	obj3: FIELDS.object({ text: FIELDS.text() }),
	array: FIELDS.array(FIELDS.text())
};

it('validateFields.incremental.filter.array', () => {
	const obj = deepCopyObject(OBJ);
	const result1 = validateObject(obj, SCHEMA);

	expect(result1.isValid).toBe(false);
	expect(result1.childErrors.obj1).toBeUndefined();
	expect(result1.childErrors.obj2).toBeUndefined();
	expect(result1.childErrors.obj3?.isValid).toBe(false);
	expect(result1.childErrors.array).toBeUndefined();

	// we revalidate obj2.text and array[1]
	// obj3 should keep its invalid state even though it's valid now, because we don't revalidate it
	obj.obj2.text = "";
	obj.obj3.text = "ABC";
	obj.array[1] = "";
	
	let validated: string[] = [];
	let skipped: string[] = [];

	const result2 = validateObject(obj, SCHEMA, {
		incrementalValidation: {
			filter: ["obj2", "array[1]"],
			previousResult: result1
		},
		callbacks: {
			onFieldValidated: t => { validated.push(t.fullQualifiedName); },
			onFieldSkipped: t => { skipped.push(t.fullQualifiedName); }
		}
	});

	expect(sameArrays(validated, ['obj2.text', 'obj2', 'array[1]', 'array', ''])).toBe(true);
	expect(sameArrays(skipped, ['obj1', 'obj3', 'array[0]'])).toBe(true);

	expect(result2.isValid).toBe(false);
	expect(result2.childErrors.obj1).toBeUndefined();
	expect(result2.childErrors.obj2?.isValid).toBe(false);

	// obj3 should keep its inValid state even though it's valid now, because we didn't revalidate it
	expect(result2.childErrors.obj3?.isValid).toBe(false);

	expect(result2.childErrors.array?.isValid).toBe(false);
	expect(result2.childErrors.array?.childErrors[0]).toBeUndefined();
	expect(result2.childErrors.array?.childErrors?.[1]?.isValid).toBe(false);

	validated = [];
	skipped = [];

	// revalidating obj3 should make it valid
	const result3 = validateObject(obj, SCHEMA, {
		incrementalValidation: {
			filter: ["obj3"],
			previousResult: result2
		},
		callbacks: {
			onFieldValidated: t => { validated.push(t.fullQualifiedName); },
			onFieldSkipped: t => { skipped.push(t.fullQualifiedName); }
		}
	});
	
	expect(sameArrays(validated, ['obj3.text', 'obj3', ''])).toBe(true);
	expect(sameArrays(skipped, ['obj1', 'obj2', 'array'])).toBe(true);

	expect(result3.isValid).toBe(false);
	expect(result3.childErrors.obj1).toBeUndefined();
	expect(result3.childErrors.obj2?.isValid).toBe(false);
	expect(result3.childErrors.obj3).toBeUndefined();
	expect(result3.childErrors.array?.isValid).toBe(false);
	expect(result3.childErrors.array?.childErrors[0]).toBeUndefined();
	expect(result3.childErrors.array?.childErrors?.[1]?.isValid).toBe(false);
});

it('validateFields.incremental.filter.callback', () => {
	const obj = deepCopyObject(OBJ);
	const result1 = validateObject(obj, SCHEMA);

	expect(result1.isValid).toBe(false);
	expect(result1.childErrors.obj1).toBeUndefined();
	expect(result1.childErrors.obj2).toBeUndefined();
	expect(result1.childErrors.obj3?.isValid).toBe(false);
	expect(result1.childErrors.array).toBeUndefined();

	// we revalidate obj2.text and array[1]
	// obj3 should keep its invalid state even though it's valid now, because we don't revalidate it
	obj.obj2.text = "";
	obj.obj3.text = "ABC";
	obj.array[1] = "";

	let validated: string[] = [];
	let skipped: string[] = [];

	const result2 = validateObject(obj, SCHEMA, {
		incrementalValidation: {
			filter: t => ["obj2", "array[1]"].some(t2 => fullQualifiedMemberNameMatchSubTree(t.fullQualifiedName, t2)),
			previousResult: result1
		},
		callbacks: {
			onFieldValidated: t => { validated.push(t.fullQualifiedName); },
			onFieldSkipped: t => { skipped.push(t.fullQualifiedName); }
		}
	});

	expect(sameArrays(validated, ['obj2.text', 'obj2', 'array[1]', 'array', ''])).toBe(true);
	expect(sameArrays(skipped, ['obj1', 'obj3', 'array[0]'])).toBe(true);

	expect(result2.isValid).toBe(false);
	expect(result2.childErrors.obj1).toBeUndefined();
	expect(result2.childErrors.obj2?.isValid).toBe(false);

	// obj3 should keep its inValid state even though it's valid now, because we didn't revalidate it
	expect(result2.childErrors.obj3?.isValid).toBe(false);

	expect(result2.childErrors.array?.isValid).toBe(false);
	expect(result2.childErrors.array?.childErrors[0]).toBeUndefined();
	expect(result2.childErrors.array?.childErrors?.[1]?.isValid).toBe(false);

	validated = [];
	skipped = [];

	// revalidating obj3 should make it valid
	const result3 = validateObject(obj, SCHEMA, {
		incrementalValidation: {
			filter: t => t.fullQualifiedName === "obj3" || t.fullQualifiedName ==="obj3.text",
			previousResult: result2
		},
		callbacks: {
			onFieldValidated: t => { validated.push(t.fullQualifiedName); },
			onFieldSkipped: t => { skipped.push(t.fullQualifiedName); }
		}
	});

	expect(sameArrays(validated, ['obj3.text', 'obj3', ''])).toBe(true);
	expect(sameArrays(skipped, ['obj1', 'obj2', 'array'])).toBe(true);

	expect(result3.isValid).toBe(false);
	expect(result3.childErrors.obj1).toBeUndefined();
	expect(result3.childErrors.obj2?.isValid).toBe(false);
	expect(result3.childErrors.obj3).toBeUndefined();
	expect(result3.childErrors.array?.isValid).toBe(false);
	expect(result3.childErrors.array?.childErrors[0]).toBeUndefined();
	expect(result3.childErrors.array?.childErrors?.[1]?.isValid).toBe(false);
});
