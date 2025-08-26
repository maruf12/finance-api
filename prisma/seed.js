// prisma/seed.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Tentukan user target untuk di-seed:
 * - set env SEED_USERNAME, atau
 * - fallback "demo"
 */
const SEED_USERNAME = process.env.SEED_USERNAME || 'demo';
const SEED_USER = {
  username: SEED_USERNAME,
  // Field di model User kamu
  password: 'testingpass', // ganti sesuai kebutuhan
  name: 'Demo User',
  email: `demo+${SEED_USERNAME}@example.com`,
};

const GROUPS = {
  // groupName: [subcategories] | null (jika tidak punya sub)
  'Living': [
    'Bensin', 'Parkir', 'Listrik', 'Kuota',
    'Olahraga', 'Subscription', 'Infaq', 'Personal care',
  ],
  'Spending': [
    'Makan Malam', 'Makan siang kantor', 'Jajan', 'Ibrahim',
    'Makan diluar', 'Kopi', 'Fashion', 'Susu',
  ],
  'Extend': [
    'Liburan', 'Dokter', 'Obat', 'Rumah tangga', 'Fashion extend',
    'Kado', 'Education', 'Mudik', 'Family', 'Fashion-maruf',
    'Fashion-ibrahim', 'Fashion-susi', 'Service', 'Pajak', 'Laundry',
    'Traktir', 'Oleh-oleh', 'Laptop', 'Kantor',
  ],
  'Bulanan': null,
  'Uang Istri': null,
  'Family': null,
};

async function ensureUser() {
  // pakai upsert by unique email (atau username kalau kamu preferring)
  const user = await prisma.user.upsert({
    where: { email: SEED_USER.email },
    update: {},
    create: SEED_USER,
  });
  return user;
}

async function upsertGroup(userUsername, name, description) {
  // @@unique([userUsername, name]) -> where: { userUsername_name: { ... } }
  return prisma.group.upsert({
    where: { userUsername_name: { userUsername, name } },
    update: {},
    create: { userUsername, name, description },
  });
}

async function upsertCategory(groupId, name) {
  // @@unique([groupId, name]) -> where: { groupId_name: { ... } }
  return prisma.category.upsert({
    where: { groupId_name: { groupId, name } },
    update: {},
    create: { groupId, name },
  });
}

async function main() {
  const user = await ensureUser();

  for (const [groupName, categories] of Object.entries(GROUPS)) {
    const desc = describeGroup(groupName);
    const group = await upsertGroup(user.username, groupName, desc);

    if (Array.isArray(categories)) {
      for (const cat of categories) {
        await upsertCategory(group.id, cat);
      }
    }
  }

  // Contoh data awal (opsional):
  // await prisma.expense.create({
  //   data: {
  //     userUsername: user.username,
  //     group: { connect: { id: groupLiving.id } },
  //     category: { connect: { groupId_name: { groupId: groupLiving.id, name: 'Listrik' } } },
  //     tanggal: new Date(),
  //     title: 'Tagihan PLN',
  //     amount: new prisma.Prisma.Decimal(-250000),
  //   }
  // });

  console.log('Seeding selesai ✅');
}

function describeGroup(name) {
  switch (name) {
    case 'Living':
      return 'Kebutuhan dasar: listrik, bensin, parkir, kuota, dll';
    case 'Spending':
      return 'Uang jajan pribadi: makan kantor/malam, kopi, dll';
    case 'Bulanan':
      return 'Uang bulanan yang dikelola Istri';
    case 'Uang Istri':
      return 'Uang jajan istri';
    case 'Family':
      return 'Dialokasikan untuk keluarga (orang tua + mertua)';
    case 'Extend':
      return 'Diluar kebutuhan utama: liburan, dokter, pajak, dll';
    default:
      return null;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
