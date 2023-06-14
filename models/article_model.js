const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database("articles_store.db3", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log(err.message);

    }else{
        console.log('Connection established');
    }
    
});

function getAllArticles() {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM articles`;
  
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
}

function getArticleDetail(article_id) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM articles WHERE id = ?`;
        db.get(sql, [article_id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

function addArticle(article_data) {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO articles (title, author, description, content, arabicContent) VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [article_data.title, article_data.author, article_data.description, article_data.content, article_data.arabicContent], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    id: this.lastID,
                    rowsAffected: this.changes
                });
            }
        });
    });
}


function updateArticle(article_id, data) {
    return new Promise((resolve, reject) => {
      let sql = `UPDATE articles SET title = ?, author = ?, description = ?, content = ?, arabicContent = ? WHERE id = ?`;
      db.run(sql, [data.title, data.author, data.description, data.content, data.arabicContent, article_id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            rowsAffected: this.changes
          });
        }
      });
    });
  }
  

function deleteArticle(article_id) {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM articles WHERE id = ?`;
        db.run(sql, [article_id], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    rowsAffected: this.changes
                });
            }
        });
    });
}

function likeArticle(article_id) {
    return new Promise((resolve, reject) => {
        let sql = `UPDATE articles SET likes = likes + 1 WHERE id = ?`;
        db.run(sql, [article_id], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    rowsAffected: this.changes
                });
            }
        });
    });
}



module.exports = {
    getAllArticles: getAllArticles,
    getArticleDetail: getArticleDetail,
    addArticle: addArticle,
    updateArticle: updateArticle,
    deleteArticle: deleteArticle,
    likeArticle: likeArticle
};


