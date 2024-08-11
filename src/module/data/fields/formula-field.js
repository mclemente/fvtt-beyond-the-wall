// SPDX-FileCopyrightText: 2021 Andrew Clayton
//
// SPDX-License-Identifier: MIT
// https://github.com/foundryvtt/dnd5e/blob/e2e6bbafe83f81130057302f7eeff00c3a646640/module/data/fields/formula-field.mjs

export default class FormulaField extends foundry.data.fields.StringField {

	/** @inheritdoc */
	static get _defaults() {
		return foundry.utils.mergeObject(super._defaults, {
			deterministic: false
		});
	}

	/* -------------------------------------------- */

	/** @inheritdoc */
	_validateType(value) {
		Roll.validate(value);
		if (this.options.deterministic) {
			const roll = new Roll(value);
			if (!roll.isDeterministic) throw new Error("must not contain dice terms");
		}
		super._validateType(value);
	}
}
