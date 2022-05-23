const { attachPaginate } = require('knex')
const knex = require('knex')(require('../knexfile').development)

// attachPaginate()

module.exports = knex
