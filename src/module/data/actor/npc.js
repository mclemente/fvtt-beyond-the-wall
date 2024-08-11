import ActorTemplateData from "./templates/actor.js";

export default class NpcData extends ActorTemplateData {
	static defineSchema() {
		// const { fields } = foundry.data;
		const superFields = super.defineSchema();
		return {
			...superFields
		};
	}
}
