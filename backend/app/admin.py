"""
This file controls the administrative interface for lang_learn app
"""

from django.contrib import admin
from .models import (
    Text,
    Photo
)

admin.site.register(Text)
admin.site.register(Photo)
