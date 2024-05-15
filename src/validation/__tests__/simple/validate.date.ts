import { FIELDS } from "fields";
import { FieldValidationRule } from "rules";
import { validateObject } from "validation";

it('validateFields.date-min', () => {
	const rule: FieldValidationRule = {
		ruleType: "date-min",
		minDate: new Date(2000, 1, 1)
	};

	let validationResult = validateObject({
		values: {
			good: new Date(2000, 1, 1),
			bad: new Date(1999, 12, 31, 23, 59, 59)
		},
		types: {
			good: FIELDS.date([rule]),
			bad: FIELDS.date([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.date-min.mustBeGreater', () => {
	const rule: FieldValidationRule = {
		ruleType: "date-min",
		minDate: new Date(2000, 1, 1),
		mustBeGreater: true
	};

	let validationResult = validateObject({
		values: {
			good: new Date(2000, 1, 1, 0, 0, 1),
			bad: new Date(2000, 1, 1)
		},
		types: {
			good: FIELDS.date([rule]),
			bad: FIELDS.date([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.date-max', () => {
	const rule: FieldValidationRule = {
		ruleType: "date-max",
		maxDate: new Date(2000, 1, 1)
	};

	let validationResult = validateObject({
		values: {
			good: new Date(2000, 1, 1),
			bad: new Date(2000, 1, 1, 0, 0, 1)
		},
		types: {
			good: FIELDS.date([rule]),
			bad: FIELDS.date([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.date-max.mustBeLess', () => {
	const rule: FieldValidationRule = {
		ruleType: "date-max",
		maxDate: new Date(2000, 1, 1),
		mustBeLess: true
	};

	let validationResult = validateObject({
		values: {
			good: new Date(1999, 12, 31, 23, 59, 59),
			bad: new Date(2000, 1, 1)
		},
		types: {
			good: FIELDS.date([rule]),
			bad: FIELDS.date([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.date-range', () => {
	const rule: FieldValidationRule = {
		ruleType: "date-range",
		minDate: new Date(2000, 1, 1),
		maxDate: new Date(2000, 12, 31)
	};

	let validationResult = validateObject({
		values: {
			good: new Date(2000, 1, 1),
			bad1: new Date(2001, 1, 1),
			bad2: new Date(1999, 1, 1),
		},
		types: {
			good: FIELDS.date([rule]),
			bad1: FIELDS.date([rule]),
			bad2: FIELDS.date([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad1.isValid).toBe(false);
	expect(validationResult.validationResult.bad2.isValid).toBe(false);
});

it('validateFields.date-value', () => {
	const rule: FieldValidationRule = {
		ruleType: "date-value",
		expectedValue: new Date(2000, 1, 2, 3, 4, 5, 6)
	};

	let validationResult = validateObject({
		values: {
			good: new Date(2000, 1, 2, 3, 4, 5, 6),
			bad: new Date(2000, 1, 1),
		},
		types: {
			good: FIELDS.date([rule]),
			bad: FIELDS.date([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});

it('validateFields.date-value.array', () => {
	const rule: FieldValidationRule = {
		ruleType: "date-value",
		expectedValue: [new Date(2000, 1, 2, 3, 4, 5, 6), new Date(2001, 1, 2, 3, 4, 5, 6)]
	};

	let validationResult = validateObject({
		values: {
			good1: new Date(2000, 1, 2, 3, 4, 5, 6),
			good2: new Date(2001, 1, 2, 3, 4, 5, 6),
			bad: new Date(2000, 1, 1),
		},
		types: {
			good1: FIELDS.date([rule]),
			good2: FIELDS.date([rule]),
			bad: FIELDS.date([rule])
		}
	});

	expect(validationResult.isValid).toBe(false);
	expect(validationResult.validationResult.good1.isValid).toBe(true);
	expect(validationResult.validationResult.good2.isValid).toBe(true);
	expect(validationResult.validationResult.bad.isValid).toBe(false);
});
