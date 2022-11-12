const {Client} = require('pg');

// const client = new Client({
//     host: "localhost",
//     user: "rb",
//     port: 5432,
//     password: 'richbudget', //"21HU!!mk#",
//     database: "richbudget"
// })

const client = new Client({
    host: "localhost",
    user: "osdm",
    port: 5432,
    password: 'kvosdm007$', //"21HU!!mk#",
    database: "postgres"
})
module.exports = client