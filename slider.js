const slider = document.getElementById('beforeAfterSlider');
const beforeImg = document.getElementById('beforeImg');
const sliderLine = document.getElementById('sliderLine');

slider.addEventListener('input', (e) => {
  const value = e.target.value;
  beforeImg.style.width = value + '%';
  sliderLine.style.left = value + '%';
});