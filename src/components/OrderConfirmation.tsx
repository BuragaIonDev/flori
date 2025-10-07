import { CheckCircle, Package, Mail, X } from 'lucide-react';

type OrderConfirmationProps = {
  orderId: string;
  customerEmail: string;
  onClose: () => void;
};

export default function OrderConfirmation({
  orderId,
  customerEmail,
  onClose,
}: OrderConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-slideUp">
        <div className="p-8 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h2>
            <p className="text-gray-600">
              Thank you for your purchase
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-rose-500" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-semibold text-gray-900 break-all">
                  {orderId.split('-')[0]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-rose-500" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Confirmation sent to</p>
                <p className="font-semibold text-gray-900 break-all">
                  {customerEmail}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-rose-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700">
              We'll send you updates about your delivery via email. Your fresh flowers
              will be carefully prepared and delivered on your selected date.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 bg-rose-500 text-white rounded-xl font-semibold text-lg hover:bg-rose-600 transition-colors shadow-lg hover:shadow-xl"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
