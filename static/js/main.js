// Auto-dismiss toasts
document.addEventListener('DOMContentLoaded', () => {
    const toasts = document.querySelectorAll('#toast-container > div');
    toasts.forEach(toast => {
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.4s ease';
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    });
});

// Ajax Add to Cart logic
function addProductToCart(productId, quantity = 1, override = false) {
    const btn = event.currentTarget;
    if(btn) {
        btn.innerHTML = `<span class="animate-spin inline-block w-4 h-4 border-2 border-white rounded-full border-t-transparent"></span>`;
        btn.disabled = true;
    }

    fetch(`/cart/add/${productId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({ quantity, override })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            document.getElementById('cart-counter').innerText = data.cart_len;
            showToast('Added to cart successfully!', 'success');
        }
    })
    .catch(error => console.error('Error:', error))
    .finally(() => {
        if(btn) {
            btn.innerHTML = `Add to Cart`;
            btn.disabled = false;
        }
    });
}

// Function to get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function showToast(message, type) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-20 right-6 z-50 flex flex-col gap-2 pointer-events-none';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'glass-effect px-6 py-3 rounded-lg shadow-lg border border-glassBorder animate-slide-in pointer-events-auto flex items-center gap-3 bg-white bg-opacity-70 backdrop-blur-md';
    toast.innerHTML = `<div class="w-2 h-2 rounded-full ${type === 'success' ? 'bg-green-500' : 'bg-blue-500'}"></div><p class="text-sm font-medium text-gray-800">${message}</p>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}
