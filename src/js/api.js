let base_url = "https://api.football-data.org/v2";

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
  return await fetch(`${url}`, {
    headers: {
      "X-Auth-Token": "62f30b942a29438f925d0f01e6cdb9a0",
    },
  }).then(handleResponse);
};

function getArticles() {
  request(`${base_url}/competitions/2019/teams`).then(({ teams }) => {
    console.log("lala", teams);
    var clubBola = "";
    teams.forEach((el) => {
      clubBola += `
            <div class="card">
              <a href="./article.html?id=${el.id}">
                <div class="card-image waves-effect waves-block waves-light">
                  <img src="${el.crestUrl}" />
                </div>
              </a>
              <div class="card-content">
                <span class="card-title truncate">${el.area.name} lala</span>
                <p>Klub ${el.area.name} berlokasi di ${el.address}</p>
              </div>
            </div>
          `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("articles").innerHTML = clubBola;
  });
}

function getArticleById() {
  // Ambil nilai query parameter (?id=)
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");
  request(`${base_url}/teams/${idParam}`)
    .then((el) => {
      // Objek JavaScript dari response.json() masuk lewat variabel data.
      console.log("ini el loh", el);
      // Menyusun komponen card artikel secara dinamis
      var articleHTML = `
          <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
              
            </div>
            <div class="card-content">
              <span class="card-title">${el.address}</span>
              ${snarkdown(el.name)}
            </div>
          </div>
        `;
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("body-content").innerHTML = articleHTML;
    })
    .catch((err) => console.log("error", err));
}
