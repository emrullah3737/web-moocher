const error = require('./error');
const Table = require('./table');

module.exports = class Mooch {
  constructor(slug) {
    if (!slug) return error.throw('please enter Mooch slug!');
    this.slug = slug;
    this.isOK = false;
    return true;
  }

  init(args) {
    if (!args) return error.throw('please enter Mooch args!');
    const { url } = args;

    if (!this.slug) return error.throw('please enter Mooch slug!');
    if (!url) return error.throw('please enter url!');

    this.url = url;
    this.isOK = true;
    return true;
  }

  getTable(args) {
    if (!this.isOK) return error.throw('please enter init parameters!');
    return Table.getTable(Object.assign(args, { slug: this.slug, url: this.url }));
  }
};
