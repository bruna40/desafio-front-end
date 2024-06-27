import { formatPhoneNumber } from './formatNumber.js';

const URL = "http://localhost:3000/employees";
let displayedEmployees = [];
let allEmployees = [];

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
    tableBody.innerHTML = '';

    displayedEmployees.forEach(employee => {
        const row = createTableRow(employee);
        tableBody.appendChild(row);
    });
}

function createTableRow(employee) {
    const row = document.createElement('tr');

    const cellFoto = createTableCell('img', employee.image, employee.name, 'employee-img');
    const cellNome = createTableCell('td', employee.name);
    const cellCargo = createTableCell('td', employee.job);
    const cellAdmissao = createTableCell('td', formatDate(employee.admission_date));
    const cellPhone = createTableCell('td', formatPhoneNumber(employee.phone));

    row.appendChild(cellFoto);
    row.appendChild(cellNome);
    row.appendChild(cellCargo);
    row.appendChild(cellAdmissao);
    row.appendChild(cellPhone);

    return row;
}

function createTableCell(elementType, contentOrSrc, alt = '', className = '') {
    const cell = document.createElement('td');

    if (elementType === 'img') {
        const img = document.createElement('img');
        img.src = contentOrSrc;
        img.alt = alt;
        img.classList.add(className);
        cell.appendChild(img);
    } else {
        cell.textContent = contentOrSrc;
    }

    return cell;
}
function getEmployees() {
    fetch(URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            allEmployees = data;
            displayedEmployees = data.slice(); // Copia os dados para displayedEmployees
            showEmployees();
        })
        .catch(error => console.error('Erro ao obter funcionários:', error));
}

function filterEmployees() {
    const filterValue = document.getElementById('search').value.trim().toLowerCase();
    displayedEmployees = allEmployees.filter(employee => 
        employee.name.toLowerCase().includes(filterValue) ||
        employee.job.toLowerCase().includes(filterValue) ||
        formatPhoneNumber(employee.phone).toLowerCase().includes(filterValue) ||
        employee.phone.replace(/\D/g, '').includes(filterValue)
    );
    showEmployees();
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', filterEmployees);
    }
    getEmployees();
});