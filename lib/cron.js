const { CronJob } = require('cron');

module.exports = class Cron extends CronJob {
  constructor(args) {
    const { cronTime, start = false, timeZone = 'Europe/Istanbul', onTick } = args;

    super({
      cronTime,
      onTick,
      start,
      timeZone,
    });
  }
};
