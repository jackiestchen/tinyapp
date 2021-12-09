# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

### Login Page
!["Login"](https://github.com/jackiestchen/tinyapp/blob/master/doc/login.png?raw=true)

### Register Page
!["Register"](https://github.com/jackiestchen/tinyapp/blob/master/doc/register.png?raw=true)

### URL List Page
!["Show list of URLs"](https://github.com/jackiestchen/tinyapp/blob/master/doc/urls.png?raw=true)

### Create New URL Page
!["Create a new short URL"](https://github.com/jackiestchen/tinyapp/blob/master/doc/newUrl.png?raw=true)

### Edit URL Page
!["Edit URL"](https://github.com/jackiestchen/tinyapp/blob/master/doc/editUrl.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session


## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `npm run start` command.

- To login, go to: `http://localhost:8080/login`
- To register, go to: `http://localhost:8080/register`

- To see a list of urls or create a new, user must login or register first. 
- To directly access the url, follow this notation: `http://localhost:8080/u/shortURL`
- To edit url, go the `My URLs` tabs and click `Edit` button

