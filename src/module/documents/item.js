export default class ItemBTW extends Item {
	static getDefaultArtwork(itemData) {
		if (itemData.type === "spell") {
			return { img: "systems/beyond-the-wall/assets/icons/svg/sparkles.svg" };
		} else if (itemData.type === "equipment") {
			return { img: "icons/svg/shield.svg" };
		} else if (itemData.type === "skill") {
			return { img: "icons/svg/skills.svg" };
		} else if (itemData.type === "weapon") {
			return { img: "icons/svg/sword.svg" };
		}
		return { img: this.DEFAULT_ICON };
	}

	getRollData({ deterministic=false }={}) {
		let data = { ...(this.actor?.getRollData({ deterministic }) ?? {}), item: { ...this.system } };
		if (data?.item) {
			data.item.flags = { ...this.flags };
			data.item.name = this.name;
		}
		return data;
	}

	getAttackToHit() {
		const rollData = this.getRollData();
		const parts = [];

		if (this.isOwned) {
			if (this.system.type === "melee") parts.push("@abilities.str.mod");
			else parts.push("@abilities.dex.mod");

			parts.push("@bab");
		}

		return { rollData, parts };
	}

	static chatListeners(html) {
		html.on("click", ".chat-card button[data-action]", async (event) => {
			event.preventDefault();

			// Extract card data
			const button = event.currentTarget;
			button.disabled = true;
			const card = button.closest(".chat-card");
			const action = button.dataset.action;

			const actor = await this._getChatCardActor(card);
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
		});
	}

	static async _getChatCardActor(card) {

		// Case 1 - a synthetic actor from a Token
		if (card.dataset.tokenId) {
			const token = await fromUuid(card.dataset.tokenId);
			if (!token) return null;
			return token.actor;
		}

		// Case 2 - use Actor ID directory
		const actorId = card.dataset.actorId;
		return game.actors.get(actorId) || null;
	}

	async displayCard(options = {}) {
		// Render the chat card template
		const token = this.actor.token;
		const templateData = {
			actor: this.actor,
			tokenId: token?.uuid || null,
			item: this,
			description: await TextEditor.enrichHTML(this.toObject().system.description, {
				async: true,
				relativeTo: this,
				rollData: this.getRollData()
			})
		};

		const html = await renderTemplate("systems/beyond-the-wall/templates/chat/item-card.hbs", templateData);

		// Create the ChatMessage data object
		const chatData = {
			user: game.user.id,
			type: CONST.CHAT_MESSAGE_STYLES.OTHER,
			content: html,
			flavor: this.system.chatFlavor || this.name,
			speaker: ChatMessage.getSpeaker({ actor: this.actor, token }),
			flags: { "core.canPopout": true }
		};

		// Apply the roll mode to adjust message visibility
		ChatMessage.applyRollMode(chatData, options.rollMode ?? game.settings.get("core", "rollMode"));

		// Create the Chat Message or return its data
		const card = options.createMessage !== false ? await ChatMessage.create(chatData) : chatData;

		return card;
	}

	async rollAttack() {
		// Get the parts and rollData for this item's attack
		const { parts, rollData } = this.getAttackToHit();
		let target;
		if (this.system.bonus) parts.push("@item.bonus");
		const targets = Array.from(game.user.targets);
		if (targets.length) {
			const { actor } = targets[0].document;
			if (actor) target = actor.system.ac;
		}

		const roll = new CONFIG.Dice.RollBTW(["1d20"].concat(parts).join(" + "), rollData, { target });

		if (roll === null) return null;

		await roll.toMessage({
			speaker: ChatMessage.getSpeaker({ actor: this.actor }),
			flavor: `${this.name} - ${game.i18n.localize("BTW.Attack")}`
		});
		return roll;
	}

	async rollDamage({ critical, event=null, options={} }={}) {
		// Get roll data
		const rollData = this.getRollData();

		const roll = new CONFIG.Dice.RollBTW(this.system.damage, rollData);

		if (roll === null) return null;

		await roll.toMessage({
			speaker: ChatMessage.getSpeaker({ actor: this.actor }),
			flavor: `${this.name} - ${game.i18n.localize("BTW.Damage")}`
		});
		return roll;
	}
}
