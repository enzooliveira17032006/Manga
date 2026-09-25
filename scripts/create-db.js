require('dotenv').config();
const { Client } = require('pg');

async function checkAndCreate() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL não está configurada no .env');
    process.exit(1);
  }

  const url = new URL(process.env.DATABASE_URL);
  const dbName = url.pathname.replace('/', '');
  
  // Conectar ao banco administrativo 'postgres' primeiro
  const adminUrl = process.env.DATABASE_URL.replace(`/${dbName}`, '/postgres');
  
  const client = new Client({ connectionString: adminUrl });
  try {
    await client.connect();
    console.log('✅ Conexão autenticada com sucesso no PostgreSQL.');

    const res = await client.query('SELECT datname FROM pg_database WHERE datname = $1', [dbName]);
    if (res.rowCount === 0) {
      console.log(`⚠️ Banco '${dbName}' não existe. Criando...`);
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Banco '${dbName}' criado com sucesso.`);
    } else {
      console.log(`✅ Banco '${dbName}' já existe.`);
    }
  } catch(e) {
    console.error('❌ Erro na conexão ou criação:', e.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

checkAndCreate();
