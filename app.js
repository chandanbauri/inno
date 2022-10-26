const client = require('./connection.js');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require("multer");
const fs = require('fs');
const path = require('path')
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");
const cheerio = require("cheerio");

const httpServer = createServer(app);
const io = new Server(httpServer, {});

io.on("connection", (socket) => {
    console.log('websocket initialised');
});

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + "/uploads/");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        req.file_path = `/admin-${file.fieldname}-${Date.now()}.${ext}`
        cb(null, `/admin-${file.fieldname}-${Date.now()}.${ext}`);
    },
});
const upload = multer({
    storage: multerStorage
});

httpServer.listen(3300, async () => {
    try {

        await client.connect();
    } catch (error) {
        throw error
    }
    console.log("Sever is now listening at port 3300");
});

//App Parser
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// Static Files
app.use(express.static("public"))
app.use(express.static("uploads"));
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/media', express.static(__dirname + 'public/media'))
app.use('/plugins', express.static(__dirname + 'public/plugins'))

// Set View's
app.set('views', './views');
app.set('view engine', 'ejs');



// Navigation
app.get('/', async (req, res) => {
    let getLastEntry = 'select * from innoappspoc ORDER BY timestamp DESC limit 1;'
    let response = await client.query(getLastEntry, []);
    let lastEntry = response.rows[0]
    // console.log(cheerio.load(lastEntry?.message, null, false).html());
    res.render('imageview', {
        text: lastEntry?.message == '' ? '' : cheerio.load(lastEntry?.message, null, false).html(),
        url: lastEntry?.yt === '' ? '' : lastEntry?.yt + '?autoplay=1',
        image: lastEntry?.imageurl == '' ? '' : path.join('uploads', lastEntry?.imageurl)
    });
});

app.post('/imageview', upload.array("files"), async (req, res) => {
    console.log(req.body);
    console.log(req.files);
    let innoappspoc = {
        id: '',
        imageurl: req.file_path ?? '',
        message: req.body.text ?? '',
        yt: req.body.url ?? ''
    }
    let insertQuery = `insert into innoappspoc (imageurl, message, yt) values ( $1, $2,$3);`

    await client.query(insertQuery, [innoappspoc.imageurl, innoappspoc.message, innoappspoc.yt])
    io.emit('entry-load');
    client.end;
    res.json({
        text: req.body.text,
        yt: req.body.url,
        image: req.file_path,
    });

});

app.get('/enter', (req, res) => {
    res.render('enter');
});

//testing api
app.post('/users', (req, res) => {
    const user = req.body;
    let insertQuery = `insert into innoappspoc (id, imageurl, message, yt) 
                       values(${innoappspoc.id}, '${innoappspoc.imageurl}', '${innoappspoc.message}', '${innoappspoc.yt}')`

    client.query(insertQuery, (err, result) => {
        if (!err) {
            res.send('Insertion was successful')
        }
        else { console.log(err.message) }
    })
    client.end;
})





app.post('/users', (req, res) => {
    const user = req.body;
    let insertQuery = `insert into innoappspoc (id, imageurl, message, yt) 
                       values(${innoappspoc.id}, '${innoappspoc.imageurl}', '${innoappspoc.message}', '${innoappspoc.yt}')`

    client.query(insertQuery, (err, result) => {
        if (!err) {
            res.send('Insertion was successful')
        }
        else { console.log(err.message) }
    })
    client.end;
})

app.put('/users/:id', (req, res) => {
    let user = req.body;
    let updateQuery = `update users
                       set firstname = '${user.firstname}',
                       lastname = '${user.lastname}',
                       location = '${user.location}'
                       where id = ${user.id}`

    client.query(updateQuery, (err, result) => {
        if (!err) {
            res.send('Update was successful')
        }
        else { console.log(err.message) }
    })
    client.end;
})

app.delete('/users/:id', (req, res) => {
    let insertQuery = `delete from users where id=${req.params.id}`

    client.query(insertQuery, (err, result) => {
        if (!err) {
            res.send('Deletion was successful')
        }
        else { console.log(err.message) }
    })
    client.end;
})