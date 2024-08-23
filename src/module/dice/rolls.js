export default class RollBTW extends Roll {
	constructor(formula, data={}, options={}) {
		if (options.rollUnder === "true") {
			options.critical ??= 1;
			options.fumble ??= 20;
		} else {
			options.critical ??= 20;
			options.fumble ??= 1;
		}

		super(formula, data, options);
	}

	get validD20Roll() {
		return (this.terms[0] instanceof foundry.dice.terms.Die) && (this.terms[0].faces === 20);
	}

	get isCritical() {
		if (!this.validD20Roll || !this._evaluated) return undefined;
		const { rollUnder, critical } = this.options;
		const rollTotal = this.dice[0].total;
		return rollUnder === "true" ? rollTotal <= critical : rollTotal >= critical;
	}

	get isFumble() {
		if (!this.validD20Roll || !this._evaluated) return undefined;
		const { rollUnder, fumble } = this.options;
		const rollTotal = this.dice[0].total;
		return rollUnder === "true" ? rollTotal >= fumble : rollTotal <= fumble;
	}

	get isSuccess() {
		if (!this.validD20Roll || !this._evaluated) return undefined;
		const { rollUnder, target } = this.options;
		if (!Number.isFinite(target)) return false;
		return rollUnder === "true" ? this.total <= target : this.total >= target;
	}
}
