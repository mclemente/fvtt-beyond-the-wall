export default class ItemTemplateData extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const { fields } = foundry.data;
		return {
			description: new fields.HTMLField(),
			favorite: new fields.BooleanField()
		};
	}
}
