// eslint-disable-next-line no-unused-vars
export function highlightSuccessFailure(message, html, data) {
	if (!message.isRoll || !message.isContentVisible || !message.rolls.length) return;

	// Highlight rolls where the first part is a d20 roll
	let rollResult = message.rolls.find((r) => {
		return r.options.target;
	});
	if (!rollResult) return;

	// Highlight successes and failures
	if (rollResult.isSuccess) {
		html.find(".dice-total").addClass("success");
	} else {
		html.find(".dice-total").addClass("failure");
	}
	if (rollResult.isCritical) {
		html.find(".dice-total").addClass("critical");
	} else if (rollResult.isFumble) {
		html.find(".dice-total").addClass("fumble");
	}
}

export function onRenderChatMessage(app, html, data) {
	highlightSuccessFailure(app, html, data);
}
