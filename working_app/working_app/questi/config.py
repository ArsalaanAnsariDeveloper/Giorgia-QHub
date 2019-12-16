import os

basedir = os.path.abspath(os.path.dirname(__file__))


# db_path = os.path.abspath('./db/app.db')

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'easy-key2'
    # ...
    # SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')

    # print SQLALCHEMY_DATABASE_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False
