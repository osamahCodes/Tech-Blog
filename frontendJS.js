// import FroalaEditor from 'https://cdn.jsdelivr.net/npm/froala-editor@latest/js/froala_editor.pkgd.min.js';
// var editor = new FroalaEditor('#Content')
// console.log(Content);
// var editor = new FroalaEditor
// ('#Content').FroalaEditor();



window.onload = function() {

    function setLanguage() {
        selectedLanguage = language.value;
        if (selectedLanguage == "arabic") {
            link.setAttribute('href', 'style arabic.css');
        }
        else{
            link.setAttribute('href', 'style.css');
        }
        localStorage.setItem("language", selectedLanguage);

        // Send AJAX GET request to update language setting on server
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/lang?lang=${selectedLanguage}`);
        xhr.send();
    }

    function likeArticle(e) {
        displayValue += 1;
        like_button.innerHTML = '<img src="like-plus.png" alt="like">'+displayValue.toString();
    
        // Send AJAX PUT request to update article like count on server
        const articleId = e.currentTarget.getAttribute('data-article-id');
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', `/articles/${articleId}/like`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const metadata = JSON.parse(xhr.responseText);
            }
        };
        xhr.send(JSON.stringify({ articleId: articleId }));
    };
    
    var like_button = document.querySelector("#like_plus");
    if(like_button != null){
        var like_img = like_button.querySelector("img");
        var displayValue = parseInt(like_button.textContent, 10);
        like_button.addEventListener('click', (e) =>{
            e.stopPropagation();
            likeArticle(e);
        });
        like_img.addEventListener('click', (e) =>{
            e.stopPropagation();
            likeArticle(e);
        });
    }

    var link = document.getElementById('stylesheet');
    var language = document.getElementById("lang");
    var selectedLanguage = language.value;
    var Content = document.querySelectorAll("#Content");
    var defaultContent = document.querySelector("#Content");
    var ArabicContent = document.querySelectorAll("#ArabicContent");

    Content.forEach((e) => {
        initform(e);
    });
    ArabicContent.forEach((e) => {
        arabicinitform(e);
    });
    function arabicinitform(e){
        var editor = new FroalaEditor(e, {
            imageUpload: true,
            fileUpload: true,
            imageUploadURL: '/upload',
            fileUploadURL: '/upload'
        });
    }

    function initform(e){
        var editor = new FroalaEditor(e, {
            imageUpload: true,
            fileUpload: true,
            imageUploadURL: '/upload',
            fileUploadURL: '/upload'
        });

        var form = document.querySelector("form");
        var realE = e;

        form.addEventListener("submit", (e) => {
            if(realE==defaultContent){
                if(editor.html.get().length<10){
                    e.preventDefault();
                    alert("Content must be at least 10 characters long");
                }
            }
        });
    }

    var deleteButtons = document.querySelectorAll('#delete');
    deleteButtons.forEach(button => {
        deleteArticle(button);
    });

    function deleteArticle(button){
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            if (confirm("Are you sure to delete this article?")){
                const articleId = button.getAttribute('data-article-id');
                console.log(articleId);

                // Send AJAX DELETE request to delete article on server
                const xhr = new XMLHttpRequest();
                xhr.open('DELETE', `/articles/${articleId}`);
                xhr.send();

                var card = button.closest('.card');
                card.remove();
            }
        });
    }

    var deleteAnchors = document.querySelectorAll('#delete-anchor');
    deleteAnchors.forEach(anchor => {
        let isConfirmed = false;
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!isConfirmed) {
                if (confirm("Are you sure to delete this article?")){
                    isConfirmed = true;
                    const articleId = link.dataset.articleId;
                    console.log(articleId);

                    // Send AJAX DELETE request to delete article on server
                    const xhr = new XMLHttpRequest();
                    xhr.open('DELETE', `/articles/${articleId}`);
                    xhr.send();

                    var card = link.parentNode.parentNode.parentNode;
                    card.remove();
                }
            }
        });
    });


      

    language.addEventListener("change", setLanguage);
};

document.addEventListener("DOMContentLoaded", function() {
    var link = document.getElementById('stylesheet');
    var language = document.getElementById("lang");
    var savedLanguage = localStorage.getItem("language") || "english";
    language.value = savedLanguage;
    if (savedLanguage == "arabic") {
        link.setAttribute('href', 'style arabic.css');
    }
    else{
        link.setAttribute('href', 'style.css');
    }
});


