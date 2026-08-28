import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { toolkit } from './src/db/schema';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const myToolkit = [
  {
    title: 'AI / ML',
    icon: 'Binary',
    items: ['Python', 'PyTorch', 'TensorFlow', 'Scikit-learn', 'XGBoost'],
  },
  {
    title: 'Generative AI',
    icon: 'Sparkles',
    items: [
      'LLMs',
      'RAG Architectures',
      'LangChain',
      'Agentic Systems',
      'Vector DBs (Chroma/FAISS)',
    ],
  },
  {
    title: 'Frontend',
    icon: 'Layout',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    title: 'Backend',
    icon: 'Server',
    items: ['FastAPI', 'Django', 'Node.js', 'Express', 'REST / GraphQL'],
  },
  {
    title: 'Data / DBs',
    icon: 'Database',
    items: ['PostgreSQL', 'MariaDB / MySQL', 'MongoDB', 'Redis', 'Pandas'],
  },
  {
    title: 'Infrastructure',
    icon: 'Terminal',
    items: [
      'Docker',
      'Git & GitHub Actions',
      'Linux / Nginx',
      'MLflow',
      'Apache Airflow',
    ],
  },
];

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(pool);

  console.log('Clearing existing toolkit...');
  await db.delete(toolkit);
  
  console.log('Preparing items...');
  const values = [];
  let orderIndex = 0;
  for (const group of myToolkit) {
    for (const item of group.items) {
      values.push({
        name: item,
        category: group.title,
        orderIndex: orderIndex++,
      });
    }
  }

  console.log('Inserting items...');
  await db.insert(toolkit).values(values);
  console.log('Successfully seeded toolkit data!');
  await pool.end();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
