export default class ItemSheetBTW extends ItemSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["btw", "sheet", "item"],
			width: 600,
			height: 450,
			scrollY: [".window-content"],
			tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "moves" }]
		});
	}

	get template() {
		return `systems/beyond-the-wall/templates/items/${this.item.type}-sheet.hbs`;
	}

	async getData() {
		const source = this.item.toObject();
		const context = {
			actor: this.actor,
			item: this.item,
			source: source.system,
			system: foundry.utils.duplicate(this.item.system),

			config: CONFIG.BTW,
		};

		const enrichmentOptions = {
			async: true,
			secrets: this.item.isOwner,
			rollData: this.item?.getRollData() ?? {},
			relativeTo: this.item
		};

		context.descriptionHTML = await TextEditor.enrichHTML(source.system.description, enrichmentOptions);

		if (source.system.abilities) {
			context.abilitiesHTML = await TextEditor.enrichHTML(source.system.description, enrichmentOptions);
		}

		context.abilitiesLabels = Object.fromEntries(
			Object.entries(CONFIG.BTW.abilities).map(([k, v]) => [k, v.label])
		);

		return context;
	}
}
