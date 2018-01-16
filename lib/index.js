const error = require('./error');
const Table = require('./table');
const Cron = require('./cron');

module.exports = class Mooch {
  constructor(args) {
    this.isOK = false;

    if (!args) return error.throw('please enter Mooch args!');
    const { url, slug } = args;

    if (!slug) return error.throw('please enter Mooch slug!');
    if (!url) return error.throw('please enter url!');

    this.url = url;
    this.slug = slug;
    this.isOK = true;

    return true;
  }


  getTable(args) {
    if (!this.isOK) return error.throw('please enter init parameters!');
    return Table.getTable(Object.assign(args, { slug: this.slug, url: this.url }));
  }

  getTablewithCron(args) {
    if (!this.isOK) return error.throw('please enter init parameters!');

    const { cron } = args;
    const { cronTime, timeZone, start } = cron;
    const tick = cron.onTick;

    const onTick = () => {
      Table.getTable(Object.assign(args, { slug: this.slug, url: this.url }))
        .then(tick)
        .catch(error.throw);
    };

    const crn = new Cron({ onTick, cronTime, timeZone, start });
    return crn;
  }
};
