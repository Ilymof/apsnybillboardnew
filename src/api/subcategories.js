'use strict'

const db = require('db.js')
const subcategories = db('subcategory')

module.exports = {
  async 'read-all'() {
    return (await subcategories.read()).rows;
  },

  async 'read'({ id }) {
    return (await subcategories.read(Number(id))).rows;
  },

  async 'create'(data) {
    await subcategories.create(data);
  },

  async 'update'(id, data) {
    await subcategories.update(Number(id), data);
  },

  async 'delete'({ id }) {
    await subcategories.delete(Number(id));
  },
};
