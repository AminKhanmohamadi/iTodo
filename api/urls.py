from django.urls import path
from . import views

urlpatterns = [
    # مسیر اصلی API
    path("", views.apiOverview, name="api-overview"),
    # مسیر لیست وظایف
    path("task-list/", views.taskList, name="task-list"),
    # مسیر جزئیات وظیفه (بر اساس کلید اصلی)
    path("task-detail/<str:pk>/", views.taskDetail, name="task-detail"),
    # مسیر ایجاد وظیفه جدید
    path("task-create/", views.taskCreate, name="task-create"),
    # مسیر بروزرسانی وظیفه (بر اساس کلید اصلی)
    path("task-update/<str:pk>/", views.taskUpdate, name="task-update"),
    # مسیر حذف وظیفه (بر اساس کلید اصلی)
    path("task-delete/<str:pk>/", views.taskDelete, name="task-delete"),
]
