const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const { getUserByEmail, generateRandomString, appendLongURL, urlsForUser } = require('./helpers');


app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const urlDataBase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "st8cgg"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "st8cgg"}
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  },
  "st8cgg": {
    id: "st8cgg",
    email: "hello@world.com",
    password: bcrypt.hashSync("12345",10)
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
  if (users[req.session.user_id]) {
    let userID = req.session.user_id;
    const templateVars = {
      user: users[userID],
      urls: urlsForUser(userID, urlDataBase) };
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login?error=" + encodeURIComponent("Please_Login"));
  }

});

app.get("/urls/new", (req, res) => {
  if (users[req.session.user_id]) {
    let userID = req.session.user_id;
    const templateVars = {
      user: users[userID],
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login?error=" + encodeURIComponent("Please_Login"));
  }

});

app.get("/urls/:shortURL", (req, res) => {
  if (users[req.session.user_id]) {
    let userID = req.session.user_id;
    const templateVars = {
      user: users[userID],
      shortURL: req.params.shortURL,
      longURL: urlDataBase[req.params.shortURL]["longURL"]
    };
    res.render("urls_show", templateVars);
  } else {
    res.redirect("/login?error=" + encodeURIComponent("Please_Login"));
  }
});

app.post("/urls", (req, res) => {
  if (users[req.session.user_id]) {
    const shortURL = generateRandomString();
    urlDataBase[shortURL] = {
      longURL: appendLongURL(req.body.longURL),
      userID: req.session.user_id
    };
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.redirect("/login?error=" + encodeURIComponent("Please_Login"));
  }
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDataBase[req.params.shortURL]["longURL"];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (users[req.session.user_id]) {
    delete urlDataBase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.redirect("/login?error=" + encodeURIComponent("Please_Login"));
  }
});

app.post("/urls/:shortURL/edit", (req, res) => {
  if (users[req.session.user_id]) {
    res.redirect(`/urls/${req.params.shortURL}`);
  } else {
    res.redirect("/login?error=" + encodeURIComponent("Please_Login"));
  }
});

app.post("/urls/:id", (req, res) => {
  if (users[req.session.user_id]) {
    urlDataBase[req.params.id] = {
      longURL: appendLongURL(req.body.longURL),
      userID: req.session.user_id
    };
    res.redirect("/urls");
  } else {
    res.redirect("/login?error=" + encodeURIComponent("Please_Login"));
  }
});

app.post("/login", (req, res) => {
  let userID = null;
  const passwordCheck = (input, databasePassword) => {
    return bcrypt.compareSync(input, databasePassword);
  };
  if (!req.body.email) {
    res.status(403).send("Error 403 - Forbidden<br>Invalid email address!");
  } else {
    userID = getUserByEmail(req.body.email, users);
    if (!userID) {
      res.status(403).send("Error 403 - Forbidden<br>Cannot find email address!");
    } else if (!passwordCheck(req.body.password, users[userID]["password"])) {
      res.status(403).send("Error 403 - Forbidden<br>Wrong password!");
    } else {
      req.session.user_id = userID;
      res.redirect("/urls");
    }
  }

});

app.get("/login", (req, res) => {
  const templateVars = {
    user: null,
  };
  res.render("login", templateVars);
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: null,
  };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  
  if (!req.body.email) {
    res.status(400).send("400 BAD REQUEST<br>INVALID EMAIL ADDRESS");
  } else if (!req.body.password) {
    res.status(400).send("400 BAD REQUEST<br>INVALID PASSWORD");
  } else if (getUserByEmail(req.body.email, users)) {
    res.status(400).send("400 BAD REQUEST<br>EMAIL ALREADY EXITS.");
  } else  {
  
    let newUserID = generateRandomString();
    users[newUserID] = {
      id: newUserID,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password.toString(), 10)
    };
    req.session.user_id = newUserID;
    res.redirect("/urls");
  }

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

