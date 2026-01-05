# BIM Web Viewer | IGP Engineering Thesis

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Technology](https://img.shields.io/badge/BIM-IFC%20%7C%20XKT-orange)
![Framework](https://img.shields.io/badge/Built%20with-JavaScript%20%2F%20xeokit-green)

Profesjonalna przeglądarka modeli BIM online, stworzona w ramach pracy inżynierskiej. Aplikacja umożliwia wysokowydajną wizualizację wielkogabarytowych modeli budynków bezpośrednio w przeglądarce przy użyciu formatów IFC oraz zoptymalizowanego XKT.

## 🚀 Kluczowe Funkcje
- **High-Performance Rendering:** Obsługa formatu `.xkt` pozwalająca na płynne wyświetlanie modeli o bardzo dużej liczbie obiektów.
- **Wsparcie IFC:** Możliwość ładowania i parsowania plików w standardzie Industry Foundation Classes.
- **Hierarchia Obiektów:** Pełne drzewo struktury modelu (Project -> Site -> Building -> Storey -> Element).
- **Zarządzanie Widocznością:** Ukrywanie/izolowanie elementów, kontrola przezroczystości oraz przekroje techniczne (clipping planes).
- **Inspektor Właściwości:** Dostęp do metadanych BIM przypisanych do poszczególnych komponentów modelu.

## 🛠 Stack Techniczny
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Silnik Wizualizacji:** [xeokit SDK](https://xeokit.io/) / [Three.js]
- **Obsługa Formatów:** BIM Data conversion (IFC -> XKT)
- **Deployment:** [np. GitHub Pages / Vercel / Docker]

## 📂 Struktura Projektu
- `/src` – Kod źródłowy aplikacji (logika przeglądarki, obsługa zdarzeń).
- `/models` – Przykładowe modele w formacie `.xkt` i `.ifc`.
- `/dist` – Skompilowana wersja produkcyjna.
- `/docs` – Dokumentacja techniczna i opis teoretyczny związany z pracą inżynierską.

## ⚙️ Instalacja i Uruchomienie
Aby uruchomić projekt lokalnie, wykonaj poniższe kroki:

1. Sklonuj repozytorium:
   ```bash
   git clone [https://github.com/P4TTRYK/IGP-BIM-EngineeringThesis.git](https://github.com/P4TTRYK/IGP-BIM-EngineeringThesis.git)