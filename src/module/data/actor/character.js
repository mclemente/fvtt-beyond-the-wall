import ActorTemplateData from "./templates/actor.js";

export default class CharacterData extends ActorTemplateData {
	static defineSchema() {
		const { fields } = foundry.data;
		const superFields = super.defineSchema();
		return {
			...superFields,
			background: new fields.HTMLField(),
			currency: new fields.SchemaField({
				gold: new fields.NumberField({
					required: true,
					nullable: false,
					integer: true,
					initial: 0,
					min: 0
				}),
				silver: new fields.NumberField({
					required: true,
					nullable: false,
					integer: true,
					initial: 0,
					min: 0
				}),
				copper: new fields.NumberField({
					required: true,
					nullable: false,
					integer: true,
					initial: 0,
					min: 0
				})
			}),
			fortunePoints: new fields.SchemaField({
				value: new fields.NumberField({
					required: true, nullable: false, integer: true, min: 0, initial: 3
				}),
				max: new fields.NumberField({
					required: true, nullable: false, integer: true, min: 0, initial: 3
				})
			}),
			level: new fields.NumberField({ nullable: false, integer: true, min: 0, initial: 0 })
		};
	}
}
