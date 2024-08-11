
export default class ActorBTW extends Actor {
	async _preCreate(data, options, user) {
		await super._preCreate(data, options, user);

		const changes = {};
		const compendiumSource = this._stats.compendiumSource;
		if (!compendiumSource?.startsWith("Compendium.")) {
			if (this.baseType === "character") {
				changes.prototypeToken = {
					actorLink: true,
					disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY
				};
			}
		}
		this.updateSource(changes);
	}
}
