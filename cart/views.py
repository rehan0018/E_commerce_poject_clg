from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from products.models import Product
from .cart import Cart
import json

def cart_add(request, product_id):
    cart = Cart(request)
    product = get_object_or_404(Product, id=product_id)
    if request.method == 'POST':
        data = json.loads(request.body)
        quantity = int(data.get('quantity', 1))
        override = data.get('override', False)
        cart.add(product=product, quantity=quantity, override_quantity=override)
        
        return JsonResponse({
            'success': True,
            'cart_total': str(cart.get_total_price()),
            'cart_len': len(cart)
        })
    return JsonResponse({'success': False}, status=400)

def cart_remove(request, product_id):
    cart = Cart(request)
    product = get_object_or_404(Product, id=product_id)
    if request.method == 'POST':
        cart.remove(product)
        return JsonResponse({
            'success': True,
            'cart_total': str(cart.get_total_price()),
            'cart_len': len(cart)
        })
    return JsonResponse({'success': False}, status=400)

def cart_detail(request):
    cart = Cart(request)
    return render(request, 'cart/detail.html', {'cart': cart})
