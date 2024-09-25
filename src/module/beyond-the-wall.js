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

	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("beyond-the-wall", applications.ActorSheetBTW, {
		makeDefault: true
	});

	Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("beyond-the-wall", applications.ItemSheetBTW, {
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

Hooks.on("renderChatLog", (app, html, data) => {
	documents.ItemBTW.chatListeners(html);
});

Hooks.on("renderChatMessage", documents.chat.onRenderChatMessage);
