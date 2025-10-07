import { X, ShoppingCart, Package, Flower2 } from 'lucide-react';
import type { Product } from '../lib/supabase';

type ProductDetailProps = {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
};

export default function ProductDetail({ product, onClose, onAddToCart }: ProductDetailProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative h-96 md:h-full bg-gray-100">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.featured && (
                <span className="absolute top-6 left-6 bg-rose-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Featured
                </span>
              )}
            </div>

            <div className="p-8">
              <div className="flex items-center gap-2 mb-3">
                <Flower2 className="w-5 h-5 text-rose-500" />
                <span className="text-sm text-rose-500 font-semibold uppercase tracking-wide">
                  {product.category}
                </span>
              </div>

              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h2>

              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                {product.description}
              </p>

              <div className="border-t border-b border-gray-200 py-6 mb-6">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-5xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Package className="w-5 h-5" />
                  {product.stock > 5 ? (
                    <span className="font-medium text-green-600">In Stock</span>
                  ) : product.stock > 0 ? (
                    <span className="font-medium text-orange-600">
                      Only {product.stock} remaining
                    </span>
                  ) : (
                    <span className="font-medium text-red-600">Out of Stock</span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  disabled={product.stock === 0}
                  className="w-full py-4 bg-rose-500 text-white rounded-xl font-semibold text-lg hover:bg-rose-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>

                <div className="bg-rose-50 rounded-xl p-4 space-y-2">
                  <h3 className="font-semibold text-gray-900">Delivery Information</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Same-day delivery available</li>
                    <li>• Fresh flowers hand-selected by our florists</li>
                    <li>• Includes care instructions</li>
                    <li>• Satisfaction guaranteed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
