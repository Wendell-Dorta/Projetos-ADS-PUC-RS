# ⚔️ Text-Adventure RPG — Programação Orientada a Objetos (2º Semestre)

Engine completa de **RPG de Aventura em Texto** desenvolvida na disciplina de **Programação Orientada a Objetos** na graduação em ADS (PUC-RS).

---

## 📌 Arquitetura e Paradigmas

O projeto aplica os conceitos clássicos da orientação a objetos combinados com o paradigma de **Design by Contract (DbC)**:
- **Encapsulamento**: Atributos privados e métodos de acesso para estado de salas, ferramentas e inventário.
- **Herança e Polimorfismo**: Especializações de ferramentas em `FerramentasAventura.js` e objetos interativos em `ObjetosAventura.js`.
- **Design by Contract (`bycontract`)**: Validações de pré-condições, pós-condições e invariantes na transição de estados e comandos do jogador.
- **Game Engine**: Máquina de estados orientada a eventos em `JogoAventura.js` gerenciando comandos textuais (`pegar`, `usar`, `ir`, `inventario`, `olhar`).

---

## 📁 Arquivos do Módulo

- `index.js`: Ponto de entrada CLI e inicialização da partida.
- `JogoAventura.js`: Motor de jogo, parser de comandos e controle de vitória/derrota.
- `SalasAventura.js`: Modelagem do mapa de salas e conexões direcionais.
- `ObjetosAventura.js`: Itens interativos espalhados pelos cenários.
- `FerramentasAventura.js`: Ferramentas com ações especiais no inventário.
- `Basicas.js`: Classes abstratas base e utilitários de contrato.
- `package.json`: Configurações do Node.js e dependência de `bycontract`.

---

## 🚀 Como Executar

```bash
# 1. Instalar dependências
npm install

# 2. Executar o jogo
npm start
# ou
node index.js
```
