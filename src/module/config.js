import { preLocalize } from "./utils.js";

const BTW = {};

BTW.abilities = {
	str: {
		label: "BTW.Ability.Str.Label",
		abbreviation: "BTW.Ability.Str.Abbr",
		features: "BTW.Ability.Str.Features"
	},
	dex: {
		label: "BTW.Ability.Dex.Label",
		abbreviation: "BTW.Ability.Dex.Abbr",
		features: "BTW.Ability.Dex.Features"
	},
	con: {
		label: "BTW.Ability.Con.Label",
		abbreviation: "BTW.Ability.Con.Abbr",
		features: "BTW.Ability.Con.Features"
	},
	int: {
		label: "BTW.Ability.Int.Label",
		abbreviation: "BTW.Ability.Int.Abbr",
		features: "BTW.Ability.Int.Features"
	},
	wis: {
		label: "BTW.Ability.Wis.Label",
		abbreviation: "BTW.Ability.Wis.Abbr",
		features: "BTW.Ability.Wis.Features"
	},
	cha: {
		label: "BTW.Ability.Cha.Label",
		abbreviation: "BTW.Ability.Cha.Abbr",
		features: "BTW.Ability.Cha.Features"
	}
};

preLocalize("abilities", { keys: ["label", "abbreviation", "features"] });

BTW.alignments = {
	law: {
		label: "BTW.Alignments.Law.Label"
	},
	chaos: {
		label: "BTW.Alignments.Chaos.Label"
	},
	neutral: {
		label: "BTW.Alignments.Neutral.Label"
	}
};

preLocalize("alignments", { keys: ["label"] });

BTW.armorTypes = {
	light: "BTW.Equipment.Light",
	medium: "BTW.Equipment.Medium",
	heavy: "BTW.Equipment.Heavy",
	natural: "BTW.Equipment.Natural",
	shield: "BTW.Equipment.Shield"
};
preLocalize("armorTypes");

BTW.itemTypes = {
	equipment: "BTW.Item.Equipment",
	loot: "BTW.Item.Loot",
	spell: "BTW.Item.Spell",
	trait: "BTW.Item.Trait",
	weapon: "BTW.Item.Weapon"
};
preLocalize("itemTypes");

BTW.saves = {
	poison: {
		label: "BTW.Save.Poison.Label"
	},
	spell: {
		label: "BTW.Save.Spell.Label"
	},
	breath: {
		label: "BTW.Save.Breath.Label"
	},
	magicItem: {
		label: "BTW.Save.MagicItem.Label"
	},
	polymorph: {
		label: "BTW.Save.Polymorph.Label"
	},
	fortitude: {
		label: "BTW.Save.Fortitude.Label"
	},
	reflex: {
		label: "BTW.Save.Reflex.Label"
	},
	will: {
		label: "BTW.Save.Will.Label"
	}
};

preLocalize("saves", { keys: ["label"] });

BTW.ranges = {
	self: "Self",
	touch: "Touch",
	near: "Near",
	far: "Far",
	cosmos: "the Cosmos"
};

BTW.scalarTimePeriods = {
	turn: "BTW.TimeTurn",
	round: "BTW.TimeRound",
	minute: "BTW.TimeMinute",
	hour: "BTW.TimeHour",
	day: "BTW.TimeDay",
	month: "BTW.TimeMonth",
	year: "BTW.TimeYear"
};

preLocalize("scalarTimePeriods");

BTW.permanentTimePeriods = {
	conc: "BTW.TimeConcentration",
	perm: "BTW.TimePerm"
};
preLocalize("permanentTimePeriods");

BTW.specialTimePeriods = {
	inst: "BTW.TimeInst"
	// spec: "BTW.Special"
};
preLocalize("specialTimePeriods");

BTW.weaponTypes = {
	melee: "BTW.Weapon.Melee",
	ranged: "BTW.Equipment.Ranged"
};
preLocalize("weaponTypes");

export default BTW;
