import initSqlJs from 'sql.js';

export async function get({ url }) {
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
			SQLPromise = initSqlJs({
				locateFile: (file) => `/${file}`
			});
			bufferPromise = caches.match('/content.sqlite').then((res) => res.arrayBuffer());
		}

		const [SQL, buffer] = await Promise.all([SQLPromise, bufferPromise]);
		db = await new SQL.Database(new Uint8Array(buffer));
	}

	// detail page
	const id = url.searchParams.get('id');
	if (id) {
		const stmt = db.prepare(`SELECT * FROM recipes WHERE id = ${id}`);
		const recipe = stmt.getAsObject({});
		stmt.free();

		return {
			body: recipe
		};
	}

	// search or all
	const q = url.searchParams.get('q');
	const stmt = q
		? db.prepare(`SELECT * FROM recipes WHERE name LIKE '%${q}%';`)
		: db.prepare('SELECT * FROM recipes;');

	let recipes = [];
	while (stmt.step()) {
		const row = stmt.getAsObject();
		recipes.push(row);
	}

	stmt.free();

	return {
		body: recipes
	};
}
