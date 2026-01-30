// calculator.js

const areaRange = document.getElementById('areaRange');
const areaDisplay = document.getElementById('areaDisplay');
const roofType = document.getElementById('roofType');
const totalDisplay = document.getElementById('totalDisplay');

function calculate() {
    const area = parseInt(areaRange.value);
    const pricePerMeter = parseInt(roofType.value);
    const total = area * pricePerMeter;
    
    areaDisplay.innerText = area;
    // Форматирование числа с пробелами (например 14 000)
    totalDisplay.innerText = total.toLocaleString('ru-RU');
}

// Слушатели событий
if (areaRange && roofType) {
    areaRange.addEventListener('input', calculate);
    roofType.addEventListener('change', calculate);
}