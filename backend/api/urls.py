from django.urls import path
from .views import NoteListCreate, NoteDelete, NoteUpdateView

urlpatterns = [
    path('notes/', NoteListCreate.as_view(), name='note-list-create'),
    path('notes/delete/<int:pk>/', NoteDelete.as_view(), name='note-delete'),
    path('notes/update/<int:pk>/', NoteUpdateView.as_view(), name='note-update'),
]