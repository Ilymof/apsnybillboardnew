'use strict'

const db = require('db.js')
const cities = db('city')
module.exports = {
  async 'read-all'() {
    return (await cities.read()).rows;
  },

  async 'read'({ id }) {
    return (await cities.read(id)).rows;
  },

  async 'create'(data) {
    await cities.create(data);
  },
  async 'update'(id, data) {
    await cities.update(id, data);
  },

  async 'delete'({ id }) {
    await cities.delete(id);
  },
};
