const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const urlDataBase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDataBase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let cookieUsername = null;
  if (req.cookies["username"]) {
    cookieUsername = req.cookies["username"];
  }
  const templateVars = {
    username: cookieUsername,
    urls: urlDataBase };
  res.render("urls_index", templateVars);
});

app. get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    shortURL: req.params.shortURL,
    longURL: urlDataBase[req.params.shortURL]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    shortURL: req.params.shortURL,
    longURL: urlDataBase[req.params.shortURL]
  };
  // console.log(templateVars);
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDataBase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
  // console.log(urlDataBase);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDataBase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  // console.log(req.params);
  delete urlDataBase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  // console.log(req.params);
  res.redirect(`/urls/${req.params.shortURL}`);
});

app.post("/urls/:id", (req, res) => {
  // console.log(req.body, req.params.id);
  urlDataBase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  res.cookie("username", req.body);
  res.redirect(301, "/urls");
  // const templateVars = {
  //   username: req.cookies["username"],
  //   urls: urlDataBase
  // };
  // console.log(templateVars);
  // res.render("urls_index", templateVars);
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


function generateRandomString() {
  return Math.random().toString(36).substr(2,6);
}
