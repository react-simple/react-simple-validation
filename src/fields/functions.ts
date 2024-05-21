import { getObjectChildMember } from "@react-simple/react-simple-util";
import { FieldType } from "./types";

export const getFieldTypeChildType = (fieldType: FieldType, fullQualifiedName: string) => {
	return getObjectChildMember<FieldType>(
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
