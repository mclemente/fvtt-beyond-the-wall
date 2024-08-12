import FormulaField from "../../fields/formula-field.js";
import MappingField from "../../fields/mapping-field.js";

export default class ActorTemplateData extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const { fields } = foundry.data;
		return {
			abilities: new MappingField(new fields.SchemaField({
				value: new fields.NumberField({
					required: true, nullable: false, integer: true, min: 1, initial: 10
				}),
				max: new fields.NumberField({
					required: true, integer: true, nullable: true, min: 0, initial: null
				})
			}), {
				initialKeys: CONFIG.BTW.abilities, initialValue: this._initialAbilityValue.bind(this),
				initialKeysOnly: true
			}),
			ac: new fields.NumberField({ initial: 10, integer: true }),
			alignment: new fields.StringField({ initial: "neutrality" }),
			bab: new fields.NumberField({ nullable: false, integer: true, initial: 0 }),
			hd: new FormulaField({ initial: "0" }),
			hp: new fields.SchemaField({
				value: new fields.NumberField({ nullable: false, integer: true, min: 0, initial: 0 }),
				max: new fields.NumberField({ nullable: true, integer: true, min: 0, initial: null })
			}),
			initiative: new fields.NumberField({ nullable: false, integer: true, initial: 0 }),
			level: new fields.NumberField({ nullable: false, integer: true, min: 0, initial: 0 }),
			notes: new fields.HTMLField(),
			saves: new MappingField(new fields.SchemaField({
				value: new fields.NumberField({
					required: true, nullable: false, integer: true, min: 0, initial: 20
				}),
				max: new fields.NumberField({
					required: true, integer: true, nullable: true, min: 0, initial: null
				})
			}), {
				initialKeys: CONFIG.BTW.saves, initialValue: this._initialSaveValue.bind(this),
				initialKeysOnly: true
			}),
			xp: new fields.SchemaField({
				value: new fields.NumberField({ nullable: false, integer: true, min: 0, initial: 0 }),
				max: new fields.NumberField({ nullable: true, integer: true, min: 0, initial: null })
			})
		};
	}

	static _initialAbilityValue(key, initial, existing) {
		const config = CONFIG.BTW.abilities[key];
		if (config) {
			let defaultValue = config.defaults?.[this._systemType] ?? initial.value;
			if (typeof defaultValue === "string") defaultValue = existing?.[defaultValue]?.value ?? initial.value;
			initial.value = defaultValue;
		}
		return initial;
	}

	static _initialSaveValue(key, initial, existing) {
		const config = CONFIG.BTW.saves[key];
		if (config) {
			let defaultValue = config.defaults?.[this._systemType] ?? initial.value;
			if (typeof defaultValue === "string") defaultValue = existing?.[defaultValue]?.value ?? initial.value;
			initial.value = defaultValue;
		}
		return initial;
	}

	prepareAbilities() {
		for (const abl of Object.values(this.abilities)) {
			if (abl.value <= 1) abl.mod = -4;
			else if (abl.value <= 3) abl.mod = -3;
			else if (abl.value <= 5) abl.mod = -2;
			else if (abl.value <= 8) abl.mod = -1;
			else if (abl.value <= 12) abl.mod = 0;
			else if (abl.value <= 15) abl.mod = 1;
			else if (abl.value <= 17) abl.mod = 2;
			else abl.mod = 3;
		}
	}

	prepareDerivedData() {
		this.prepareAbilities();
	}
}
