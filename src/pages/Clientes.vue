<template>
  <div class="clientes-container">
    <!-- Cabeçalho -->
    <header class="header">
      <img src="../assets/logo.jpg" alt="Logo" class="logo-clientes" />
      <div class="header-text">
        <h1>Gestão de Clientes</h1>
        <h2>{{ isEditando ? 'Editar Cliente' : 'Novo Cliente' }}</h2> <!-- Subtítulo -->
      </div>
    </header>

    <!-- Conteúdo -->
    <div class="clientes-content">
      <!-- Formulário de cadastro/edição -->
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Nome:</label>
          <input v-model="cliente.nome" required minlength="3" />
        </div>

        <div class="form-group">
          <label>CPF:</label>
          <input v-model="cliente.cpf" @blur="validarCpf" required />
        </div>

        <div class="form-group">
          <label>RG:</label>
          <input v-model="cliente.rg" />
        </div>

        <div class="form-group">
          <label>Data Expedição:</label>
          <input type="date" v-model="cliente.dataExpedicao" />
        </div>

        <div class="form-group">
          <label>Órgão Expedição:</label>
          <input v-model="cliente.orgaoExpedicao" />
        </div>

        <div class="form-group">
          <label>Data Nascimento:</label>
          <input type="date" v-model="cliente.dataNascimento" @blur="validarDataNascimento" required />
        </div>

        <div class="form-group">
          <label>Sexo:</label>
          <select v-model="cliente.sexo" required>
            <option value="">Selecione</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>

        <div class="form-group">
          <label>Estado Civil:</label>
          <select v-model="cliente.estadoCivil" required>
            <option value="">Selecione</option>
            <option value="Solteiro(a)">Solteiro(a)</option>
            <option value="Casado(a)">Casado(a)</option>
            <option value="Divorciado(a)">Divorciado(a)</option>
          </select>
        </div>

        <!-- Endereço -->
        <div class="form-group">
          <label>CEP:</label>
          <input v-model="cliente.endereco.cep" @blur="buscarCep" maxlength="8" required />
        </div>

        <div class="form-group">
          <label>Logradouro:</label>
          <input v-model="cliente.endereco.logradouro" required />
        </div>

        <div class="form-group">
          <label>Número:</label>
          <input v-model="cliente.endereco.numero" required />
        </div>

        <div class="form-group">
          <label>Complemento:</label>
          <input v-model="cliente.endereco.complemento" />
        </div>

        <div class="form-group">
          <label>Bairro:</label>
          <input v-model="cliente.endereco.bairro" required />
        </div>

        <div class="form-group">
          <label>UF:</label>
          <input v-model="cliente.endereco.uf" maxlength="2" required />
        </div>

        <div class="form-group">
          <label>Cidade:</label>
          <input v-model="cliente.endereco.cidade" required />
        </div>

        <button type="submit">{{ isEditando ? 'Salvar Alterações' : 'Adicionar Cliente' }}</button>
      </form>

      <!-- Filtros -->
      <div class="filtros">
        <input type="text" v-model="filtroNome" placeholder="Filtrar por Nome" />
        <input type="text" v-model="filtroCpf" placeholder="Filtrar por CPF" />
        <button @click="filtrarClientes">Filtrar</button>
        <button @click="resetarFiltro">Limpar</button>
      </div>

      <!-- Tabela de clientes -->
      <table class="clientes-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Sexo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cliente in clientesFiltrados" :key="cliente.clienteId">
            <td>{{ cliente.nome }}</td>
            <td>{{ cliente.cpf }}</td>
            <td>{{ cliente.sexo }}</td>
            <td>
              <button @click="editarCliente(cliente)">Editar</button>
              <button @click="excluirCliente(cliente.clienteId)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Rodapé -->
    <footer class="footer">
      <p>&copy; 2024 - Fundação Carlos Chagas</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'

// Endereço da API
const API_BASE = 'http://dotnetapis.netservices.fcc.org.br/webapi/testecandidato/v1/Cliente'

// Cliente e lista
const cliente = reactive({
  clienteId: 0,
  cpf: '',
  nome: '',
  rg: '',
  dataExpedicao: '',
  orgaoExpedicao: '',
  dataNascimento: '',
  sexo: '',
  estadoCivil: '',
  endereco: {
    enderecoId: 0,
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: ''
  }
})

const clientes = ref([])
const isEditando = ref(false)
const filtroNome = ref('')
const filtroCpf = ref('')

// Buscar todos os clientes
const listarClientes = async () => {
  try {
    const response = await axios.get(`${API_BASE}/Listar`)
    clientes.value = response.data
  } catch (error) {
    console.error('Erro ao listar clientes:', error)
  }
}

// Adicionar ou alterar cliente
const handleSubmit = async () => {
  try {
    if (!validarCpf() || !validarDataNascimento()) return

    const data = {
      clienteId: cliente.clienteId,
      cpf: cliente.cpf,
      nome: cliente.nome,
      rg: cliente.rg,
      dataExpedicao: cliente.dataExpedicao,
      orgaoExpedicao: cliente.orgaoExpedicao,
      dataNascimento: cliente.dataNascimento,
      sexo: cliente.sexo,
      estadoCivil: cliente.estadoCivil,
      endereco: cliente.endereco
    }

    if (isEditando.value) {
      await axios.put(`${API_BASE}/Alterar`, data)
      alert('Cliente alterado com sucesso!')
    } else {
      await axios.post(`${API_BASE}/Adicionar`, data)
      alert('Cliente adicionado com sucesso!')
    }
    listarClientes()
    resetarFormulario()
  } catch (error) {
    console.error('Erro ao salvar cliente:', error)
    alert('Erro ao salvar cliente. Tente novamente mais tarde.')
  }
}

// Editar cliente
const editarCliente = (c) => {
  Object.assign(cliente, JSON.parse(JSON.stringify(c)))
  isEditando.value = true
}

// Excluir cliente
const excluirCliente = async (id) => {
  if (!confirm('Tem certeza que deseja excluir?')) return
  try {
    await axios.delete(`${API_BASE}/Excluir/${id}`)
    alert('Cliente excluído com sucesso!')
    listarClientes()
  } catch (error) {
    console.error('Erro ao excluir cliente:', error)
  }
}

// Filtro
const clientesFiltrados = computed(() => {
  return clientes.value.filter(c => {
    const nomeMatch = c.nome.toLowerCase().includes(filtroNome.value.toLowerCase())
    const cpfMatch = c.cpf.includes(filtroCpf.value)
    return nomeMatch && cpfMatch
  })
})

const filtrarClientes = () => { /* já filtra com computed */ }

const resetarFiltro = () => {
  filtroNome.value = ''
  filtroCpf.value = ''
}

// Validações
const validarCpf = () => {
  const cpf = cliente.cpf.replace(/\D/g, '')
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    alert('CPF inválido!')
    return false
  }
  return true
}

const validarDataNascimento = () => {
  if (!cliente.dataNascimento) {
    alert('Data de nascimento obrigatória!')
    return false
  }
  return true
}

// Busca CEP no ViaCEP
const buscarCep = async () => {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cliente.endereco.cep}/json/`)
    const data = response.data
    if (data.erro) {
      alert('CEP não encontrado!')
      return
    }
    cliente.endereco.logradouro = data.logradouro
    cliente.endereco.bairro = data.bairro
    cliente.endereco.cidade = data.localidade
    cliente.endereco.uf = data.uf
  } catch (error) {
    alert('Erro ao buscar CEP!')
  }
}

// Limpa o formulário
const resetarFormulario = () => {
  Object.assign(cliente, {
    clienteId: 0, 
    cpf: '',
    nome: '',
    rg: '',
    dataExpedicao: '',
    orgaoExpedicao: '',
    dataNascimento: '',
    sexo: '',
    estadoCivil: '',
    endereco: {
      enderecoId: 0, 
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: ''
    }
  })
  isEditando.value = false
}

onMounted(() => {
  listarClientes()
})
</script>

<style scoped>
.clientes-container {
  background-color: white;
  width: 100%;
  max-width: 1200px;
  margin: 40px auto;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.header .logo-clientes {
  height: 80px;
  border-radius: 5px;
  margin-right: 30px; 
}

.header-text {
  display: flex;
  flex-direction: column;
  text-align: center;
  flex: 1; 
}

.header-text h1,
.header-text h2 {
  margin: 0;
  padding: 0;
}

.footer {
  text-align: center;
  margin-top: 20px;
  color: #888;
}

.clientes-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

form {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 20px;
}

.form-group {
  flex: 1 1 48%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  flex: 1 1 100%;
}

.form-group input, .form-group select {
  padding: 8px;
  font-size: 13px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
}

form button {
  width: 100%;
  background-color: #A50638;
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  border: none;
  transition: background-color 0.3s ease;
}

form button:hover {
  background-color: #ff6600; 
}

.filtros {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center; 
}

.filtros input {
  padding: 8px;
  font-size: 13px;
  flex: 1 1 45%;
}

.filtros button {
  background-color: #A50638;
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  flex: 0 1 45%;
  transition: background-color 0.3s ease;
}

.filtros button:hover {
  background-color: #ff6600; 
}

.clientes-table {
  width: 100%;
  margin-top: 30px;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

.clientes-table th,
.clientes-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.clientes-table th {
  background-color: #f7f7f7;
}

.clientes-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.clientes-table button {
  background-color: #ff8c00;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.3s ease;
}

.clientes-table button:hover {
  background-color: #ff6600;
}

/* Responsividade */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    text-align: center;
  }

  .header .logo-clientes {
    margin-bottom: 10px;
  }

  .clientes-container {
    padding: 15px;
  }

  .form-group {
    flex: 1 1 100%;
  }

  .filtros input, .filtros button {
    flex: 1 1 100%;
  }
}
</style>
