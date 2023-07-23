//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/wikiDB");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const articleSchema = mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

//TODO
//---- Request targeting All articles ----
app.route("/articles")

.get(async(req, res) => {
  const foundArticles = await Article.find();
  console.log(foundArticles);
})

.post(async(req, res) => {
  console.log(req.body.title);
  console.log(req.body.content);

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save();
})

.delete(async(req, res) => {
  await Article.deleteMany();
  res.send("Successfully deleted all articles");
});

// ---- Request targeting a specific article ----
app.route("/articles/:articleTitle")

.get(async(req, res) => {
  const articleTitle = req.params.articleTitle;
  const foundArticle = await Article.findOne({title: articleTitle});
  res.send(foundArticle);
})

.put(async(req, res) => {
  const result = await Article.findOneAndUpdate(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true}
  );
  res.send("Successfully updated articles.");
})

.patch(async(req, res) => {
  const result = await Article.findOneAndUpdate(
    {title: req.params.articleTitle},
    {$set: req.body}
  );
  res.send("Successfully updated the selected articles.");
})

.delete(async(req, res) => {
  const result = await Article.deleteOne(
    {title: req.params.articleTitle}
  );

  res.send("Successfully deleted the selected articles");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});