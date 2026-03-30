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
      photo.src = 'framed/PuertoDream-BlackFrame.png';
      break;
    case 'wood':
      photo.src = 'framed/PuertoDream-WoodFrame.png';
      break;
    case 'none':
    default:
      photo.src = 'framed/PuertoDream-NoFrame.png';
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




paypal.Buttons({
    createOrder: function(data, actions) {
      const sizePrice = parseFloat(sizeSelect.options[sizeSelect.selectedIndex].dataset.price);
      const framePrice = parseFloat(frameSelect.options[frameSelect.selectedIndex].dataset.price);
      const totalPrice = (sizePrice + framePrice).toFixed(2);
  
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: totalPrice
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        alert('Transaction completed by ' + details.payer.name.given_name + '!');
        // You can add redirect or database logic here
      });
    }
  }).render('#paypal-button-container');
  