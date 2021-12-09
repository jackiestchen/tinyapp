
// get userid by email address
const getUserByEmail = (email, database) => {
  if (!email) {
    return undefined;
  } else {
    for (const userID in database) {
      if (Object.hasOwnProperty.call(database, userID)) {
        const user = database[userID];
        if (user["email"] === email) {
          return user["id"];
        }
      }
    }
    return undefined;
  }
};

// generate a string of 6 random characters and numbers
const generateRandomString = () => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// append url if the user does not input http:// or https://
const appendLongURL = (string) => {
  string = string.toLowerCase();
  if (string.substr(0, 7) !== "http://" || string.substr(0, 8) !== "https://") {
    return "http://" + string;
  }
  return string;
};


// find user data by user id
const urlsForUser = (id, dataBase) => {
  let output = {};
  for (const shortID in dataBase) {
    if (Object.hasOwnProperty.call(dataBase, shortID)) {
      const element = dataBase[shortID];
      if (element.userID === id) {
        output[shortID] = element.longURL;
      }
    }
  }
  return output;
};

module.exports = {
  getUserByEmail,
  generateRandomString,
  appendLongURL,
  urlsForUser,
};
