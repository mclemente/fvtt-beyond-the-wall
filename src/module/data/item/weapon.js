import FormulaField from "../fields/formula-field.js";
import ItemTemplateData from "./templates/item.js";

export default class WeaponData extends ItemTemplateData {
	static defineSchema() {
		const { fields } = foundry.data;
		const superFields = super.defineSchema();
		return {
			...superFields,
			bonus: new fields.NumberField({ required: true, integer: true, min: 0, initial: 0 }),
			equipped: new fields.BooleanField({ required: true }),
			damage: new FormulaField({ required: true, initial: "1d6" }),
			range: new fields.SchemaField({
				short: new fields.NumberField({ required: true, integer: true, min: 0, initial: 50 }),
				long: new fields.NumberField({ required: true, integer: true, min: 0, initial: 200 })
			}),
			type: new fields.StringField({ required: true, blank: true, initial: "melee" })
		};
	}
}
