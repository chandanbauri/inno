const {Client} = require('pg');

const client = new Client({
    host: "localhost",
    user: "osdm",
    port: 5432,
    password: 'osdm007', //"21HU!!mk#",
    database: "postgres"
})

module.exports = client