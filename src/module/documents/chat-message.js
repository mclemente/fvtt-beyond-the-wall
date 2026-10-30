/** Format system success/critical results on v13 and v14 chat HTML. */
export function highlightSuccessFailure(message, html) {
	if (!message.isRoll || !message.isContentVisible || !message.rolls?.length) return;
	const roll = message.rolls.find((r) => r instanceof CONFIG.Dice.RollBTW);
	if (!roll) return;
	const total = html.querySelector(".dice-total");
	if (!total) return;
	if (Number.isFinite(roll.options.target)) total.classList.add(roll.isSuccess ? "success" : "failure");
	if (roll.isCritical) total.classList.add("critical");
	else if (roll.isFumble) total.classList.add("fumble");
}
