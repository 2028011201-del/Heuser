# Homework 9 — Your Own Web Server

## Project overview
A Flask backend serving the four required routes:
- `/` — home page with links to the three destinations
- `/game` — Homework 6 game
- `/portfolio` — Homework 8 portfolio
- `/api` — Screen Universe, a live-data discovery page using the free TVmaze API

## Run locally
```bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python app.py
```
Open http://127.0.0.1:5000.

## Deploy on Vercel
This folder is the Vercel project root. When importing the GitHub repository:
1. Select the `2028011201-del/Heuser` repository.
2. Set **Root Directory** to `CS_CRP/Homework_9`.
3. Keep the detected Python/Flask framework settings and deploy.
4. No API key or environment variable is required for the TVmaze API.

Vercel supports Flask applications and can detect the app from `app.py` and dependencies in `requirements.txt`. The app's routes serve the home, game, portfolio, and API pages.

## API idea
The API page uses TVmaze's public show-search endpoint:
`https://api.tvmaze.com/search/shows?q=adventure`.
It is free, does not require an API key, and is not a weather API. The page transforms the returned television-show data into a poster-style discovery wall, with artwork, genres, language and ratings rather than raw JSON or a plain table. It displays a loading message and a friendly error message if the request fails.

## Project folders
- `app.py`: Flask routes and server-side TVmaze request
- `requirements.txt`: Python dependencies
- `home/`: home page
- `game/`: Homework 6 game copy
- `portfolio/`: Homework 8 portfolio copy
- `api/`: live-data page
- `templates/404.html`: custom not-found page
- `static/site.css`: shared server-site styling

## Before submission
Test all four routes on the deployed site. Confirm the game and portfolio assets load, the Homework 7 link still opens, the API error state is friendly, and an unknown route shows the custom 404 page. State the coding agent actually used in your submission.
