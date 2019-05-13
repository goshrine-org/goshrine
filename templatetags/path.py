import os.path
from django import template
from django.template.defaultfilters import stringfilter

register = template.Library()

@register.filter
@stringfilter
def splitext(path):
    return os.path.splitext(path)
