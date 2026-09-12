import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Inicializando banco de dados de faturamento (faturamento.db)...');
  await prisma.pagamento.deleteMany({});

  const p1 = await prisma.pagamento.create({
    data: {
      codAss: 1,
      valorPago: 49.9,
      dataPagamento: new Date(),
      dia: new Date().getUTCDate(),
      mes: new Date().getUTCMonth() + 1,
      ano: new Date().getUTCFullYear(),
    },
  });

  console.log(`Pagamento de teste inserido com sucesso (ID: ${p1.codigo}).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
