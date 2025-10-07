import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { getSessionId } from './lib/cart';
import type { Product, CartItem } from './lib/supabase';
import type { OrderFormData } from './components/Checkout';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';

type View = 'home' | 'cart' | 'checkout' | 'confirmation';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<(CartItem & { product: Product })[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [orderId, setOrderId] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const sessionId = getSessionId();

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  async function loadProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setProducts(data);
        setFeaturedProducts(data.filter((p) => p.featured));
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadCart() {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, product:products(*)')
        .eq('session_id', sessionId);

      if (error) throw error;

      if (data) {
        setCartItems(data as (CartItem & { product: Product })[]);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }

  async function addToCart(product: Product) {
    try {
      const existingItem = cartItems.find((item) => item.product_id === product.id);

      if (existingItem) {
        const newQuantity = Math.min(
          existingItem.quantity + 1,
          product.stock
        );

        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            session_id: sessionId,
            product_id: product.id,
            quantity: 1,
          });

        if (error) throw error;
      }

      await loadCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }

  async function updateCartQuantity(itemId: string, quantity: number) {
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq('id', itemId);

      if (error) throw error;

      await loadCart();
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  }

  async function removeFromCart(itemId: string) {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      await loadCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  }

  async function submitOrder(orderData: OrderFormData) {
    try {
      const total = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          ...orderData,
          total_amount: total,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price,
        product_name: item.product.name,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      const { error: deleteError } = await supabase
        .from('cart_items')
        .delete()
        .eq('session_id', sessionId);

      if (deleteError) throw deleteError;

      setOrderId(order.id);
      setCustomerEmail(orderData.customer_email);
      setCartItems([]);
      setCurrentView('confirmation');
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading beautiful flowers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartCount={cartCount}
        onCartClick={() => setCurrentView('cart')}
        onLogoClick={() => setCurrentView('home')}
      />

      {currentView === 'home' && (
        <>
          <Hero />

          <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Featured Arrangements
              </h2>
              <p className="text-gray-600 text-lg">
                Hand-picked selections from our expert florists
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onViewDetails={setSelectedProduct}
                />
              ))}
            </div>
          </section>

          <section id="catalog" className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  All Flowers
                </h2>
                <p className="text-gray-600 text-lg">
                  Explore our complete collection
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    onViewDetails={setSelectedProduct}
                  />
                ))}
              </div>
            </div>
          </section>

          <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                Bloom & Petal
              </h3>
              <p className="text-gray-400 mb-4">
                Fresh flowers delivered with love, every day
              </p>
              <p className="text-gray-500 text-sm">
                © 2025 Bloom & Petal. All rights reserved.
              </p>
            </div>
          </footer>
        </>
      )}

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      {currentView === 'cart' && (
        <Cart
          cartItems={cartItems}
          onClose={() => setCurrentView('home')}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeFromCart}
          onCheckout={() => setCurrentView('checkout')}
        />
      )}

      {currentView === 'checkout' && (
        <Checkout
          cartItems={cartItems}
          onClose={() => setCurrentView('cart')}
          onSubmitOrder={submitOrder}
        />
      )}

      {currentView === 'confirmation' && (
        <OrderConfirmation
          orderId={orderId}
          customerEmail={customerEmail}
          onClose={() => setCurrentView('home')}
        />
      )}
    </div>
  );
}

export default App;
