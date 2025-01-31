$(document).ready(function () {
    let csrftoken = getCookie('csrftoken'); // دریافت CSRF توکن
    let activeItem = null; // ذخیره آیتمی که ویرایش می‌شود

    // 📌 دریافت مقدار CSRF از کوکی‌ها
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            let cookies = document.cookie.split(';');
            $.each(cookies, function (index, cookie) {
                cookie = $.trim(cookie);
                if (cookie.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                }
            });
        }
        return cookieValue;
    }

    // 📌 دریافت و نمایش لیست وظایف
    function buildList() {
        let url = 'http://localhost:8000/api/task-list/';
        let $wrapper = $('#list-wrapper');

        $.getJSON(url, function (data) {
            $wrapper.empty();
            $.each(data, function (index, task) {
                let title = task.completed ? `<strike class="title">${task.title}</strike>` : `<span class="title">${task.title}</span>`;

                let item = `
                    <div id="data-row-${task.id}" class="task-wrapper flex-wrapper">
                        <div style="flex:7">${title}</div>
                        <div style="flex:1">
                            <button class="btn btn-sm btn-outline-info edit" data-id="${task.id}">ویرایش</button>
                        </div>
                        <div style="flex:1">
                            <button class="btn btn-sm btn-outline-dark delete" data-id="${task.id}">🗑️</button>
                        </div>
                    </div>
                `;
                $wrapper.append(item);
            });
        });
    }

    // 📌 ارسال فرم برای ایجاد یا ویرایش وظیفه
    $('#form').submit(function (e) {
        e.preventDefault();

        let title = $('#title').val().trim();
        if (!title) {
            alert('عنوان وظیفه نمی‌تواند خالی باشد!');
            return;
        }

        let url = activeItem ? `http://localhost:8000/api/task-update/${activeItem.id}/` : 'http://localhost:8000/api/task-create/';

        $.ajax({
            type: 'POST',
            url: url,
            headers: {'X-CSRFToken': csrftoken},
            contentType: 'application/json',
            data: JSON.stringify({title: title}),
            success: function (data) {
                console.log('Task created/updated:', data);
                $('#form')[0].reset();
                activeItem = null;
                buildList();
            },
            error: function (xhr) {
                console.error('Error:', xhr.responseText);
            }
        });
    });

    // 📌 هندلر ویرایش، حذف و تکمیل وظیفه با Event Delegation
    $('#list-wrapper').on('click', '.edit', function () {
        let taskId = $(this).data('id');
        $.getJSON(`http://localhost:8000/api/task-detail/${taskId}/`, function (task) {
            activeItem = task;
            $('#title').val(task.title);
        });
    });

    $('#list-wrapper').on('click', '.delete', function () {
        let taskId = $(this).data('id');
        $.ajax({
            type: 'DELETE',
            url: `http://localhost:8000/api/task-delete/${taskId}/`,
            headers: {'X-CSRFToken': csrftoken},
            success: function () {
                buildList();
            }
        });
    });

    $('#list-wrapper').on('click', '.title', function () {
        let $taskWrapper = $(this).closest('.task-wrapper');
        let taskId = $taskWrapper.find('.edit').data('id');

        $.getJSON(`http://localhost:8000/api/task-detail/${taskId}/`, function (task) {
            task.completed = !task.completed;

            $.ajax({
                type: 'POST',
                url: `http://localhost:8000/api/task-update/${taskId}/`,
                headers: {'X-CSRFToken': csrftoken},
                contentType: 'application/json',
                data: JSON.stringify({title: task.title, completed: task.completed}),
                success: function () {
                    buildList();
                }
            });
        });
    });

    buildList(); // بارگذاری لیست هنگام شروع
});
