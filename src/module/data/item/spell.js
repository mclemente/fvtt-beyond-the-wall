import { ItemTemplateData } from "./templates/item.js";

export default class SpellData extends ItemTemplateData {
	static defineSchema() {
		const { fields } = foundry.data;
		const superFields = super.defineSchema();
		return {
			...superFields,
			ability: new fields.StringField({ initial: "", blank: true }),
			cantrip: new fields.BooleanField(),
			duration: new fields.SchemaField({
				value: new fields.NumberField({ required: true, nullable: false, integer: true, min: 0, initial: 0 }),
				units: new fields.StringField({ initial: "inst" }),
				level: new fields.BooleanField()
			}),
			range: new fields.StringField({ initial: "", blank: true, choices: CONFIG.BTW.ranges }),
			save: new fields.BooleanField()
		};
	}
}
