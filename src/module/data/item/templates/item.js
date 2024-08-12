export class ItemTemplateData extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const { fields } = foundry.data;
		return {
			description: new fields.HTMLField()
		};
	}
}
