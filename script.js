let currentQuestionIndex = 0;
let questions = [];
let correctAnswersCount = 0;
let users = [];
let currentEditingIndex = -1; 
let quizHistory = [];


const questionTitleElement = document.getElementById('question-title');
const optionsContainer = document.getElementById('options-container');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const startQuizBtn = document.getElementById('start-quiz-btn');
const startQuizContainer = document.getElementById('start-quiz-container');
const errorMessageElement = document.getElementById('error-message');
const scoreProgressBar = document.getElementById('scoreProgressBar');
const scoreText = document.getElementById('scoreText');
const userNameElement = document.getElementById('user-name');
const userIdElement = document.getElementById('user-id');
const cepField = document.getElementById('register-cep');
const logradouroField = document.getElementById('register-logradouro');
const bairroField = document.getElementById('register-bairro');
const cidadeField = document.getElementById('register-cidade');
const estadoField = document.getElementById('register-estado');

// Event listener for Login
document.getElementById('login-btn').addEventListener('click', function() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    console.log("Iniciando processo de login...");
    console.log(`E-mail: ${email}, Senha: ${password}`);

    fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            senha: password
        })
    })
    .then(response => {
        console.log("Resposta recebida...");
        return response.json();
    })
    .then(data => {
        console.log("Dados processados:", data);

        if (data.nome && data.id) {
            userNameElement.textContent = `${data.nome}`; 
            userIdElement.textContent = `${data.id}`; 
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('main-navbar').style.display = 'block';
            startQuizContainer.style.display = 'block';
        } else if (data.mesage === "Senha incorreta para este usuário :/") {
            alert('Email or password is incorrect.');
        } else if (data.mesage === "Registro de usuario não encontrado na base :/") {
            alert('Email or password is incorrect.');
        } else {
            console.error("Erro desconhecido:", data);
            alert('Houve um erro no processo de login. Tente novamente.');
        }
    })
    .catch(error => {
        console.error("Erro ao buscar o JSON:", error);
        alert('Houve um erro no processo de login. Tente novamente.');
    });
});

function loadUsers() {
    fetch('http://127.0.0.1:5000/usuarios')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('usuariosTable').querySelector('tbody');
        tableBody.innerHTML = ''; 

        data.usuarios.forEach(user => {  
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.textContent = user.id;

            const nameCell = document.createElement('td');
            nameCell.textContent = user.nome;

            const emailCell = document.createElement('td');
            emailCell.textContent = user.email;

            const cepCell = document.createElement('td');
            cepCell.textContent = user.cep;

            const logradouroCell = document.createElement('td');
            logradouroCell.textContent = user.logradouro;

            const bairroCell = document.createElement('td');
            bairroCell.textContent = user.bairro;

            const cidadeCell = document.createElement('td');
            cidadeCell.textContent = user.cidade;

            const estadoCell = document.createElement('td');
            estadoCell.textContent = user.estado;

            row.appendChild(idCell);
            row.appendChild(nameCell);
            row.appendChild(emailCell);
            row.appendChild(cepCell);
            row.appendChild(logradouroCell);
            row.appendChild(bairroCell);
            row.appendChild(cidadeCell);
            row.appendChild(estadoCell);

            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error("Erro ao buscar os usuários:", error);
        alert('Houve um erro ao carregar a lista de usuários.');
    });
}


document.getElementById('nav-users').addEventListener('click', function() {
    hideAllContainers();
    document.getElementById('users-control-container').style.display = 'block';
    fetchAndDisplayUsers();  
});

// Event listener for Registration
document.getElementById('register-btn').addEventListener('click', function() {
    const nome = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    const cep = document.getElementById('register-cep').value.trim();
    const logradouro = document.getElementById('register-logradouro').value.trim();
    const bairro = document.getElementById('register-bairro').value.trim();
    const cidade = document.getElementById('register-cidade').value.trim();
    const estado = document.getElementById('register-estado').value.trim();

    if (!nome || !email || !password || !cep || !logradouro || !bairro || !cidade || !estado) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    fetch('http://127.0.0.1:5000/usuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: nome,
            email: email,
            senha: password,
            cep: cep,
            logradouro: logradouro,
            bairro: bairro,
            cidade: cidade,
            estado: estado
        })
    })
    .then(response => {
        console.log("Resposta recebida...");
    })
    .then(data => {
        alert('Registration successful!');
        if (data.nome) {
            document.getElementById('register-container').style.display = 'none';
            document.getElementById('login-container').style.display = 'block';
        }
    })
    .catch(error => {
        console.error("Error during user registration:", error);
        document.getElementById('register-container').style.display = 'none';
        document.getElementById('login-container').style.display = 'block';
    });
});


cepField.addEventListener('blur', function() {
    const cepValue = cepField.value.replace(/[^0-9]/g, '');  // Remove qualquer caracter não numérico

    if (cepValue.length !== 8) {
        alert('Por favor, insira um CEP válido.');
        return;
    }

    fetch(`https://viacep.com.br/ws/${cepValue}/json/`)
    .then(response => response.json())
    .then(data => {
        if (data.erro) {
            alert('CEP não encontrado.');
            return;
        }

        logradouroField.value = data.logradouro;
        bairroField.value = data.bairro;
        cidadeField.value = data.localidade;
        estadoField.value = data.uf;
    })
    .catch(error => {
        console.error("Erro ao buscar o CEP:", error);
        alert('Houve um erro ao buscar o CEP. Por favor, tente novamente.');
    });
});

function clearRegistrationForm() {
    document.getElementById('register-name').value = '';
    document.getElementById('register-email').value = '';
    document.getElementById('register-password').value = '';
    document.getElementById('register-cep').value = '';
    document.getElementById('register-logradouro').value = '';
    document.getElementById('register-bairro').value = '';
    document.getElementById('register-cidade').value = '';
    document.getElementById('register-estado').value = '';
}


function initializeHistoryView() {
    const filterTypeSelect = document.getElementById('filter-type');
    filterTypeSelect.value = 'user';

    document.getElementById('filter-value').style.display = 'block';
    document.getElementById('trivia_category_report').style.display = 'none';
}

document.getElementById('filter-type').addEventListener('change', function(e) {
    const selectedType = e.target.value;
    
    if (selectedType === 'user') {
        document.getElementById('filter-value').style.display = 'block';
        document.getElementById('trivia_category_report').style.display = 'none';
    } else if (selectedType === 'category') {
        document.getElementById('trivia_category_report').style.display = 'block';
        document.getElementById('filter-value').style.display = 'none';
    }
});

document.getElementById('trivia_category_report').style.display = 'none';  
document.getElementById('filter-value').style.display = 'block';          
document.getElementById('filter-value').placeholder = "Digite o nome do usuário";  


document.getElementById('filter-btn').addEventListener('click', function() {
    const filterType = document.getElementById('filter-type').value;
    let filterValue;

    if (filterType === 'category') {
        filterValue = document.getElementById('trivia_category_report').value;
    } else if (filterType === 'user') {
        filterValue = document.getElementById('filter-value').value.trim();
    }
    fetchHistories(filterType, filterValue);      
});

startQuizBtn.addEventListener('click', function() {
    const categorySelect = document.querySelector('[name="trivia_category"]');
    const numberOfQuestionsInput = document.querySelector('[name="num_questions"]');
    const category = categorySelect.value;
    const amount = numberOfQuestionsInput.value;

    if (category === 'any') {
        errorMessageElement.textContent = "Please select a valid category.";
        return;
    }

    errorMessageElement.textContent = "";

    fetch(`https://opentdb.com/api.php?amount=${amount}&category=${category}`)
        .then(response => response.json())
        .then(data => {
            questions = data.results;
            currentQuestionIndex = 0;
            correctAnswersCount = 0;
            displayQuestion(currentQuestionIndex);
            startQuizContainer.style.display = 'none';
            document.querySelector('.quiz-container').style.display = 'block';
        })
        .catch(error => console.error("Erro ao buscar o JSON:", error));
});

document.getElementById("nav-quote-of-day").addEventListener("click", function() {
    // Esconda todas as outras seções (você precisa adicionar IDs ou classes conforme necessário em seus containers)
    const containers = ["login-container", "register-container", "start-quiz-container", "users-control-container", "history-container", "quote-container"];
    containers.forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
    
    // Mostre a seção de Quote of the Day
    document.getElementById("quote-container").style.display = 'block';

    // Faça uma requisição para obter a citação
    fetch('https://www.boredapi.com/api/activity/')
    .then(response => response.json())
    .then(data => {
        document.getElementById("daily-quote").textContent = data.activity;
    })
    .catch(error => {
        console.error('Erro ao buscar a citação:', error);
        document.getElementById("daily-quote").textContent = "Erro ao buscar a citação. Por favor, tente novamente mais tarde.";
    });
});

function displayQuestion(index) {
    const question = questions[index];
    questionTitleElement.textContent = decodeHTMLEntities(question.question);

    optionsContainer.innerHTML = '';

    const allAnswers = [...question.incorrect_answers, question.correct_answer];
    allAnswers.sort(() => Math.random() - 0.5); 

    allAnswers.forEach((answer, i) => {
        const optionWrapper = document.createElement('div');
        optionWrapper.classList.add('option');

        const radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.name = 'quiz-option';
        radioButton.id = `option${i}`;
        radioButton.value = answer;

        const label = document.createElement('label');
        label.htmlFor = `option${i}`;
        label.textContent = decodeHTMLEntities(answer);

        if (question.userAnswer) {
            if (answer === question.correct_answer) {
                label.style.color = 'green';
            }
            if (question.userAnswer === answer && answer !== question.correct_answer) {
                radioButton.checked = true;
                label.style.color = 'red';
            } else if (question.userAnswer === answer) {
                radioButton.checked = true;
            }
            radioButton.disabled = true;
        }

        radioButton.addEventListener('click', (event) => {
            question.userAnswer = answer;
            verifyAnswer(question, answer);
        });

        optionWrapper.appendChild(radioButton);
        optionWrapper.appendChild(label);
        optionsContainer.appendChild(optionWrapper);
    });

    updateScoreDisplay();
}

function verifyAnswer(question, selectedAnswer) {
    const correctAnswer = question.correct_answer;

    if (selectedAnswer === correctAnswer) {
        correctAnswersCount++;
    }

    for (let option of optionsContainer.children) {
        const radio = option.querySelector('input');
        const label = option.querySelector('label');

        if (radio.value === correctAnswer) {
            label.style.color = 'green';
        } else if (radio.value !== correctAnswer && radio.value === selectedAnswer) {
            label.style.color = 'red';
        }

        radio.disabled = true;
    }

    updateScoreDisplay();

    if (currentQuestionIndex === questions.length - 1) {
        setTimeout(showFinalScore, 1000);
    }
}

function updateScoreDisplay() {
    const percentage = (correctAnswersCount / questions.length) * 100;
    scoreProgressBar.style.width = percentage + '%';
    scoreProgressBar.setAttribute('aria-valuenow', percentage);
    scoreText.textContent = `Score: ${correctAnswersCount}/${questions.length}`;
}

function showFinalScore() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const scorePercentage = (correctAnswersCount / questions.length) * 100;

    modalTitle.textContent = "Quiz Completed!";
    if (scorePercentage >= 60) {
        modalBody.innerHTML = `<h4 style="color: green;">Your Score: ${correctAnswersCount}/${questions.length}</h4>`;
    } else {
        modalBody.innerHTML = `<h4 style="color: red;">Your Score: ${correctAnswersCount}/${questions.length}</h4>`;
    }

    $('#scoreModal').modal('show');
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth()+1}/${currentDate.getFullYear()}`;

    const newHistoryEntry = {
        user: userIdElement.textContent,
        category: document.querySelector('[name="trivia_category"] option:checked').textContent,
        score: `${correctAnswersCount}/${questions.length}`,
        date: formattedDate
    };
    quizHistory.push(newHistoryEntry);

    sendQuizHistoryToServer(newHistoryEntry);
}

function fetchHistories(type, value) {
    let endpoint;
    let payload = {};

    if (type === 'category') {
        endpoint = 'http://127.0.0.1:5000/por-categoria';
        
        const selectedOption = document.getElementById('trivia_category_report')
                                    .options[document.getElementById('trivia_category_report').selectedIndex].text;
        
        payload.categoryName = selectedOption; 

    } else if (type === 'user') {
        endpoint = `http://127.0.0.1:5000/por-usuario`;
        payload.userName = value; 
    }

    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        displayHistories(data, type);
    })
    .catch(error => {
        console.error(`Erro ao buscar o JSON por ${type}:`, error);
    });
}

function displayHistories(data, type) {
    const tableBody = document.getElementById(`history-table`);
    tableBody.innerHTML = '';      
    console.log(data); 

    if (type === 'category') {
        tableBody.innerHTML = `
            <tr>
                <th>Categoria</th>
                <th>Score</th>
                <th>Data</th>
                <th>Nome</th>
            </tr>
        `;
    } else if (type === 'user') {    
        tableBody.innerHTML = `
        <tr>
            <th>Categoria</th>
            <th>Score</th>
            <th>Data</th>
        </tr>
    `;
    }

    data.historicos.forEach(item => {
        const row = document.createElement('tr');
        
        if (type === 'category') {
            
            const categoryCell = document.createElement('td');
            categoryCell.textContent = item.categoria;

            const scoreCell = document.createElement('td');
            scoreCell.textContent = item.score;

            const dateCell = document.createElement('td');
            dateCell.textContent = item.data;

            const nomeCell = document.createElement('td');
            nomeCell.textContent = item.nome;

            row.appendChild(categoryCell);
            row.appendChild(scoreCell);
            row.appendChild(dateCell);
            row.appendChild(nomeCell);
        } else if (type === 'user') {
            const userCell = document.createElement('td');
            userCell.textContent = item.categoria;

            const scoreCell = document.createElement('td');
            scoreCell.textContent = item.score;

            const dateCell = document.createElement('td');
            dateCell.textContent = item.data;

            row.appendChild(userCell);
            row.appendChild(scoreCell);
            row.appendChild(dateCell);
        }

        tableBody.appendChild(row);
    });
}

function sendQuizHistoryToServer(historyEntry) {
    fetch('http://127.0.0.1:5000/historico', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(historyEntry)
    })
    .then(response => {
        console.log("Resposta recebida...");
        
    })
    .then(data => {
        console.log("Histórico salvo com sucesso:", data);
    })
    .catch(error => {
        console.error("Erro ao salvar o histórico:", error);
        alert('Houve um erro ao salvar o histórico do quiz. Por favor, tente novamente.');
    });
}

document.getElementById('restart-quiz-btn').addEventListener('click', function() {
    $('#scoreModal').modal('hide');
    startQuizContainer.style.display = 'block';
    document.querySelector('.quiz-container').style.display = 'none';
});

prevButton.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion(currentQuestionIndex);
    }
});

nextButton.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);
    }
});

function decodeHTMLEntities(text) {
    let textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}

document.getElementById('show-register').addEventListener('click', function() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('register-container').style.display = 'block';
    clearRegistrationForm();
});

document.getElementById('show-login').addEventListener('click', function() {
    document.getElementById('register-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
});

document.getElementById('logout-btn').addEventListener('click', function() {
    hideAllContainers();  
    document.getElementById('main-navbar').style.display = 'none';  
    document.getElementById('login-container').style.display = 'block';
});

document.getElementById('nav-quiz').addEventListener('click', function() {
    hideAllContainers();
    startQuizContainer.style.display = 'block';
});

document.getElementById('nav-history').addEventListener('click', function() {
    hideAllContainers();
    document.getElementById('history-container').style.display = 'block';
    initializeHistoryView();
});

function hideAllContainers() {
    document.getElementById('start-quiz-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('register-container').style.display = 'none';
    document.getElementById('users-control-container').style.display = 'none';
    document.getElementById('history-container').style.display = 'none'; 
    document.getElementById('quote-container').style.display = 'none'; 
    document.querySelector('.quiz-container').style.display = 'none';
    
}

document.getElementById('nav-users').addEventListener('click', function() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('register-container').style.display = 'none';
    document.getElementById('quote-container').style.display = 'none';
    document.querySelector('.quiz-container').style.display = 'none';
    startQuizContainer.style.display = 'none';
    document.getElementById('users-control-container').style.display = 'block';
    populateUsersTable();
});


function populateUsersTable(users) {
    if (!users || !Array.isArray(users)) return;
    const usersTable = document.getElementById('users-table');
    usersTable.innerHTML = '';

    users.forEach((user, index) => {
        const row = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.textContent = user.id;

        const nameCell = document.createElement('td');
        nameCell.textContent = user.nome;

        const emailCell = document.createElement('td');
        emailCell.textContent = user.email;

        const cepCell = document.createElement('td');
        cepCell.textContent = user.cep;

        const logradouroCell = document.createElement('td');
        logradouroCell.textContent = user.logradouro;

        const bairroCell = document.createElement('td');
        bairroCell.textContent = user.bairro;

        const cidadeCell = document.createElement('td');
        cidadeCell.textContent = user.cidade;

        const estadoCell = document.createElement('td');
        estadoCell.textContent = user.estado;

        const actionsCell = document.createElement('td');
        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('actions');

        const editButton = document.createElement('button');
        editButton.classList.add('btn', 'btn-warning', 'btn-sm');
        editButton.textContent = 'Editar';
        editButton.addEventListener('click', function() {
            editUser(index);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
        deleteButton.textContent = 'Excluir';
        deleteButton.addEventListener('click', function() {
            deleteUser(user.id);
        });

        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(deleteButton);
        actionsCell.appendChild(actionsDiv);

        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(emailCell);
        row.appendChild(cepCell);
        row.appendChild(logradouroCell);
        row.appendChild(bairroCell);
        row.appendChild(cidadeCell);
        row.appendChild(estadoCell);
        row.appendChild(actionsCell);

        usersTable.appendChild(row);
    });
}


const actionsCell = document.createElement('td');
const actionsDiv = document.createElement('div');
actionsDiv.classList.add('actions');

const editButton = document.createElement('button');
editButton.classList.add('btn', 'btn-warning', 'btn-sm');
editButton.textContent = 'Editar';
editButton.addEventListener('click', function() {
    editUser(index);
});

const deleteButton = document.createElement('button');
deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
deleteButton.textContent = 'Excluir';
deleteButton.addEventListener('click', function() {
    deleteUser(index);
});

actionsDiv.appendChild(editButton);
actionsDiv.appendChild(deleteButton);
actionsCell.appendChild(actionsDiv);

function fetchAndDisplayUsers() {
    fetch('http://127.0.0.1:5000/usuarios')
        .then(response => response.json())
        .then(data => {
            users = data.usuarios; 
            populateUsersTable(users);
        })
        .catch(error => {
            console.error("Erro ao buscar o JSON:", error);
            alert('Houve um erro ao buscar os usuários. Tente novamente.');
        });
}

function updateUser(user, index) {
    fetch('http://127.0.0.1:5000/usuario', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        return response.json().then(err => {
            throw err;
        });
    })
    .then(data => {
        alert('Usuário atualizado com sucesso!');
        users[index] = data; 
        fetchAndDisplayUsers();
        $('#editUserModal').modal('hide');
    })
    .catch(error => {
        console.error("Erro durante a atualização do usuário:", error);
        alert('Houve um erro durante a atualização. Por favor, tente novamente.');
    });
}

function saveChangesHandler() {
    const userToUpdate = {
        id: users[currentEditingIndex].id,
        nome: document.getElementById('edit-user-name').value,
        email: document.getElementById('edit-user-email').value,
        senha: document.getElementById('edit-user-password').value
    };

    updateUser(userToUpdate, currentEditingIndex);
}

function editUser(index) {
    
    console.log("Received index:", index);  
    console.log("Users array:", users);     
    
    if (!users || index < 0 || index >= users.length) {
        console.error("Invalid index or users array not initialized.");
        return;
    }

    const user = users[index];
    
    if (!user) {
        console.error(`User not found at index ${index}`);
        return;
    }

    document.getElementById('edit-user-name').value = user.nome;
    document.getElementById('edit-user-email').value = user.email;
    document.getElementById('edit-user-password').value = user.password;
    if (user.cep) {
        document.getElementById('edit-user-cep').value = user.cep;
    } else {
        document.getElementById('edit-user-cep').value = ''; 
    }
    document.getElementById('edit-user-cep').addEventListener('change', function() {
        fetch(`https://viacep.com.br/ws/${this.value}/json/`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('edit-user-logradouro').value = data.logradouro;
                document.getElementById('edit-user-bairro').value = data.bairro;
                document.getElementById('edit-user-cidade').value = data.localidade;
                document.getElementById('edit-user-estado').value = data.uf;
            })
            .catch(error => {
                console.error("Erro ao buscar o JSON:", error);
                alert('Houve um erro ao buscar o CEP. Tente novamente.');
            });
    });
    document.getElementById('save-changes-btn').removeEventListener('click', saveChangesHandler);
    currentEditingIndex = index;
    document.getElementById('save-changes-btn').addEventListener('click', saveChangesHandler);
    $('#editUserModal').modal('show');
}

function deleteUser(userId) {
    if (!confirm("Tem certeza de que deseja excluir este usuário?")) {
        return;
    }
    
    fetch('http://127.0.0.1:5000/usuario', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: userId }) 
    })
    .then(response => {
        if (response.ok) {
            alert('Usuário excluído com sucesso!');
            fetchAndDisplayUsers();
        } else {
            return response.json().then(err => {
                throw err;
            });
        }
    })
    .catch(error => {
        console.error("Erro ao excluir o usuário:", error);
        alert('Houve um erro ao excluir o usuário. Tente novamente.');
    });
}

