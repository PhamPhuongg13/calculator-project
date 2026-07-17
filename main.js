const result = document.querySelector(".result");
const buttons = document.querySelectorAll("button");

let bieuThuc = "";

function checkValid(str) {
    return true;
}

function updateDisplay(idx) {
    if (buttons[idx].textContent === "=") {
        if (checkValid(bieuThuc)) 
            result.textContent = calculate(bieuThuc);
    }
    else if (buttons[idx].textContent === "AC") {
        bieuThuc = result.textContent = "";
    }
    else {
        if (buttons[idx].classList.contains("operator") && ["+", "−", "×", "÷"].includes(bieuThuc[bieuThuc.length - 1]))
            bieuThuc = bieuThuc.slice(0, -1);
        bieuThuc += buttons[idx].textContent;
        result.textContent = bieuThuc;
    }
}

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    buttons[i].classList.add("active");
    updateDisplay(i);
  });
}

function priority(op) {
  if (op === "+" || op === "-") return 1;
  if (op === "*" || op === "/" || op === "%") return 2;
  return 0;
}

function process(nums, op) {
  const t1 = nums.pop(),
    t2 = nums.pop(),
    ope = op.pop();

  if (ope === "+") return Number(t1) + Number(t2);
  else if (ope === "-") return Number(t2) - Number(t1);
  else if (ope === "*") return Number(t2) * Number(t1);
  else if (ope === "/") return Number(t2) / Number(t1); 
  else return Number(t2) % Number(t1); 
}

function calculate(str) {
  let nums = new Array();
  let op = new Array();
  let number = "";

    for (let i = 0; i < str.length; i++) {
        if (str[i] == " ") continue;
        if (str[i] >= "0" && str[i] <= "9") {
            number += str[i];
        } 
        else {
            nums.push(number);
            number = "";
            while(nums.length >= 2 && op.length >= 1 && priority(op[op.length - 1]) >= priority(str[i])) {
                let kq = process(nums, op);
                nums.push(kq);
            }
            
            op.push(str[i]);
        }
    }
    if (number !== "") nums.push(number);
    
    while(nums.length >= 2 && op.length >= 1) {
        let kq = process(nums, op);
        nums.push(kq);
    }
    return nums[0];
}



