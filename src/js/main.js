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
        const mainRow = createMainRow(employee);
        tableBody.appendChild(mainRow);

        const detailsRow = createDetailsRow(employee);
        tableBody.appendChild(detailsRow);

        const expandCell = mainRow.querySelector('.expand-button-cell');
        expandCell.addEventListener('click', () => {
            detailsRow.classList.toggle('visible');
        });
    });
}

function createMainRow(employee) {
    const mainRow = document.createElement('tr');

    const cellFoto = createTableCell('td', '', 'employee-img');
    const img = document.createElement('img');
    img.src = employee.image;
    img.alt = employee.name;
    img.classList.add('employee-img');
    cellFoto.appendChild(img);

    const cellNome = createTableCell('td', employee.name);
    const cellExpand = createTableCell('td', '&#x25BC;', 'expand-button-cell', 'mobile-only');


    const cellCargo = createTableCell('td', employee.job, 'desktop-only');
    const cellAdmissao = createTableCell('td', formatDate(employee.admission_date), 'desktop-only');
    const cellPhone = createTableCell('td', formatPhoneNumber(employee.phone), 'desktop-only');

    mainRow.appendChild(cellFoto);
    mainRow.appendChild(cellNome);
    mainRow.appendChild(cellExpand);
    mainRow.appendChild(cellCargo);
    mainRow.appendChild(cellAdmissao);
    mainRow.appendChild(cellPhone);


    return mainRow;
}

function createDetailsRow(employee) {
    const detailsRow = document.createElement('tr');
    detailsRow.classList.add('details-row', 'mobile-only');

    const detailsCell = document.createElement('td');
    detailsCell.colSpan = 3;

    detailsCell.innerHTML = `
        <div class="details-content">
            <p><strong>Cargo:</strong> ${employee.job}</p>
            <p><strong>Data de Admissão:</strong> ${formatDate(employee.admission_date)}</p>
            <p><strong>Telefone:</strong> ${formatPhoneNumber(employee.phone)}</p>
        </div>
    `;

    detailsRow.appendChild(detailsCell);
    return detailsRow;
}

function createTableCell(elementType, text, ...classNames) {
    const cell = document.createElement(elementType);
    classNames.forEach(className => {
        cell.classList.add(className);
    });
    cell.innerHTML = text;
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
            displayedEmployees = data.slice();
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
