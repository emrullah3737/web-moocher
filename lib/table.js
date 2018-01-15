const cheerio = require('cheerio');
const request = require('request-promise');
const error = require('./error');

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
  const { sort } = fields;
  let { count } = fields;
  let obj = {};

  $(selector).each(function a(i) {
    if (!count) count = sort.length;
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

module.exports = {

  getTable(args) {
    return new Promise((resolve, reject) => {
      const { selector, fields, url, slug } = args;
      if (!selector) return error.throw('please enter selector!');
      if (!fields) return error.throw('please enter field!');

      return loadBody(url)
        .then(($) => {
          if (!$) return error.throw('body is empty!');

          const param = {
            $,
            selector: `${selector} tr td`,
            fields,
            slug,
          };
          const data = htmlToObject(param);
          return resolve(data);
        })
        .catch(reject);
    });
  },
};
