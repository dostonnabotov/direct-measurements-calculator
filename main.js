// import packages
import { v4 as uuidv4 } from "uuid";

// DOM elements
const tbodyEl = document.getElementById("tbody");
const formEl = document.getElementById("form");
const inputEl = formEl.querySelector('input[type="number"]');

// data
let data = [
  {
    id: uuidv4(),
    value: 24,
  },
  {
    id: uuidv4(),
    value: 25,
  },
];

// custom variables
let isEditing = false;
let editingID = "";

// Event Listeners
window.addEventListener("DOMContentLoaded", () => {
  render();
});

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  addNewValue(inputEl);
});

function addNewValue(input) {
  const value = input.value;
  // validation
  if (!value) return;

  if (isEditing) {
    data.map((element) => {
      if (element.id === editingID) element.value = inputEl.value;
    });
  } else {
    data.push({ id: uuidv4(), value });
  }

  render();
  isEditing = false;
  input.value = "";
}

function render() {
  // validation
  tbodyEl.innerHTML = "";
  if (data.length === 0) return;

  renderRows();
}

function renderRows() {
  // render in UI
  data.forEach((element, index) => {
    tbodyEl.innerHTML += `
        <tr data-id=${element.id}>
          <th scope="row">${index}</th>
          <td data-value>${element.value}</td>
          <td class="form-group" data-form-layout="50-50">
            <button data-action="edit">Edit</button>
            <button data-action="delete">Delete</button>
          </td>
        </tr>
    `;

    const actionBtns = tbodyEl.querySelectorAll("[data-action]");
    actionBtns.forEach((btn) => {
      btn.addEventListener("click", performActions);
    });
  });
}

function performActions(e) {
  const parentRow = e.target.parentElement.parentElement;
  const parentId = parentRow.dataset.id;
  const value = parentRow.querySelector("[data-value]");

  switch (e.target.dataset.action) {
    case "delete":
      data = data.filter((element) => element.id != parentId);
      render();
      break;

    case "edit":
      const found = data.find((element) => element.id === parentId);
      isEditing = true;
      editingID = found.id;
      inputEl.value = value.innerText;
      break;

    default:
      break;
  }
}
