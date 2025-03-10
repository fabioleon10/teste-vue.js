<template>
  <div class="login-container">
    <img class="logo-login" src="../assets/logo.jpg" alt="Logo" />
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Usuário:</label>
        <input type="text" id="username" v-model="username" />
      </div>

      <div>
        <label for="password">Senha:</label>
        <input type="password" id="password" v-model="password" />
      </div>

      <button type="submit">Entrar</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Import JSON 
import loginMockDataJSON from '@/assets/login-mock.json'

const username = ref('')
const password = ref('')
const router = useRouter()

const loginMockData = loginMockDataJSON

// Função de login
const handleLogin = () => {
  // Verifique se o loginMockData foi carregado corretamente
  console.log('Dados do loginMockData:', loginMockData)

  // Verifica se o usuário e senha existem no JSON
  const user = loginMockData.find(user => user.username === username.value && user.password === password.value)

  if (user) {
    // Se o usuário e senha forem encontrados, redireciona para a página de clientes
    router.push('/clientes')
  } else {
    alert('Usuário ou senha inválidos!')
  }
}
</script>

<style scoped>
body {
  background-color: #A50638; /* Cor de fundo desejada */
  margin: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  background-color: white;
  width: 100%;
  max-width: 500px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.logo-login {
  height: 120px;
  border-radius: 5px;
  margin-bottom: 30px;
}

.login-container div {
  margin-bottom: 25px;
  width: 100%;
}

.login-container label {
  font-size: 16px;
  margin-bottom: 8px;
  display: block;
}

.login-container input {
  width: 100%;
  padding: 12px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.login-container button {
  background-color: #A50638;
  color: white;
  width: 100%;
  padding: 15px;
  margin-top: 25px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
}

.login-container button:hover {
  background-color: #8c0331;
}
</style>
