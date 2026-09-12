import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando o seeding do banco de dados...');

  // Limpa os dados existentes
  await prisma.assinatura.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.plano.deleteMany();

  // 1. Inserir 10 Clientes
  const clientesData = [
    { nome: 'Ana Silva', email: 'ana.silva@email.com' },
    { nome: 'Bruno Santos', email: 'bruno.santos@email.com' },
    { nome: 'Carlos Oliveira', email: 'carlos.oliveira@email.com' },
    { nome: 'Daniela Lima', email: 'daniela.lima@email.com' },
    { nome: 'Eduardo Souza', email: 'eduardo.souza@email.com' },
    { nome: 'Fernanda Costa', email: 'fernanda.costa@email.com' },
    { nome: 'Gabriel Pereira', email: 'gabriel.pereira@email.com' },
    { nome: 'Helena Rodrigues', email: 'helena.rodrigues@email.com' },
    { nome: 'Igor Alves', email: 'igor.alves@email.com' },
    { nome: 'Juliana Martins', email: 'juliana.martins@email.com' },
  ];

  const clientes = [];
  for (const c of clientesData) {
    const created = await prisma.cliente.create({ data: c });
    clientes.push(created);
  }
  console.log(`✅ ${clientes.length} clientes inseridos.`);

  // 2. Inserir 5 Planos
  const planosData = [
    {
      nome: 'Fibra 100 Mega',
      custoMensal: 89.90,
      descricao: 'Internet Fibra Óptica 100Mbps download / 50Mbps upload',
    },
    {
      nome: 'Fibra 300 Mega',
      custoMensal: 119.90,
      descricao: 'Internet Fibra Óptica 300Mbps com Wi-Fi 6 incluso',
    },
    {
      nome: 'Fibra 600 Mega',
      custoMensal: 159.90,
      descricao: 'Internet Ultra Fibra 600Mbps com suporte prioritário',
    },
    {
      nome: 'Combo Fibra + TV',
      custoMensal: 199.90,
      descricao: 'Fibra 500Mbps + 120 canais HD de TV por assinatura',
    },
    {
      nome: 'Plano Empresarial 1G',
      custoMensal: 349.90,
      descricao: 'Internet Dedicada 1Gbps com garantia de SLA de 4 horas',
    },
  ];

  const planos = [];
  for (const p of planosData) {
    const created = await prisma.plano.create({ data: p });
    planos.push(created);
  }
  console.log(`✅ ${planos.length} planos inseridos.`);

  // Data atual de referência
  const agora = new Date();
  const umAnoFuturo = new Date(agora.getTime() + 365 * 24 * 60 * 60 * 1000);
  const dataRecente = new Date(agora.getTime() - 5 * 24 * 60 * 60 * 1000); // 5 dias atrás (ATIVO)
  const dataAtrasada45 = new Date(agora.getTime() - 45 * 24 * 60 * 60 * 1000); // 45 dias atrás (CANCELADO)
  const dataAtrasada60 = new Date(agora.getTime() - 60 * 24 * 60 * 60 * 1000); // 60 dias atrás (CANCELADO)

  // 3. Inserir 6 Assinaturas (mistura de ativas e canceladas por atraso de pagamento)
  const assinaturasData = [
    {
      codCli: clientes[0].codigo,
      codPlano: planos[0].codigo,
      inicioFidelidade: agora,
      fimFidelidade: umAnoFuturo,
      dataUltimoPagamento: dataRecente,
      custoFinal: 79.90,
      descricao: 'Desconto promocional de fidelidade anual (100MB)',
    },
    {
      codCli: clientes[1].codigo,
      codPlano: planos[1].codigo,
      inicioFidelidade: agora,
      fimFidelidade: umAnoFuturo,
      dataUltimoPagamento: dataRecente,
      custoFinal: 99.90,
      descricao: 'Desconto combo fibra 300M',
    },
    {
      codCli: clientes[2].codigo,
      codPlano: planos[4].codigo,
      inicioFidelidade: agora,
      fimFidelidade: umAnoFuturo,
      dataUltimoPagamento: dataAtrasada45, // > 30 dias -> CANCELADO
      custoFinal: 299.90,
      descricao: 'Plano empresarial negociado em evento corporativo',
    },
    {
      codCli: clientes[3].codigo,
      codPlano: planos[2].codigo,
      inicioFidelidade: agora,
      fimFidelidade: umAnoFuturo,
      dataUltimoPagamento: dataRecente,
      custoFinal: 139.90,
      descricao: 'Migração de velocidade com fidelidade',
    },
    {
      codCli: clientes[4].codigo,
      codPlano: planos[3].codigo,
      inicioFidelidade: agora,
      fimFidelidade: umAnoFuturo,
      dataUltimoPagamento: dataAtrasada60, // > 30 dias -> CANCELADO
      custoFinal: 179.90,
      descricao: 'Combo residência pacote premium',
    },
    {
      codCli: clientes[5].codigo,
      codPlano: planos[0].codigo,
      inicioFidelidade: agora,
      fimFidelidade: umAnoFuturo,
      dataUltimoPagamento: dataRecente,
      custoFinal: 79.90,
      descricao: 'Cliente indicado por amigo',
    },
  ];

  for (const a of assinaturasData) {
    await prisma.assinatura.create({ data: a });
  }

  console.log(`✅ ${assinaturasData.length} assinaturas inseridas.`);
  console.log('🌱 Seeding concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
