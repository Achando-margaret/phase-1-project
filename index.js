let cart = []
const productList = document.getElementById('productList');
const searchInput = document.getElementById('searchInput');
const filterBtn = document.getElementById('filterBtn');
const toggleModeBtn = document.getElementById('toggleModeBtn');
let products = [];

// Fetch products from the json-server API
fetch('http://localhost:3000/products')
  .then(response => response.json())
  .then(data => {
    // Store the products data
    products = data;

    // Display all products on the page initially
    displayProducts(products);
  })
  .catch(error => {
    console.error('Error:', error);
  });

// Event listener for search input
searchInput.addEventListener('input', function () {
  const searchValue = this.value.toLowerCase();
  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchValue));
  displayProducts(filteredProducts);
});

// Event listener for filter button
filterBtn.addEventListener('click', function () {
  const filteredProducts = products.filter(product => product.price <= 20);
  displayProducts(filteredProducts);
});

// Event listener for toggle mode button
toggleModeBtn.addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');
});

// Display the products on the page
function displayProducts(products) {
  productList.innerHTML = '';

  products.forEach(product => {
    const productSection = document.createElement('section');
    productSection.innerHTML = `
      <h2>${product.name}</h2>
      <img src="${product.image}" alt="${product.name} Image" data-id="${product.id}">
      <p>Price: $${product.price}</p>
      <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
    `;
    productList.appendChild(productSection);
  });

  // Add event listeners to the "Add to Cart" buttons
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.getAttribute('data-id');
      addToCart(productId);
    });
  });
}

// Function to add an item to the cart
function addToCart(productId) {
  const productToAdd = products.find(product => product.id == productId);
  if (productToAdd) {
    cart.push(productToAdd);
    displayCart();
    // Display toast message
    const toast = document.createElement('div');
    toast.className = 'toast show-toast';
    toast.textContent = `${productToAdd.name} has been added to the cart.`;
    document.body.appendChild(toast);
    // Remove the toast after a certain duration
    setTimeout(() => {
      toast.classList.remove('show-toast');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, 3000); // Adjust the duration (in milliseconds) as needed
  }
}




// Function to remove an item from the cart
function removeFromCart(productId) {
  const index = cart.findIndex(item => item.id == productId);
  if (index !== -1) {
    cart.splice(index, 1);
    displayCart();
  }
}
// Display the items in the cart
function displayCart() {
  cartItems.innerHTML = '';
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - Quantity: ${item.quantity || 1}`;
    
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      removeFromCart(item.id);
    });

    li.appendChild(removeButton);
    cartItems.appendChild(li);
  });
}
// Function to increment the quantity of an item in the cart
function incrementQuantity(productId) {
  const productToUpdate = cart.find(item => item.id == productId);
  if (productToUpdate) {
    productToUpdate.quantity = (productToUpdate.quantity || 1) + 1;
    displayCart();
  }
}

// Display the items in the cart
function displayCart() {
  cartItems.innerHTML = '';
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - Quantity: ${item.quantity || 1}`;
    
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      removeFromCart(item.id);
    });
    
    const plusButton = document.createElement('button');
    plusButton.textContent = '+';
    plusButton.addEventListener('click', () => {
      incrementQuantity(item.id);
    });

    li.appendChild(plusButton);
    li.appendChild(removeButton);
    cartItems.appendChild(li);
  });
}
