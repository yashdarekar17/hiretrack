/* eslint-disable */
// Load env variables
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaNeon } = require("@prisma/adapter-neon");
const bcrypt = require("bcryptjs");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL environment variable is missing.");
  process.exit(1);
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "demo@demo.com";
  const password = "demo1234";
  
  // Hash the demo password with cost 12 to match the playbook security criteria
  const hashedPassword = await bcrypt.hash(password, 12);

  const demoUser = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
    },
    create: {
      email,
      name: "Demo Recruiter",
      password: hashedPassword,
    },
  });

  console.log("Successfully seeded demo user:", demoUser.email);
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
