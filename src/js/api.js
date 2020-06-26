let base_url = "https://api.football-data.org/v2";
let api_key = "62f30b942a29438f925d0f01e6cdb9a0";

// function handleResponse(response) {
//   return response.text().then((text) => {
//     const data = text && JSON.parse(text);
//     if (!response.ok) {
//       const error = (data && data.message) || response.statusText;
//       return Promise.reject(new Error("Ada error gaes", error));
//     }
//     return data;
//   });
// }
const fetchApi = async (url) => {
  return await fetch(url, {
    headers: {
      "X-Auth-Token": api_key,
    },
  })
    .then((res) => {
      if (res.status !== 200) {
        return Promise.reject(new Error(res.statusText));
      } else {
        return Promise.resolve(res);
      }
    })
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
    });
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
            teamSeria(teams);
          });
        }
      });
  }
  fetchApi(`${base_url}/competitions/2019/teams`).then(({ teams }) => {
    teamSeria(teams);
  });
}

function teamSeria(data) {
  const elemen = document.getElementById("teambola");
  console.log("ini apa", elemen);
  let clubBola = "";
  if (data !== undefined) {
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
    elemen.innerHTML = clubBola;
  }
}

function getArticleById() {
  return new Promise(function (resolve, reject) {
    // Ambil nilai query parameter (?id=)
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");
    if ("caches" in window) {
      caches.match(`${base_url}/teams/${idParam}`).then((response) => {
        if (response) {
          response.json().then((el) => {
            let articleHTML = `
            <div class="cards">
            <div class="kontainerimage">
           
                <div class="image">
                  <img src=${el.crestUrl} alt="logo"/>
                </div>
                  <div class="card-contents">
                    <ul class="sejarahteam">
                      <li><i class="material-icons">assignment_ind</i> ${
                        el.name
                      }</li>
                      <li><i class="material-icons">location_city</i> ${
                        el.address
                      }</li>
                      <li><i class="material-icons">local_post_office</i> ${
                        el.email
                      }</li>
                      <li><i class="material-icons">local_phone</i>${
                        el.phone
                      }</li>
                      <li><i class="material-icons">store_mall_directory</i>${
                        el.venue
                      }</li>
                      </ul>
                  </div>
              </div>
              <ul class="namateam">
              ${el.squad.map(
                (pemain) =>
                  `<li><span> ${pemain.position} </span> ${pemain.name} </li>`
              )}
              </ul>
                    `;
            document.getElementById("deskripsiteam").innerHTML = articleHTML;
            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(el);
          });
        }
      });
    }
    fetchApi(`${base_url}/teams/${idParam}`).then((el) => {
      // Objek JavaScript dari response.json() masuk lewat variabel data.
      // Menyusun komponen card artikel secara dinamis
      let articleHTML = `
        <div class="cards">
        <div class="kontainerimage">
       
            <div class="image">
              <img src=${el.crestUrl} alt="logo"/>
            </div>
              <div class="card-contents">
                <ul class="sejarahteam">
                  <li><i class="material-icons">assignment_ind</i> ${
                    el.name
                  }</li>
                  <li><i class="material-icons">location_city</i> ${
                    el.address
                  }</li>
                  <li><i class="material-icons">local_post_office</i> ${
                    el.email
                  }</li>
                  <li><i class="material-icons">local_phone</i>${el.phone}</li>
                  <li><i class="material-icons">store_mall_directory</i>${
                    el.venue
                  }</li>
                  </ul>
              </div>
          </div>
          <ul class="namateam">
          ${el.squad.map(
            (pemain) =>
              `<li><span> ${pemain.position} </span> ${pemain.name} </li>`
          )}
          </ul>
      `;
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("deskripsiteam").innerHTML = articleHTML;
      // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
      resolve(el);
    });
  });
}

function getSavedArticles() {
  getAll().then(function (favorite) {
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
    let articleHTML = ` <div class="cards">
        <div class="kontainerimage">
       
            <div class="image">
              <img src=${el.crestUrl} alt="logo"/>
            </div>
              <div class="card-contents">
                <ul class="sejarahteam">
                  <li><i class="material-icons">assignment_ind</i> ${
                    el.name
                  }</li>
                  <li><i class="material-icons">location_city</i> ${
                    el.address
                  }</li>
                  <li><i class="material-icons">local_post_office</i> ${
                    el.email
                  }</li>
                  <li><i class="material-icons">local_phone</i>${el.phone}</li>
                  <li><i class="material-icons">store_mall_directory</i>${
                    el.venue
                  }</li>
                  </ul>
              </div>
          </div>
          <ul class="namateam">
          ${el.squad.map(
            (pemain) =>
              `<li><span> ${pemain.position} </span> ${pemain.name} </li>`
          )}
          </ul>`;
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("deskripsiteam").innerHTML = articleHTML;
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
