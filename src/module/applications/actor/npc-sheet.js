import ActorSheetBTW from "./base-actor-sheet.js";

export default class NPCSheetBTW extends ActorSheetBTW {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["btw", "sheet", "actor", "npc"],
			height: 600,
			scrollY: [".window-content"],
			tabs: [],
			dragDrop: [{ dragSelector: ".items-list .item" }]
		});
	}

	get template() {
		return "systems/beyond-the-wall/templates/actors/npc-sheet.hbs";
	}

	/**
	 * Blocklist of item types that shouldn't be added to the actor.
	 * @returns {Set<string>}
	 */
	get unsupportedItemTypes() {
		return new Set(["skill", "traits"]);
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
		context.itemList = {
			weapon: []
		};
		context.skills = [];
		context.items.filter((i) => i.type === "weapon")
			.forEach((i) => {
				context.itemList[i.type].push(i);
			});
	}
}
