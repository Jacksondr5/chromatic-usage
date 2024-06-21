import initSqlJs from "sql.js";

export const db = await initSqlJs({
  // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
  // You can omit locateFile completely when running in node
  locateFile: (file) => `https://sql.js.org/dist/${file}`,
}).then((SQL) => {
  const db = new SQL.Database();
  const setupStatement = `
        CREATE TABLE IF NOT EXISTS chromatic (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          appId TEXT,
          buildId TEXT,
          date INTEGER,
          repositorySlug TEXT,
          branch TEXT,
          buildNumber INTEGER,
          skippedSnapshots INTEGER,
          chromeSnapshots INTEGER,
          firefoxSnapshots INTEGER,
          safariSnapshots INTEGER,
          edgeSnapshots INTEGER,
          internetExplorerSnapshots INTEGER
        );
          `;
  db.run(setupStatement);
  return db;
});
