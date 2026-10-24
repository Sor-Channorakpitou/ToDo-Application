import 'dotenv/config';
import pg from 'pg';
import * as argon2 from 'argon2';

const { Client } = pg;

const email = process.argv[2] || 'admin@example.com';
const password = process.argv[3] || 'Admin123!';

async function main() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'todo',
  });

  await client.connect();

  const normalizedEmail = email.trim().toLowerCase();

  // Check if user already exists
  const checkRes = await client.query('SELECT id, email, role FROM "user" WHERE email = $1;', [
    normalizedEmail,
  ]);

  if (checkRes.rows.length > 0) {
    const existing = checkRes.rows[0];
    const passwordHash = await argon2.hash(password);
    await client.query('UPDATE "user" SET role = $1, "passwordHash" = $2 WHERE id = $3;', [
      'ADMIN',
      passwordHash,
      existing.id,
    ]);
    console.log(`\nUpdated existing user "${normalizedEmail}" to ADMIN with updated Argon2 password.`);
  } else {
    // Create new admin user
    const passwordHash = await argon2.hash(password);
    const insertRes = await client.query(
      'INSERT INTO "user" ("email", "passwordHash", "role") VALUES ($1, $2, $3) RETURNING id, email, role;',
      [normalizedEmail, passwordHash, 'ADMIN']
    );
    console.log('\nCreated new ADMIN account successfully:');
    console.log(insertRes.rows[0]);
  }

  console.log('\nCredentials:');
  console.log(`  Email:    ${normalizedEmail}`);
  console.log(`  Password: ${password}\n`);

  await client.end();
}

main().catch((err) => {
  console.error('Error creating admin account:', err);
  process.exit(1);
});
