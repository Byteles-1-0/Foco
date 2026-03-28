# Prompt — Adattamento dashboard al design di riferimento

Adatta la dashboard esistente in **Next.js + TypeScript + Tailwind + shadcn/ui** seguendo fedelmente il design del reference screen allegato.

## Obiettivo
Trasformare la dashboard attuale in una UI con estetica **dark premium**, minimale, elegante e altamente pulita, con focus su:
- gerarchia visiva forte
- look SaaS moderno
- card principale con effetto “floating panel”
- sidebar interna compatta
- contenuti ordinati, leggibili e ben spaziati
- contrasto elevato ma non aggressivo

## Direzione stilistica
Il design deve riflettere queste caratteristiche:

- **Tema scuro profondo**
  - sfondo quasi nero
  - pannelli con leggere differenze tonali
  - bordi sottili e morbidi
  - glow/shadow molto delicati

- **Hero text molto evidente**
  - label piccola in alto: `PROJECT DASHBOARD`
  - headline grande, bianca, multilinea
  - forte impatto tipografico
  - ampia spaziatura verticale sopra il mockup

- **Card/mockup centrale**
  - grande contenitore con angoli molto arrotondati
  - bordo leggero e shadow elegante
  - effetto layered con pannello di sfondo sfalsato dietro
  - interno simile a una finestra/app desktop

- **Top bar del pannello**
  - tre dots a sinistra
  - label `WORKSPACE` centrata
  - look discreto, leggermente trasparente

- **Sidebar sinistra interna**
  - colonna stretta
  - tab verticali con icona + label
  - stato attivo con:
    - background leggermente più chiaro
    - pill/indicator verticale sottile a sinistra
    - testo più luminoso
  - badge piccoli e discreti per alcune voci

- **Area contenuto a destra**
  - titolo sezione in uppercase (`PROJECT OVERVIEW`)
  - sottotitolo piccolo e muted
  - card KPI con:
    - titolo piccolo
    - valore grande (`94.2%`)
    - progress bar sottile
    - testo descrittivo secondario
  - griglia inferiore con mini statistiche/cards

## Mood visivo
La dashboard deve sembrare:
- professionale
- premium
- pulita
- tecnologica
- moderna
- sobria

Evitare:
- colori troppo saturi
- ombre pesanti
- glassmorphism invasivo
- elementi troppo “giocosi”
- spacing stretto o caotico

## Requisiti di layout
### Container principale
- centrato nella pagina
- larghezza massima ampia ma controllata
- molto respiro ai lati
- padding generoso
- ottimo comportamento responsive

### Header esterno
Inserire:
- eyebrow label piccola in uppercase
- headline grande su 2 righe circa
- distanza importante tra testo e mockup

### Dashboard mockup
Struttura:
1. frame esterno grande con rounded corners
2. layer posteriore offset
3. finestra principale in primo piano
4. top bar
5. sidebar sinistra
6. content panel destro

## Specifiche UI
### Tipografia
Usare una gerarchia molto chiara:
- label: piccola, uppercase, muted
- heading hero: molto grande, semibold/bold
- section title: uppercase, medium
- body text: piccolo e leggibile
- KPI value: grande e forte

### Colori
Usare una palette dark neutra, ad esempio:
- background: quasi nero
- panel: nero/grigio molto scuro
- border: grigio tenue con opacità bassa
- text primary: bianco soft
- text secondary: grigio muted
- accent: chiaro/neutro o primary già presente nel tema, ma usato con moderazione

### Bordi e raggi
- card esterne: molto arrotondate
- card interne: arrotondate ma più compatte
- bordi sottili, eleganti, quasi impercettibili

### Ombre
- shadow ampia ma soft
- glow leggerissimo sul container principale
- niente shadow dura

## Comportamento responsive
Su mobile e tablet:
- mantenere il design premium
- ridurre headline in modo proporzionato
- evitare overflow orizzontale
- mockup scalabile
- sidebar e contenuti devono restare leggibili
- se necessario, ridurre padding e dimensioni interne in modo armonioso

## Interazioni
Le animazioni devono essere minime e raffinate:
- transizione morbida sul cambio tab
- hover delicato sui tab
- hover quasi impercettibile sul container principale
- nessun effetto appariscente

## Componenti da aggiornare
Adatta i seguenti elementi al nuovo design:
- wrapper della pagina demo
- card principale della dashboard
- hero section testuale
- top bar del pannello
- sidebar tabs
- area overview
- KPI card
- mini stat cards
- spacing, font-size, border radius, ombre e colori

## Vincoli tecnici
- Usa **Next.js**
- Usa **TypeScript**
- Usa **Tailwind CSS**
- Mantieni compatibilità con **shadcn/ui**
- Mantieni il componente pulito e riutilizzabile
- Evita dipendenze non necessarie
- Non rompere la struttura del componente esistente se non serve
- Se possibile, migliora i nomi delle classi e la leggibilità del codice

## Output richiesto
Fornisci:
1. il componente aggiornato
2. eventuali classi Tailwind migliorate
3. eventuali piccoli aggiustamenti strutturali
4. una versione visivamente il più vicina possibile allo screen di riferimento

## Priorità assolute
1. Fedeltà visiva allo screen
2. Pulizia del layout
3. Corretta gerarchia tipografica
4. Spacing premium
5. Eleganza dark UI

## Nota finale
Il risultato finale deve sembrare una dashboard SaaS di fascia alta, ispirata allo screen allegato: scura, pulita, raffinata, con hero statement molto forte e mockup centrale dal look editor/workspace.