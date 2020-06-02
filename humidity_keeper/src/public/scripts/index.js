/******************************************************************************
 *                          Fetch and display users
 ******************************************************************************/

displayUsers();


function displayUsers() {
    httpGet('/api/v1/users/all')
        .then(response => response.json())
        .then((response) => {
            console.log('data: ', response.data)
            var allUsers = response.data;
            // Empty the anchor
            var allUsersAnchor = document.getElementById('all-users-anchor');
            allUsersAnchor.innerHTML = '';
            // Append users to anchor
            allUsers.forEach((user) => {
                allUsersAnchor.innerHTML += getUserDisplayEle(user);
            });
        });
};


function getUserDisplayEle(user) {
    return `<div class="user-display-ele">

        <div class="normal-view">
            <div>Id: ${user.id}</div>
            <div>Name: ${user.name}</div>
            <div>Email: ${user.email}</div>
            <div>userId: ${user.userId}</div>
            <div>Password: ${user.password}</div>
            <button class="edit-user-btn" data-user-id="${user.id}">
                Edit
            </button>
            <button class="delete-user-btn" data-user-id="${user.id}">
                Delete
            </button>
        </div>
        
        <div class="edit-view">
            <div>
                Name: <input class="name-edit-input" value="${user.name}">
            </div>
            <div>
                Email: <input class="email-edit-input" value="${user.email}">
            </div>
            <div>
                userId: <input class="userid-edit-input" value="${user.userId}">
            </div>
            <div>
                Password: <input class="password-edit-input" value="${user.password}">
            </div>
            <button class="submit-edit-btn" data-user-id="${user.id}">
                Submit
            </button>
            <button class="cancel-edit-btn" data-user-id="${user.id}">
                Cancel
            </button>
        </div>
    </div>`;
}


/******************************************************************************
 *                        Add, Edit, and Delete Users
 ******************************************************************************/

document.addEventListener('click', function (event) {
    event.preventDefault();
    var ele = event.target;
    if (ele.matches('#add-user-btn')) {
        addUser();
    } else if (ele.matches('.edit-user-btn')) {
        showEditView(ele.parentNode.parentNode);
    } else if (ele.matches('.cancel-edit-btn')) {
        cancelEdit(ele.parentNode.parentNode);
    } else if (ele.matches('.submit-edit-btn')) {
        submitEdit(ele);
    } else if (ele.matches('.delete-user-btn')) {
        deleteUser(ele);
    }
}, false)


function addUser() {
    var nameInput = document.getElementById('name-input');
    var emailInput = document.getElementById('email-input');
    var useridInput = document.getElementById('userid-input');
    var passwordInput = document.getElementById('password-input');
    var data = {
        user: {
            name: nameInput.value,
            email: emailInput.value,
            userid: useridInput.value,
            password: passwordInput.value,
            created: new Date(),
        },
    };

    httpPost('/api/v1/users/add', data)
        .then(() => {
            displayUsers();
        })
        .catch((err) => {
            alert(err)
        })
}


function showEditView(userEle) {
    var normalView = userEle.getElementsByClassName('normal-view')[0];
    var editView = userEle.getElementsByClassName('edit-view')[0];
    normalView.style.display = 'none';
    editView.style.display = 'block';
}


function cancelEdit(userEle) {
    var normalView = userEle.getElementsByClassName('normal-view')[0];
    var editView = userEle.getElementsByClassName('edit-view')[0];
    normalView.style.display = 'block';
    editView.style.display = 'none';
}


function submitEdit(ele) {
    var userEle = ele.parentNode.parentNode;
    var nameInput = userEle.getElementsByClassName('name-edit-input')[0];
    var emailInput = userEle.getElementsByClassName('email-edit-input')[0];
    var useridInput = userEle.getElementsByClassName('userid-edit-input')[0];
    var emailpasswordInputnput = userEle.getElementsByClassName('password-edit-input')[0];
    var id = ele.getAttribute('data-user-id');
    var data = {
        user: {
            name: nameInput.value,
            email: emailInput.value,
            id: id
        }
    };
	httpPut('/api/v1/users/update', data)
        .then(() => {
            displayUsers();
        })
}


function deleteUser(ele) {
    var id = ele.getAttribute('data-user-id');
	httpDelete('/api/v1/users/delete/' + id)
        .then(() => {
            displayUsers();
        })
}


function httpGet(path) {
    return fetch(path, getOptions('GET'))
}


function httpPost(path, data) {
    return fetch(path, getOptions('POST', data));
}


function httpPut(path, data) {
    return fetch(path, getOptions('PUT', data));
}


function httpDelete(path) {
    return fetch(path, getOptions('DELETE'));
}


function getOptions(verb, data) {
    var options = {
        dataType: 'json',
        method: verb,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    if (data) {
        options.body = JSON.stringify(data);
    }
    return options;
}

