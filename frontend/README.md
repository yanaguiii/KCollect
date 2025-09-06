# K-Collect: Wishlist Viewer

Sua coleção de photocards de K-pop, organizada do seu jeito.

## 📖 Sobre o Projeto
K-Collect é uma Single Page Application (SPA) construída com React, projetada para que colecionadores de K-pop possam criar, gerenciar e visualizar suas wishlists de photocards de forma dinâmica e interativa. Em vez de depender de templates estáticos, esta aplicação permite que o usuário construa sua própria base de dados do zero, salvando todas as informações diretamente no navegador.

Este projeto foi desenvolvido como um estudo prático de conceitos fundamentais e avançados de React, incluindo gerenciamento de estado complexo, manipulação de eventos, componentização e persistência de dados local.

## ✨ Funcionalidades
Criação Dinâmica de Wishlists: Adicione novas wishlists para diferentes artistas, com nome e foto de perfil personalizados.

Gerenciamento de Coleções: Dentro de cada wishlist, crie, edite e exclua coleções (ex: "ANTIFRAGILE", "EASY").

Upload de Cards: Adicione photocards a qualquer coleção fazendo o upload de imagens diretamente do seu computador.

Controle de Coleção: Marque e desmarque cards como "coletados" com um simples clique, atualizando a UI instantaneamente.

Persistência de Dados: Suas wishlists e coleções são salvas no localStorage do navegador, para que seu progresso não seja perdido.

Tema Customizável: Alterne entre os modos claro e escuro para uma melhor experiência de visualização.

## 🚀 Tecnologias Utilizadas
React: Biblioteca principal para a construção da interface de usuário.

React Hooks: useState para gerenciamento de estado local e useEffect para efeitos colaterais (como salvar no localStorage).

CSS Modules: Para estilização escopada por componente.

Vite: Ferramenta de build para um ambiente de desenvolvimento rápido e otimizado.

## 💻 Como Rodar o Projeto
Bash

### Clone o repositório
$ git clone https://github.com/seu-usuario/kcollector-wishlist-viewer.git

### Navegue até a pasta do projeto
$ cd kcollector-wishlist-viewer

### Instale as dependências
$ npm install

# Inicie o servidor de desenvolvimento
$ npm run dev
Abra http://localhost:5173 (ou a porta indicada no seu terminal) para ver o projeto rodando.

