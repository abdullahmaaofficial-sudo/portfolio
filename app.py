from flask import Flask,render_template,jsonify,request
from email.message import EmailMessage 
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import smtplib
import os

app = Flask(__name__)

load_dotenv()
my_email = os.getenv("EMAIL_ADDRESS")
app_password = os.getenv("EMAIL_PASSWORD")

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",
)


@app.route('/')
def home():
    return render_template('index.html')

@app.route("/contact", methods=["POST"])
@limiter.limit("5 per minute; 20 per day")
def contact():
    name = request.form.get("name")
    email = request.form.get("email")
    message = request.form.get("message")

    if not name or not email or not message:
        return jsonify({'sent': False, 'msg': 'Please provide all information'})

    try:
        msg = EmailMessage()

        msg["Subject"] = f"Portfolio Message from {name}"
        msg["From"] = my_email
        msg["To"] = my_email
        msg["Reply-To"] = email

        msg.set_content(f"""
            Name: {name}
            Email: {email}
            Message:{message}
        """)

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(my_email, app_password)
            server.send_message(msg)
    except:
        return jsonify({'sent': False, 'msg': 'An error occurred. Please try again.'})

    return jsonify({'sent': True, 'msg': 'Message sent successfully'})

@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({'sent': False, 'msg': 'Too many requests. Please try again later.'}), 429

if __name__ == "__main__":
    app.run(debug=False,host='0.0.0.0')