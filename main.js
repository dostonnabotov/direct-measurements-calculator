// import packages
import { v4 as uuidv4 } from "uuid";
import DirectMeasurement from "./Direct";

// DOM elements
const tbodyEl = document.getElementById("tbody");
const formEl = document.getElementById("form");
const inputEl = formEl.querySelector("#input-value");
const calculateBtn = document.querySelector('[data-action="calculate"]');

// data
let data = [];

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

calculateBtn.addEventListener("click", () => {
  const inputsEl = document.querySelectorAll("[data-input]");
  const outputsEl = document.querySelectorAll("[data-output]");
  let arr = [],
    coefficient = "",
    smallestScale = "",
    type = "";

  for (let i of inputsEl) {
    switch (i.dataset.input) {
      case "value":
        arr.push(parseFloat(i.innerText));
        break;
      case "coefficient":
        coefficient = parseFloat(i.value);
        break;
      case "sm-scale":
        smallestScale = parseFloat(i.value);
        break;
      case "type":
        type = i.value;
        break;
      default:
        break;
    }
  }

  const direct = new DirectMeasurement(arr, smallestScale, coefficient, type);

  for (let i of outputsEl) {
    switch (i.dataset.output) {
      case "average":
        i.innerHTML = direct.averageValue();
        break;
      case "standard-error":
        i.innerHTML = direct.standardError();
        break;
      case "device-error":
        i.innerHTML = direct.deviceError();
        break;
      case "random-error":
        i.innerHTML = direct.randomError();
        break;
      case "measurement-error":
        i.innerHTML = direct.measurementError();
        break;
      case "absolute-error":
        i.innerHTML = direct.absoluteError();
        break;
      case "relative-error":
        i.innerHTML = direct.relativeError();
        break;
      case "result":
        i.innerHTML = direct.calculate();
        break;
      default:
        break;
    }
  }
});

// Functions
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
          <td data-input="value">${element.value}</td>
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
  const value = parentRow.querySelector('[data-input="value"]');

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
