import { FieldValidationOptions } from "./types";

export function mergeFieldValidationOptions(target: FieldValidationOptions, source: FieldValidationOptions): FieldValidationOptions {
	return {
		...target,
		...source,

		namedObjs: {
			...target.namedObjs,
			...source.namedObjs
		},

		callbacks: (target.callbacks || source.callbacks) && {
			onFieldRuleValidated: (target.callbacks?.onFieldRuleValidated || source.callbacks?.onFieldRuleValidated)
				? (t1, t2, t3) => {
					target.callbacks?.onFieldRuleValidated?.(t1, t2, t3);
					source.callbacks?.onFieldRuleValidated?.(t1, t2, t3);
				}
				: undefined,

			onFieldValidated: (target.callbacks?.onFieldValidated || source.callbacks?.onFieldValidated)
				? (t1, t2) => {
					target.callbacks?.onFieldValidated?.(t1, t2);
					source.callbacks?.onFieldValidated?.(t1, t2);
				}
				: undefined,

			onFieldSkipped: (target.callbacks?.onFieldSkipped || source.callbacks?.onFieldSkipped)
				? (t1, t2, t3) => {
					target.callbacks?.onFieldSkipped?.(t1, t2, t3);
					source.callbacks?.onFieldSkipped?.(t1, t2, t3);
				}
				: undefined,

			onObjectValidated: (target.callbacks?.onObjectValidated || source.callbacks?.onObjectValidated)
				? (t1, t2) => {
					target.callbacks?.onObjectValidated?.(t1, t2);
					source.callbacks?.onObjectValidated?.(t1, t2);
				}
				: undefined
		}
	};
}
