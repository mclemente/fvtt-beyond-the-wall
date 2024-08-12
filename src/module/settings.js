export default function registerSettings() {
	game.settings.register("beyond-the-wall", "simplified-saves", {
		name: "Simplified Saving Throws",
		scope: "world",
		config: true,
		type: Boolean,
		default: false,
		requiresReload: true
	});
}
