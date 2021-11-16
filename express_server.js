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

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
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
  let userID = null;
  if (req.cookies["user_id"]) {
    userID = req.cookies["user_id"];
  }
  const templateVars = {
    user: users[userID],
    urls: urlDataBase };
  console.log(users);
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let userID = null;
  if (req.cookies["user_id"]) {
    userID = req.cookies["user_id"];
  }
  const templateVars = {
    user: users[userID],
    shortURL: req.params.shortURL,
    longURL: urlDataBase[req.params.shortURL]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let userID = null;
  if (req.cookies["user_id"]) {
    userID = req.cookies["user_id"];
  }
  const templateVars = {
    user: users[userID],
    shortURL: req.params.shortURL,
    longURL: urlDataBase[req.params.shortURL]
  };
  // console.log(templateVars);
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDataBase[shortURL] = appendLongURL(req.body.longURL);
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
  urlDataBase[req.params.id] = appendLongURL(req.body.longURL);
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  // res.cookie("user_id", req.body);
  // res.redirect(301, "/urls");
  let userID = null;
  if (req.cookies["user_id"]) {
    userID = req.cookies["user_id"];
  }
  const templateVars = {
    user: users[userID],
    shortURL: req.params.shortURL,
    longURL: urlDataBase[req.params.shortURL]
  };
  console.log(templateVars);
  console.log(users);
  res.render("login", templateVars);
});

app.get("/login", (req, res) => {
  let userID = null;
  if (req.cookies["user_id"]) {
    userID = req.cookies["user_id"];
  }
  const templateVars = {
    user: users[userID],
    shortURL: req.params.shortURL,
    longURL: urlDataBase[req.params.shortURL]
  };
  res.render("login", templateVars);
})

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/register", (req, res) => {
  let userID = null;
  if (req.cookies["user_id"]) {
    userID = req.cookies["user_id"];
  }
  const templateVars = {
    user: users[userID],
    shortURL: req.params.shortURL,
    longURL: urlDataBase[req.params.shortURL]
  };
  console.log(templateVars);
  console.log(users);
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  if (!isEmailValid(req.body.email) || !req.body.password) {
    res.redirect(400, "/register")
  } else {
  let newUserID = generateRandomString();
  users[newUserID] = {
    id: newUserID,
    email: req.body.email,
    password: req.body.password
  };
  res.cookie("user_id", newUserID);
  res.redirect(301, "/urls");
}
});


function generateRandomString() {
  return Math.random().toString(36).substr(2,6);
}

function appendLongURL(string) {
  string = string.toLowerCase();
  if (string.substr(0, 6) !== "http://") {
    return "http://" + string;
  }
  return string;
}

function isEmailValid(email) {
  if (!email) {
    return false;
  } else {
    for (const userID in users) {
      if (users[userID]["email"] === email)  {
        return false;
      }
    }
    return true;
  }
}