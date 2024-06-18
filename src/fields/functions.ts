import { ChildMemberInfoWithCallbacks, getChildMemberInfo } from "@react-simple/react-simple-mapping";
import { FieldType, FieldTypes, ObjectFieldType } from "./types/types";
import { REACT_SIMPLE_VALIDATION } from "data";
import { FIELDS } from "./data";

function getChildFieldTypeByName_default(fieldType: FieldType, name: string): FieldType | undefined {
	switch (fieldType.baseType) {
		case "object":
			return fieldType.schema[name];

		case "array":
			return fieldType.itemType;

		default:
			return undefined;
	}
}

REACT_SIMPLE_VALIDATION.DI.fields.getChildFieldTypeByName = getChildFieldTypeByName_default;

export function getChildFieldTypeByName(fieldType: FieldType, name: string): FieldType | undefined {
	return REACT_SIMPLE_VALIDATION.DI.fields.getChildFieldTypeByName(fieldType, name, getChildFieldTypeByName_default);
}

function getChildFieldTypeInfoByFullQualifiedName_default(
	fieldType: FieldType,
	fullQualifiedName: string,
	createMissingChildObjects: boolean
): ChildMemberInfoWithCallbacks<FieldType> | undefined {
	return getChildMemberInfo<FieldType>(
		fieldType,
		fullQualifiedName,
		createMissingChildObjects,
		{
			getMemberValue: (type, name) => {
				return getChildFieldTypeByName(type as FieldType, name.name);
			}
		}
	);
}

REACT_SIMPLE_VALIDATION.DI.fields.getChildFieldTypeInfoByFullQualifiedName = getChildFieldTypeInfoByFullQualifiedName_default;

// Returns accessors for the child type from the type hierarchy, but does not create missing child objects, if it's not yet created; returns undefined
export function getChildFieldTypeInfoByFullQualifiedName(
	fieldType: FieldType,
	fullQualifiedName: string,
	createMissingChildObjects: boolean
): ChildMemberInfoWithCallbacks<FieldType> | undefined {
	return REACT_SIMPLE_VALIDATION.DI.fields.getChildFieldTypeInfoByFullQualifiedName(
		fieldType, fullQualifiedName, createMissingChildObjects, getChildFieldTypeInfoByFullQualifiedName_default
	);
}

// Returns the child type from the type hierarchy, but does not create missing child objects, if it's not yet created; returns undefined
function getChildFieldTypeByFullQualifiedName_default(fieldType: FieldType, fullQualifiedName: string): FieldType | undefined {
	return getChildFieldTypeInfoByFullQualifiedName(fieldType, fullQualifiedName, false)?.getValue?.();
}

REACT_SIMPLE_VALIDATION.DI.fields.getChildFieldTypeByFullQualifiedName = getChildFieldTypeByFullQualifiedName_default;

// Returns the child type from the type hierarchy, but does not create missing child objects, if it's not yet created; returns undefined
export function getChildFieldTypeByFullQualifiedName(fieldType: FieldType, fullQualifiedName: string): FieldType | undefined {
	return REACT_SIMPLE_VALIDATION.DI.fields.getChildFieldTypeByFullQualifiedName(
		fieldType, fullQualifiedName, getChildFieldTypeByFullQualifiedName_default
	);
}

export const iterateFieldTypes = <Schema extends FieldTypes, Obj extends object = object>(
	schema: Schema | ObjectFieldType<Schema>,
	obj?: Obj,
) => {
	const type = (schema as ObjectFieldType).baseType === "object" && (schema as ObjectFieldType).type === "object"
		? schema as ObjectFieldType<Schema>
		: FIELDS.object(schema as Schema);
	
};
