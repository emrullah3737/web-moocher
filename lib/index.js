const error = require('./error');
const cheerio = require('cheerio');
const request = require('request-promise');


function loadBody(url) {
  return new Promise((resolve, reject) => {
    request.get(url)
      .then((body) => {
        const $ = cheerio.load(body);
        resolve($);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function htmlToObject(args) {
  const res = {};
  const array = [];
  const { $, selector, fields, slug } = args;
  const { sort, count } = fields;
  let obj = {};

  $(selector).each(function a(i) {
    const mod = i % count;
    if (sort[mod]) obj[sort[mod]] = $(this).text();
    if (mod === count - 1) {
      array.push(obj);
      obj = {};
    }
  });

  res[slug] = array;
  return res;
}

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
    return new Promise((resolve, reject) => {
      const { selector, fields } = args;
      if (!selector) return error.throw('please enter selector!');
      if (!fields) return error.throw('please enter field!');
      if (!this.isOK) return error.throw('please enter init parameters!');

      return loadBody(this.url)
        .then(($) => {
          if (!$) return error.throw('body is empty!');

          const param = {
            $,
            selector: `${selector} tr td`,
            fields,
            slug: this.slug,
          };
          const data = htmlToObject(param);
          return resolve(data);
        })
        .catch(reject);
    });
  }
};
