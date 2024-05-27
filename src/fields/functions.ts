import { getObjectChildValue } from "@react-simple/react-simple-mapping";
import { FieldType } from "./types/types";

export const getFieldTypeChild = (fieldType: FieldType, fullQualifiedName: string) => {
	return getObjectChildValue<FieldType>(
		fieldType,
		fullQualifiedName,
		{
			getValue: (type, name) => {
				const fieldType = type as FieldType;

				switch (fieldType.baseType) {
					case "object":
						return fieldType.schema[name];
          
					case "array":
						return fieldType.itemType;
          
					default:
						return undefined;
				}
			}
		}
	);
};
