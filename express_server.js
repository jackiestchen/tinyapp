const express = require("express");
const app = express();
const morgan = require('morgan')
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const path = require("path");
const {
  getUserByEmail,
  generateRandomString,
  appendLongURL,
  urlsForUser,
} = require("./helpers");

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const urlDataBase = {
  b2xVn2: { longURL: "http://www.lighthouselabs.ca", userID: "st8cgg" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "st8cgg" },
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10),
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10),
  },
  st8cgg: {
    id: "st8cgg",
    email: "hello@world.com",
    password: bcrypt.hashSync("12345", 10),
  },
};

// GET /
app.get("/", (req, res) => {
  return res.send("Hello!");
});

// GET /urls.json
app.get("/urls.json", (req, res) => {
  return res.json(urlDataBase);
});

// GET /hello
app.get("/hello", (req, res) => {
  return res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// GET /urls
app.get("/urls", (req, res) => {
  if (users[req.session.user_id]) {
    let userID = req.session.user_id;
    const templateVars = {
      user: users[userID],
      urls: urlsForUser(userID, urlDataBase),
    };
    return res.render("urls_index", templateVars);
  }
  return res.redirect("/login?error=" + encodeURIComponent("Please_Login"));
});

// GET /urls/new
app.get("/urls/new", (req, res) => {
  if (users[req.session.user_id]) {
    let userID = req.session.user_id;
    const templateVars = {
      user: users[userID],
    };
    return res.render("urls_new", templateVars);
  }
  return res.redirect("/login?error=" + encodeURIComponent("Please_Login"));
});

// GET /urls/:shortURL
app.get("/urls/:shortURL", (req, res) => {
  if (users[req.session.user_id]) {
    let userID = req.session.user_id;
    const templateVars = {
      user: users[userID],
      shortURL: req.params.shortURL,
      longURL: urlDataBase[req.params.shortURL]["longURL"],
    };
    return res.render("urls_show", templateVars);
  }
  return res.redirect("/login?error=" + encodeURIComponent("Please_Login"));
});

// POST /urls (create new url)
app.post("/urls", (req, res) => {
  if (users[req.session.user_id]) {
    const shortURL = generateRandomString();
    urlDataBase[shortURL] = {
      longURL: appendLongURL(req.body.longURL),
      userID: req.session.user_id,
    };
    return res.redirect(`/urls/${shortURL}`);
  }
  return res.redirect("/login?error=" + encodeURIComponent("Please_Login"));
});

// GET /u/shortULR (redirect to URL)
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDataBase[req.params.shortURL]["longURL"];
  res.redirect(longURL);
});

// GET /urls/:shortURL/delete (delete URL)
app.post("/urls/:shortURL/delete", (req, res) => {
  if (users[req.session.user_id]) {
    delete urlDataBase[req.params.shortURL];
    return res.redirect("/urls");
  }
  return res.redirect("/login?error=" + encodeURIComponent("Please_Login"));
});

// POST /urls/:id/edit (edit URL)
app.post("/urls/:id/edit", (req, res) => {
  if (users[req.session.user_id]) {
    urlDataBase[req.params.id] = {
      longURL: appendLongURL(req.body.longURL),
      userID: req.session.user_id,
    };
    return res.redirect("/urls");
  }
  return res.redirect("/login?error=" + encodeURIComponent("Please_Login"));
});

// POST /login
app.post("/login", (req, res) => {
  let userID = null;
  const passwordCheck = (input, databasePassword) => {
    return bcrypt.compareSync(input, databasePassword);
  };
  if (!req.body.email) {
    return res
      .status(403)
      .send("Error 403 - Forbidden<br>Invalid email address!");
  } else {
    userID = getUserByEmail(req.body.email, users);
    if (!userID) {
      return res
        .status(403)
        .send("Error 403 - Forbidden<br>Cannot find email address!");
    } else if (!passwordCheck(req.body.password, users[userID]["password"])) {
      return res.status(403).send("Error 403 - Forbidden<br>Wrong password!");
    }
    req.session.user_id = userID;
    return res.redirect("/urls");
  }
});

// GET /login
app.get("/login", (req, res) => {
  const templateVars = {
    user: null,
  };
  return res.render("login", templateVars);
});

// POST /logout
app.post("/logout", (req, res) => {
  req.session = null;
  return res.redirect("/login");
});

// GET /register
app.get("/register", (req, res) => {
  const templateVars = {
    user: null,
  };
  return res.render("register", templateVars);
});

// POST /register
app.post("/register", (req, res) => {
  if (!req.body.email) {
    return res.status(400).sendFile("400 BAD REQUEST<br>INVALID EMAIL ADDRESS");
  } else if (!req.body.password) {
    return res.status(400).send("400 BAD REQUEST<br>INVALID PASSWORD");
  } else if (getUserByEmail(req.body.email, users)) {
    return res.status(400).send("400 BAD REQUEST<br>EMAIL ALREADY EXITS.");
  } else {
    let newUserID = generateRandomString();
    users[newUserID] = {
      id: newUserID,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password.toString(), 10),
    };
    req.session.user_id = newUserID;
    return res.redirect("/urls");
  }
});

// GET * (page not found)
app.get("*", (req, res) => {
  const fileName = "404.jpeg";
  const options = {
    root: path.join(__dirname, "./pic"),
  };
  return res.status(404).sendFile(fileName, options, (err) => {
    if (err) {
      next(err);
    } else {
      console.log("Sent: ", fileName);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
