const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const Filter = require('bad-words');
const Datastore = require('nedb');

const app = express();

const db = new Datastore('meows.db');
db.loadDatabase();

const filter = new Filter();

app.use(cors());
app.use(express.json({ limit: '1kb' }));

app.get('/', (req, res) => {
  res.json({
    message: 'Meow 🙀',
  });
});

app.get('/mews', (req, res, next) => {
  db.find({})
    .sort({ created: -1 })
    .exec(function (err, data) {
      if (err) {
        res.json({
          error: 'Nothing here 😿',
        });
        res.end();
        return;
      }
      res.json(data);
    });
});

app.use(
  rateLimit({
    windowMs: 30 * 1000,
    max: 3,
  })
);

function isValidMew(mew) {
  return (
    mew.name &&
    mew.name.toString().trim() !== '' &&
    mew.name.toString().trim().length <= 50 &&
    mew.content &&
    mew.content.toString().trim() !== '' &&
    mew.content.toString().trim().length <= 140
  );
}

app.post('/mews', (req, res) => {
  if (isValidMew(req.body)) {
    const mew = {
      name: filter.clean(req.body.name.toString()),
      content: filter.clean(req.body.content.toString()),
      created: new Date(),
    };

    db.insert(mew);
    res.json(mew);
  } else {
    res.status(422).json({
      message: 'Name and mew are required',
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
