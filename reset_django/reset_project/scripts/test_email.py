import os

# Django 1.7+
from django.core.wsgi import get_wsgi_application
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


os.environ["DJANGO_SETTINGS_MODULE"] = "reset_project.settings"
application = get_wsgi_application()


def check_email():
    subject, from_email, to = (
        "test of email from ReSET",
        "beerelf@gmail.com",
        "pattersd@colostate.edu",
    )
    text_content = "eRAMS email test"

    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
    print("sending email to " + to)
    ret = msg.send()
    print("result of send:", ret)
