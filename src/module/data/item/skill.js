import { ItemTemplateData } from "./templates/item.js";

export default class SkillData extends ItemTemplateData {
	static defineSchema() {
		const { fields } = foundry.data;
		const superFields = super.defineSchema();
		return {
			...superFields,
			ability: new fields.StringField({ initial: "", blank: true, choices: CONFIG.BTW.abilities }),
			bonus: new fields.NumberField({ required: true, nullable: false, integer: true, min: 0, initial: 2 })
		};
	}
}
