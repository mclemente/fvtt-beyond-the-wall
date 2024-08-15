import FormulaField from "../fields/formula-field.js";
import ItemTemplateData from "./templates/item.js";

export default class ClassData extends ItemTemplateData {
	static defineSchema() {
		const { fields } = foundry.data;
		const superFields = super.defineSchema();
		return {
			...superFields,
			abilities: new fields.HTMLField(),
			armor: new fields.StringField(),
			hd: new FormulaField({ initial: "0" }),
			initiative: new fields.NumberField({ nullable: false, integer: true, initial: 0 })
		};
	}
}
