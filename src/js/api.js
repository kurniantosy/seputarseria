var base_url = "https://api.football-data.org/v2";

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      const error = (data && data.message) || response.statusText;
      return Promise.reject(new Error("Ada error gaes", error));
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
  if ("caches" in window) {
    caches
      .match(`${base_url}/competitions/2019/teams`, {
        headers: {
          "X-Auth-Token": "62f30b942a29438f925d0f01e6cdb9a0",
        },
      })
      .then((response) => {
        if (response) {
          response.json().then(({ teams }) => {
            console.log("ada data", teams);
            teamSeria(teams);
          });
        }
      })

      .catch((error) => console.log("error", error));
  }
  request(`${base_url}/competitions/2019/teams`)
    .then(({ teams }) => {
      console.log("lala", teams);
      teamSeria(teams);
    })
    .catch((error) => console.log("error", error));
}

function teamSeria(data) {
  let clubBola = "";
  data.forEach((el) => {
    clubBola += `
                <div class="kartubola">
                  <a href="./article.html?id=${el.id}">
                    <div class="iconbola waves-effect waves-block waves-light">
                      <img src="${el.crestUrl}" alt=${el.area.name}/>
                    </div>
                  </a>
                  <div class="card-contents">
                    <span class="namateam">${el.name}</span>
                    <p>Klub ${el.shortName} berlokasi di ${el.address}</p>
                  </div>
                </div>
              `;
  });
  document.getElementById("articles").innerHTML = clubBola;
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
            <div>Pernah Juara ${el.activeCompetitions.map(
              (juara) => `<div>Nama Kompetisi : ${juara.name}</div>`
            )}</div>
            </div>
            <div>Nama Team
            <ul>
            ${el.squad.map(
              (pemain) => `<li>${pemain.name} - ${pemain.position}</li>`
            )}
            </ul>
            </div>
        `;
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("body-content").innerHTML = articleHTML;
    })
    .catch((err) => console.log("error", err));
}
