import "dotenv/config";
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({connectionString})
const prisma = new PrismaClient({adapter})

async function main() {
	console.log('Seed start');
	await prisma.itemContagemEstoque.deleteMany()
	await prisma.contagemEstoque.deleteMany()
	await prisma.estoqueProduto.deleteMany()
	await prisma.produto.deleteMany()
	await prisma.funcionario.deleteMany()


	const funcionario = await prisma.funcionario.create({
		data: {
			nome: 'Niv',
			email: 'niv@teste.com'
		},
	})

	const produtosData = [
    { nome: 'Notebook Dell G15', codigo: 'DELL-G15', qtd: 5 },
    { nome: 'Monitor LG Ultrawide', codigo: 'LG-29WK', qtd: 10 },
    { nome: 'Teclado Mecânico Keychron', codigo: 'KEY-K2', qtd: 0 },
    { nome: 'Mouse Logitech MX', codigo: 'LOG-MX3', qtd: 8 },
    { nome: 'Cabo HDMI 2.0', codigo: 'CAB-HDMI', qtd: 50 },
  ]

 for (const p of produtosData) {
    await prisma.produto.create({
      data: {
        nome: p.nome,
        codigoSistema: p.codigo,
        estoque: {
          create: {
            quantidadeSistema: p.qtd
          }
        }
      }
    })
  }
	 const todosProdutos = await prisma.produto.findMany({ include: { estoque: true } })
	 const contagem = await prisma.contagemEstoque.create({
    data: {
      codigo: 'CONT-1001',
      dataAgendada: new Date(),
      responsavelId: funcionario.id,
      status: 'EM_ANDAMENTO',
      itens: {
        create: todosProdutos.map(p => ({
          produtoId: p.id,
          quantidadeSistema: p.estoque?.quantidadeSistema ?? 0,
          situacao: 'A_CONFERIR',
          quantidadeContada: null
        }))
      }
    }
  })

  console.log(`Seed concluded, Count: ${contagem.id}`)
  console.log(`Count code test: ${contagem.codigo}`)
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
