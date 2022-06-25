import fs from 'fs';
import initSqlJs from 'sql.js';

initSqlJs().then(async (SQL) => {
	// Load the db
	const db = new SQL.Database();

	db.run('CREATE TABLE recipes (name);');
	const seedResults = await seed();

	seedResults.forEach(async (recipe) => {
		const stmt = db.prepare('INSERT INTO recipes VALUES (@name);');
		stmt.bind({ '@name': recipe.name });
		stmt.step();
	});

	const data = db.export();
	const buffer = Buffer.from(data);
	fs.writeFileSync('./data/content.sqlite', buffer);
	fs.writeFileSync('./static/content.sqlite', buffer);
});

/**
 * Seed database
 *
 * @return {Promise<void>}
 */
async function seed() {
	const adverbs = ['great', 'tall', 'broad', 'fine', 'giant', 'awesome', 'typical'];
	const nouns1 = ['crocodile', 'overlord', 'dwarven', 'robot', 'ragdoll', 'ornithopter'];
	const nouns2 = ['meetup', 'feast', 'presence', 'happening', 'party', 'gathering', 'adventure'];

	function random(range) {
		return Math.floor(Math.random() * range);
	}

	function makeName() {
		return `${adverbs[random(adverbs.length)]}-${nouns1[random(nouns1.length)]}-${
			nouns2[random(nouns2.length)]
		}`;
	}

	let recipes = [];

	for (let i = 0; i < 100; i++) {
		const recipe = {
			id: i,
			name: makeName()
		};
		recipes.push(recipe);
	}

	return recipes;
}
