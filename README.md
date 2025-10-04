# LookBook API

API JSON RESTful sviluppata con **Node.js**, **Express.js** e **Sequelize (MySQL)** per la gestione di utenti, prodotti e ordini di tipo swap, parte del progetto **LookBook**.

---

## Descrizione

LookBook è un’app per la vendita e lo scambio di abbigliamento second-hand.  
Questa API consente di:

- Creare, leggere, aggiornare ed eliminare utenti.
- Creare, leggere, aggiornare ed eliminare prodotti.
- Creare, leggere, aggiornare ed eliminare ordini swap.
- Filtrare gli ordini per data e per prodotti contenuti.

---

## Tecnologie utilizzate

- **Node.js**
- **Express.js** per la gestione delle route e delle richieste HTTP
- **Sequelize** come ORM per MySQL
- **MySQL** come database
- **express-validator** per validazione dei dati
- **dotenv** per la gestione delle variabili d’ambiente

---

## Struttura del progetto

- `/config` -> Configurazione database
- `/models` -> Modelli Sequelize (`User`, `Product`, `SwapOrder`)
- `/routes` -> Rotte API (`users.js`, `products.js`, `swapOrders.js`)
- `/migrations` -> Script SQL per creare le tabelle
- `app.js` -> Configurazione Express
- `server.js` -> Avvio server
- `.env` -> Variabili d'ambiente

---

## 🚀 Installazione

1. Clonare il repository:

```bash
git clone https://github.com/tuo-username/lookbook-api.git
cd lookbook-api
```

2. Installare le dipendenze del progetto con npm

```bash
npm install
```

3. Configurare il file .env

```ini
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=tuapassword
MYSQL_DATABASE=lookbook
PORT=3000
```

4. Creare il database MySQL ed eseguire lo script "migrations.sql" nella cartella /migrations per creare le tabelle

5. Avviare il server

```bash
npm run dev
```

Il server sarà disponibile su: http://localhost:3000

## Endpoints principali

### Users

- **POST** `/api/users` → Crea un nuovo utente
- **GET** `/api/users/:id` → Legge un utente per ID
- **PUT** `/api/users/:id` → Aggiorna un utente
- **DELETE** `/api/users/:id` → Elimina un utente

### Products

- **POST** `/api/products` → Crea un prodotto
- **GET** `/api/products/:id` → Legge un prodotto per ID
- **PUT** `/api/products/:id` → Aggiorna un prodotto
- **DELETE** `/api/products/:id` → Elimina un prodotto

### Swap Orders

- **POST** `/api/orders` → Crea un ordine swap
- **GET** `/api/orders/:id` → Legge un ordine swap per ID
- **GET** `/api/orders` → Legge tutti gli ordini, con possibilità di filtro per data o prodotto
- **PUT** `/api/orders/:id` → Aggiorna un ordine swap
- **DELETE** `/api/orders/:id` → Elimina un ordine swap

## Sicurezza

- Tutte le query MySQL sono protette da **prepared statements** tramite Sequelize, evitando SQL Injection.
- La validazione dei dati in ingresso è gestita con **express-validator**.
- Le variabili sensibili sono mantenute nel file `.env`, **ignorato da Git** tramite `.gitignore`.

## Test API

È possibile testare gli endpoint con:

- **Postman**
- **Thunder Client** (estensione VS Code)

## Autore

Giovanni Lapalombella per Start2Impact
