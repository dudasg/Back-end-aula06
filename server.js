const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para permitir leitura de JSON no req.body
app.use(express.json());

// BANCO DE DADOS EM MEMÓRIA (Atributos: nome, categoria, duracaoMin, preco)
let servicos = [
  {
    id: 1,
    nome: "Corte de Cabelo",
    categoria: "Cabelo",
    duracaoMin: 45,
    preco: 80,
  },
  {
    id: 2,
    nome: "Manicure",
    categoria: "Unhas",
    duracaoMin: 30,
    preco: 40,
  }
];

// ROTA 1: GET /servicos (200 OK - Lista todos os serviços)
app.get('/servicos', (req, res) => {
  return res.status(200).json(servicos);
});

// ROTA 2: GET /servicos/:id (200 OK ou 404 Not Found)
app.get('/servicos/:id', (req, res) => {
  const { id } = req.params;
  const servico = servicos.find(s => s.id === parseInt(id));

  if (!servico) {
    return res.status(404).json({ mensagem: 'Serviço não encontrado.' });
  }

  return res.status(200).json(servico);
});

// ROTA 3: POST /servicos (201 Created - req.body)
app.post('/servicos', (req, res) => {
  const { nome, categoria, duracaoMin, preco } = req.body;

  // Validação dos atributos do recurso
  if (!nome || !categoria || duracaoMin === undefined || preco === undefined) {
    return res.status(400).json({ 
      mensagem: 'Todos os campos são obrigatórios: nome, categoria, duracaoMin, preco.' 
    });
  }

  const novoServico = {
    id: servicos.length > 0 ? servicos[servicos.length - 1].id + 1 : 1,
    nome,
    categoria,
    duracaoMin: Number(duracaoMin),
    preco: Number(preco),
  };

  servicos.push(novoServico);

  return res.status(201).json(novoServico);
});

// ROTA 4: PUT /servicos/:id (200 OK - req.params + req.body)
app.put('/servicos/:id', (req, res) => {
  const { id } = req.params;
  const servico = servicos.find(s => s.id === parseInt(id));

  if (!servico) {
    return res.status(404).json({ mensagem: 'Serviço não encontrado.' });
  }

  const { nome, categoria, duracaoMin, preco } = req.body;

  if (nome) servico.nome = nome;
  if (categoria) servico.categoria = categoria;
  if (duracaoMin !== undefined) servico.duracaoMin = Number(duracaoMin);
  if (preco !== undefined) servico.preco = Number(preco);

  return res.status(200).json(servico);
});

// ROTA 5: DELETE /servicos/:id (200 OK - req.params)
app.delete('/servicos/:id', (req, res) => {
  const { id } = req.params;
  const index = servicos.findIndex(s => s.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ mensagem: 'Serviço não encontrado.' });
  }

  const servicoRemovido = servicos.splice(index, 1)[0];

  return res.status(200).json({
    mensagem: 'Serviço removido com sucesso!',
    servico: servicoRemovido
  });
});

// DESAFIO DE SUB-RECURSO: POST /servicos/:id/agendamentos
app.post('/servicos/:id/agendamentos', (req, res) => {
  const { id } = req.params;
  const servico = servicos.find(s => s.id === parseInt(id));

  if (!servico) {
    return res.status(404).json({ mensagem: 'Serviço não encontrado.' });
  }

  const { cliente, data, profissional } = req.body;

  if (!cliente || !data || !profissional) {
    return res.status(400).json({ 
      mensagem: 'Os campos cliente, data e profissional são obrigatórios para agendamento.' 
    });
  }

  const novoAgendamento = {
    id: servico.agendamentos.length + 1,
    cliente,
    data,
    profissional
  };

  servico.agendamentos.push(novoAgendamento);

  return res.status(201).json(novoAgendamento);
});

app.listen(PORT, () => {
  console.log(`Servidor do Salão rodando em http://localhost:${PORT}`);
});