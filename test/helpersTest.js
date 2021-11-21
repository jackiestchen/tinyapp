const {assert} = require('chai');

const {getUserByEmail, appendLongURL, urlsForUser} = require('../helpers');

const testUsers = {
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

const urlDataBase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "st8cgg"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "st8cgg"}
};

describe('getUserByEmail', () => {
  it("should return a user with a valid email", () => {
    const user = "user@example.com";
    const expectedOutput = "userRandomID";

    assert.equal(getUserByEmail(user, testUsers), expectedOutput);
  });
});
describe('getUserByEmail', () => {
  it("should return a undefined with a invalid email", () => {
    const user = "user3@example.com";
    const expectedOutput = undefined;

    assert.isUndefined(getUserByEmail(user, testUsers), expectedOutput);
  });
});
describe('getUserByEmail', () => {
  it("should return a undefined with an empty email", () => {
    const user = "";
    const expectedOutput = undefined;

    assert.isUndefined(getUserByEmail(user, testUsers), expectedOutput);
  });
});

describe('appendLongURL', () => {
  it("should return http://www.google.com for www.google.com", () => {
    const originalString = "www.google.com";
    const expectedOutput = "http://www.google.com";

    assert.equal(appendLongURL(originalString), expectedOutput);
  });
});

describe('appendLongURL', () => {
  it("should return http://www.google.com for http://www.google.com", () => {
    const originalString = "http://www.google.com";
    const expectedOutput = "http://www.google.com";

    assert.equal(appendLongURL(originalString), expectedOutput);
  });
});

describe('urlsForUser', () => {
  it("should return urls for userid: st8cgg", () => {
    const userID = "st8cgg";
    const expectedOutput = `{"b2xVn2":"http://www.lighthouselabs.ca","9sm5xK":"http://www.google.com"}`;

    assert.equal(JSON.stringify(urlsForUser(userID, urlDataBase)), expectedOutput);
  });
});

describe('urlsForUser', () => {
  it("should return urls for userid: 123456", () => {
    const userID = "123456";
    const expectedOutput = "{}";
    assert.equal(JSON.stringify(urlsForUser(userID, urlDataBase)), expectedOutput);
  });
});

describe('urlsForUser', () => {
  it("should return urls for userid: ", () => {
    const userID = "";
    const expectedOutput = "{}";
    assert.equal(JSON.stringify(urlsForUser(userID, urlDataBase)), expectedOutput);
  });
});