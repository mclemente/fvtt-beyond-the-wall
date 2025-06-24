import RollBTW from "../../dice/rolls.js";

export default class ActorSheetBTW extends foundry.appv1.sheets.ActorSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["btw", "sheet", "actor", "character"],
			width: 620,
			height: 750,
			scrollY: [".window-content"],
			tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }],
			dragDrop: [{ dragSelector: ".items-list .item" }]
		});
	}

	get template() {
		return "systems/beyond-the-wall/templates/actors/actor-sheet.hbs";
	}

	/**
	 * Blocklist of item types that shouldn't be added to the actor.
	 * @returns {Set<string>}
	 */
	get unsupportedItemTypes() {
		return new Set();
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

		const enrichmentOptions = {
			async: true,
			secrets: source.isOwner,
			rollData: this.actor?.getRollData() ?? {},
			relativeTo: this.actor
		};

		for (const [a, abl] of Object.entries(context.abilities)) {
			abl.label = CONFIG.BTW.abilities[a]?.label;
			abl.features = CONFIG.BTW.abilities[a]?.features.split(", ");
		}
		for (const [s, save] of Object.entries(context.saves)) {
			save.label = CONFIG.BTW.saves[s]?.label;
		}

		context.descriptionHTML = await TextEditor.enrichHTML(source.system.notes, enrichmentOptions);

		this._prepareItems(context);

		if (context.class) {
			context.abilitiesHTML = await TextEditor.enrichHTML(context.class.system.abilities, enrichmentOptions);
		}

		return context;
	}

	_prepareItems(context) {
		context.favorites = [];
		context.itemList = {
			weapon: [],
			equipment: [],
			loot: [],
			spell: [],
			trait: []
		};
		context.skills = [];
		context.items.forEach((i) => {
			if (i.type === "class") {
				context.class = i;
			} else if (i.type === "skill") {
				i.abl = CONFIG.BTW.abilities[i.system.ability]?.abbreviation;
				context.skills.push(i);
			} else context.itemList[i.type].push(i);
			if (i.system.favorite) context.favorites.push(i);
		});
	}

	activateListeners(html) {
		super.activateListeners(html);

		if (!this.isEditable) return;

		html.find("[data-ability] .rollable").on("click", async (ev) => {
			const { ability } = ev.target.closest(".ability").dataset;
			const abl = this.actor.system.abilities[ability];
			const roll = await new RollBTW("1d20", this.actor.getRollData(), { target: abl.value, rollUnder: true }).evaluate();
			roll.toMessage({
				speaker: ChatMessage.getSpeaker({ actor: this.actor }),
				flavor: CONFIG.BTW.abilities[ability].label,
				rollMode: game.settings.get("core", "rollMode")
			});
		});

		html.find("[data-save] .rollable").on("click", async (ev) => {
			const { save } = ev.target.closest(".save").dataset;
			const s = this.actor.system.saves[save];
			const roll = await new RollBTW("1d20", this.actor.getRollData(), { target: s.value }).evaluate();
			roll.toMessage({
				speaker: ChatMessage.getSpeaker({ actor: this.actor }),
				flavor: CONFIG.BTW.saves[save].label,
				rollMode: game.settings.get("core", "rollMode")
			});
		});

		html.find("[data-action] .item-image").on("click", (ev) => {
			ev.preventDefault();
			const itemId = ev.currentTarget.closest(".item").dataset.itemId;
			const item = this.actor.items.get(itemId);
			return item.displayCard(ev);
		});

		html.find(".item-rollable").on("click", async (ev) => {
			const { itemId } = ev.target.closest(".item").dataset;
			const item = this.actor.items.get(itemId);
			const { ability, bonus } = item.system;
			if (!ability) return;
			const abl = this.actor.system.abilities[ability];
			const roll = await new RollBTW("1d20", this.actor.getRollData(), { target: abl.value + bonus, rollUnder: true }).evaluate();
			const formattedBonus = bonus >= 0 ? `+${bonus}` : `-${bonus}`;
			roll.toMessage({
				speaker: ChatMessage.getSpeaker({ actor: this.actor }),
				flavor: `${item.name} (${CONFIG.BTW.abilities[ability].label} ${formattedBonus})`,
				rollMode: game.settings.get("core", "rollMode")
			});
		});

		html.find(".item-favorite").on("click", (ev) => {
			ev.preventDefault();
			const li = ev.currentTarget.closest(".item");
			const item = this.actor.items.get(li.dataset.itemId);
			item.update({ "system.favorite": !item.system.favorite });
		});

		html.find(".item-equip").on("click", (ev) => {
			ev.preventDefault();
			const li = ev.currentTarget.closest(".item");
			const item = this.actor.items.get(li.dataset.itemId);
			item.update({ "system.equipped": !item.system.equipped });
		});

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

	async _onDropItemCreate(itemData) {
		const items = Array.isArray(itemData) ? itemData : [itemData];
		const toCreate = items.filter((item) => !this.unsupportedItemTypes.has(item.type));
		// Create the owned items as normal
		return this.actor.createEmbeddedDocuments("Item", toCreate);
	}
}
