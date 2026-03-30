const sizeSelect = document.getElementById('size');
const frameSelect = document.getElementById('frame');
const priceTag = document.getElementById('price');
const photo = document.getElementById('photo');

// Function to update the price based on selected size and frame
function updatePrice() {
  const sizePrice = parseFloat(sizeSelect.options[sizeSelect.selectedIndex].dataset.price);
  const framePrice = parseFloat(frameSelect.options[frameSelect.selectedIndex].dataset.price);
  const totalPrice = sizePrice + framePrice;

  priceTag.textContent = `Price: $${totalPrice}`;
}

// Function to update the image based on selected frame
function updateImage() {
  const frameValue = frameSelect.value;
  switch (frameValue) {
    case 'black':
      photo.src = 'framed/Palmera-BlackFrame.png';
      break;
    case 'wood':
      photo.src = 'framed/Palmera-WoodFrame.png';
      break;
    case 'none':
    default:
      photo.src = 'framed/Palmera-NoFrame.png';
      break;
  }
}

// Attach event listeners
sizeSelect.addEventListener('change', updatePrice);
frameSelect.addEventListener('change', () => {
  updatePrice();
  updateImage();
});

// Set initial state
updatePrice();
updateImage();


