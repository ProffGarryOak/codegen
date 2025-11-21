const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const languages = [
    { name: 'Python', slug: 'python' },
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'TypeScript', slug: 'typescript' },
    { name: 'Java', slug: 'java' },
    { name: 'C++', slug: 'cpp' },
    { name: 'Go', slug: 'go' },
    { name: 'Rust', slug: 'rust' },
  ];

  console.log('Start seeding...');
  for (const lang of languages) {
    const language = await prisma.language.upsert({
      where: { slug: lang.slug },
      update: {},
      create: lang,
    });
    console.log(`Created language: ${language.name}`);
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
