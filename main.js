const result = document.querySelector(".result");
const buttons = document.querySelectorAll("button");
let bieuThuc = "";

function checkValid(str) {
    return true;
}

function isOperator(char) {
    return ["+", "−", "×", "÷", "%"].includes(char);
}

function toggleSign() {
    if (bieuThuc === "") {
        bieuThuc = "−";
        return;
    }

    const lastValue = bieuThuc[bieuThuc.length - 1];

    if (["+", "×", "÷"].includes(lastValue)) {
        bieuThuc += "−";
        return;
    }

    if (lastValue === "−") {
        const beforeLastValue = bieuThuc[bieuThuc.length - 2];

        if (bieuThuc.length === 1 || isOperator(beforeLastValue)) {
            bieuThuc = bieuThuc.slice(0, -1);
        }

        return;
    }

    let start = bieuThuc.length - 1;

    while (
        start >= 0 &&
        ((bieuThuc[start] >= "0" && bieuThuc[start] <= "9") || bieuThuc[start] === ".")
    ) {
        start--;
    }

    const numberStart = start + 1;

    if (numberStart === bieuThuc.length) return;

    if (bieuThuc[start] === "−" && (start === 0 || isOperator(bieuThuc[start - 1]))) {
        bieuThuc = bieuThuc.slice(0, start) + bieuThuc.slice(numberStart);
    }
    else {
        bieuThuc = bieuThuc.slice(0, numberStart) + "−" + bieuThuc.slice(numberStart);
    }
}

function updateDisplay(idx) {
    if (buttons[idx].textContent === "=") {
        if (checkValid(bieuThuc)) {
            bieuThuc = String(calculate(bieuThuc));
        }
    }
    else if (buttons[idx].textContent === "AC") {
        bieuThuc = "";
    }
    else if (buttons[idx].textContent === "⌫") {
        bieuThuc = bieuThuc.slice(0, -1);
    }
    else if (buttons[idx].textContent === "±") {
        toggleSign();
    }
    else {
        const currentValue = buttons[idx].textContent;
        const lastValue = bieuThuc[bieuThuc.length - 1];
        const allowSignedNumber = ["+", "−"].includes(currentValue) && ["×", "÷"].includes(lastValue);

        if (buttons[idx].classList.contains("operator") && ["+", "−", "×", "÷"].includes(lastValue) && !allowSignedNumber)
            bieuThuc = bieuThuc.slice(0, -1);
        bieuThuc += currentValue;
    }
    result.textContent = bieuThuc;
}

function priority(op) {
  if (op === "+" || op === "−") return 1;
  if (op === "×" || op === "÷" || op === "%") return 2;
  return 0;
}

function process(nums, op) {
  const t1 = nums.pop(),
    t2 = nums.pop(),
    ope = op.pop();

  if (ope === "+") return Number(t1) + Number(t2);
  else if (ope === "−") return Number(t2) - Number(t1);
  else if (ope === "×") return Number(t2) * Number(t1);
  else if (ope === "÷") return Number(t2) / Number(t1); 
  else return Number(t2) % Number(t1); 
}

function calculate(str) {
  let nums = new Array();
  let op = new Array();
  let number = "";

    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        const prevChar = str[i - 1];
        const isDigit = char >= "0" && char <= "9";
        const isDecimal = char === ".";
        const isSign =
            (char === "−" || char === "+") &&
            number === "" &&
            (i === 0 || ["+", "−", "×", "÷", "%"].includes(prevChar));

        if (char == " ") continue;
        if (isDigit || isDecimal || isSign) {
            if (char === "−") number += "-";
            else if (char !== "+") number += char;
        } 
        else {
            if (number !== "") {
                nums.push(number);
                number = "";
            }
            number = "";
            while(nums.length >= 2 && op.length >= 1 && priority(op[op.length - 1]) >= priority(char)) {
                let kq = process(nums, op);
                nums.push(kq);
            }
            
            op.push(char);
        }
    }
    if (number !== "") nums.push(number);
    
    while(nums.length >= 2 && op.length >= 1) {
        let kq = process(nums, op);
        nums.push(kq);
    }

    if (op.length && op[op.length - 1] == "%")
        return Number(nums[0]) / 100;
    return nums[0];
}


for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    buttons[i].classList.add("active");
    updateDisplay(i);
  });
}
