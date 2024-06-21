import { getChildMemberValue } from "@react-simple/react-simple-mapping";
import { ArrayFieldTypeBase, FieldType, FieldTypes, ObjectFieldType, ObjectFieldTypeBase } from "./types/types";
import { FIELDS } from "./data";

// Returns the child type from the type hierarchy, but does not create missing child objects, if it's not yet created; returns undefined
export function getChildFieldType(fieldType: FieldType, fullQualifiedName: string): FieldType | undefined {
	return getChildMemberValue<FieldType>(
		fieldType,
		fullQualifiedName,
		{
			getMemberValue: (type, names) => {
				switch ((type as FieldType).baseType) {
					case "object":
						return (type as ObjectFieldTypeBase).schema[names.name];

					case "array":
						return (type as ArrayFieldTypeBase).itemType;

					default:
						return undefined;
				}
			}
		}
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
