from flask import Flask, request, jsonify
from flask_cors import CORS
login = Flask(__name__)
CORS(login)

users = {
    'admin': 'admin',
    'user': 'user',
    'test': 'test'
}

@login.route('/api/login_user', methods=['POST'])
def login_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if username in users and users[username] == password:
        return jsonify({'success': True , 'message': 'Login successful'})
    else:
        return jsonify({'success': False , 'message': 'Invalid username or password'})
if __name__ == '__main__':
    login.run(debug=True)