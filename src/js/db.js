let dbPromised = idb.open("seputar-seria", 1, function (upgradeDb) {
  let articlesObjectStore = upgradeDb.createObjectStore("teams", {
    keyPath: "id",
    autoIncrement: false,
  });
  articlesObjectStore.createIndex("id", "id", {
    unique: false,
  });
});

function saveForLater(ctx) {
  console.log("isi ctx ", ctx);
  dbPromised.then((db) => {
    const tx = db.transaction("teams", "readwrite");
    const store = tx.objectStore("teams");
    store.add(ctx);
    return tx.complete;
  });
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
