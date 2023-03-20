// import packages
import { v4 as uuidv4 } from "uuid";
import DirectMeasurement from "./Direct";

// DOM elements
const tbodyEl = document.getElementById("tbody");
const formEl = document.getElementById("form");
const inputEl = document.getElementById("input-value");
const calculateBtn = document.querySelector('[data-action="calculate"]');
const rangeBtn = document.querySelector('[data-action="range"]');

// data
let data = [{ id: uuidv4(), value: 24.567 }];

// custom variables
let isEditing = false;
let editingID = "";
let RANGE = 4;

// Event Listeners
window.addEventListener("DOMContentLoaded", () => {
  render();
});

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  addNewValue(inputEl);
});

rangeBtn.addEventListener("input", (e) => {
  RANGE = e.target.value;
  calculation();
});

calculateBtn.addEventListener("click", () => {
  calculation();
});

// Functions
function calculation() {
  const inputsEl = document.querySelectorAll("[data-input]");
  const outputsEl = document.querySelectorAll("[data-output]");

  let arr = [];
  let coefficient = "";
  let smallestScale = "";
  let type = "";
  let range = RANGE;
  let calibration = "";
  let diapason = "";

  for (let output of inputsEl) {
    switch (output.dataset.input) {
      case "value":
        arr.push(parseFloat(output.innerText));
        break;
      case "coefficient":
        coefficient = parseFloat(output.value);
        break;
      case "sm-scale":
        smallestScale = parseFloat(output.value);
        break;
      case "type":
        type = output.value;
        break;
      case "calibration":
        calibration = parseFloat(output.value);
        break;
      case "diapason":
        diapason = parseFloat(output.value);
        break;
      default:
        break;
    }
  }

  const direct = new DirectMeasurement(
    arr,
    smallestScale,
    coefficient,
    type,
    range,
    diapason,
    calibration
  );

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
}

function addNewValue(input) {
  const value = input.value;
  // validation
  if (!value) return;

  if (isEditing) {
    data.map((element) => {
      if (element.id === editingID) element.value = inputEl.value;
    });
  } else {
    data.push({ id: uuidv4(), value: value });
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
          <td>${index}</td>
          <td>
            <span data-input="value" data-set-width="md">${element.value}</span>
          </td>
          <td>
            <button class="button" data-action="edit">
              <i class="fa-solid fa-edit"></i>
            </button>
          </td>
          <td>
            <button class="button" data-action="delete">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
    `;

    const actionBtns = tbodyEl.querySelectorAll("[data-action]");
    actionBtns.forEach((btn) => {
      btn.addEventListener("click", handleClick);
    });
  });
}

function handleClick(e) {
  let btn = "";
  // Check if the target is the button or the icon
  if (e.target.dataset.action) {
    btn = e.target;
  } else {
    btn = e.target.parentElement;
  }

  const parentRow = btn.parentElement.parentElement;
  const parentId = parentRow.dataset.id;
  const value = parentRow.querySelector('[data-input="value"]');

  switch (btn.dataset.action) {
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
