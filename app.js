const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = 'chave_secreta'; 
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Mock de dados
const users = [
  { username: 'user', password: '123456', id: 123, email: 'user@dominio.com', perfil: 'user' },
  { username: 'admin', password: '123456789', id: 124, email: 'admin@dominio.com', perfil: 'admin' },
  { username: 'colab', password: '123', id: 125, email: 'colab@dominio.com', perfil: 'user' },
];

// Middleware para validar o token JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Header de autorização ausente' });
  }

  const token = authHeader.split(' ')[1]; // Formato esperado: Bearer <token>
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);

    // Verifica expiração
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      return res.status(403).json({ message: 'Token expirado' });
    }

    // Adiciona os dados do usuário na requisição
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token Invalido', error: error.message });
  }
}

// Endpoint de login
app.post('/api/auth/login', (req, res) => {
  const credentials = req.body;
  const userData = doLogin(credentials);

  if (userData) {
    const token = jwt.sign(
      {
        id: userData.id,
        perfil: userData.perfil,
      },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    return res.json({ token });
  } else {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

// Endpoint para recuperação dos dados de todos os usuários (somente admin)
app.get('/api/users', verifyToken, (req, res) => {
  if (req.user.perfil !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Somente acesso de admin' });
  }
  res.status(200).json({ data: users });
});

// Endpoint para recuperação dos contratos existentes
app.get('/api/contracts/:empresa/:inicio', verifyToken, (req, res) => {
  const empresa = req.params.empresa;
  const dtInicio = req.params.inicio;

  const result = getContracts(empresa, dtInicio);
  if (result) {
    res.status(200).json({ data: result });
  } else {
    res.status(404).json({ message: 'Dados não encontrados' });
  }
});

// Endpoint para dados do usuário logado
app.get('/api/user/profile', verifyToken, (req, res) => {
  const userData = users.find(user => user.id === req.user.id);
  res.status(200).json({ user: userData });
});

// Funções auxiliares
function doLogin(credentials) {
  return users.find(
    user =>
      credentials?.username === user.username && credentials?.password === user.password
  );
}

class Repository {
  execute(query, params) {
    // Simula a execução de uma query preparada
    console.log('Executando query:', query, 'com params:', params);
    return []; // Retorno simulado
  }
}

// Método ajustado para evitar SQL Injection
function getContracts(empresa, inicio) {
  if (!/^[a-zA-Z0-9]+$/.test(empresa) || !/^\d{4}-\d{2}-\d{2}$/.test(inicio)) {
    return null; // Dados inválidos
  }

  const repository = new Repository();
  const query = `SELECT * FROM contracts WHERE empresa = ? AND data_inicio = ?`;
  return repository.execute(query, [empresa, inicio]); // Query preparada com parâmetros
}

module.exports = app;
