Com certeza\! Você fez um progresso imenso, transformando o projeto de uma aplicação puramente de frontend para uma aplicação full-stack. O `README.md` precisa refletir essa evolução para que qualquer pessoa (incluindo você no futuro ou um recrutador) entenda a arquitetura completa do projeto.

Aqui está uma versão atualizada do seu `README.md`, reescrita para ser condizente com o estado atual do projeto.

-----

# K-Collect: Wishlist Viewer

Sua coleção de photocards de K-pop, organizada do seu jeito. Uma aplicação full-stack com backend em C\# .NET e frontend em React.

## 📖 Sobre o Projeto

K-Collect é uma aplicação web completa construída com uma arquitetura moderna, utilizando .NET para o backend e React para o frontend. O projeto foi projetado para que colecionadores de K-pop possam criar, gerenciar e visualizar suas wishlists de photocards de forma dinâmica e interativa.

O backend, construído com ASP.NET Core, serve como uma API RESTful centralizada, responsável por toda a lógica de negócio e persistência dos dados. O frontend, uma Single Page Application (SPA) em React, consome essa API para oferecer uma experiência de usuário rica e reativa.

Este projeto foi desenvolvido como um estudo prático de tecnologias full-stack, integrando um backend robusto com uma interface de usuário moderna e demonstrando conceitos como arquitetura de API, gerenciamento de estado e comunicação cliente-servidor.

## ✨ Funcionalidades

  * **Criação Dinâmica de Wishlists:** Adicione novas wishlists para diferentes artistas, com nome e foto de perfil personalizados.
  * **Gerenciamento de Coleções:** Dentro de cada wishlist, crie, edite e exclua coleções (ex: "ANTIFRAGILE", "EASY").
  * **Upload de Cards:** Adicione photocards a qualquer coleção fazendo o upload de imagens diretamente do seu computador.
  * **Controle de Coleção:** Marque e desmarque cards como "coletados" com um simples clique, atualizando a UI instantaneamente.
  * **Persistência de Dados:** Suas wishlists e coleções são gerenciadas pelo backend .NET, garantindo que os dados sejam centralizados e seguros.
  * **Tema Customizável:** Alterne entre os modos claro e escuro para uma melhor experiência de visualização.

## 🚀 Tecnologias Utilizadas

### **Backend**

  * **.NET (C\#):** Plataforma e linguagem utilizadas para construir a API.
  * **ASP.NET Core:** Framework para a criação de APIs RESTful robustas e de alto desempenho.
  * **Controllers:** Padrão de arquitetura utilizado para organizar os endpoints da API.

### **Frontend**

  * **React:** Biblioteca principal para a construção da interface de usuário.
  * **React Hooks:** `useState` para gerenciamento de estado local e `useEffect` para efeitos colaterais (como buscar dados da API).
  * **CSS Modules:** Para estilização escopada por componente, evitando conflitos de estilo.
  * **Vite:** Ferramenta de build para um ambiente de desenvolvimento rápido e otimizado.

## 💻 Como Rodar o Projeto

Para rodar este projeto, você precisará ter o **SDK do .NET** e o **Node.js** instalados na sua máquina. O projeto requer que o backend e o frontend sejam executados simultaneamente em terminais separados.

### 1\. Clone o repositório

```bash
git clone https://github.com/yanaguiii/KCollect.git
```

### 2\. Navegue até a pasta do projeto

```bash
cd KCollect
```

### 3\. Inicie o Backend (.NET API)

Abra um terminal e execute os seguintes comandos:

```bash
# Navegue para a pasta do backend
cd backend

# Inicie o servidor da API
dotnet run
```

O backend estará rodando, geralmente em `http://localhost:5062` (verifique a porta exata no seu terminal). **Deixe este terminal aberto.**

### 4\. Inicie o Frontend (React App)

Abra um **novo terminal** (sem fechar o primeiro) e execute os seguintes comandos:

```bash
# Navegue para a pasta do frontend (a partir da raiz do projeto)
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend será aberto no seu navegador, geralmente em `http://localhost:5173`. A aplicação agora está totalmente funcional e se comunicando com o seu backend.