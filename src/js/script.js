document.addEventListener("DOMContentLoaded", function () {
  // Activate sidebar nav
  var elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);
  loadNav();

  function loadNav() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status != 200) return;

        // Muat daftar tautan menu
        document.querySelectorAll(".topnav, .sidenav").forEach((elm) => {
          elm.innerHTML = xhttp.responseText;
        });

        // Daftarkan event listener untuk setiap tautan menu
        document.querySelectorAll(".sidenav a, .topnav a").forEach((elm) => {
          elm.addEventListener("click", (event) => {
            // Tutup sidenav
            let sidenav = document.querySelector(".sidenav");
            M.Sidenav.getInstance(sidenav).close();

            // Muat konten halaman yang dipanggil
            page = event.target.getAttribute("href").substr(1);
            console.log("page", page);
            loadPage(page);
          });
        });
      }
    };
    xhttp.open("GET", "src/nav.html", true);
    xhttp.send();
  }
  // Load page content
  let page = window.location.hash.substr(1);
  if (page === "") page = "home";
  loadPage(page);

  function loadPage(page) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        let content = document.querySelector(".body-contents");
        switch (this.status) {
          case 200:
            content.innerHTML = xhttp.responseText;
            break;
          case 404:
            content.innerHTML = `<p style="margin-top: 100px; padding: 20px; font-size:20px ; color : red;">Halaman tidak ditemukan.</p>`;
            break;
          default:
            content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
            break;
        }
      }
    };
    xhttp.open("GET", "src/pages/" + page + ".html", true);
    xhttp.send();
  }
});
