let db;

export function initDB() {
  const req = indexedDB.open("ruralLearnDB", 1);

  req.onupgradeneeded = (e) => {
    db = e.target.result;
    db.createObjectStore("forms", { autoIncrement: true });
  };

  req.onsuccess = (e) => {
    db = e.target.result;
  };
}

export function saveForm(data) {
  const tx = db.transaction("forms", "readwrite");
  tx.objectStore("forms").add(data);
}
