import { showEmployees } from "./main.js"

const URL = "http://localhost:3000/employees";

let allEmployees = [];
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