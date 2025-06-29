import * as applications from "./applications/_module.js";
import * as dataModels from "./data/_module.js";
import * as dice from "./dice/_module.js";
import * as documents from "./documents/_module.js";
import * as utils from "./utils.js";

import BTW from "./config.js";

import registerSettings from "./settings.js";

globalThis.btw = {
	// applications,
	config: BTW,
	dice,
	dataModels,
	documents,
	utils
};

Hooks.once("init", function () {
	globalThis.btw = game.btw = Object.assign(game.system, globalThis.btw);
	CONFIG.BTW = BTW;
	CONFIG.Dice.RollBTW = dice.RollBTW;
	CONFIG.Dice.rolls.push(dice.RollBTW);

	CONFIG.Actor.dataModels.character = dataModels.CharacterData;
	CONFIG.Actor.dataModels.npc = dataModels.NpcData;

	CONFIG.Item.dataModels.class = dataModels.ClassData;
	CONFIG.Item.dataModels.equipment = dataModels.EquipmentData;
	CONFIG.Item.dataModels.loot = dataModels.ItemTemplate;
	CONFIG.Item.dataModels.skill = dataModels.SkillData;
	CONFIG.Item.dataModels.spell = dataModels.SpellData;
	CONFIG.Item.dataModels.trait = dataModels.EquipmentData;
	CONFIG.Item.dataModels.weapon = dataModels.WeaponData;

	CONFIG.Actor.documentClass = documents.ActorBTW;
	CONFIG.Item.documentClass = documents.ItemBTW;

	foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
	foundry.documents.collections.Actors.registerSheet("beyond-the-wall", applications.ActorSheetBTW, {
		types: ["character"],
		makeDefault: true
	});
	foundry.documents.collections.Actors.registerSheet("beyond-the-wall", applications.NPCSheetBTW, {
		types: ["npc"],
		makeDefault: true
	});

	foundry.documents.collections.Items.unregisterSheet("core", foundry.appv1.sheets.ItemSheet);
	foundry.documents.collections.Items.registerSheet("beyond-the-wall", applications.ItemSheetBTW, {
		makeDefault: true
	});

	registerSettings();

	if (game.settings.get("beyond-the-wall", "simplified-saves")) {
		delete CONFIG.BTW.saves.poison;
		delete CONFIG.BTW.saves.spell;
		delete CONFIG.BTW.saves.breath;
		delete CONFIG.BTW.saves.magicItem;
		delete CONFIG.BTW.saves.polymorph;
	} else {
		delete CONFIG.BTW.saves.fortitude;
		delete CONFIG.BTW.saves.reflex;
		delete CONFIG.BTW.saves.will;
	}

	utils.registerHandlebarsHelpers();
	utils.preloadTemplates();
});

Hooks.once("i18nInit", () => utils.performPreLocalization(CONFIG.BTW));

Hooks.on("renderChatMessage", documents.chat.onRenderChatMessage);
Hooks.on("renderChatMessageHTML", (_app, html) => {
	html.querySelectorAll(".chat-card button[data-action]")
		.forEach((button) => button.addEventListener("click", async (event) => {
			event.preventDefault();

			// Extract card data
			const button = event.currentTarget;
			button.disabled = true;
			const card = button.closest(".chat-card");
			const action = button.dataset.action;

			const actor = await documents.ItemBTW._getChatCardActor(card);
			if (!actor) return;

			let item = actor.items.get(card.dataset.itemId);
			if (!item) return null;

			switch (action) {
				case "attack":
					await item.rollAttack({ event });
					break;
				case "damage":
					await item.rollDamage({ event });
					break;
			}

			button.disabled = false;
		}));
});
