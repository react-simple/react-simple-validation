import { NumberFieldTypeBase } from "./types";
import { REACT_SIMPLE_VALIDATION } from "data";

// Custom number field types

export interface PercentNumberFieldType extends NumberFieldTypeBase {
	readonly type: "number-percent";
}

REACT_SIMPLE_VALIDATION.DEFAULT_RULES.number["number-percent"] = [
	{ ruleType: "required" },
	{ ruleType: "number-min", minValue: 0 },
	{ ruleType: "number-max", maxValue: 100 }
];
