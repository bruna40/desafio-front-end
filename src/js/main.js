const URL = "http://localhost:3000/employees";
let displayedEmployees = [];
let allEmployees = [];

function formatPhoneNumber(phoneNumber) {
    // Limpa todos os caracteres não numéricos
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');

    // Verifica se o número tem 11 dígitos (com código de país)
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{5})(\d{4})$/);

    if (match) {
        // Formato com código de país e código de área
        return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
    } else {
        // Verifica se o número tem 10 dígitos (com código de área)
        const matchWithAreaCode = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
        if (matchWithAreaCode) {
            // Formato com código de área
            return `(${matchWithAreaCode[1]}) ${matchWithAreaCode[2]}-${matchWithAreaCode[3]}`;
        } else {
            // Verifica se o número tem 9 dígitos (sem código de área)
            const matchWithoutAreaCode = cleaned.match(/^(\d{5})(\d{4})$/);
            if (matchWithoutAreaCode) {
                // Formato sem código de área
                return `${matchWithoutAreaCode[1]}-${matchWithoutAreaCode[2]}`;
            } else {
                // Caso não corresponda a nenhum formato conhecido, retorna o número original
                return phoneNumber;
            }
        }
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
}

function showEmployees() {
    const tableBody = document.getElementById("employees");
    if (!tableBody) {
        console.error("Elemento tbody não encontrado.");
        return;
    }
    tableBody.innerHTML = ''; // Limpa o conteúdo anterior da tabela antes de adicionar novas linhas

    displayedEmployees.forEach(employee => {
        const row = document.createElement('tr');
        
        // Criando células para cada coluna
        const cellFoto = document.createElement('td');
        const img = document.createElement('img');
        img.src = employee.image; // Substitua com a lógica apropriada para o URL da imagem
        img.alt = employee.name; // Substitua com a lógica apropriada para o texto alternativo da imagem
        img.classList.add('employee-img'); // Adiciona uma classe à imagem se necessário
        cellFoto.appendChild(img); // Adiciona a imagem à célula
        
        const cellNome = document.createElement('td');
        cellNome.textContent = employee.name; // Substitua com a lógica apropriada para o nome
        
        const cellCargo = document.createElement('td');
        cellCargo.textContent = employee.job; // Substitua com a lógica apropriada para o cargo
        
        const cellAdmissao = document.createElement('td');
        cellAdmissao.textContent = formatDate(employee.admission_date); // Substitua com a lógica apropriada para a data de admissão
        
        const cellPhone = document.createElement('td');
        cellPhone.textContent = formatPhoneNumber(employee.phone); // Formata o telefone usando a função
        
        // Adicionando as células à linha da tabela
        row.appendChild(cellFoto);
        row.appendChild(cellNome);
        row.appendChild(cellCargo);
        row.appendChild(cellAdmissao);
        row.appendChild(cellPhone);
        
        // Adicionando a linha à tabela
        tableBody.appendChild(row);
    });
}

function getEmployees() {
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            allEmployees = data; // Armazena todos os funcionários recebidos do servidor
            displayedEmployees = data; // Define os funcionários a serem exibidos inicialmente como todos os recebidos
            
            showEmployees(); // Mostra os funcionários na tabela
        })
        .catch(error => console.error('Erro ao obter funcionários:', error));
}

document.addEventListener('DOMContentLoaded', getEmployees);