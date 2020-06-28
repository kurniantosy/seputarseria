let dbPromised = idb.open("seputar-seria", 1, function (upgradeDb) {
  let articlesObjectStore = upgradeDb.createObjectStore("teams", {
    keyPath: "id",
    autoIncrement: false,
  });
  articlesObjectStore.createIndex("id", "id", {
    unique: true,
  });
});

function saveForLater(ctx) {
  console.log("isi ctx ", ctx);
  dbPromised
    .then((db) => {
      const tx = db.transaction("teams", "readwrite");
      const store = tx.objectStore("teams");
      store.put(ctx);
      return tx.complete;
    })
    .then(() => alert("Berhasil Menyimpan Data"));
}

function getAll() {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then((db) => {
        var tx = db.transaction("teams", "readonly");
        var store = tx.objectStore("teams");
        return store.getAll();
      })
      .then((teams) => {
        resolve(teams);
      });
  });
}
function deleteTeamFav(id) {
  var ask = confirm(`Kamu yakin menghapus data favorite?`);
  if (ask == true) {
    dbPromised
      .then((db) => {
        console.log("isi db", db);
        const tx = db.transaction("teams", "readwrite");
        tx.objectStore("teams").delete(id);
        return tx.complete;
      })
      .then(() =>
        setTimeout(() => {
          getSavedArticles();
        }, 100)
      );
  }
}
