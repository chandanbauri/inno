const {Client} = require('pg');

const client = new Client({
    host: "localhost",
    user: "rb",
    port: 5432,
    password: 'richbudget', //"21HU!!mk#",
    database: "richbudget"
})

module.exports = client