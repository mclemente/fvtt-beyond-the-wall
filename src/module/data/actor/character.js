import ActorTemplateData from "./templates/actor.js";

export default class CharacterData extends ActorTemplateData {
	static defineSchema() {
		const { fields } = foundry.data;
		const superFields = super.defineSchema();
		return {
			...superFields,
			background: new fields.HTMLField(),
			fortunePoints: new fields.SchemaField({
				value: new fields.NumberField({
					required: true, nullable: false, integer: true, min: 0, initial: 3
				}),
				max: new fields.NumberField({
					required: true, nullable: false, integer: true, min: 0, initial: 3
				})
			}),
			level: new fields.NumberField({ nullable: false, integer: true, min: 0, initial: 0 }),
		};
	}
}
