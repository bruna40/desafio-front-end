import { formatPhoneNumber } from './formatNumber.js';

import { formatDate } from './formatDate.js';

const URL = "http://localhost:3000/employees";

export let allEmployees = [];
export let displayedEmployees = [];

export function getEmployees() {
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

export function showEmployees() {
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
    const cellExpand = createTableCell('td', '<img src="./assets/arrow-down.png"/>', 'expand-button-cell', 'mobile-only');

    cellExpand.addEventListener('click', function() {
        const img = this.querySelector('img');
        if (img.src.includes('arrow-down.png')) {
            img.src = './assets/arrow-up.png'; 
        } else {
            img.src = './assets/arrow-down.png';
        }
    });

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
            <p class="details-content-line"><span>Cargo</span> ${employee.job}</p>
            <p class="details-content-line"><span>Data de Admissão</span> ${formatDate(employee.admission_date)}</p>
            <p class="details-content-line"><span>Telefone</span> ${formatPhoneNumber(employee.phone)}</p>
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
