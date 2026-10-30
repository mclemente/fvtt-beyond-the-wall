/** Foundry VTT 13/14 API differences, isolated from game rules. */
export const isV14 = () => Number(game.version?.split(".")[0] ?? game.release?.generation ?? 13) >= 14;

const legacyModes = { public: "publicroll", gm: "gmroll", blind: "blindroll", self: "selfroll" };
const modernModes = Object.fromEntries(Object.entries(legacyModes).map(([key, value]) => [value, key]));

export function getMessageMode(mode) {
    if (isV14()) return modernModes[mode] ?? mode ?? game.settings.get("core", "messageMode");
    return legacyModes[mode] ?? mode ?? game.settings.get("core", "rollMode");
}

export function messageOptions(mode) {
    const key = isV14() ? "messageMode" : "rollMode";
    return { [key]: getMessageMode(mode) };
}

export function applyMessageMode(data, mode) {
    if (isV14()) return ChatMessage.applyMode(data, getMessageMode(mode));
    return ChatMessage.applyRollMode(data, getMessageMode(mode));
}

/** v14 does not register default core Actor/Item sheets; v13 does. */
export function registerSheets(applications) {
    const actors = foundry.documents.collections.Actors;
    const items = foundry.documents.collections.Items;
    if (!isV14()) {
        actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
        items.unregisterSheet("core", foundry.appv1.sheets.ItemSheet);
    }
    actors.registerSheet("beyond-the-wall", applications.ActorSheetBTW, {
        types: ["character"], makeDefault: true
    });
    actors.registerSheet("beyond-the-wall", applications.NPCSheetBTW, {
        types: ["npc"], makeDefault: true
    });
    items.registerSheet("beyond-the-wall", applications.ItemSheetBTW, { makeDefault: true });
}
