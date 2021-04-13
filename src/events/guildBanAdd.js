const Event = require("../structures/Event");
const { SendModAction } = require("../utils/moderation/log");
const InfractionsManager = new (require("../utils/InfractionsManager"))

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	async run(guild, target) {
		// TODO
		// split the message for non audit log bans
		if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;

		const auditLog = await guild.fetchAuditLogs({ limit: 1, type: "MEMBER_BAN_ADD" });

		const banLog = auditLog.entries.first();
		let { executor, reason } = banLog;
		if (executor.id === this.client.user.id) return;
		if (reason === null) reason = await this.client.bulbutils.translate("global_no_reason", guild.id);

		const infId = await InfractionsManager.createInfraction(guild.id, "Manual ban", "false", reason, target.tag, target.id, executor.tag, executor.id);
		await SendModAction(this.client, guild, "manually banned", target, executor, reason, infId);
	}
};
