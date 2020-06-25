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
  return new Promise(function (resolve, reject) {
    // Ambil nilai query parameter (?id=)
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");
    console.log("isi id params", idParam);
    if ("caches" in window) {
      caches
        .match(`${base_url}/teams/${idParam}`, {
          headers: {
            "X-Auth-Token": "62f30b942a29438f925d0f01e6cdb9a0",
          },
        })
        .then((response) => {
          if (response) {
            response.json().then((el) => {
              console.log("ini apa chaces,  ", el);
              var articleHTML = `
                              <div class="card">
                                <div class="card-image waves-effect waves-block waves-light">
              
                                </div>
                                <div class="card-content">
                                  <span class="card-title">${el.address}</span>
                                  ${snarkdown(el.name)}
                                </div>
                                <div>Pernah Juara ${el.activeCompetitions.map(
                                  (juara) =>
                                    `<div>Nama Kompetisi : ${juara.name}</div>`
                                )}</div>
                              </div>
                              <div>Nama Team
                                <ul>
                                ${el.squad.map(
                                  (pemain) =>
                                    `<li>${pemain.name} - ${pemain.position}</li>`
                                )}
                                </ul>
                              </div>
                    `;
              document.getElementById("body-content").innerHTML = articleHTML;
              // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
              resolve(el);
            });
          }
        });
    }
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
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(el);
      })
      .catch((err) => console.log("error", err));
  });
}

function getSavedArticles() {
  getAll().then(function (favorite) {
    console.log("isi data fovorite", favorite);
    // Menyusun komponen card artikel secara dinamis
    let elemen = document.getElementById("body-content");
    let articlesHTML = "";
    favorite.forEach((el) => {
      articlesHTML += `
            <div class="kartubola">
              <a href="./article.html?id=${el.id}&favorite=true">
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

    elemen.innerHTML = articlesHTML;
  });
}

function getSavedArticleById() {
  let urlParams = new URLSearchParams(window.location.search);
  let idParam = urlParams.get("id");

  getById(idParam).then((el) => {
    articleHTML = "";
    let articleHTML = ` <div class="card">
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
    ${el.squad.map((pemain) => `<li>${pemain.name} - ${pemain.position}</li>`)}
    </ul>
    </div>`;
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = articleHTML;
  });
}

function getById(id) {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then((db) => {
        var tx = db.transaction("teams", "readonly");
        var store = tx.objectStore("teams");
        return store.get(id);
      })
      .then((teams) => {
        resolve(teams);
      });
  });
}
