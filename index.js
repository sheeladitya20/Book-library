const express = require('express');
const app = express();
const Book = require('./models/book');
const booksRouter = require('./routes/books');
const authRouter = require('./routes/auth');
const categoriesRouter = require('./routes/categories');
const usersRouter = require('./routes/users');
var cors = require('cors')


var corsOptions = {
  origin: '*',
}

app.use(express.json());
app.use(cors(corsOptions))
app.use('/auth', authRouter);
app.use('/categories', categoriesRouter);


app.use('/books', booksRouter);
app.use('/user', usersRouter)



// Start the server 
app.listen(2030, () => {
    console.log(`Server is running on port 2030`);
  })