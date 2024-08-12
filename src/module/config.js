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

export default BTW;
