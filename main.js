const result = document.querySelector(".result");
const buttons = document.querySelectorAll("button");
let bieuThuc = "";

function checkValid(str) {
    try {
        calculate(str);
        return true;
    }
    catch {
        return false;
    }
}

function isOperator(char) {
    return ["+", "−", "×", "÷", "%"].includes(char);
}

function isBinaryOperator(char) {
    return ["+", "−", "×", "÷"].includes(char);
}

function getCurrentNumber() {
    let start = bieuThuc.length - 1;

    while (
        start >= 0 &&
        ((bieuThuc[start] >= "0" && bieuThuc[start] <= "9") || bieuThuc[start] === ".")
    ) {
        start--;
    }

    return bieuThuc.slice(start + 1);
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
    const currentValue = buttons[idx].textContent;

    if (currentValue !== "AC" && currentValue !== "=" && bieuThuc === "Error") {
        bieuThuc = "";
    }

    if (currentValue === "=") {
        if (checkValid(bieuThuc)) {
            bieuThuc = String(calculate(bieuThuc));
        }
        else {
            bieuThuc = "Error";
        }
    }
    else if (currentValue === "AC") {
        bieuThuc = "";
    }
    else if (currentValue === "⌫") {
        bieuThuc = bieuThuc.slice(0, -1);
    }
    else if (currentValue === "±") {
        toggleSign();
    }
    else if (currentValue === ".") {
        const lastValue = bieuThuc[bieuThuc.length - 1];
        const currentNumber = getCurrentNumber();

        if (currentNumber.includes(".")) return;
        if (bieuThuc === "" || isBinaryOperator(lastValue)) bieuThuc += "0.";
        else if (lastValue !== "%") bieuThuc += ".";
    }
    else if (currentValue === "%") {
        const lastValue = bieuThuc[bieuThuc.length - 1];

        if (bieuThuc !== "" && !isBinaryOperator(lastValue) && lastValue !== "%") {
            bieuThuc += currentValue;
        }
    }
    else {
        const lastValue = bieuThuc[bieuThuc.length - 1];
        const allowSignedNumber = ["+", "−"].includes(currentValue) && ["×", "÷"].includes(lastValue);

        if (lastValue === "%" && !buttons[idx].classList.contains("operator")) return;
        if (["×", "÷"].includes(currentValue) && bieuThuc === "") return;
        if (buttons[idx].classList.contains("operator") && ["+", "−", "×", "÷"].includes(lastValue) && !allowSignedNumber)
            bieuThuc = bieuThuc.slice(0, -1);
        bieuThuc += currentValue;
    }
    result.textContent = bieuThuc;
}

function priority(op) {
  if (op === "+" || op === "−") return 1;
  if (op === "×" || op === "÷") return 2;
  return 0;
}

function process(nums, op) {
  const t1 = nums.pop(),
    t2 = nums.pop(),
    ope = op.pop();

  if (t1 === undefined || t2 === undefined || ope === undefined) {
    throw new Error("Invalid expression");
  }

  if (ope === "+") return Number(t1) + Number(t2);
  else if (ope === "−") return Number(t2) - Number(t1);
  else if (ope === "×") return Number(t2) * Number(t1);
  else {
    if (Number(t1) === 0) throw new Error("Cannot divide by zero");
    return Number(t2) / Number(t1); 
  }
}

function calculate(str) {
  let nums = new Array();
  let op = new Array();
  let number = "";
  let expectingNumber = true;

    function pushNumber(isPercent = false) {
        if (number === "" || number === "-" || number === "." || number === "-.") {
            throw new Error("Invalid expression");
        }

        const value = Number(number);

        if (!Number.isFinite(value)) {
            throw new Error("Invalid expression");
        }

        nums.push(isPercent ? value / 100 : value);
        number = "";
        expectingNumber = false;
    }

    function pushOperator(char) {
        while(nums.length >= 2 && op.length >= 1 && priority(op[op.length - 1]) >= priority(char)) {
            let kq = process(nums, op);
            nums.push(kq);
        }
        
        op.push(char);
        expectingNumber = true;
    }

    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        const isDigit = char >= "0" && char <= "9";
        const isDecimal = char === ".";

        if (char === " ") continue;

        if (isDigit || isDecimal) {
            if (!expectingNumber && number === "") {
                throw new Error("Invalid expression");
            }

            if (isDecimal && number.includes(".")) {
                throw new Error("Invalid expression");
            }

            if (isDecimal && (number === "" || number === "-")) {
                number += "0.";
            }
            else {
                number += char;
            }

            expectingNumber = false;
        }
        else if ((char === "−" || char === "+") && expectingNumber && number === "") {
            if (char === "−") number = "-";
        }
        else if (char === "%") {
            pushNumber(true);
        }
        else if (isBinaryOperator(char)) {
            if (number !== "") {
                pushNumber();
            }

            if (expectingNumber) {
                throw new Error("Invalid expression");
            }

            pushOperator(char);
        }
        else {
            throw new Error("Invalid expression");
        }
    }

    if (number !== "") {
        pushNumber();
    }
    else if (expectingNumber) {
        throw new Error("Invalid expression");
    }
    
    while(nums.length >= 2 && op.length >= 1) {
        let kq = process(nums, op);
        nums.push(kq);
    }

    if (nums.length !== 1 || op.length !== 0) {
        throw new Error("Invalid expression");
    }

    return nums[0];
}


for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    buttons[i].classList.add("active");
    updateDisplay(i);
  });
}
