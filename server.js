const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { getAllArticles, getArticleDetail, deleteArticle, likeArticle, addArticle, updateArticle } = require('./models/article_model.js');
const { escape, unescape } = require('html-escaper');
// const FloraEditor = require('wysiwyg-editor-node-sdk/lib/froalaEditor');
const FroalaEditor = require('wysiwyg-editor-node-sdk/lib/froalaEditor');
const path = require('path');
const port = 5000;
const multer = require('multer');

nunjucks.configure('views', {
  express: app
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// app.use(express.static('public'));
app.use('/public', express.static(__dirname + '/public'));

app.engine('html', nunjucks.render);
app.set('views', path.join(__dirname, "/views"));
app.set('view engine', 'html');

app.get('/', async (req, res) => {
  const articles = await getAllArticles();
  res.render('index.html', { articles });
});

app.get('/lang', async (req, res) => {
    const lang = req.query.lang;
    res.cookie('lang', lang, { expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)});
    if (req.originalUrl.includes(`/articles/${req.params.article_id}`)) {
        console.log(req.cookies.lang)
      if (req.cookies.lang === 'arabic') {
        const article_id = req.params.article_id;
        const article = await getArticleById(article_id);
        article.content = article.arabicContent;
        console.log(article);
        res.render('article.html', { article });
      } else {
        res.redirect(req.originalUrl.replace(req.cookies.lang, lang));
      }
    } else {
      res.send('Language updated successfully.');
    }
});
  

app.get('/articles/:article_id', async (req, res) => {
    const article_id = req.params.article_id;
    const article = await getArticleDetail(article_id);
    article.content = await unescape(article.content);
    if ((req.cookies.lang === 'arabic')) {
      // article.content = decodeURIComponent(escape(article.arabicContent));
      article.content = unescape(article.arabicContent);
    }
    res.render('article.html', { article });
});

// app.get('/articles/:id', async (req, res) => {
//     const id = req.params.id;
//     const article = await getArticleDetail(id);
//     if (req.cookies.lang === 'arabic') {
//       article.content = decodeURIComponent(escape(article.arabicContent));
//     }
//     res.render('article.html', { article });
// });

app.delete('/articles/:article_id', async (req, res) => {
  const articleId = req.params.article_id;
  const metadata = await deleteArticle(articleId);
  res.json(metadata);
});

app.put('/articles/:article_id/like', async (req, res) => {
    const article_id = req.params.article_id;
    const metadata = await likeArticle(article_id);
    res.json(metadata);
});

app.get('/new', (req, res) => {
  res.render('new_article.html');
});

app.post('/new', async (req, res) => {
  const article_data = {
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    content: req.body.content ? escape(req.body.content) : null,
    arabicContent: req.body.arabicContent ? escape(req.body.arabicContent) : null
  };
  const metadata = await addArticle(article_data);
  const redirectUrl = req.body.redirect || '/';
  res.redirect(redirectUrl);
//   res.json(metadata);
});

app.get('/edit/:id', async (req, res) => {
  const id = req.params.id;
  const article = await getArticleDetail(id);
  res.render('new_article.html', { article });
});

app.post('/edit/:id', async (req, res) => {
  const id = req.params.id;
  const article_data = {
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    content: req.body.content ? escape(req.body.content) : null,
    arabicContent: req.body.arabicContent ? escape(req.body.arabicContent) : null
  };
  const metadata = await updateArticle(id, article_data);
  res.redirect("/articles/" + id);
//   res.json(metadata);
});

const upload = multer({ dest: 'public/' });

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file was uploaded.');
    }
    const filePath = req.file.path;

    const fileUrl = `http://localhost:${port}/public/${req.file.filename}`;

    res.send({ link: fileUrl });
});
app.listen(port, function(){
    console.log(`server running at ${port}`);
});  
      
