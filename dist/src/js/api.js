// let base_url = "https://api.football-data.org/v2";

var base_url = "https://readerapi.codepolitan.com/";

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
}
let request = async (url) => {
  return await fetch(`${url}`).then(handleResponse);
};

function getArticles() {
  request(base_url + "articles").then((data) => {
    var articlesHTML = "";
    data.result.forEach(function (article) {
      articlesHTML += `
            <div class="card">
              <a href="./article.html?id=${article.id}">
                <div class="card-image waves-effect waves-block waves-light">
                  <img src="${article.thumbnail}" />
                </div>
              </a>
              <div class="card-content">
                <span class="card-title truncate">${article.title}</span>
                <p>${article.description}</p>
              </div>
            </div>
          `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("articles").innerHTML = articlesHTML;
  });
}
