import initSqlJs from 'sql.js';

export async function get({ params, url }) {
	let SQLPromise;
	let bufferPromise;
	let db;

	if (!db) {
		if (typeof self === 'undefined') {
			// server
			SQLPromise = initSqlJs();
			bufferPromise = fetch(url.origin + '/content.sqlite').then((res) => res.arrayBuffer());
		} else {
			// service worker
			SQLPromise = await initSqlJs({
				locateFile: (file) => `https://sql.js.org/dist/${file}`
			});
			bufferPromise = await caches.match('/content.sqlite').then((res) => res.arrayBuffer());
		}

		const [SQL, buffer] = await Promise.all([SQLPromise, bufferPromise]);
		db = await new SQL.Database(new Uint8Array(buffer));
	}

	const q = url.searchParams.get('q');
	const stmt = q
		? db.prepare(`SELECT * FROM recipes WHERE name LIKE '%${q}%';`)
		: db.prepare('SELECT * FROM recipes;');

	let recipes = [];
	while (stmt.step()) {
		const row = stmt.getAsObject();
		recipes.push(row);
	}

	return {
		body: recipes
	};
}
