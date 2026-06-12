import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const PRODUCTS = [
  {
    name: 'Scarpin Milano',
    category: 'scarpin',
    price: 289.9,
    oldPrice: 389.9,
    description: 'Scarpin italiano em couro legítimo com salto de 8cm. Linhas refinadas e acabamento premium que elevam qualquer look.',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
      'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=800&q=80',
    ],
    sizes: ['33', '34', '35', '36', '37', '38', '39'],
    colors: ['Preto', 'Nude', 'Marsala'],
    featured: true,
    promo: true,
    stock: 15,
  },
  {
    name: 'Mule Veludo Noir',
    category: 'mule',
    price: 319.9,
    oldPrice: null,
    description: 'Mule em veludo italiano com detalhes dourados. Peça única que combina sofisticação e conforto.',
    images: [
      'https://images.unsplash.com/photo-1596703264163-6cedd70e2e00?w=800&q=80',
    ],
    sizes: ['34', '35', '36', '37', '38', '39', '40'],
    colors: ['Preto', 'Vinho', 'Verde'],
    featured: true,
    promo: false,
    stock: 8,
  },
  {
    name: 'Ankle Boot Couro Nappa',
    category: 'bota',
    price: 459.9,
    oldPrice: 579.9,
    description: 'Ankle boot em couro nappa italiano com zíper lateral dourado. O calçado mais elegante da temporada.',
    images: [
      'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=800&q=80',
    ],
    sizes: ['33', '34', '35', '36', '37', '38'],
    colors: ['Preto', 'Caramelo'],
    featured: true,
    promo: true,
    stock: 12,
  },
  {
    name: 'Sandália Gladiadora Gold',
    category: 'sandalia',
    price: 249.9,
    oldPrice: null,
    description: 'Sandália gladiadora com detalhes dourados e tiras em couro ecológico premium. Perfeita para ocasiões especiais.',
    images: [
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
    ],
    sizes: ['34', '35', '36', '37', '38', '39'],
    colors: ['Dourado', 'Prata', 'Bronze'],
    featured: true,
    promo: false,
    stock: 20,
  },
  {
    name: 'Loafer Horsebit Dourado',
    category: 'loafer',
    price: 389.9,
    oldPrice: 489.9,
    description: 'Loafer inspirado nas peças icônicas das casas de alta-costura. Couro legítimo com horsebit dourado.',
    images: [
      'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&q=80',
    ],
    sizes: ['33', '34', '35', '36', '37', '38', '39', '40'],
    colors: ['Preto', 'Marrom', 'Caramelo'],
    featured: false,
    promo: true,
    stock: 10,
  },
  {
    name: 'Sapatilha Ballet Luxe',
    category: 'sapatilha',
    price: 199.9,
    oldPrice: null,
    description: 'Sapatilha estilo ballet com acabamento em cetim e laço de seda. Delicada e elegante para o dia a dia.',
    images: [
      'https://images.unsplash.com/photo-1518894781321-630e638d0742?w=800&q=80',
    ],
    sizes: ['33', '34', '35', '36', '37', '38'],
    colors: ['Rosa', 'Bege', 'Preto'],
    featured: false,
    promo: false,
    stock: 25,
  },
  {
    name: 'Plataforma Crystal',
    category: 'plataforma',
    price: 349.9,
    oldPrice: 419.9,
    description: 'Sandália plataforma com cristais cravejados à mão. Peça de coleção para noites inesquecíveis.',
    images: [
      'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=800&q=80',
    ],
    sizes: ['34', '35', '36', '37', '38'],
    colors: ['Transparente', 'Dourado'],
    featured: false,
    promo: true,
    stock: 6,
  },
  {
    name: 'Mule Bico Fino Verniz',
    category: 'mule',
    price: 279.9,
    oldPrice: null,
    description: 'Mule de bico fino em verniz italiano. O equilíbrio perfeito entre modernidade e elegância atemporal.',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
    ],
    sizes: ['33', '34', '35', '36', '37', '38', '39'],
    colors: ['Preto', 'Branco', 'Vermelho'],
    featured: false,
    promo: false,
    stock: 18,
  },
]

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar usuário admin
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lumiere.com' },
    update: {},
    create: {
      email: 'admin@lumiere.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  })
  
  console.log(`✅ Admin criado: ${admin.email}`)

  // Criar produtos
  for (const produto of PRODUCTS) {
    const p = await prisma.product.create({ data: produto })
    console.log(`✅ Produto criado: ${p.name}`)
  }

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
