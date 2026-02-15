# RAG (Retrieval-Augmented Generation) – Node.js
Prosty projekt RAG napisany w node JS z uzyciem modelu OpenAI.
Pozwala zadawać pytania i odpowadać na podstawie dostarczonego dokumentu.


## Funkcjonalności
- Proste czyszczenie tekstu
- Generowanie chunków wraz z overlapem
- Reprezentacja chunków jako wektory
- Reprezentacja zapytania uzytkownika jako wektor
- Obliczenie podobieństwa cosinusowego aby znaleźć chunki z tekstu podobne do zapytania uzytkownika.
- Tworzenie promptu z zapytaniem oraz wybranymi fragmentami tekstu i przesłanie do modelu aby uzyskać odpowiedź.

## Wymagania
- Node.js >= 18
- Konto OpenAI oraz klucz API (ustawiony jako zmienna środowiskowa `OPENAI_API_KEY`)

## Instalacja
```bash
npm install
```

## Użycie
1. Umieść plik tekstowy (np. "zemsta.txt") w katalogu `src/`.
2. Uruchom aplikację:
```bash
node src/app.js
```
3. Wprowadź pytanie dotyczące treści dokumentu, gdy pojawi się odpowiedni komunikat.

## Pliki
- `src/app.js` – główny plik aplikacji
- `src/zemsta.txt` – przykładowy dokument tekstowy

## Działanie
Aplikacja dzieli dokument na fragmenty, generuje embeddingi, a następnie na podstawie zapytania użytkownika wyszukuje najbardziej pasujące fragmenty i generuje odpowiedź, korzystając wyłącznie z tych fragmentów.

## Licencja
MIT
