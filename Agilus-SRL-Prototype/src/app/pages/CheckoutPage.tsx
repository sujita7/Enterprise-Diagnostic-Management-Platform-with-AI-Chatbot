import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../../store/cartSlice';
import { fetchTimeSlots, validateCoupon, placeOrder, resetCoupon, resetCheckout } from '../../store/checkoutSlice';
import {
  Trash2, Shield, Award, Clock, MapPin, User, Phone, Mail,
  CalendarDays, ChevronRight, Check, AlertCircle, CreditCard,
  Building2, Stethoscope, FileText, CheckCircle2, ChevronLeft, Loader2
} from 'lucide-react';

export function CheckoutPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart?.items || []);

  // Checkout state from Redux
  const {
    timeSlots, timeSlotsLoading,
    coupon, couponLoading, couponError, couponDiscount,
    order, orderLoading, orderError, orderPlaced
  } = useSelector((state: any) => state.checkout);

  const [currentStep, setCurrentStep] = useState(1);

  // Patient form state
  const [patient, setPatient] = useState({
    fullName: '',
    phone: '',
    email: '',
    age: '',
    gender: 'Male',
    address: '',
    city: localStorage.getItem('selectedCity') || '',
    pincode: '',
  });

  // Schedule state
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [collectionType, setCollectionType] = useState('home');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [couponCode, setCouponCode] = useState('');

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch time slots from backend on mount
  useEffect(() => {
    dispatch(fetchTimeSlots() as any);
    // Reset checkout state on mount
    dispatch(resetCheckout());
    window.scrollTo(0, 0);
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  // Compute pricing
  const totalOriginal = cartItems.reduce((sum: number, item: any) => sum + (item.originalPrice || item.price * 1.5), 0);
  const totalPayable = cartItems.reduce((sum: number, item: any) => sum + item.price, 0);
  const baseDiscount = totalOriginal - totalPayable;
  const finalAmount = Math.max(0, totalPayable - couponDiscount);

  // Generate date options (next 7 days)
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      value: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
      day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString('en-IN', { month: 'short' }),
    };
  });

  // Group time slots by period (from backend data)
  const slotPeriods = timeSlots.reduce((acc: any, slot: any) => {
    if (!acc[slot.period]) acc[slot.period] = [];
    acc[slot.period].push(slot);
    return acc;
  }, {});

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!patient.fullName.trim()) errs.fullName = 'Full name is required';
    if (!patient.phone.trim() || patient.phone.length < 10) errs.phone = 'Valid phone number is required';
    if (!patient.email.trim() || !patient.email.includes('@')) errs.email = 'Valid email is required';
    if (!patient.age.trim()) errs.age = 'Age is required';
    if (collectionType === 'home' && !patient.address.trim()) errs.address = 'Address is required for home collection';
    if (collectionType === 'home' && !patient.pincode.trim()) errs.pincode = 'Pincode is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!selectedDate) errs.date = 'Please select a date';
    if (!selectedSlot) errs.slot = 'Please select a time slot';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    dispatch(validateCoupon({ code: couponCode, orderTotal: totalPayable }) as any);
  };

  const handleResetCoupon = () => {
    setCouponCode('');
    dispatch(resetCoupon());
  };

  const handlePlaceOrder = () => {
    const orderData = {
      full_name: patient.fullName,
      phone: patient.phone,
      email: patient.email,
      age: parseInt(patient.age),
      gender: patient.gender,
      collection_type: collectionType,
      address: patient.address,
      city: patient.city,
      pincode: patient.pincode,
      appointment_date: selectedDate,
      time_slot: selectedSlot,
      payment_method: paymentMethod,
      coupon_code: coupon?.code || '',
      mrp_total: Math.round(totalOriginal),
      discount: Math.round(baseDiscount),
      coupon_discount: couponDiscount,
      final_amount: Math.round(finalAmount),
      items: cartItems.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        type: item.type,
      })),
    };
    dispatch(placeOrder(orderData) as any).then((result: any) => {
      if (result.meta.requestStatus === 'fulfilled') {
        dispatch(clearCart());
      }
    });
  };

  const steps = [
    { num: 1, label: 'Patient Details', icon: User },
    { num: 2, label: 'Schedule', icon: CalendarDays },
    { num: 3, label: 'Payment', icon: CreditCard },
  ];

  // Find the selected slot label from backend data
  const selectedSlotObj = timeSlots.find((s: any) => s.value === selectedSlot);

  // If cart is empty and not order placed
  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="bg-[#f7f9fa] min-h-screen pt-8 pb-20 font-sans">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <FileText className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md">Add tests or health packages to proceed with checkout.</p>
            <button
              onClick={() => (window as any).appNavigate('/tests')}
              className="px-8 py-3.5 bg-gradient-to-r from-[#0C1E40] to-[#16458B] text-white rounded-xl font-bold text-sm uppercase tracking-wide hover:shadow-lg transition-all active:scale-95"
            >
              Browse Tests & Packages
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Order confirmation
  if (orderPlaced && order) {
    return (
      <div className="bg-[#f7f9fa] min-h-screen pt-8 pb-20 font-sans">
        <div className="max-w-[640px] mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 lg:p-12 text-center mt-8">
            {/* Success animation circle */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-20"></div>
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-200">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-500 text-sm mb-6">Your health test booking has been successfully placed.</p>

            <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Order ID</span>
                <span className="font-bold text-gray-900 text-sm">{order.order_id}</span>
              </div>
              <div className="border-t border-gray-100"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Patient</span>
                <span className="font-semibold text-gray-900 text-sm">{order.full_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Date</span>
                <span className="font-semibold text-gray-900 text-sm">{order.appointment_date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Time Slot</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {selectedSlotObj?.label || order.time_slot}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Collection</span>
                <span className="font-semibold text-gray-900 text-sm capitalize">{order.collection_type} Collection</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Status</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase">{order.status}</span>
              </div>
              <div className="border-t border-gray-100"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Items</span>
                <span className="font-semibold text-gray-900 text-sm">{order.items?.length || 0} items</span>
              </div>
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center pl-4">
                  <span className="text-xs text-gray-500">{item.name}</span>
                  <span className="text-xs font-semibold text-gray-700">₹{item.price}</span>
                </div>
              ))}
              <div className="border-t border-gray-100"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">Amount Paid</span>
                <span className="font-extrabold text-lg text-green-600">₹{Math.round(parseFloat(order.final_amount))}</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 text-left mb-8">
              <Phone className="w-5 h-5 text-[#0076BC] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-gray-900 mb-0.5">Our team will contact you shortly</p>
                <p className="text-xs text-gray-500">A confirmation SMS has been sent to {order.phone}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => { dispatch(resetCheckout()); (window as any).appNavigate('/'); }}
                className="flex-1 py-3.5 border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all active:scale-95"
              >
                Back to Home
              </button>
              <button
                onClick={() => { dispatch(resetCheckout()); (window as any).appNavigate('/tests'); }}
                className="flex-1 py-3.5 bg-[#0076BC] text-white rounded-xl font-bold text-sm hover:bg-[#0A366B] transition-all active:scale-95"
              >
                Book More Tests
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f9fa] min-h-screen pt-6 pb-20 font-sans">
      <div className="max-w-[1100px] mx-auto px-4 lg:px-6">

        {/* Back Button */}
        <button
          onClick={() => {
            if (currentStep > 1) setCurrentStep(currentStep - 1);
            else (window as any).appNavigate('/');
          }}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">{currentStep > 1 ? 'Back' : 'Continue Shopping'}</span>
        </button>

        {/* Step Progress */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-6">
          <div className="flex items-center justify-between max-w-[500px] mx-auto">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.num;
              const isCompleted = currentStep > step.num;
              return (
                <React.Fragment key={step.num}>
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-500 text-white shadow-md shadow-green-100'
                        : isActive
                          ? 'bg-[#0076BC] text-white shadow-md shadow-blue-100'
                          : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-[10px] lg:text-xs font-bold tracking-wide ${
                      isActive ? 'text-[#0076BC]' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`flex-1 h-[2px] mx-2 lg:mx-4 rounded-full transition-colors ${
                      currentStep > step.num ? 'bg-green-400' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-2">
            {/* STEP 1: Patient Details */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <User className="w-5 h-5 text-[#0076BC]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-gray-900">Patient Details</h2>
                    <p className="text-xs text-gray-400">Fill in the details of the person getting tested</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField label="Full Name" name="fullName" value={patient.fullName} error={errors.fullName}
                    icon={<User className="w-4 h-4" />}
                    onChange={(v) => setPatient({ ...patient, fullName: v })} placeholder="Enter full name" />
                  <InputField label="Phone Number" name="phone" value={patient.phone} error={errors.phone}
                    icon={<Phone className="w-4 h-4" />} type="tel"
                    onChange={(v) => setPatient({ ...patient, phone: v })} placeholder="10-digit mobile" />
                  <InputField label="Email" name="email" value={patient.email} error={errors.email}
                    icon={<Mail className="w-4 h-4" />} type="email"
                    onChange={(v) => setPatient({ ...patient, email: v })} placeholder="your@email.com" />
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <InputField label="Age" name="age" value={patient.age} error={errors.age}
                        type="number" onChange={(v) => setPatient({ ...patient, age: v })} placeholder="Age" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Gender</label>
                      <select
                        value={patient.gender}
                        onChange={(e) => setPatient({ ...patient, gender: e.target.value })}
                        className="w-full h-[46px] px-3 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white focus:border-[#0076BC] focus:ring-2 focus:ring-blue-50 outline-none transition-all"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Collection Type */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-3 uppercase tracking-wider">Sample Collection</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setCollectionType('home')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        collectionType === 'home'
                          ? 'border-[#0076BC] bg-blue-50/50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <MapPin className={`w-5 h-5 mb-2 ${collectionType === 'home' ? 'text-[#0076BC]' : 'text-gray-400'}`} />
                      <div className="font-bold text-sm text-gray-900">Home Collection</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">Phlebotomist visits your home</div>
                    </button>
                    <button
                      onClick={() => setCollectionType('lab')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        collectionType === 'lab'
                          ? 'border-[#0076BC] bg-blue-50/50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Building2 className={`w-5 h-5 mb-2 ${collectionType === 'lab' ? 'text-[#0076BC]' : 'text-gray-400'}`} />
                      <div className="font-bold text-sm text-gray-900">Lab Visit</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">Visit nearest Agilus lab</div>
                    </button>
                  </div>
                </div>

                {/* Address (only for home collection) */}
                {collectionType === 'home' && (
                  <div className="space-y-4 pt-2">
                    <InputField label="Address" name="address" value={patient.address} error={errors.address}
                      icon={<MapPin className="w-4 h-4" />}
                      onChange={(v) => setPatient({ ...patient, address: v })} placeholder="House no, Street, Landmark" />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="City" name="city" value={patient.city}
                        onChange={(v) => setPatient({ ...patient, city: v })} placeholder="City" />
                      <InputField label="Pincode" name="pincode" value={patient.pincode} error={errors.pincode}
                        type="number" onChange={(v) => setPatient({ ...patient, pincode: v })} placeholder="6-digit pincode" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Schedule */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-[#0076BC]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-gray-900">Select Date & Time</h2>
                    <p className="text-xs text-gray-400">Choose a convenient slot for sample collection</p>
                  </div>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-3 uppercase tracking-wider">Select Date</label>
                  {errors.date && (
                    <p className="text-xs text-red-500 font-medium mb-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.date}
                    </p>
                  )}
                  <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {dateOptions.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => { setSelectedDate(d.value); setErrors({ ...errors, date: '' }); }}
                        className={`flex flex-col items-center px-4 py-3 rounded-xl border-2 min-w-[72px] transition-all ${
                          selectedDate === d.value
                            ? 'border-[#0076BC] bg-[#0076BC] text-white shadow-md shadow-blue-100'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <span className={`text-[10px] font-bold uppercase ${selectedDate === d.value ? 'text-blue-100' : 'text-gray-400'}`}>{d.day}</span>
                        <span className="text-xl font-extrabold leading-none mt-1">{d.date}</span>
                        <span className={`text-[10px] font-semibold mt-0.5 ${selectedDate === d.value ? 'text-blue-100' : 'text-gray-400'}`}>{d.month}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots from Backend */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-3 uppercase tracking-wider">Select Time Slot</label>
                  {errors.slot && (
                    <p className="text-xs text-red-500 font-medium mb-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.slot}
                    </p>
                  )}
                  {timeSlotsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 text-[#0076BC] animate-spin" />
                      <span className="text-sm text-gray-500 ml-2">Loading time slots...</span>
                    </div>
                  ) : (
                    Object.entries(slotPeriods).map(([period, slots]: [string, any]) => (
                      <div key={period} className="mb-4">
                        <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> {period}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {slots.map((slot: any) => (
                            <button
                              key={slot.value}
                              onClick={() => { setSelectedSlot(slot.value); setErrors({ ...errors, slot: '' }); }}
                              className={`py-2.5 px-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                                selectedSlot === slot.value
                                  ? 'border-[#0076BC] bg-blue-50 text-[#0076BC] shadow-sm'
                                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
                              }`}
                            >
                              {slot.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Preparation Tips */}
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" /> Pre-Test Preparation
                  </h4>
                  <ul className="text-xs text-amber-700 space-y-1.5">
                    <li className="flex items-start gap-2"><span className="mt-0.5">•</span> Fasting of 10-12 hours may be required for certain tests</li>
                    <li className="flex items-start gap-2"><span className="mt-0.5">•</span> Drink enough water before the sample collection</li>
                    <li className="flex items-start gap-2"><span className="mt-0.5">•</span> Carry a valid photo ID at the time of collection</li>
                  </ul>
                </div>
              </div>
            )}

            {/* STEP 3: Payment */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Order Review */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#0076BC]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold text-gray-900">Order Review</h2>
                      <p className="text-xs text-gray-400">Verify your booking details</p>
                    </div>
                  </div>

                  {/* Patient summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <ReviewItem icon={<User className="w-4 h-4" />} label="Patient" value={`${patient.fullName}, ${patient.age} yrs, ${patient.gender}`} />
                    <ReviewItem icon={<Phone className="w-4 h-4" />} label="Phone" value={patient.phone} />
                    <ReviewItem icon={<CalendarDays className="w-4 h-4" />} label="Date" value={dateOptions.find(d => d.value === selectedDate)?.label || ''} />
                    <ReviewItem icon={<Clock className="w-4 h-4" />} label="Time" value={selectedSlotObj?.label || ''} />
                    <ReviewItem icon={<MapPin className="w-4 h-4" />} label="Collection" value={collectionType === 'home' ? `Home – ${patient.address}` : 'Lab Visit'} />
                  </div>

                  {/* Test items in order */}
                  <div className="border-t border-gray-100 pt-5">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Tests / Packages ({cartItems.length})</h4>
                    <div className="space-y-2">
                      {cartItems.map((item: any) => (
                        <div key={`${item.type}-${item.id}`} className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-[9px] font-bold text-[#0076BC] uppercase">{item.type}</span>
                            <span className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{item.name}</span>
                          </div>
                          <span className="font-bold text-sm text-gray-900">₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Coupon - validated via backend */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Have a coupon?</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => { setCouponCode(e.target.value); }}
                      disabled={!!coupon}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#0076BC] focus:ring-2 focus:ring-blue-50 transition-all disabled:bg-gray-50"
                    />
                    {coupon ? (
                      <button
                        onClick={handleResetCoupon}
                        className="px-6 py-2.5 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-all active:scale-95"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className="px-6 py-2.5 bg-[#0076BC] text-white rounded-xl font-bold text-sm hover:bg-[#0A366B] transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                      >
                        {couponLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Apply
                      </button>
                    )}
                  </div>
                  {couponError && <p className="text-xs text-red-500 mt-2">{typeof couponError === 'string' ? couponError : 'Invalid coupon code'}</p>}
                  {coupon && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Coupon "{coupon.code}" applied! You save ₹{couponDiscount}
                      </p>
                      {coupon.description && (
                        <p className="text-[11px] text-gray-400">{coupon.description}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-[#0076BC]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold text-gray-900">Payment Method</h2>
                      <p className="text-xs text-gray-400">Select how you'd like to pay</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'online', label: 'Pay Online', sub: 'UPI, Cards, Net Banking', icon: CreditCard },
                      { key: 'cod', label: 'Pay on Collection', sub: 'Pay when sample is collected', icon: Building2 },
                    ].map(m => (
                      <button
                        key={m.key}
                        onClick={() => setPaymentMethod(m.key)}
                        className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${
                          paymentMethod === m.key
                            ? 'border-[#0076BC] bg-blue-50/50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <m.icon className={`w-5 h-5 mt-0.5 ${paymentMethod === m.key ? 'text-[#0076BC]' : 'text-gray-400'}`} />
                        <div>
                          <div className="font-bold text-sm text-gray-900">{m.label}</div>
                          <div className="text-[11px] text-gray-500 mt-0.5">{m.sub}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Order Error */}
                {orderError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <p className="text-sm text-red-700 font-medium">
                      Failed to place order. Please try again. {typeof orderError === 'string' ? orderError : ''}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Cart Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6 sticky top-28 space-y-5">
              <h3 className="font-extrabold text-gray-900">Order Summary</h3>

              {/* Items */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 [scrollbar-width:thin]">
                {cartItems.map((item: any) => (
                  <div key={`${item.type}-${item.id}`} className="flex items-center justify-between py-2 group">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                      <span className="text-[10px] text-gray-400 uppercase font-bold">{item.type}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-bold text-gray-900">₹{item.price}</span>
                      <button
                        onClick={() => dispatch(removeFromCart({ id: item.id, type: item.type }))}
                        className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="border-t border-gray-100 pt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>M.R.P. Total</span>
                  <span>₹{Math.round(totalOriginal)}</span>
                </div>
                {baseDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span>- ₹{Math.round(baseDiscount)}</span>
                  </div>
                )}
                {coupon && couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Coupon ({coupon.code})</span>
                    <span>- ₹{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>Home Collection</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-black text-gray-900 text-base">
                  <span>Total Payable</span>
                  <span className="text-lg">₹{Math.round(finalAmount)}</span>
                </div>
              </div>

              {baseDiscount > 0 && (
                <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-center gap-2 text-xs text-green-700 font-medium">
                  <Check className="w-4 h-4 text-green-600 shrink-0" />
                  You're saving ₹{Math.round(baseDiscount + couponDiscount)} on this order!
                </div>
              )}

              {/* CTA */}
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="w-full py-4 bg-[#0076BC] hover:bg-[#0A366B] text-white rounded-2xl font-bold text-sm transition-all shadow-md active:scale-[0.98] uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={orderLoading}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl font-bold text-sm transition-all shadow-md shadow-green-100 active:scale-[0.98] uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {orderLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Placing Order...</>
                  ) : (
                    <><CheckCircle2 className="w-5 h-5" /> {paymentMethod === 'online' ? 'Pay & Place Order' : 'Confirm Booking'}</>
                  )}
                </button>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-2 text-center text-gray-500 text-[10px]">
                <div className="flex flex-col items-center p-2 bg-gray-50 rounded-xl">
                  <Shield className="w-4 h-4 text-[#0076BC] mb-1" />
                  <span className="font-bold text-gray-700">100% Safe</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-gray-50 rounded-xl">
                  <Award className="w-4 h-4 text-yellow-600 mb-1" />
                  <span className="font-bold text-gray-700">NABL Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──── Reusable small components ──── */

function InputField({ label, name, value, error, icon, type = 'text', placeholder, onChange }: {
  label: string; name: string; value: string; error?: string; icon?: React.ReactNode; type?: string; placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full h-[46px] ${icon ? 'pl-10' : 'pl-4'} pr-4 border rounded-xl text-sm text-gray-900 outline-none transition-all ${
            error ? 'border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-2 focus:ring-red-50' : 'border-gray-200 focus:border-[#0076BC] focus:ring-2 focus:ring-blue-50'
          }`}
        />
      </div>
      {error && (
        <p className="text-[11px] text-red-500 font-medium mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}

function ReviewItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
      <span className="text-[#0076BC] mt-0.5">{icon}</span>
      <div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
