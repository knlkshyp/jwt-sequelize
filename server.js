const express = require('express');
const db = require('./models');
const app = express();
const router = require('./routes/route');
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

db.sequelize.sync().then(() => {
    app.listen(port, () => { console.log(`Server up on ${port}`); });
});
