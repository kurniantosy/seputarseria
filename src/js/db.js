var dbPromised = idb.open("seputar-seria", 1, function (upgradeDb) {
  var articlesObjectStore = upgradeDb.createObjectStore("teams", {
    keyPath: "ID",
  });
  articlesObjectStore.createIndex("post_title", "post_title", {
    unique: false,
  });
});

function saveForLater(data) {
  dbPromised
    .then(function (db) {
      var tx = db.transaction("seputar-seria", "readwrite");
      var store = tx.objectStore("seputar-seria");
      console.log(data);
      store.add(data);
      return tx.complete;
    })
    .then(function () {
      console.log("Artikel berhasil di simpan.");
    });
}
