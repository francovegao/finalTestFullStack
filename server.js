const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// const uri = process.env.ATLAS_URI;
const uri =
  'mongodb+srv://test_user:test@cluster0testfullstackdo.mxhexez.mongodb.net/testFinal';
mongoose.connect(uri);

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

const Schema = mongoose.Schema;

// Create a Schema object
const testSchema = new Schema(
  {
    name: { type: String, required: true },
    age: {type: String, required: true},
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  }
);

// This Activitry creates the collection called activitimodels
const Testmodel = mongoose.model('Testmodel', testSchema);

app.get('/', (req, res) => {
  Testmodel.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json('Error: ' + err));
});

app.post('/add', async (req, res) => {
  console.log(req.body.name)
  const name = req.body.name;
  const age = req.body.age;
  // create a new Activity object
  const newUser = await new Testmodel({
    name,
    age
  });
  console.log(newUser);
  // save the new object (newActivity)
  newUser
    .save()
    .then(() => res.json('User added!'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

app.get('/:id', (req, res) => {
  console.log('just id' + req.params.id);
  Testmodel.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json('Error: ' + err));
});

app.post('/update/:id', async (req, res) => {
  console.log(req.params.id);
  await Testmodel.findById(req.params.id)
    .then((userforedit) => {
      userforedit.name = req.body.name;
      userforedit.age = req.body.age;

      userforedit
        .save()
        .then(() => res.json('User updated!'))
        .catch((err) => res.status(400).json('Error: ' + err));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

app.delete('/delete/:id', async (req, res) => {
  console.log('delete logged');
  await Testmodel.findByIdAndDelete(req.params.id)
    .then(() => res.json('User deleted.'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
