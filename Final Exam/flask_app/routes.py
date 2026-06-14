# Author: Prof. MM Ghassemi <ghassem3@msu.edu>
from flask import current_app as app
from flask import render_template, redirect, request, session, url_for, copy_current_request_context
from flask_socketio import SocketIO, emit, join_room, leave_room, close_room, rooms, disconnect
from .utils.database.database  import database
from werkzeug.datastructures   import ImmutableMultiDict
from pprint import pprint
import json
import random
import functools
from bs4 import BeautifulSoup
import requests
import enchant
from . import socketio
db = database()
d = enchant.Dict("en_US")

#######################################################################################
# AUTHENTICATION RELATED
#######################################################################################
def login_required(func):
    @functools.wraps(func)
    def secure_function(*args, **kwargs):
        if "email" not in session:
            return redirect(url_for("login", next=request.url))
        return func(*args, **kwargs)
    return secure_function

def getUser():
    if 'email' in session:
        decrypt_email = db.reversibleEncrypt('decrypt', session['email'])
    return decrypt_email if 'email' in session else 'Unknown'

@app.route('/login')
def login():
	return render_template('login.html')

@app.route('/signup')
def signup():
	return render_template('signup.html')

@app.route('/logout')
def logout():
	session.pop('email', default=None)
	return redirect('/')

@app.route('/processlogin', methods = ["POST","GET"])
def processlogin():
    form_fields = dict((key, request.form.getlist(key)[0]) for key in list(request.form.keys()))
    session['email'] = form_fields['email']

    # authenticate given email and password
    status = db.authenticate(form_fields['email'], form_fields['password'])

    #if authentic, encrypt email    
    if status.get('success') == 1:
        session['email'] = db.reversibleEncrypt('encrypt', form_fields['email'])

    return json.dumps(status.get('success'))

@app.route('/processsignup', methods = ["POST","GET"])
def processsignup():
    form_fields = dict((key, request.form.getlist(key)[0]) for key in list(request.form.keys()))
    
    # add user to database
    status = db.createUser(form_fields['email'], form_fields['password'], 'guest')

    #if created, encrypt email    
    if status.get('success') == 1:
        session['email'] = db.reversibleEncrypt('encrypt', form_fields['email'])
        
    return json.dumps(status.get('success'))
    
#######################################################################################
# CHATROOM RELATED
#######################################################################################
@app.route('/chat')
@login_required
def chat():
    return render_template('chat.html', user=getUser())

# get style of text for chat
def getChatStyle():
    # default
    style = 'width: 100%;color:grey;text-align: left'
    # change if user is the owner
    if getUser() == "owner@email.com":
        style = 'width: 100%;color:blue;text-align: right'
    return style

@socketio.on('joined', namespace='/chat')
def joined(message):
    join_room('main')
    emit('status', {'msg': getUser() + ' has entered the room.', 'style': getChatStyle()}, room='main')

@socketio.on('msg_sent', namespace='/chat')
def msg_sent(message):
    emit('status', {'msg': message, 'style': getChatStyle()}, room='main')

@socketio.on('leave', namespace='/chat')
def leave(message):
     emit('status', {'msg': getUser() + ' has left the room.', 'style': getChatStyle()}, room='main')
     leave_room('main')

#####################################################################
# WORLDL
#####################################################################
# finds and returns word of the day from merrium webster
#https://www.reddit.com/r/learnpython/comments/qzr8ir/how_to_start_web_scraping_with_python/
@app.route('/worldl++')
@login_required
def wordle():
    played_worldl = db.playedWorldl(getUser())
    if played_worldl == False:
        return redirect('/instructions')
    else:
        return render_template('worldl++.html', user=getUser())
    
@app.route('/instructions')
def instructions():
    return render_template('instructions.html', user=getUser())

def get_word_of_day():
    word_class = "word-header-txt"
    URL = 'https://www.merriam-webster.com/word-of-the-day'
    hdr = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36'}
    page = requests.get(URL, headers=hdr)
    soup = BeautifulSoup(page.content, "html.parser")
    word_of_day = soup.find(class_=word_class)
    return word_of_day.text
    
@socketio.on('get_word', namespace='/worldl')
def get_word(message):
    wod = get_word_of_day()
    emit('return_word', {'word' : wod})

@app.route('/validateword', methods = ["POST","GET"])
def validateword():
    form_fields = dict((key, request.form.getlist(key)[0]) for key in list(request.form.keys()))
    valid = d.check(form_fields['word'])
    if valid == True:
        return json.dumps(1)
    else:
        return json.dumps(0)

#######################################################################################
# OTHER
#######################################################################################
@app.route('/')
def root():
	return redirect('/home')

@app.route('/home')
def home():
	print(db.query('SELECT * FROM users'))
	x = random.choice(['I started university when I was a wee lad of 15 years.','I have a pet sparrow.','I write poetry.'])
	return render_template('home.html', user=getUser(), fun_fact = x)

@app.route('/projects')
def projects():
    return render_template('projects.html', user=getUser())

@app.route('/piano')
def piano():
    return render_template('piano.html', user=getUser())

@app.route("/static/<path:path>")
def static_dir(path):
    return send_from_directory("static", path)

@app.after_request
def add_header(r):
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    return r
