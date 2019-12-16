import flask
from flask import render_template, request, jsonify, flash, redirect, url_for
from questi.app import app, db
from flask_login import current_user, login_user, logout_user
from questi.app.models import User
from questi.app.forms import LoginForm, RegistrationForm
from flask_login import logout_user

current_id = 31

questions_list = [
    {
        "id": 1,
        "question": "Can you explain binary search trees",
        "votes": 10,
        "upvoted_users": [],
        "session_code": "1981k21kj"
    },
    {
        "id": 2,
        "question": "What is a stack",
        "votes": 20,
        "upvoted_users": [],
        "session_code": "1981k21ka"
    },
    {
        "id": 3,
        "question": "What is infix notation",
        "votes": 30,
        "upvoted_users": [],
        "session_code": "198afadsf1ka"
    },
    {
        "id": 4,
        "question": "What is infix notation 4",
        "votes": 40,
        "upvoted_users": [],
        "session_code": "1981k21ka"
    },
    {
        "id": 5,
        "question": "What is infix notation 5",
        "votes": 50,
        "upvoted_users": [],
        "session_code": "1981k21ka"
    },
    {
        "id": 6,
        "question": "What is infix notation 6",
        "votes": 60,
        "upvoted_users": [],
        "session_code": "198afadsf1ka"
    },
    {
        "id": 7,
        "question": "What is infix notation 7",
        "votes": 70,
        "upvoted_users": [],
        "session_code": "198afadsf1ka"
    },
    {
        "id": 8,
        "question": "What is infix notation 8",
        "votes": 80,
        "upvoted_users": [],
        "session_code": "198afadsf1ka"
    },
    {
        "id": 9,
        "question": "What is infix notation 9",
        "votes": 90,
        "upvoted_users": [],
        "session_code": "198afadsf1ka"
    }
]

sessions_list = [
    {
        "session_code": "198afadsf1ka",
        "created_by_user": "sun",
        "session_name": "198afadsf1ka"
    },
    {
        "session_code": "1981k21ka",
        "created_by_user": "sun",
        "session_name": "198afadsf1ka"
    }
]


@app.route('/')
def index():
    # form = LoginForm()
    # if not current_user.is_authenticated:
    #     return redirect(url_for('login'))
    username = ''
    if current_user.is_authenticated:
        username = current_user.username

    return render_template('start.html',
                           is_authenticated=current_user.is_authenticated,
                           username=username)

@app.route('/home')
def home():
    # form = LoginForm()
    # if not current_user.is_authenticated:
    #     return redirect(url_for('login'))
    username = ''
    if current_user.is_authenticated:
        username = current_user.username

    return render_template('home.html',
                           is_authenticated=current_user.is_authenticated,
                           username=username)

@app.route('/generate')
def generate_page():
    # form = LoginForm()
    # if not current_user.is_authenticated:
    #     return redirect(url_for('login'))
    username = ''
    if current_user.is_authenticated:
        username = current_user.username

    return render_template('generate.html', title='generate', user_type=current_user.user_type)


@app.route('/questions')
def questions():
    global questions_list

    session_code = request.args.get('session_code')
    print(session_code)

    form = LoginForm()
    if not current_user.is_authenticated:
        return redirect(url_for('login'))

    questions_for_session = []
    for question in questions_list:
        if str(question['session_code']) == str(session_code):
            questions_for_session.append(question)

    session_name = ''
    for session in sessions_list:
        if session['session_code'] == session_code:
            session_name = session['session_name']
            break

    return render_template('questions.html', session_code=session_code,
                           session_name=session_name,
                           questions=questions_for_session,
                           user_type=current_user.user_type,
                           username=current_user.username)


@app.route('/save_question', methods=['GET', 'POST'])
def save_question():
    global questions_list
    global current_id

    question_data = request.get_json()
    question_data["id"] = current_id
    current_id += 1
    questions_list.append(question_data)

    session_code = question_data["session_code"]
    questions_for_session = []
    for question in questions_list:
        if str(question['session_code']) == str(session_code):
            questions_for_session.append(question)

    return jsonify(questions=questions_for_session, question_data=question_data)


@app.route('/update_session_name', methods=['GET', 'POST'])
def update_session_name():
    session_data = request.get_json()
    for i in range(len(sessions_list)):
        if sessions_list[i]['session_code'] == session_data['session_code']:
            sessions_list[i]['session_name'] = session_data['new_session_name']

    questions_for_session = []
    for question in questions_list:
        if str(question['session_code']) == session_data['session_code']:
            questions_for_session.append(question)

    return jsonify(questions=questions_for_session,
                   session_name=session_data['new_session_name'],
                   user_type=current_user.user_type)


@app.route('/update_question', methods=['GET', 'POST'])
def update_question():
    print("update_question")
    global questions_list
    global current_id

    question_data = request.get_json()
    update_id = int(question_data["id"])
    new_count = int(question_data["new_count"])

    print("Update id: ", update_id)
    index_to_update = None
    for (i, s) in enumerate(questions_list):
        s_id = s["id"]
        if s_id == update_id:
            print("found it: ")
            print(i, s)
            index_to_update = i
            break

    current_username = current_user.username

    users = questions_list[index_to_update]["upvoted_users"]
    upvoted = current_username in users
    if index_to_update is not None:
        if not upvoted:
            questions_list[index_to_update]["votes"] = new_count
            questions_list[index_to_update]["upvoted_users"].append(
                current_username)
        else:
            questions_list[index_to_update]["votes"] = new_count - 2
            questions_list[index_to_update]["upvoted_users"].remove(
                current_username)

    session_code = question_data["session_code"]
    questions_for_session = []
    for question in questions_list:
        if str(question['session_code']) == str(session_code):
            questions_for_session.append(question)

    return jsonify(questions=questions_for_session)


@app.route('/register', methods=['GET', 'POST'])
def register():
    print(current_user)

    if current_user.is_authenticated:
        print("user is already registered - take them to the homepage")
        return redirect(url_for('index'))

    print("user needs to register")
    form = RegistrationForm()

    print("form")
    if form.validate_on_submit():
        user = User(user_type=form.user_type.data,
                    username=form.username.data,
                    email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = LoginForm()
    if form.validate_on_submit():

        # user = Users.query.get(id)

        user = User.query.filter_by(username=form.username.data).first()

        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))

        login_user(user, remember=form.remember_me.data)
        print (current_user.user_type + " This is current user type")
        if current_user.user_type in ['ta','TA']:
            print("Showing TA Pages")
            return render_template('generate.html', title='generate', form=form, user_type=current_user.user_type)
        else:
            return render_template('home.html', is_authenticated=current_user.is_authenticated, form=form, user_type=current_user.user_type)
            #return render_template('home.html', title='generate', form=form, user_type=current_user.user_type)
    else:
        return render_template('login.html', title='Sign In', form=form)


@app.route('/delete_question', methods=['GET', 'POST'])
def delete_question():
    global questions_list
    global current_id

    id_json = request.get_json()
    print(id_json)

    delete_id = int(id_json["id"])
    print(delete_id)

    index_to_delete = None
    for (i, s) in enumerate(questions_list):
        s_id = s["id"]
        print(s["id"])
        if s_id == delete_id:
            print("found it: ")
            print(i, s)
            index_to_delete = i
            break

    if index_to_delete is not None:
        print("deleting: ", index_to_delete)
        del questions_list[index_to_delete]

    session_code = id_json["session_code"]
    questions_for_session = []
    for question in questions_list:
        if str(question['session_code']) == str(session_code):
            questions_for_session.append(question)

    return jsonify(questions=questions_for_session)


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route('/profile')
def profile_page():
    global sessions_list

    if not current_user.is_authenticated:
        return redirect(url_for('login'))

    sessions_created_by_user = []
    for session in sessions_list:
        if session['created_by_user'] == current_user.username:
            sessions_created_by_user.append(session)

    return render_template('profile.html',
                           sessions_created=sessions_created_by_user,
                           username=current_user.username,
                           user_type=current_user.user_type,
                           email=current_user.email)


@app.route('/save_session', methods=['GET', 'POST'])
def generate_session():
    global sessions_list

    id_json = request.get_json()
    session_code = id_json["session_code"]
    created_by_user = id_json["created_by_user"]

    sessions_list.append({
        "session_code": session_code,
        "created_by_user": created_by_user,
        "session_name": session_code
    })

    return id_json
    # return render_template('questions.html', questions = [], user_type=current_user.user_type, username=current_user.username)
