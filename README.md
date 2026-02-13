<div align="center">
  

### Scheduled Stock Count

Sistema de contagem de estoque agendado: Um sistema que agenda contagens de estoques para seus funcionários. O funcionário consegue acessar fisicamente e checar os produtos.

<img src="https://i.imgur.com/CH5UN6E.png" height="310px" align="right" />

</div>

### Sobre o projeto:

- Feito utilizando as stacks: Next.js, Express.js, PrismaORM, PostgresSQL, Typescript (Tipagem), TailwindCSS, Docker (Conteinerização).
- O projeto consta com três seções: A conferir, Faltantes / Excedentes e Conferidos. Estes constam sistema de filtro por nome do produto/código no sistema. 
- Consta com JWT auth com cookies para login do usuário. (Definido pelo seed do prisma ao rodar o projeto para ambiente de desenvolvimento: { email: admin@teste.com, senha: 123456})
- Testes automatizados básicos, além de tratamento de erros e tipagem com TypeScript.
- Deploy presente por meio de Vercel + Render + Neon: [Link](https://scheduled-stock-count-frontend.vercel.app/login)

### 🐳 Instruções para rodar localmente com Docker:
Certifique-se de ter instalado em sua máquina:
* [Docker](https://www.docker.com/get-started)
* [Docker Compose](https://docs.docker.com/compose/install/) (Geralmente incluído no Docker Desktop)
```bash
    git clone https://github.com/nivdantas/scheduled-stock-count
    cd scheduled-stock-count
    docker-compose up --build
   ```
Frontend: http://localhost:3001
Backend: http://localhost:3000
</div>

