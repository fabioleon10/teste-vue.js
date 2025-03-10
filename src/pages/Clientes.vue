<template>
  <div>
    <header class="header">
      <h1>Cadastro de Clientes</h1>
      <nav>
        <button @click="showForm = !showForm">Cadastrar Cliente</button>
        <button @click="loadClients">Listar Clientes</button>
      </nav>
    </header>

    <div v-if="showForm">
      <h2>{{ isEdit ? 'Editar' : 'Cadastrar' }} Cliente</h2>
      <form @submit.prevent="isEdit ? updateClient() : addClient">
        <!-- Dados do Cliente -->
        <div>
          <label for="cpf">CPF:</label>
          <input type="text" v-model="client.cpf" id="cpf" required />
        </div>
        <div>
          <label for="nome">Nome:</label>
          <input type="text" v-model="client.nome" id="nome" required />
        </div>
        <div>
          <label for="dataNascimento">Data de Nascimento:</label>
          <input type="date" v-model="client.dataNascimento" id="dataNascimento" required />
        </div>
        <div>
          <label for="sexo">Sexo:</label>
          <select v-model="client.sexo" id="sexo" required>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>

        <!-- Endereço do Cliente -->
        <h3>Endereço</h3>
        <div>
          <label for="cep">CEP:</label>
          <input type="text" v-model="client.endereco.cep" id="cep" required />
        </div>
        <div>
          <label for="logradouro">Logradouro:</label>
          <input type="text" v-model="client.endereco.logradouro" id="logradouro" required />
        </div>
        <div>
          <label for="numero">Número:</label>
          <input type="text" v-model="client.endereco.numero" id="numero" required />
        </div>
        <div>
          <label for="bairro">Bairro:</label>
          <input type="text" v-model="client.endereco.bairro" id="bairro" required />
        </div>
        <div>
          <label for="cidade">Cidade:</label>
          <input type="text" v-model="client.endereco.cidade" id="cidade" required />
        </div>
        <div>
          <label for="uf">UF:</label>
          <input type="text" v-model="client.endereco.uf" id="uf" required />
        </div>
        <button type="submit">{{ isEdit ? 'Atualizar' : 'Cadastrar' }}</button>
      </form>
    </div>

    <div v-if="clients.length > 0">
      <h2>Clientes Cadastrados</h2>
      <input type="text" v-model="filter" placeholder="Buscar por nome ou CPF" />
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Data de Nascimento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in filteredClients" :key="client.clienteId">
            <td>{{ client.nome }}</td>
            <td>{{ client.cpf }}</td>
            <td>{{ client.dataNascimento }}</td>
            <td>
              <button @click="editClient(client)">Editar</button>
              <button @click="deleteClient(client.clienteId)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <footer class="footer">
      <p>&copy; 2025 Fundação Carlos Chagas</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

const apiUrl = 'http://dotnetapis.netservices.fcc.org.br/webapi/testecandidato/v1/Cliente'

const showForm = ref(false)
const isEdit = ref(false)
const client = ref({
  cpf: '',
  nome: '',
  dataNascimento: '',
  sexo: '',
  endereco: {
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: ''
  }
})
const clients = ref([])
const filter = ref('')

const loadClients = async () => {
  try {
    const response = await axios.get(`${apiUrl}/Listar`)
    clients.value = response.data
  } catch (error) {
    console.error('Erro ao carregar clientes', error)
  }
}

const addClient = async () => {
  try {
    const response = await axios.post(`${apiUrl}/Adicionar`, client.value)
    alert('Cliente cadastrado com sucesso!')
    loadClients()
    resetForm()
  } catch (error) {
    alert('Erro ao cadastrar cliente.')
    console.error('Erro ao adicionar cliente:', error)
  }
}

const updateClient = async () => {
  try {
    const response = await axios.put(`${apiUrl}/Alterar`, client.value)
    alert('Cliente atualizado com sucesso!')
    loadClients()
    resetForm()
  } catch (error) {
    alert('Erro ao atualizar cliente.')
    console.error('Erro ao atualizar cliente:', error)
  }
}

const deleteClient = async (clientId) => {
  try {
    const response = await axios.delete(`${apiUrl}/Excluir/${clientId}`)
    alert('Cliente excluído com sucesso!')
    loadClients()
  } catch (error) {
    alert('Erro ao excluir cliente.')
    console.error('Erro ao excluir cliente:', error)
  }
}

const editClient = (clientData) => {
  client.value = { ...clientData, endereco: { ...clientData.endereco } }
  isEdit.value = true
  showForm.value = true
}

const resetForm = () => {
  client.value = {
    cpf: '',
    nome: '',
    dataNascimento: '',
    sexo: '',
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      uf: ''
    }
  }
  isEdit.value = false
  showForm.value = false
}

const filteredClients = computed(() => {
  return clients.value.filter(client =>
    client.nome.toLowerCase().includes(filter.value.toLowerCase()) ||
    client.cpf.includes(filter.value)
  )
})
</script>

<style scoped>
/* Estilos básicos para o layout */
.header {
  background-color: #A50638;
  color: white;
  padding: 20px;
  text-align: center;
}

footer {
  background-color: #A50638;
  color: white;
  padding: 10px;
  text-align: center;
}

nav button {
  margin: 10px;
  padding: 10px;
  background-color: #8c0331;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #b54d6b;
}

input, select {
  margin: 5px;
  padding: 8px;
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th, table td {
  padding: 10px;
  text-align: left;
}

table tr:nth-child(even) {
  background-color: #f2f2f2;
}

button {
  background-color: #A50638;
  color: white;
  padding: 8px 16px;
  cursor: pointer;
}

button:hover {
  background-color: #8c0331;
}
</style>
