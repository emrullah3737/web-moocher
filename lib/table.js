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
  const array = [];
  const { $, selector, fields } = args;
  const { sort } = fields;
  let { count } = fields;
  let obj = {};

  $(`${selector} tr td`).each(function a(i) {
    if (!count) count = sort.length;
    const mod = i % count;
    if (sort[mod]) obj[sort[mod]] = $(this).text();
    if (mod === count - 1) {
      array.push(obj);
      obj = {};
    }
  });

  return array;
}

function dataQueryProcess(args) {
  const { pureData, param } = args;
  const { fields, slug } = param;
  const { limit, skip } = fields;
  const res = {};

  if (skip) pureData.splice(0, skip);
  const l = pureData.length;
  if (limit) pureData.splice(-(l - limit), (l - limit));
  res[slug] = pureData;
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
            selector,
            fields,
            slug,
          };
          const pureData = htmlToObject(param);
          return resolve(dataQueryProcess({ pureData, param }));
        })
        .catch(reject);
    });
  },
};
