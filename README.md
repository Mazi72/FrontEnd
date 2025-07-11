README - GymPro (React + Vite)

💪 Fitness App

Una moderna applicazione web fitness sviluppata con React + Vite, che permette agli utenti di seguire allenamenti, monitorare i propri progressi, gestire il profilo e, per gli amministratori ovvero i coach, di creare e modificare contenuti.


📌 Descrizione del progetto

- Login con ruoli: utente (atleta) e admin (coach)
- Navigazione tra più pagine (Home, Dashboard, Allenamento, ecc.)
- Routing dinamico per visualizzare dettagli
- Stato globale con Redux Toolkit + Thunk
- Moduli/form controllati con validazione
- Recupero dati dinamici da un’API mock (JSON Server)
- UI responsive e moderna


🚀 Come eseguire il progetto

1. Clona il repository o estrai lo zip
2. Installa le dipendenze: npm install
3. Avvia il frontend con: npm run dev
4. Avvia JSON Server: npx json-server --watch db.json --port 3000


🧩 Struttura dell'applicazione

src/pages/: contiene le pagine principali
src/components/: componenti riutilizzabili
src/features/: Redux slice
src/hooks/: hook personalizzati


🔐 Autenticazione e Ruoli

- Login finto con due ruoli (utente e admin)
- Accesso a viste diverse a seconda del ruolo


🧠 Stato globale

- Redux Toolkit
- Redux Thunk per chiamate asincrone


🔄 Routing

- React Router v6
- Routing dinamico con useParams e Route path


📬 Form e Validazione

- Almeno 4 form controllati
- Validazione dei campi
- Gestione errori


🌐 API

- JSON Server usato come backend mock


🎨 Stile e UI

- Layout responsive
- (Inserire qui: Tailwind, Bootstrap, ecc. se usati)


🧪 Tecnologie utilizzate

- React, Vite, Redux Toolkit, Redux Thunk, React Router, JSON Server


📁 File principali

- main.jsx,
- App.jsx,
- store.jsx,
- db.json


📌 Autore

- Nome: Andrea Antonelli
- Corso: FrontEnd Programming
- Data: Luglio 2025


📎 Note
- ⚠️ Il progetto è in **versione beta**: lo sviluppo è focalizzato attualmente solo sul frontend.
- Il backend è simulato con JSON Server, ma in futuro sarà necessario sviluppare un'API reale.
- Mancano ancora dati completi nel database: molte sezioni sono strutturate ma non ancora popolate.

Nota extra per il Prof: Desidero scusarmi in anticipo per l’estrema semplicità dell’applicazione. A causa del tempo limitato a mia disposizione, non sono riuscito a sviluppare tutte le funzionalità e a rifinire l’interfaccia come avrei voluto. Ho sottostimato il tempo richiesto per lo sviluppo concreto di un app con React, purtroppo.
Ho comunque cercato di rispettare con attenzione tutte le richieste specificate nell’assignment, focalizzandomi sull’implementazione corretta delle funzionalità principali. Anche se il risultato finale è essenziale, spero possa comunque dimostrare l’impegno e la comprensione degli argomenti trattati.

🎉 Buon allenamento!