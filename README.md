# React Simple! Validation Library
Validation library for React application development. Intended usage is form validation, but can be used for other purposes.

Documentation is for version 0.6.0.

Features:
- Validation is based on **schema of field types**. Field types support primitive values (text, number, Date, boolean) and structures (arrays, object), therefore nested child objects are supported. 
- Field types can have associated **validation rules**. Besides basic validation also conditions, operators and references to other fields are supported.
- Validating **child objects** or **array of child objects** are natively supported (array-match-some, array-match-all etc.)
- It's possible to **refer to other fields** using **full qualified names** (name.name[0].name...) or by assigned **reference names** (@partner_type).
- External parameters can also be used (@param)
- Localization is not added intentionally. All number, Date and boolean values are expected to be present in their native format. 
It is the responsibility of the consuming component to do the conversion (forms binding for example).
- Detailed error result is returned.
- **Incremental validation** by keeping previous results, it's possible to filter fields by full qualified names
- **Dependency injection** for pluggable architecture. All the important methods can be replaced with custom implementation by setting REACT_SIMPLE_VALIDATION.DI members.
- **Unit tests** for all fetaures

# Usage

## Installation
npm -i @react-simple/react-simple-validation

## Build
npm run build

## Test
npm run test

## Import
import { ... } from "@react-simple/react-simple-validation";

# Configuration
## REACT_SIMPLE_VALIDATION

Members in the REACT_SIMPLE_VALIDATION object can be set to update the behavior of the provided functions.

### REACT_SIMPLE_VALIDATION.FIELD_DEFAULTS

Default values for field types validation rules (minValue, maxValue, maxLength, regExp format etc.). Can be overriden in concrete instances.

### REACT_SIMPLE_VALIDATION.DI

Dependency injection references which will be called by the appropriate methods. For example **validateRule()** will 
call **REACT_SIMPLE_VALIDATION.DI.validateRule()**, so it can be easily replaced with a custom implementation. The custom callback will be called with all parameters and a callback to the default implementation (**validateRule_default()**) which makes implementing wrappers easier.

# Content

## Functions

- **validateObject(*obj, schema, options*)**: Root entry point for validating object models. Specify
  - ***options.namedObjs*** for parameter values (accessible with @name refs)
  - ***options.incrementalValidation.filter/previousResult*** for incremental validation
- **vdaliteField(*field, context, previousResult*)**: Used to validate single fields. Fields encapsulate field value with field type. ***previousResult*** is used for incremental validation.
- **validateRule(*rule, field, context*)**: Validates a single rule for a field.

## Field Types

Field types describe single fields in the object model with **validation rules** and **type meta data** to access and validate child members. While the **baseType, type** and **baseValue** members describe the type itself the other members describe the field type instance for a particular field. Therefore we instantiate field types for all fields.

### FieldTypeBase
The base **FieldTypeBase&lt;*ValueType, RulesType*&gt;** type has the following members:
- **baseType**:
  - The **base type refers to the underlying JavaScript type** and it can be: **text (string), **number**, **date (Date), **boolean**, **file (File), **array (Array), **object** or **any**.
  - Has the type of **BaseFieldType** which is an enum and not extendable.
- **type**:
  - By default for each base type we have a type created, but **types are extendable**.
  - For example for the **text base type** we already have: **text, shortText, longText, notesText, tel, phone, email**, but client code can further extend this list. 
  - What all these field types differ from each other is the default validation rules attached (minLength, maxLength, regExp etc.)
- **baseValue**: This is not the default value for the field, but the **default value for the type**.
- **rules**: List of validation rules for the field type instance.
- **refName**: Name for the field type instance for references. Some validation rules can refer to other fields (reference, compare) and in that case not only full qualified field names but named references can be used (@*name*) to address fields. Named references can refer to single values, arrays or objects, since those all are valid field types.
- **defaultValue**: The default value for the field type instance used for initialization.

### FieldType ###

The **FieldType** union type includes all field types. It is a **discriminated union type** and the **type discriminator** is the **type** field, therefore curly braces object creation will be validated by the TypeScript compiler.

### Default field types

The following field types are supported by default, but custom field types can be created by extending the appropriate **&lt;*baseType*&gt;FieldTypeBase** and specifying a custom **type**.

- TextFieldType ("text" / string)
- NumberFieldType ("number" / number)
- DateFieldType ("date" / Date)
- BooleanFieldType ("boolean" / boolean)
- FileFieldType ("file" / ValueOrArray&lt;File&gt;)
- ArrayFieldType ("array" / unknown[])
- ObjectFieldType ("object" / object)
- AnyFieldType ("any" / any)

For convenience the **factory methods** in **FIELDS** can be used to initialize field types like **FIELDS.number(*rules, options*)**.

### Extending field types

Creating new field types is easy first you must **extend the underlying base type** then provide the set of **default rules**. (The EmailTextFieldType is already defined.)

Since, unlike **baseType** which is an enum type, the **type** field is a string, any references to it won't be validated by TypeScript. However, in client code you might consider defining your own type.

Note, that the base field type is extended by specifying the underlying **value type** and the **type of the valid rules** for this field type.

```
export interface EmailTextFieldType extends FieldTypeBase<string, TextFieldValidationRules> {
	readonly type: "text-email";
}

REACT_SIMPLE_VALIDATION.DEFAULT_RULES.text["text-email"] = [
	{ ruleType: "required" },
	{ ruleType: "text-length-max", maxLength: 50 },
	{ ruleType: "text-match", regExp: /^\w.+@\w.+\.\w+$/ }
];
```

It is advised to extend the **FIELDS** factory too with your own methods:

```
import { FIELDS as BASE_FIELDS } from '@react-simple/react-simple-validation";

export const FIELDS = { ...BASE_FIELDS, ...my factory methods };
```

## Rules

Validation rules are used to validate field values.
- Not all rules can be used for all field types, therefore for a particular **&lt;*baseType*&gt;FieldType** we have the **&lt;*baseType*&gt;FieldValidationRules** union type created which includes all valid rules.
- The **Simple&lt;*baseType*&gt;FieldValidationRules** type is also created to exclude **CompositeValidationRules (conditions, operators, references) keeping only single field validation rules.

### FieldValidationRuleBase

The base **FieldValidationRule** type has the following members:

- **ruleType**: The type of the rule.
- **message**: The custom message for the rule when validation fails if the default message is not sufficient.

### FieldValidationRule

The **FieldValidationRule** union type includes all rules types. It is a **discriminated union type** and the **type discriminator** is the **ruleType** field, therefore curly braces object creation will be validated by the TypeScript compiler.

### CommonFieldValidationRules

- **FieldTypeRule ("type")**: Can be defined manually to override the default message, but it is automatically validated based on the **baseType** of the field.
- **FieldRequiredRule ("required")**: Annotates a required field.

### TextFieldValidationRules

Most of the text validation rules support the **ignoreCase** member ('false* by default).

- **FieldTextMinLengthRule ("text-length-min")**: Min text length
- **FieldTextMaxLengthRule ("text-length-max")**: Max text length
- **FieldTextLengthRule ("text-length-value")**: Exact text length
- **FieldTextLengthRangeRule ("text-length-range")**: Min-max range for text length
- **FieldTextValueRule ("text-equals")**: Exact text value
- **FieldTextMatchRule ("text-match")**: Validate by regular expression(s)
- **FieldTextCustomValidationRule ("text-custom")**: The **customValidate(*field, context, validateField*)** callback can be used to implement custom validation logic. Provides the ***validateField()***  callback to invoke the default validation logic which makes implementing wrappers easier.

### NumberFieldValidationRules

- **FieldNumberMinValueRule ("number-min")**: Minimum value, specify *mustBeGreater* to exclude equality
- **FieldNumberMaxValueRule ("number-max")**: Maximum value, specify *mustBeLess* to exclude equality
- **FieldNumberValueRule ("number-equals")**: Exact value
- **FieldNumberRangeRule ("number-range")**: Min-max range, specify *mustBeGreater* and/or *mustBeLess* to exclude equality
- **FieldNumberCustomValidationRule ("number-custom")**: The **customValidate(*field, context, validateField*)** callback can be used to implement custom validation logic. Provides the ***validateField()***  callback to invoke the default validation logic which makes implementing wrappers easier.

### DateFieldValidationRules

- **FieldDateMinValueRule ("date-min")**: Minimum value, specify *mustBeGreater* to exclude equality
- **FieldDateMaxValueRule ("date-max")**: Maximum value, specify *mustBeLess* to exclude equality
- **FieldDateValueRule ("date-equals")**: Exact value
- **FieldDateRangeRule ("date-range")**: Min-max range, specify *mustBeGreater* and/or *mustBeLess* to exclude equality
- **FieldDateCustomValidationRule ("date-custom")**: The **customValidate(*field, context, validateField*)** callback can be used to implement custom validation logic. Provides the ***validateField()***  callback to invoke the default validation logic which makes implementing wrappers easier.

### BooleanFieldValidationRules

- **FieldBooleanValueRule ("boolen-value")**: Exact value
- **FieldBooleanCustomValidationRule ("boolean-custom")**: The **customValidate(*field, context, validateField*)** callback can be used to implement custom validation logic. Provides the ***validateField()***  callback to invoke the default validation logic which makes implementing wrappers easier.

### FileFieldValidationRules

- **FieldFileMaxSizeRule ("file-max-size")**: Maximum file size in bytes
- **FieldFileContentTypeRule ("file-content-type")**: List of allowed content types. Specify **CONTENT_TYPE[]**, one of the pre-defined values from **CONTENT_TYPE** (documents, images etc.) or custom value(s).
- **FieldFileCustomValidationRule ("boolean-custom")**: The **customValidate(*field, context, validateField*)** callback can be used to implement custom validation logic. Provides the ***validateField()***  callback to invoke the default validation logic which makes implementing wrappers easier.

### ArrayFieldValidationRules

Most of the array rules support the optinal ***filter*** parameter to filter the list of items with a rule for validation.

- **FieldArrayMinLengthRule ("array-length-min")**: Minimum array length (filtered or all items)
- **FieldArrayMaxLengthRule ("array-length-max")**: Maximum array length (filtered or all items)
- **FieldArrayLengthRule ("array-length-value")**: Exect array length (filtered or all items)
- **FieldArrayLengthRangeRule ("array-length-range")**: Min/max array length
- **FieldArrayMatchAllRule ("array-match-all")**: All items must match the specified ***predicate***  (filtered or all items)
- **FieldArrayMatchSomeRule ("array-match-some")**: At least one item must match the specified ***predicate***  (filtered or all items)
- **FieldArrayIncludeSomeRule ("array-include-all")**: The array must include all the specified values (filtered or all items)
- **FieldArrayIncludeAllRule ("array-include-some")**: The array must include at least one of the specified values (filtered or all items)
- **FieldArrayIncludeNoneRule ("array-include-none")**: The array must not include any of the specified values (filtered or all items)
- **ArrayItemIndexRule ("array-itemindex-value")**: When the current field is inside an array the index position must be exactly like the specified value (closest array in object hierarchy)
- **ArrayItemIndexMinRule ("array-itemindex-min")**: When the current field is inside an array the index position must be greater or equal like the specified value (closest array in object hierarchy)
- **ArrayItemIndexMaxRule ("array-itemindex-max")**: When the current field is inside an array the index position must be less or equal like the specified value (closest array in object hierarchy)
- **ArrayItemIndexRangeRule ("array-itemindex-range")**: Min/max range for index position
- **FieldArrayCustomValidationRule ("array-custom")**: The **customValidate(*field, context, validateField*)** callback can be used to implement custom validation logic. Provides the ***validateField()***  callback to invoke the default validation logic which makes implementing wrappers easier.

### ObjectFieldValidationRules

- **FieldObjectCustomValidationRule ("array-object")**: The **customValidate(*field, context, validateField*)** callback can be used to implement custom validation logic. Provides the ***validateField()***  callback to invoke the default validation logic which makes implementing wrappers easier.

### AnyFieldValidationRules

- **FieldAnyCustomValidationRule ("array-object")**: The **customValidate(*field, context, validateField*)** callback can be used to implement custom validation logic. Provides the ***validateField()***  callback to invoke the default validation logic which makes implementing wrappers easier.

# Links

- How to Set Up Rollup to Run React?: https://www.codeguage.com/blog/setup-rollup-for-react
- Creating and testing a react package with CRA and rollup: https://dev.to/emeka/creating-and-testing-a-react-package-with-cra-and-rollup-5a4l
- (react-scripts) Support for TypeScript 5.x: https://github.com/facebook/create-react-app/issues/13080
