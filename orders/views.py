from django.shortcuts import render, redirect
from .models import OrderItem, Order
from cart.cart import Cart

def order_create(request):
    cart = Cart(request)
    if not cart:
        return redirect('cart:cart_detail')
        
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        address = request.POST.get('address')
        postal_code = request.POST.get('postal_code')
        city = request.POST.get('city')
        
        order = Order.objects.create(
            first_name=first_name, last_name=last_name, email=email,
            address=address, postal_code=postal_code, city=city
        )
        if request.user.is_authenticated:
            order.user = request.user
            order.save()
            
        for item in cart:
            OrderItem.objects.create(
                order=order,
                product=item['product'],
                price=item['price'],
                quantity=item['quantity']
            )
        cart.clear()
        return render(request, 'orders/created.html', {'order': order})
        
    return render(request, 'orders/create.html', {'cart': cart})
