export const preloadTemplates = async function () {
	const templatePaths = [
		"systems/beyond-the-wall/templates/actors/actor-sheet.hbs",
		"systems/beyond-the-wall/templates/actors/partials/actor-header.hbs",
		"systems/beyond-the-wall/templates/actors/partials/actor-item-display.hbs",

		"systems/beyond-the-wall/templates/items/partials/item-header.hbs",

		"systems/beyond-the-wall/templates/chat/item-card.hbs"
	];

	const paths = {};
	for (const path of templatePaths) {
		paths[path.replace(".hbs", ".html")] = path;
		paths[`btw.${path.split("/").pop()
			.replace(".hbs", "")}`] = path;
	}

	// Load the template parts
	return loadTemplates(paths);
};

/* -------------------------------------------- */
/*  Object Helpers                              */
/* -------------------------------------------- */

/**
 * Sort the provided object by its values or by an inner sortKey.
 * @param {object} obj        The object to sort.
 * @param {string} [sortKey]  An inner key upon which to sort.
 * @returns {object}          A copy of the original object that has been sorted.
 */
export function sortObjectEntries(obj, sortKey) {
	let sorted = Object.entries(obj);
	if (sortKey) sorted = sorted.sort((a, b) => a[1][sortKey].localeCompare(b[1][sortKey]));
	else sorted = sorted.sort((a, b) => a[1].localeCompare(b[1]));
	return Object.fromEntries(sorted);
}

export function registerHandlebarsHelpers() {
	Handlebars.registerHelper({
		"btw-formatDuration": (duration) => {
			let str = "";
			const { level, units, value } = duration;
			if (units) {
				if (units in CONFIG.BTW.scalarTimePeriods) {
					str = `${value} ${CONFIG.BTW.scalarTimePeriods[units]}`;
					if (level) str += "/Level";
				} else if (units in CONFIG.BTW.permanentTimePeriods) {
					str = CONFIG.BTW.permanentTimePeriods[units];
				} else return CONFIG.BTW.specialTimePeriods[units];
			}
			return str;
		}
	});
}

/* -------------------------------------------- */
/*  Config Pre-Localization                     */
/* -------------------------------------------- */

/**
 * Storage for pre-localization configuration.
 * @type {object}
 * @private
 */
const _preLocalizationRegistrations = {};

/**
 * Mark the provided config key to be pre-localized during the init stage.
 * @param {string} configKeyPath          Key path within `CONFIG.TRESDETV` to localize.
 * @param {object} [options={}]
 * @param {string} [options.key]          If each entry in the config enum is an object,
 *                                        localize and sort using this property.
 * @param {string[]} [options.keys=[]]    Array of localization keys. First key listed will be used for sorting
 *                                        if multiple are provided.
 * @param {boolean} [options.sort=false]  Sort this config enum, using the key if set.
 */
export function preLocalize(configKeyPath, { key, keys = [], sort = false } = {}) {
	if (key) keys.unshift(key);
	_preLocalizationRegistrations[configKeyPath] = { keys, sort };
}

/* -------------------------------------------- */

/**
 * Execute previously defined pre-localization tasks on the provided config object.
 * @param {object} config  The `CONFIG.TRESDETV` object to localize and sort. *Will be mutated.*
 */
export function performPreLocalization(config) {
	for (const [keyPath, settings] of Object.entries(_preLocalizationRegistrations)) {
		const target = foundry.utils.getProperty(config, keyPath);
		_localizeObject(target, settings.keys);
		if (settings.sort) foundry.utils.setProperty(config, keyPath, sortObjectEntries(target, settings.keys[0]));
	}
}

/* -------------------------------------------- */

/**
 * Localize the values of a configuration object by translating them in-place.
 * @param {object} obj       The configuration object to localize.
 * @param {string[]} [keys]  List of inner keys that should be localized if this is an object.
 * @private
 */
function _localizeObject(obj, keys) {
	for (const [k, v] of Object.entries(obj)) {
		const type = typeof v;
		if (type === "string") {
			obj[k] = game.i18n.localize(v);
			continue;
		}

		if (type !== "object") {
			console.error(
				new Error(
					`Pre-localized configuration values must be a string or object, ${type} found for "${k}" instead.`
				)
			);
			continue;
		}
		if (!keys?.length) {
			console.error(new Error("Localization keys must be provided for pre-localizing when target is an object."));
			continue;
		}

		for (const key of keys) {
			if (!v[key]) continue;
			v[key] = game.i18n.localize(v[key]);
		}
	}
}
