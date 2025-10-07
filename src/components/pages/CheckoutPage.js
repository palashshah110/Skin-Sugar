import { useContext, useState } from "react";
import { AppContext } from "../../App";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api";
import PincodeCheck from './PinCodeCheck'
export default function CheckoutPage() {
  const { cart, setCart, setOrders, user, basketItems, setBasketItems } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [shippingCost, setShippingCost] = useState(-1);
  // Check if coming from gift baskets
  const isGiftBasketCheckout = location.state?.basketType === 'gift';
  const itemsToCheckout = isGiftBasketCheckout ? basketItems : cart;

  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    recipientName: '',
    giftMessage: ''
  });

  const handleInputChange = (e) => {
    setShippingInfo(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Calculate totals for all baskets
  const getBasketTotal = (basketNum) => {
    return basketItems
      .filter(item => item.basketNumber === basketNum)
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getUniqueBaskets = () => {
    return [...new Set(basketItems.map(item => item.basketNumber))];
  };

  const total = isGiftBasketCheckout
    ? getUniqueBaskets().reduce((sum, basket) => sum + getBasketTotal(basket), 0)
    : itemsToCheckout.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // const shippingCost = 99;
  const isServiceable = true;
  const finalTotal = total + shippingCost;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to place an order");
      navigate('/login');
      return;
    }

    // Validate shipping info
    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.pincode || !shippingInfo.phone) {
      toast.error("Please fill all shipping information");
      return;
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(shippingInfo.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    // Validate pincode
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(shippingInfo.pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }

    try {
      setIsPlacingOrder(true);
      const IdtoProduct = basketItems.map(item => ({
        ...item,
        product: item._id,
      }));
      const addproductfield = (basketNum) => {
        const BasketItems = basketItems.filter(item => item.basketNumber === basketNum);
        const BasketItemsToCheckout = BasketItems.map((item) => ({
          ...item,
          product: item._id,
        }));
        return BasketItemsToCheckout;
      }
      const ProductIdOfCart = cart.map(item => ({
        ...item,
        product: item._id,
      }));
      // Prepare order data for API
      const orderData = {
        user: user._id || user.id,
        items: isGiftBasketCheckout ? IdtoProduct : ProductIdOfCart,
        totalAmount: finalTotal,
        shippingInfo: {
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          pincode: shippingInfo.pincode,
          phone: shippingInfo.phone,
          ...(isGiftBasketCheckout && {
            recipientName: shippingInfo.recipientName,
            giftMessage: shippingInfo.giftMessage
          })
        },
        orderType: isGiftBasketCheckout ? 'gift_basket' : 'regular',
        ...(isGiftBasketCheckout && {
          baskets: getUniqueBaskets().map(basketNum => ({
            basketNumber: basketNum,
            items: addproductfield(basketNum),
            total: getBasketTotal(basketNum)

          }))
        })
      };

      // Make API call to create order
      const response = await api.post('/orders', orderData);

      if (response.data && response.data.order) {
        // Success - update local state
        const newOrder = {
          id: response.data.order._id,
          items: [...itemsToCheckout],
          total: finalTotal,
          shippingInfo,
          date: new Date().toLocaleDateString(),
          status: 'pending',
          paymentStatus: 'pending',
          orderType: isGiftBasketCheckout ? 'gift_basket' : 'regular'
        };

        setOrders(prev => [...prev, newOrder]);

        // Clear the appropriate items based on order type
        if (isGiftBasketCheckout) {
          setBasketItems([]);
        } else {
          setCart([]);
        }

        toast.success("Order placed successfully!");
        navigate('/orders');
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (error) {
      console.error('Order placement error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (itemsToCheckout.length === 0) {
    navigate(isGiftBasketCheckout ? '/orders' : '/orders');
    return null;
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Checkout {isGiftBasketCheckout && '(Gift Baskets)'}
          </h1>
          <button
            onClick={() => navigate(isGiftBasketCheckout ? '/gift-baskets' : '/cart')}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            ← Back to {isGiftBasketCheckout ? 'Gift Baskets' : 'Cart'}
          </button>
        </div>

        <form onSubmit={handlePlaceOrder} className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h3>

              <div className="grid md:grid-cols-2 gap-6">
                {isGiftBasketCheckout && (
                  <>
                    <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Recipient Name
                        </label>
                        <input
                          type="text"
                          name="recipientName"
                          required
                          value={shippingInfo.recipientName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors duration-200"
                          placeholder="Enter recipient's name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gift Message (Optional)
                        </label>
                        <textarea
                          name="giftMessage"
                          value={shippingInfo.giftMessage}
                          onChange={handleInputChange}
                          rows="1"
                          className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors duration-200"
                          placeholder="Add a personal gift message"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                  <textarea
                    name="address"
                    required
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Enter your full address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Enter your city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Enter your state"
                  />
                </div>

                <PincodeCheck value={shippingInfo.pincode} onChange={handleInputChange} onShippingCostChange={setShippingCost} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="10-digit phone number"
                    maxLength="10"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

              {isGiftBasketCheckout ? (
                // Gift Baskets Summary
                <div className="space-y-4 mb-6">
                  {getUniqueBaskets().map(basketNum => (
                    <div key={basketNum} className="border rounded-lg p-4 bg-green-50">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-green-800">Basket #{basketNum}</h4>
                        <span className="text-sm font-medium">₹{getBasketTotal(basketNum)}</span>
                      </div>
                      <div className="space-y-2">
                        {basketItems
                          .filter(item => item.basketNumber === basketNum)
                          .map((item, index) => (
                            <div key={item.id || index} className="flex items-center space-x-3 text-sm">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-8 h-8 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 truncate">{item.name}</p>
                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                              </div>
                              <span>₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Regular Cart Summary
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id || item._id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPlacingOrder || !isServiceable}
                className={`w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-semibold transition-all duration-300 ${isPlacingOrder || !isServiceable
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:from-green-600 hover:to-emerald-600'
                  }`}
              >
                {isPlacingOrder ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Placing Order...
                  </div>
                ) : (
                  `Place Order  ₹${finalTotal}`
                )}
              </button>

              {!isServiceable && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  Sorry, we don't deliver to your area yet.
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}