# Missão Prática | Mundo 5 | Nível 5

Este projeto implementa uma API RESTful com autenticação utilizando JSON Web Tokens (JWT). A API permite a autenticação de usuários, controle de acesso baseado em perfil (admin e user) e a recuperação de contratos e dados de usuários.

## Funcionalidades

- **Autenticação JWT**: Implementação de login e geração de tokens JWT para autenticação.
- **Controle de Acesso**: Restrição de acesso aos endpoints com base no perfil do usuário (admin ou user).
- **Recuperação de Dados**: Permite que usuários logados recuperem seus próprios dados, e admins possam acessar informações de todos os usuários.
- **Recuperação de Contratos**: Endpoints para consultar contratos com base em parâmetros como empresa e data de início.

## Endpoints Implementados

1. **POST /api/auth/login**: Geração de token de autenticação.
2. **GET /api/user/profile**: Recuperação dos dados do usuário logado.
3. **GET /api/users**: Recuperação dos dados de todos os usuários (restrito a admins).
4. **GET /api/contracts/:empresa/:inicio**: Recuperação de contratos com base em empresa e data de início.

## Tecnologias Utilizadas

- **Node.js** para o desenvolvimento do backend.
- **JWT (JSON Web Tokens)** para autenticação e controle de sessões.
- **Express** para gerenciamento das rotas e middleware.

## Como Rodar

1. Clone o repositório.
2. Instale as dependências: `npm install`.
3. Inicie o servidor: `npm start`.
4. Utilize ferramentas como [Insomnia](https://insomnia.rest/) ou [Postman](https://www.postman.com/) para testar os endpoints da API.

## Testes

Utilize os tokens JWT gerados ao fazer login para testar os endpoints que exigem autenticação. O controle de acesso garante que apenas usuários com o perfil adequado (admin ou user) possam acessar determinados recursos.



