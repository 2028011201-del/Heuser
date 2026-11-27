# Homework 9 — Your Own Web Server on Render

## Project overview
A Flask backend serving four required routes:
- `/` — home page
- `/game/` — copied Homework 6 Memory Matrix game
- `/portfolio/` — copied Homework 8 comic portfolio
- `/api` — Screen Universe, a live-data discovery page using the free TVmaze API

## Run locally
```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python app.py
```
Open http://127.0.0.1:5000.

## Render settings
- Runtime: Python 3
- Root Directory: `CS_CRP/Homework_9`
- Build Command: `pip install -r requirements.txt`
- Start Command: `gunicorn app:app`
- Instance: Free

The server binds to `0.0.0.0` and uses Render's `PORT` environment variable.

## API idea and documentation
The API page uses TVmaze's public show-search endpoint:
`https://api.tvmaze.com/search/shows?q=adventure`.
It is free, does not require a credit card or API key, and is not a weather API. It returns television-show records, so the page is called **Screen Universe** rather than presenting the results as cinema-only movies. The page displays a loading message and a friendly error message if the request fails.

## Files
- `app.py`: Flask routes and server-side TVmaze request
- `requirements.txt`: Python dependencies
- `templates/`: home, API and 404 pages
- `static/site.css`: server-site styling
- `game/`: Homework 6 game copy
- `portfolio/`: Homework 8 portfolio copy

## Before submission
Test all four routes locally and on Render. Confirm the game and portfolio assets load, the Homework 7 link still opens, the API error state is friendly, and an unknown route shows the custom 404 page. State the coding agent actually used in your submission; this project was prepared with ChatGPT assistance.
