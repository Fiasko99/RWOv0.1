$(window).on('load', async function () {
    if (location.href == "http://rwo-project.std-915.ist.mospolytech.ru/profile.html") {
        if (document.cookie.replace(/(?:(?:^|.*;\s*)username=\s*\s*([^;]*).*$)|^.*$/, "$1")) {
            let name = document.cookie.replace(/(?:(?:^|.*;\s*)username=\s*\s*([^;]*).*$)|^.*$/, "$1");
            let role = document.cookie.replace(/(?:(?:^|.*;\s*)role=\s*\s*([^;]*).*$)|^.*$/, "$1");
            let date = document.cookie.replace(/(?:(?:^|.*;\s*)date_of_born=\s*\s*([^;]*).*$)|^.*$/, "$1");
            $('#profileName').text(name);
            $('#profileRole').text(role);
            $('#profileAge').text("Дата рождения: " + date);
            $('#link_exit').text("Выйти");
        } else {
            $(location).attr('href',"http://rwo-project.std-915.ist.mospolytech.ru");
        }
    } else if (location.href.indexOf("http://rwo-project.std-915.ist.mospolytech.ru/content.html") != -1) {
        if (document.cookie.replace(/(?:(?:^|.*;\s*)username=\s*\s*([^;]*).*$)|^.*$/, "$1")) {
            $('#link_exit').text("Выйти")
            initContent();
        } else {
            $(location).attr('href',"http://rwo-project.std-915.ist.mospolytech.ru");
        }
    }  else if (location.href == "http://rwo-project.std-915.ist.mospolytech.ru/index.html") {
        if (document.cookie.replace(/(?:(?:^|.*;\s*)username=\s*\s*([^;]*).*$)|^.*$/, "$1")) {
            $('#link_content').removeClass('disabled');
            $('#link_profile').removeClass('disabled');
            $('#link_exit').text("Выйти")
        } else {
            $('#link_exit').text("Войти")
        } 
    } else if (location.href == "http://rwo-project.std-915.ist.mospolytech.ru/login.html") {
        deleteCookie('username')
    } else if (location.href == "http://rwo-project.std-915.ist.mospolytech.ru/user_profile.html") {
        if (document.cookie.replace(/(?:(?:^|.*;\s*)username=\s*\s*([^;]*).*$)|^.*$/, "$1")) {
            $('#name_writer').text(`${document.cookie.replace(/(?:(?:^|.*;\s*)name_writer=\s*\s*([^;]*).*$)|^.*$/, "$1")}`);
            $('#date_writer').text(`Дата рождения: ${document.cookie.replace(/(?:(?:^|.*;\s*)date_writer=\s*\s*([^;]*).*$)|^.*$/, "$1")}`);
            $('#work_experience').text(`Стаж: ${document.cookie.replace(/(?:(?:^|.*;\s*)work_experience=\s*\s*([^;]*).*$)|^.*$/, "$1")}`);
        } else {
            $(location).attr('href',"http://rwo-project.std-915.ist.mospolytech.ru");
        } 
    }

    $("body").on("click", "#onSend", async function() {
        let id_writer = document.cookie.replace(/(?:(?:^|.*;\s*)id=\s*\s*([^;]*).*$)|^.*$/, "$1");
        let name_composition = $('body #nameComposition').val()
        let main_genre = $('body #mainGenre').val()
        let id_age_limit = $('body #ageLimit').val()
        let text_composition = $('body #compositionArea').val()
        $.post(
            `http://test-proxy.std-915.ist.mospolytech.ru/post/compositions/
            ${id_writer}/${name_composition}/${main_genre}
            /${id_age_limit}`, {"myData": text_composition},
            function() {
                alert("Вы успешно отправили пост!")
                $("body #main").empty()
                initContent()
            }
        );
    });
   
    $('#onLogin').on('click', async function() {
        let login = $('#myLogin').val();
        let password = $('#myPassword').val();
        let valueRole = $( "#myRole" ).val();
        let urlHttpGet = "http://test-proxy.std-915.ist.mospolytech.ru/login/"+login+"/"+password+"/"+valueRole
        if (login < 6) {
            alert("Неверный логин");
        } else if (password < 8) {
            alert("Неверный пароль");
        } else if (valueRole == "null") {
            alert("Не выбрана роль");
        } else {
            await $.get( urlHttpGet, function( data ) {
                if (data['id']) {
                    let urlLocation = "http://rwo-project.std-915.ist.mospolytech.ru/profile.html";
                    document.cookie = `id=${data['id']};`
                    document.cookie = `username=${data['name']};`
                    document.cookie = `role=${$('#myRole option:selected').text()};`
                    document.cookie = `date_of_born=${data['date_of_born']};`
                    $(location).attr('href',urlLocation);
                } else {
                    alert()
                }
                }, "json" );
        }
    });
    
    $('#registUser').on('click', function () {
        let login = $('#registLogin').val();
        let password = $('#registPassword').val();
        let secretCode = $('#registCode').val();
        let name = $('#registName').val();
        let role = $('#registRole').val();
        let urlRegist = 'http://test-proxy.std-915.ist.mospolytech.ru/post/new/user';
        $.post(`${urlRegist}/${login}/${password}/${secretCode}/${name}/${role}`,
            function () {
                alert('Вы успешно зарегестрированы');
                $(location).attr('href', 'http://rwo-project.std-915.ist.mospolytech.ru/login.html');
            }
        );
    });
});

function contentToggle(identy, btnID) {
    $('#main #' + identy).toggleClass('hide');
    if ($('#main #' + identy).hasClass('hide')) {
        console.log($('#' + btnID).text())
        $('body #' + btnID).text('Подробнее');
    } else {
        console.log($('#' + btnID).text())
        $('body #' + btnID).text('Скрыть');
    }		
}

function likeComposition(id_composition) {
    $(`body #rating-${id_composition}`).text('Рейтинг произведения: 1')
}

function deleteCookie(name) {
    setCookie(name, "", {
        'max-age': -1
    })
}

function setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

async function initUserProfile(id_writer) {
    await $.get("http://test-proxy.std-915.ist.mospolytech.ru/writers/" + id_writer, function( data ) {
        if (data !== null) {
            document.cookie = `id_writer=${id_writer}`;
            document.cookie = `name_writer=${data['name_writer']}`;
            document.cookie = `date_writer=${data['date_of_born']}`;
            document.cookie = `work_experience=${data['work_experience']}`;
            $(location).attr('href', 'http://rwo-project.std-915.ist.mospolytech.ru/user_profile.html');
        }
    }, "json" );
}

// function updatePageContent(num) {
//     pageContent = num;
//     initContent()
// }

async function initContent() { 
    let urlHttpGet = "http://test-proxy.std-915.ist.mospolytech.ru/compositions"
    await $.get( urlHttpGet, function( data ) {
        if (data !== null) {
            fillMain(data)
        }
    }, "json" );
}



async function fillMain(compositions) {

    // let lenCompositionPage = Math.ceil(compositions.length/10);

    $('#main').append(
        `<div class="h1 mb-3 text-primary d-inline w-60">Все произведения</div>
        <div class="d-inline float-right">
            <a href="#compositionArea" class="link-primary font-weight-bold">Написать пост</a>
        </div>
        <hr class="border border-info hr-border mt-5">`
    );

    for (let numComposition = 0; numComposition < compositions.length; numComposition++) {
        let post = compositions[numComposition]
        let writer;
        let age_limit;
        let urlHttpGetWriter = "http://test-proxy.std-915.ist.mospolytech.ru/writers/" + post['id_writer']
        await $.get( urlHttpGetWriter, function( data ) {
            if (data !== null) {
                writer = data;
            }
        }, "json" );
        let urlHttpGetAgeLimit = "http://test-proxy.std-915.ist.mospolytech.ru/age_limits/" + post['id_age_limit']
        await $.get( urlHttpGetAgeLimit, function( data ) {
            if (data !== null) {
                age_limit = data;
            }
        }, "json" );
        
        let readerFunc = ''

        if (`${document.cookie.replace(/(?:(?:^|.*;\s*)role=\s*\s*([^;]*).*$)|^.*$/, "$1")}` == "Читатель") {
            readerFunc = `<button class="btn btn-primary w-100" id="${post['id']}" onclick="likeComposition(this)">Оценить произведение</button>`
        }

        $('#main').append(
            `<div class="row m-2 mb-4 p-1 border border-info rounded">
                <div class="col-4 border-right border-info">
                    <img src="media/userFon.jpg" alt="no img" class="img-fluid img-thumbnail mx-auto d-block rounded-circle">
                    <div class="h6 text-primary text-wrap w-100">Имя пользователя: ${writer['name_writer']}</div>
                    <div class="h6 text-primary text-wrap w-100">Дата рождения: ${writer['date_of_born']}</div>
                    <div class="h6 text-primary text-wrap">Стаж: ${writer['work_experience']}</div>
                    <div class="h6 text-primary" id="rating-${post['id']}">Рейтинг произведения: 0</div>
                    <button class="btn btn-outline-info float-right mb-2 w-100 button-text-set" onclick="initUserProfile(${post.id_writer});">Профиль</button>
                </div>
                <div class="col-8">
                    ${readerFunc}
                    <div class="h3 text-primary">${post['name_composition']} </div>
                    <div class="h4 text-primary w-100">${age_limit['value']}</div>
                    <div class="h5 text-primary w-100">${post['main_genre']}</div>
                    <div class="content_block hide" id="item${post['id']}"> 
                        <p class="text-wrap text-info">${post['text_composition']}</p>
                    </div>
                    <a onclick="contentToggle('item${post['id']}', 'btn${post['id']}')" href="#likeBTN-${post['id']}" id="btn${post['id']}">Подробнее</a>
                </div>
            </div>`
        );
    }

    // for (let page = 1; page <= lenCompositionPage; page++) {
    //     $('#main').append(
    //         `<span class="btn btn-outline-primary m-2 pr-4 pl-4" onclick="updatePageContent(${page})">Страница ${page}</span>`
    //     )
    // }

    if (`${document.cookie.replace(/(?:(?:^|.*;\s*)role=\s*\s*([^;]*).*$)|^.*$/, "$1")}` == "Писатель") {
        $('#main').append(
            `<h4 class="h4 text-center bg-primary rounded-sm">Написать новое произведение</h4>
            <div class="row">
                <div class="col-6">
                    <div class="form-group">
                        <label for="nameComposition" class="text-white w-100 text-center bg-info rounded-lg">Название произведения</label>
                        <input type="text" class="form-control border border-dark rounded" id="nameComposition" rows="10" required></input>
                    </div>
                </div>
                
                <div class="col-6">
                    <div class="form-group">
                        <label for="mainGenre" class="text-white w-100 text-center bg-info rounded-lg">Основной жанр произведения</label>
                        <input type="text" class="form-control border border-dark rounded" id="mainGenre" rows="10" required></input>
                    </div>
                </div>
            </div>
    
            <div class="form-group">
                <label for="compositionArea" class="text-white w-100 text-center bg-info rounded-lg">Текст композиции</label>
                <textarea class="form-control border border-dark rounded" id="compositionArea" rows="10" required></textarea>
            </div>
            <select id="ageLimit" class="form-group w-10 border border-info float-right hr-border">
                <option value="none" disabled selected="selected" required>Выбрать ограничение по возрасту</option>
            </select>
            <button class="btn btn-outline-dark" id="onSend">Отправить</button>
            <button class="btn btn-outline-dark" id="onPrew" target="_blank">Предпросмотр</button>`
        );
    }

    $.get( 'http://test-proxy.std-915.ist.mospolytech.ru/table/age_limits', function( data ) {
        if (data !== null) {
            for (age_limit of data) {
                $('body #ageLimit').append(
                    `<option value="${age_limit.id}">${age_limit.value}</option>`
                )
            }
        }
    }, "json" );
}




