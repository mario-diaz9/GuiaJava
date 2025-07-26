// Load cart from localStorage
const cart = JSON.parse(localStorage.getItem('checkout_cart') || '[]');
const checkoutItems = document.getElementById('checkoutItems');
const checkoutTotal = document.getElementById('checkoutTotal');
const checkoutForm = document.getElementById('checkoutForm');

// Display checkout items and total
function displayCheckoutSummary() {
    checkoutItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div>
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
        </div>
    `).join('');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.13;
    const total = subtotal + tax;
    
    checkoutItems.innerHTML += `
        <div class="checkout-summary-totals">
            <div class="subtotal-line">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="tax-line">
                <span>IVA (13%):</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
        </div>
    `;
    
    checkoutTotal.textContent = `$${total.toFixed(2)}`;
}

// Form validation
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

function validatePhone(phone) {
    return /^[0-9]{8}$/.test(phone);
}

// Handle form submission
checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        nombres: document.getElementById('nombres').value,
        apellidos: document.getElementById('apellidos').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        direccion: document.getElementById('direccion').value
    };

    if (!validateEmail(formData.email)) {
        alert('Por favor, ingresa un correo electrónico válido');
        return;
    }

    if (!validatePhone(formData.telefono)) {
        alert('Por favor, ingresa un número de teléfono válido (8 dígitos)');
        return;
    }

    try {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.13;
        const total = subtotal + tax;



        // Save order details for confirmation page
        localStorage.setItem('order_details', JSON.stringify({
            cart,
            subtotal,
            tax,
            total,
            customer: formData
        }));

        // Clear cart
        localStorage.removeItem('cart');
        localStorage.removeItem('checkout_cart');

        // Redirect to confirmation page
        window.location.href = 'confirmation.html';
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al procesar tu orden. Por favor, intenta nuevamente.');
    }
});

// Initialize checkout page
displayCheckoutSummary();