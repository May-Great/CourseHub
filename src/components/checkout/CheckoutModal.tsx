import React, { useState } from 'react';
import { useCartStore, useStudentStore } from '@/lib/stores';
import { X, CreditCard, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export const CheckoutModal = () => {
  const { items, isOpen, setIsOpen, clearCart, getTotal } = useCartStore();
  const { purchaseCourse } = useStudentStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Purchase all items
    items.forEach(item => {
      purchaseCourse(item.courseId);
    });
    
    setIsProcessing(false);
    setIsSuccess(true);
    
    // Close and redirect after delay
    setTimeout(() => {
      clearCart();
      setIsSuccess(false);
      setIsOpen(false);
      
      // Redirect to the first purchased course if single item
      if (items.length === 1) {
        router.push(`/buyer/courses/${items[0].courseId}`);
      } else {
        router.push('/buyer/courses');
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-300">
        
        {/* Close button */}
        {!isSuccess && !isProcessing && (
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {isSuccess ? (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Оплата прошла успешно!</h3>
            <p className="text-slate-500">Доступ к курсам открыт. Перенаправляем...</p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">Оформление заказа</h2>
              <p className="text-sm text-slate-500 mt-1">Всего к оплате: {getTotal().toLocaleString('ru-RU')} ₽</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.courseId} className="flex gap-3">
                    <img src={item.thumbnail} alt={item.title} className="w-16 h-10 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.price.toLocaleString('ru-RU')} ₽</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Form (Fake) */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Номер карты</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="0000 0000 0000 0000" 
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      defaultValue="4242 4242 4242 4242"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Срок действия</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      defaultValue="12/28"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">CVC</label>
                    <input 
                      type="text" 
                      placeholder="123" 
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      defaultValue="123"
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={handlePayment} 
                className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Обработка...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Оплатить {getTotal().toLocaleString('ru-RU')} ₽
                  </div>
                )}
              </Button>
              
              <p className="text-xs text-center text-slate-400 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> Безопасная оплата (тестовый режим)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
