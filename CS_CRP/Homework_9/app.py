import os
import requests
from flask import Flask, jsonify, redirect, render_template, send_from_directory

app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
HOME_DIR = os.path.join(BASE_DIR, "home")
GAME_DIR = os.path.join(BASE_DIR, "game")
PORTFOLIO_DIR = os.path.join(BASE_DIR, "portfolio")
API_DIR = os.path.join(BASE_DIR, "api")


@app.get("/")
def home():
    return send_from_directory(HOME_DIR, "index.html")


@app.get("/game")
def game_redirect():
    return redirect("/game/")


@app.get("/game/")
def game():
    return send_from_directory(GAME_DIR, "index.html")


@app.get("/game/<path:filename>")
def game_files(filename):
    return send_from_directory(GAME_DIR, filename)


@app.get("/portfolio")
def portfolio_redirect():
    return redirect("/portfolio/")


@app.get("/portfolio/")
def portfolio():
    return send_from_directory(PORTFOLIO_DIR, "index.html")


@app.get("/portfolio/<path:filename>")
def portfolio_files(filename):
    return send_from_directory(PORTFOLIO_DIR, filename)


@app.get("/api/")
def api_redirect():
    return redirect("/api")


@app.get("/api")
def api_page():
    return send_from_directory(API_DIR, "index.html")


@app.get("/api/data")
def api_data():
    try:
        response = requests.get(
            "https://api.tvmaze.com/search/shows",
            params={"q": "adventure"},
            timeout=12
        )
        response.raise_for_status()
        results = response.json()
        shows = []
        for item in results[:18]:
            show = item.get("show", {})
            image = show.get("image") or {}
            shows.append({
                "name": show.get("name") or "Untitled",
                "summary": show.get("summary") or "No synopsis is available.",
                "image": image.get("medium") or image.get("original"),
                "rating": (show.get("rating") or {}).get("average"),
                "genres": show.get("genres") or [],
                "language": show.get("language") or "Unknown",
                "url": show.get("url")
            })
        return jsonify({"shows": shows})
    except (requests.RequestException, ValueError):
        return jsonify({
            "error": "The screen universe is taking a short break. Please try again in a moment."
        }), 502


@app.errorhandler(404)
def not_found(error):
    return render_template("404.html"), 404


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="0.0.0.0", port=port)
