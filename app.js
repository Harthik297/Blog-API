const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json()); 

const authenticateAuthor = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization === 'harthik') {
    next(); 
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

const logRequest = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

app.use(logRequest);

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
};

let blogs = [];
let authors = [];

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  authors.push({ username, password });
  res.json({ message: 'Author registered successfully' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const author = authors.find(a => a.username === username && a.password === password);
  if (author) {
    res.json({ token: 'harthik' }); 
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.use(authenticateAuthor); 
app.get('/blogs', (req, res) => {
  res.json(blogs);
});

app.post('/blogs', (req, res) => {
  const { title, content } = req.body;
  const authorId = req.headers['author-id']; 
  blogs.push({ title, content, authorId });
  res.json({ message: 'Blog created successfully' });
});

app.get('/blogs/:authorId', (req, res) => {
  const { authorId } = req.params;
  const authorBlogs = blogs.filter(blog => blog.authorId === authorId);
  res.json(authorBlogs);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
