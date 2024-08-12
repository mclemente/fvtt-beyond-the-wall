export default class ActorSheetBTW extends ActorSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["btw", "sheet", "actor"],
			width: 600,
			height: 735,
			scrollY: [".window-content"],
			tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "moves" }]
			// dragDrop: [{ dragSelector: ".items-list .item" }]
		});
	}

	get template() {
		return "systems/beyond-the-wall/templates/actors/actor-sheet.hbs";
	}

	async getData() {
		const source = this.actor.toObject();
		const context = {
			actor: this.actor,
			source: source.system,
			system: foundry.utils.duplicate(this.actor.system),
			items: Array.from(this.actor.items.toObject()).sort((a, b) => (a.sort || 0) - (b.sort || 0)),
			abilities: foundry.utils.deepClone(this.actor.system.abilities),
			saves: foundry.utils.deepClone(this.actor.system.saves),

			config: CONFIG.BTW
		};

		for (const [a, abl] of Object.entries(context.abilities)) {
			abl.label = CONFIG.BTW.abilities[a]?.label;
			abl.features = CONFIG.BTW.abilities[a]?.features.split(", ");
		}
		for (const [s, save] of Object.entries(context.saves)) {
			save.label = CONFIG.BTW.saves[s]?.label;
		}

		context.descriptionHTML = await TextEditor.enrichHTML(source.system.notes, {
			secrets: source.isOwner,
			async: true,
			relativeTo: this.actor,
			rollData: context.actor.getRollData()
		});

		this._prepareItems(context);

		return context;
	}

	_prepareItems(context) {
		context.skills = [];
		this.actor.items.forEach((i) => {
			if (i.type === "skill") {
				i.abl = CONFIG.BTW.abilities[i.system.ability]?.abbreviation;
				context.skills.push(i);
			}
		});
	}

	activateListeners(html) {
		super.activateListeners(html);

		if (!this.isEditable) return;

		html.find(".item-create").on("click", (ev) => {
			ev.preventDefault();
			const header = ev.currentTarget;
			const type = header.dataset.type;

			const itemData = {
				name: CONFIG.Item.documentClass.defaultName({ type, parent: this.actor }),
				type: type
			};
			this.actor.createEmbeddedDocuments("Item", [itemData], { renderSheet: true });
		});

		html.find(".item-edit").click((ev) => {
			const li = ev.currentTarget.closest(".item");
			const item = this.actor.items.get(li.dataset.itemId);
			item.sheet.render(true);
		});

		// Delete Inventory Item
		html.find(".item-delete").click((ev) => {
			const li = ev.currentTarget.closest(".item");
			this.actor.deleteEmbeddedDocuments("Item", [li.dataset.itemId]);
			this.render(false);
		});
	}
}
