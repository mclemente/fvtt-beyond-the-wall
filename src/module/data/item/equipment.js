import ItemTemplateData from "./templates/item.js";

export default class EquipmentData extends ItemTemplateData {
	static defineSchema() {
		const { fields } = foundry.data;
		const superFields = super.defineSchema();
		return {
			...superFields,
			armor: new fields.NumberField({ required: true, integer: true, min: 0, initial: 0 }),
			equipped: new fields.BooleanField({ required: true }),
			penalty: new fields.NumberField({ required: true, integer: true, min: 0, initial: 0 }),
			type: new fields.StringField({ required: true, blank: true, initial: "light" })
		};
	}
}
