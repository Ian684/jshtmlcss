#pip install flask flask-cors pyjwt werkzeug flask-limiter
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt, datetime
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = Flask(__name__)
app.config["SECRET_KEY"] = "CHANGE_ME_TO_RANDOM_LONG_SECRET"

CORS(app, supports_credentials=True, origins=["http://127.0.0.1:5500", "http://localhost:5500"])

limiter = Limiter(get_remote_address, app=app, default_limits=["200 per day", "50 per hour"])

users = {
    "admin": generate_password_hash("admin"),
    "user": generate_password_hash("user"),
    "test": generate_password_hash("test"),
}

@app.post("/api/login")
@limiter.limit("10 per minute")
def login():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = (data.get("password") or "").strip()

    if not username or not password:
        return jsonify(success=False, message="Missing username or password"), 400

    pw_hash = users.get(username)
    if not pw_hash or not check_password_hash(pw_hash, password):
        return jsonify(success=False, message="Invalid username or password"), 401

    payload = {
        "sub": username,
        "iat": datetime.datetime.utcnow(),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }
    token = jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")

    resp = make_response(jsonify(success=True, message="Login successful"))

    resp.set_cookie(
        "access_token",
        token,
        httponly=True,
        samesite="Lax",
        secure=False, 
        max_age=2*60*60
    )
    return resp

@app.get("/api/me")
def me():
    token = request.cookies.get("access_token")
    if not token:
        return jsonify(success=False, message="Not logged in"), 401
    try:
        payload = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        return jsonify(success=True, username=payload["sub"])
    except jwt.ExpiredSignatureError:
        return jsonify(success=False, message="Token expired"), 401
    except Exception:
        return jsonify(success=False, message="Invalid token"), 401

@app.post("/api/logout")
def logout():
    resp = make_response(jsonify(success=True))
    resp.set_cookie("access_token", "", expires=0)
    return resp

if __name__ == "__main__":
    app.run(debug=True)
