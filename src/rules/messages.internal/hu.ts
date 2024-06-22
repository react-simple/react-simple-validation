import { getResolvedArray, isArray } from "@react-simple/react-simple-util";
import { NumberFormatOptions, formatDateOrDateTime, formatNumber, getCulture } from "@react-simple/react-simple-localization";
import { ValidationRuleMessages } from "rules/types";
import { BaseFieldType } from "fields/types";

const CULTURE_ID = "HU";

const dateToStr = (d: Date) => {
	return formatDateOrDateTime(d, getCulture(CULTURE_ID).dateFormat);
};

const floatToStr = (n: number, options?: NumberFormatOptions) => {
	return formatNumber(n, getCulture(CULTURE_ID).numberFormat, options);
};

// not all validation rules have default messages
export const getValidationRuleMessagesHU: (
	fieldTypeNames: () => ({ [cultureId: string]: Record<BaseFieldType, string> })
) => ValidationRuleMessages = fieldTypeNames => ({
	"all-rules-valid": undefined,
	"any-custom": undefined,

	"array-custom": undefined,
	"array-include-all": ({ items }) => isArray(items)
		? `Hiányzó értékek: ${items.join(", ")}`
		: `Hiányzó érték: ${items}`,

	"array-include-none": ({ items }) => isArray(items)
		? `Nem megengedett értékek: ${items.join(", ")}`
		: `Nem megengedett érték: ${items}`,

	"array-include-some": ({ items }) => isArray(items)
		? `Elvárt értékek: ${items.join(", ")}`
		: `Elvárt érték: ${items}`,

	"array-itemindex-equals": undefined,
	"array-itemindex-max": undefined,
	"array-itemindex-min": undefined,
	"array-itemindex-range": undefined,

	"array-length-equals": ({ expectedLength }) => `${expectedLength} elemet adjon meg`,
	"array-length-max": ({ maxLength }) => `Legfeljebb ${maxLength} elemet adjon meg`,
	"array-length-min": ({ minLength }) => `Legalább ${minLength} elemet adjon meg`,
	"array-length-range": ({ minLength, maxLength }) => `Legalább ${minLength} és legfeljebb ${maxLength} elemet adjon meg`,

	"array-match-all": undefined,
	"array-match-some": undefined,

	"boolean-custom": undefined,
	"boolean-equals": ({ expectedValue }) => expectedValue ? "Kötelező bejelölni" : "Kötelező üresen hagyni",
	"compare": undefined,

	"date-custom": undefined,

	"date-min": ({ minDate, mustBeGreater }) => mustBeGreater
		? `${dateToStr(minDate)} utáni dátumot adjon meg`
		: `${dateToStr(minDate)} vagy későbbi dátumot adjon meg`,

	"date-max": ({ maxDate, mustBeLess }) => mustBeLess
		? `${dateToStr(maxDate)} előtti dátumot adjon meg`
		: `${dateToStr(maxDate)} vagy korábbi dátumot adjon meg`,

	"date-range": ({ minDate, mustBeGreater, maxDate, mustBeLess }) =>
		`${dateToStr(minDate)} ${mustBeGreater ? "utáni" : "vagy későbbi"} és ` +
		`${dateToStr(maxDate)} ${mustBeLess ? "előtti" : "vagy korábbi"} dátumot adjon meg`,

	"date-equals": ({ expectedValue }) => isArray(expectedValue)
		? `Elvárt dátumok: ${expectedValue.map(t => dateToStr(t), ", ").join(", ")}`
		: `Elvárt dátum: ${dateToStr(expectedValue)}`,

	"field-reference": undefined,
	"file-content-type": ({ allowedContentTypes }) => `Elvárt formátum: ${getResolvedArray(allowedContentTypes).map(t => t.name).join(", ")}`,
	"file-custom": undefined,
	"file-size-max": ({ maxFileSize }) => maxFileSize >= 0x100000
		? `Maximum fájlméret: ${floatToStr(maxFileSize / 0x100000, { maxDecimalDigits: 1 })} Mb`
		: `Maximum fájlméret: ${floatToStr(maxFileSize / 0x400, { maxDecimalDigits: 1 })} Kb`,

	"if-then-else": undefined,

	"number-custom": undefined,
	"number-min": ({ minValue, mustBeGreater }) => mustBeGreater
		? `Nagyobb mint ${floatToStr(minValue)} a megengedett`
		: `Legalább ${floatToStr(minValue)} a megengedett`,

	"number-max": ({ maxValue, mustBeLess }) => mustBeLess
		? `Kevesebb mint ${floatToStr(maxValue)} a megengedett`
		: `Legfeljebb ${floatToStr(maxValue)} a megengedett`,

	"number-range": ({ minValue, mustBeGreater, maxValue, mustBeLess }) =>
		`${mustBeGreater ? "Nagyobb mint" : "Legalább"} ${floatToStr(minValue)} és ` +
		`${mustBeLess ? "kevesebb mint" : "legfeljebb"} ${floatToStr(maxValue)} a megengedett`,

	"number-equals": ({ expectedValue }) => isArray(expectedValue)
		? `Elvárt értékek: ${expectedValue.map(t => floatToStr(t), ", ").join(", ")}`
		: `Elvárt érték ${floatToStr(expectedValue)}`,

	"object-custom": undefined,
	"required": () => "Kötelező",
	"some-rules-valid": undefined,
	"switch": undefined,

	"text-custom": undefined,
	"text-length-equals": ({ expectedLength }) => expectedLength === 1
		? "Egy karakter adjon meg"
		: `${expectedLength} karakter hosszú szöveget adjon meg`,

	"text-length-min": ({ minLength }) => minLength === 1
		? "Legalább egy karaktert adjon meg"
		: `Legalább ${minLength} karaktert adjon meg`,

	"text-length-max": ({ maxLength }) => maxLength === 1
		? "Legfeljebb egy karaktert adjon meg"
		: `Legfeljebb ${maxLength} karaktert adjon meg`,

	"text-length-range": ({ minLength, maxLength }) => (
		minLength !== maxLength ? `Legalább ${minLength} és legfeljebb ${maxLength} karaktert adjon meg` :
			minLength === 1 ? "Egy karaktert adjon meg" :
				`${minLength} karaktert adjon meg`
	),

	"text-match": ({ regExpName }) => regExpName
		? `Elvárt formátum: (${regExpName})`
		: "Nem megfelelő formátum",

	"text-equals": ({ expectedValue }) => isArray(expectedValue)
		? `Elvárt értékek: ${expectedValue.join(", ")}`
		: `Elvárt érték: '${expectedValue}'`,

	"type": ({ valueType }) => {
		const typeName = fieldTypeNames()["HU"]?.[valueType];
		return typeName ? `Elvárt érték típus: ${typeName}` : 'Hibás érték típus';
	}
});
