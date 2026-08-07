# ALMA

App locale con frontend Vite e backend Express su `http://localhost:3001`.

## Avvio

```bash
npm run dev
```

Il comando avvia sia il frontend sia il backend locale.

## Backup locale automatico

ALMA continua a usare `localStorage` per letture e scritture rapide, ma rispecchia automaticamente i dati principali su disco tramite il backend locale.

File principale:

```text
%USERPROFILE%\ALMA-backup\alma-data.json
```

Su macOS/Linux il percorso equivalente e:

```text
~/ALMA-backup/alma-data.json
```

Prima di ogni sovrascrittura, il backend archivia la versione precedente in:

```text
%USERPROFILE%\ALMA-backup\archive\
```

Vengono mantenute solo le ultime 10 copie.

### Dati inclusi

Il backup include queste chiavi:

- `jarvis_todos`
- `jarvis_diary`
- `jarvis_tasks`
- `alma_conversations`

La chiave `alma_key` non viene salvata nel file di backup, per evitare di lasciare una API key in chiaro su disco. Dopo un ripristino completo del browser, va reinserita manualmente nella UI.

### Ripristino automatico

All'avvio, se una o piu chiavi previste mancano da `localStorage` e il file `alma-data.json` esiste, ALMA ripristina automaticamente solo le chiavi mancanti.

### Ripristino manuale

In caso di emergenza:

1. Apri `alma-data.json`.
2. Copia il valore dentro `data`.
3. Apri DevTools nel browser.
4. Per ogni chiave, reinserisci il valore in `localStorage`.

Esempio dalla console DevTools:

```js
localStorage.setItem('jarvis_todos', JSON.stringify(data.jarvis_todos));
localStorage.setItem('jarvis_diary', JSON.stringify(data.jarvis_diary));
localStorage.setItem('jarvis_tasks', JSON.stringify(data.jarvis_tasks));
localStorage.setItem('alma_conversations', JSON.stringify(data.alma_conversations));
```

Poi ricarica la pagina.
