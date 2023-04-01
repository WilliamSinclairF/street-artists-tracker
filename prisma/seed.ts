/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();

  Array.from({ length: 10 }).forEach(async (_, i) => {
    const id = users?.[Math.floor(Math.random() * users?.length)]?.id;

    if (!id) throw new Error('No user found!');

    const date = new Date();
    date.setDate(date.getDate() + i);

    prisma.event
      .create({
        data: {
          date: date,
          time: date,
          description: 'This a very cool event ' + i.toString(),
          title: 'This a very cool event ' + i.toString(),
          creator: { connect: { id } },
          latitude: 49.316666 - Math.random() * 0.1,
          longitude: -123.066666 + Math.random() * 0.1,
          type: 'test',
        },
      })
      .then((event) => {
        console.log(event);
      })
      .catch((e) => {
        console.error(e);
      });
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
