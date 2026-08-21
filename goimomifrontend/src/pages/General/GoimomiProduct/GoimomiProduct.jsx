import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ShoppingCart, Zap, Package, Search, X, CheckCircle, ShoppingBag, Star, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import api from "../../../api.js";
import "./GoimomiProduct.css";




/* ─── Helpers ──────────────────────────────────────────────── */
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

const getCartItems = () => {
  try { return JSON.parse(localStorage.getItem("goimomi_cart") || "[]"); }
  catch { return []; }
};
const saveCart = (items) => localStorage.setItem("goimomi_cart", JSON.stringify(items));

/* ─── Skeleton Card ────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="gp-skeleton-card">
    <div className="gp-skeleton gp-skeleton-img" />
    <div className="gp-skeleton-body">
      <div className="gp-skeleton gp-skeleton-line" style={{ width: "60%" }} />
      <div className="gp-skeleton gp-skeleton-line" />
      <div className="gp-skeleton gp-skeleton-line" style={{ width: "80%" }} />
      <div className="gp-skeleton gp-skeleton-line" style={{ width: "40%", marginTop: 8 }} />
    </div>
  </div>
);

/* ─── Buy Now Modal ────────────────────────────────────────── */
/* ─── Order Success Modal ──────────────────────────────────── */
const OrderSuccessModal = ({ orderId, onClose }) => {
  return (
    <div className="gp-modal-overlay" onClick={onClose}>
      <div className="gp-modal" style={{ textAlign: "center", padding: "30px 20px" }}>
        <button className="gp-modal-close" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CheckCircle size={64} color="#16a34a" style={{ marginBottom: 20 }} />
          <h3 style={{ fontSize: 22, fontWeight: "bold", color: "#1e293b", marginBottom: 8 }}>Payment Successful!</h3>
          <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
            Thank you for your order! Your payment was processed successfully.
          </p>
          {orderId && (
            <div style={{ background: "#f1f5f9", padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: "600", color: "#64748b", marginBottom: 24 }}>
              Order ID: <span style={{ color: "#0f172a" }}>{orderId}</span>
            </div>
          )}
          <button className="gp-modal-submit" style={{ width: "100%", maxWidth: 200, margin: "0 auto" }} onClick={onClose}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];


const BuyNowModal = ({ product, onClose }) => {
  const isCartCheckout = product?.isCartCheckout;
  const maxStock = !isCartCheckout ? (Number(product?.quantity) || 0) : 9999;
  const initialQty = isCartCheckout
    ? (product?.cartItems ? product.cartItems.reduce((sum, item) => sum + item.qty, 0) : (product?.selectedQty || 1))
    : Math.max(1, Math.min(product?.selectedQty || 1, maxStock > 0 ? maxStock : 1));

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    qty: initialQty,
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // OTP Verification State
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setForm((p) => ({ ...p, email: val }));
    setIsOtpSent(false);
    setIsEmailVerified(false);
    setOtpValue("");
    setOtpError("");
    setOtpSuccess("");
  };

  const decreaseQty = () => {
    setForm((p) => ({ ...p, qty: Math.max(1, p.qty - 1) }));
  };

  const increaseQty = () => {
    if (!isCartCheckout && maxStock > 0 && form.qty >= maxStock) return;
    setForm((p) => ({ ...p, qty: !isCartCheckout && maxStock > 0 ? Math.min(maxStock, p.qty + 1) : p.qty + 1 }));
  };

  const handleSendOtp = async () => {
    const emailTrimmed = (form.email || "").trim();
    if (!emailTrimmed) {
      setOtpError("Please enter your Email ID first.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setOtpError("Please enter a valid email address.");
      return;
    }

    setSendingOtp(true);
    setOtpError("");
    setOtpSuccess("");

    try {
      await api.post("/api/goimomi-product-orders/send-otp/", { email: emailTrimmed });
      setIsOtpSent(true);
      setOtpSuccess("OTP sent successfully to your email inbox!");
    } catch (err) {
      console.error("Error sending OTP:", err);
      setOtpError(err.response?.data?.error || "Failed to send OTP. Please check your email and try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpValue || otpValue.trim().length !== 6) {
      setOtpError("Please enter the 6-digit OTP code.");
      return;
    }

    setVerifyingOtp(true);
    setOtpError("");
    setOtpSuccess("");

    try {
      await api.post("/api/goimomi-product-orders/verify-otp/", {
        email: form.email.trim(),
        otp: otpValue.trim()
      });
      setIsEmailVerified(true);
      setOtpSuccess("Email address verified successfully!");
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setOtpError(err.response?.data?.error || "Invalid or expired OTP code.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.email.trim()) {
      alert("Email address is required.");
      return;
    }

    if (!isEmailVerified) {
      if (!isOtpSent) {
        handleSendOtp();
        alert("We have sent a 6-digit OTP code to your email. Please enter and verify the code to proceed.");
      } else {
        alert("Please enter the 6-digit OTP code sent to your email and click 'Verify OTP' before proceeding.");
      }
      return;
    }

    setLoading(true);
    try {
      const fullAddress = [form.address_line1, form.address_line2, form.city, form.state, form.pincode ? `PIN: ${form.pincode}` : ""]
        .map(s => (s || "").trim())
        .filter(Boolean)
        .join(", ");

      const payload = {
        product: product.isCartCheckout ? null : product.id,
        quantity: form.qty,
        name: form.name,
        email: form.email.trim(),
        phone: form.phone,
        address: fullAddress,
        address_line1: (form.address_line1 || "").trim(),
        address_line2: (form.address_line2 || "").trim(),
        city: (form.city || "").trim(),
        state: (form.state || "").trim(),
        pincode: (form.pincode || "").trim(),
      };

      if (product.isCartCheckout) {
        payload.cart_items = product.cartItems.map(item => ({
          product_id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.qty
        }));
        payload.quantity = product.cartItems.reduce((sum, item) => sum + item.qty, 0);
      }

      const response = await api.post("/api/goimomi-product-orders/", payload, { skipAuth: true });
      
      if (product.isCartCheckout) {
        localStorage.setItem("goimomi_pending_cart_order_id", response.data?.order_id || "");
      }

      if (response.data && response.data.payment_url) {
        window.location.href = response.data.payment_url;
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Error confirming order enquiry:", err);
      const errMsg = err.response?.data?.error || "Failed to submit order. Please try again.";
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gp-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="gp-modal">
        <button className="gp-modal-close" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <CheckCircle size={56} color="#16a34a" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ marginBottom: 8 }}>Order Enquiry Sent!</h3>
            <p style={{ color: "#64748b", fontSize: 14 }}>
              Our team will contact you on <strong>{form.phone}</strong> shortly.
            </p>
            <button className="gp-modal-submit" style={{ marginTop: 24 }} onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <h3>Checkout & Payment</h3>
            <p className="gp-modal-subtitle">Enter your details to proceed to secure checkout via Zoho Payments.</p>

            <div className="gp-modal-product-info">
              {product.isCartCheckout ? (
                <>
                  <h4 style={{ fontSize: 13, textTransform: "uppercase", color: "#16a34a", letterSpacing: "0.05em", marginBottom: 6 }}>Checkout Summary</h4>
                  <div style={{ maxHeight: 60, overflowY: "auto", fontSize: 12, color: "#475569", marginBottom: 6, lineHeight: 1.4 }} className="gp-cart-checkout-summary-list">
                    {product.description}
                  </div>
                  <p style={{ borderTop: "1px solid #bbf7d0", paddingTop: 4, fontWeight: "bold", fontSize: 13, margin: 0 }}>
                    Total: {formatCurrency(product.price)}
                  </p>
                </>
              ) : (
                <>
                  <h4>{product.title}</h4>
                  <p>
                    {formatCurrency(product.price)}{" "}
                    {product.mrp > product.price && (
                      <span style={{ textDecoration: "line-through", color: "#94a3b8", marginLeft: 6 }}>
                        {formatCurrency(product.mrp)}
                      </span>
                    )}
                  </p>
                </>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="gp-buy-name">Name *</label>
                  <input id="gp-buy-name" name="name" required placeholder="Your name" value={form.name} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="gp-buy-phone">Mobile Number *</label>
                  <input id="gp-buy-phone" name="phone" required placeholder="+91 9999999999" value={form.phone} onChange={handleChange} />
                </div>
              </div>
              
              {product.isCartCheckout ? (
                <div>
                  <div className="flex justify-between items-center">
                    <label htmlFor="gp-buy-email">Email ID *</label>
                    {isEmailVerified ? (
                      <span className="text-[11px] font-bold text-emerald-600">✓ Verified</span>
                    ) : isOtpSent ? (
                      <button type="button" onClick={handleSendOtp} disabled={sendingOtp} className="text-[11px] font-bold text-green-700 hover:underline">
                        {sendingOtp ? "Resending..." : "Resend OTP"}
                      </button>
                    ) : (
                      form.email && (
                        <button type="button" onClick={handleSendOtp} disabled={sendingOtp} className="text-[11px] font-bold text-green-700 bg-green-50 hover:bg-green-100 px-2 py-0.5 rounded border border-green-200">
                          {sendingOtp ? "Sending..." : "Send OTP"}
                        </button>
                      )
                    )}
                  </div>
                  <input
                    id="gp-buy-email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={handleEmailChange}
                    disabled={isEmailVerified}
                    className={isEmailVerified ? "bg-emerald-50/50 border-emerald-300 text-emerald-900 font-semibold" : ""}
                  />
                  {isOtpSent && !isEmailVerified && (
                    <div className="mt-2 p-2.5 bg-green-50/60 border border-green-200 rounded-lg space-y-2">
                      <p className="text-[11px] font-medium text-gray-600">Enter 6-digit OTP code sent to <strong>{form.email}</strong>:</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="6-digit OTP"
                          value={otpValue}
                          onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={verifyingOtp || otpValue.length !== 6}
                          className="px-4 py-1.5 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white rounded-md text-xs font-bold transition"
                        >
                          {verifyingOtp ? "Verifying..." : "Verify OTP"}
                        </button>
                      </div>
                    </div>
                  )}
                  {otpSuccess && <p className="text-[11px] font-semibold text-emerald-600 mt-1">{otpSuccess}</p>}
                  {otpError && <p className="text-[11px] font-semibold text-red-600 mt-1">{otpError}</p>}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between items-center">
                      <label htmlFor="gp-buy-email">Email ID *</label>
                      {isEmailVerified ? (
                        <span className="text-[11px] font-bold text-emerald-600">✓ Verified</span>
                      ) : isOtpSent ? (
                        <button type="button" onClick={handleSendOtp} disabled={sendingOtp} className="text-[11px] font-bold text-green-700 hover:underline">
                          {sendingOtp ? "Resending..." : "Resend OTP"}
                        </button>
                      ) : (
                        form.email && (
                          <button type="button" onClick={handleSendOtp} disabled={sendingOtp} className="text-[11px] font-bold text-green-700 bg-green-50 hover:bg-green-100 px-2 py-0.5 rounded border border-green-200">
                            {sendingOtp ? "Sending..." : "Send OTP"}
                          </button>
                        )
                      )}
                    </div>
                    <input
                      id="gp-buy-email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@email.com"
                      value={form.email}
                      onChange={handleEmailChange}
                      disabled={isEmailVerified}
                      className={isEmailVerified ? "bg-emerald-50/50 border-emerald-300 text-emerald-900 font-semibold" : ""}
                    />
                  </div>
                  <div>
                    <label htmlFor="gp-buy-qty">Quantity</label>
                    <div className="flex items-center border border-gray-200 rounded-lg h-[34px] overflow-hidden bg-white mt-1">
                      <button
                        type="button"
                        onClick={decreaseQty}
                        disabled={form.qty <= 1}
                        className="w-10 h-full bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-500 font-bold border-r border-gray-200 text-sm select-none"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={!isCartCheckout && maxStock > 0 ? maxStock : undefined}
                        readOnly={isCartCheckout}
                        value={form.qty}
                        onChange={(e) => {
                          if (isCartCheckout) return;
                          const val = parseInt(e.target.value) || 1;
                          const clamped = Math.max(1, maxStock > 0 ? Math.min(maxStock, val) : val);
                          setForm((p) => ({ ...p, qty: clamped }));
                        }}
                        className="w-full text-center text-sm font-semibold text-gray-700 outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={increaseQty}
                        disabled={!isCartCheckout && maxStock > 0 && form.qty >= maxStock}
                        className="w-10 h-full bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-500 font-bold border-l border-gray-200 text-sm select-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Full width OTP row for single product checkout if sent */}
                  {isOtpSent && !isEmailVerified && (
                    <div className="col-span-full mt-1 p-2.5 bg-green-50/60 border border-green-200 rounded-lg space-y-2">
                      <p className="text-[11px] font-medium text-gray-600">Enter 6-digit OTP code sent to <strong>{form.email}</strong>:</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="6-digit OTP"
                          value={otpValue}
                          onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={verifyingOtp || otpValue.length !== 6}
                          className="px-4 py-1.5 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white rounded-md text-xs font-bold transition"
                        >
                          {verifyingOtp ? "Verifying..." : "Verify OTP"}
                        </button>
                      </div>
                    </div>
                  )}
                  {otpSuccess && <p className="col-span-full text-[11px] font-semibold text-emerald-600 mt-0.5">{otpSuccess}</p>}
                  {otpError && <p className="col-span-full text-[11px] font-semibold text-red-600 mt-0.5">{otpError}</p>}
                </div>
              )}


              {/* Structured Address Fields */}
              <div className="grid grid-cols-1 gap-3 pt-1">
                <div>
                  <label htmlFor="gp-buy-addr1">Address Line 1 *</label>
                  <input
                    id="gp-buy-addr1"
                    name="address_line1"
                    type="text"
                    required
                    placeholder="House / Flat No., Building, Street"
                    value={form.address_line1}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="gp-buy-addr2">Address Line 2</label>
                  <input
                    id="gp-buy-addr2"
                    name="address_line2"
                    type="text"
                    placeholder="Landmark, Area, Locality (Optional)"
                    value={form.address_line2}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* City, State, PIN Code in balanced 3-column row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="gp-buy-city">City *</label>
                  <input
                    id="gp-buy-city"
                    name="city"
                    type="text"
                    required
                    placeholder="Town / City"
                    value={form.city}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="gp-buy-state">State *</label>
                  <select
                    id="gp-buy-state"
                    name="state"
                    required
                    value={form.state}
                    onChange={handleChange}
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="gp-buy-pincode">PIN Code *</label>
                  <input
                    id="gp-buy-pincode"
                    name="pincode"
                    type="text"
                    required
                    maxLength={6}
                    placeholder="6-digit PIN"
                    value={form.pincode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setForm((p) => ({ ...p, pincode: val }));
                    }}
                  />
                </div>
              </div>
              
              <button type="submit" className="gp-modal-submit" disabled={loading}>
                {loading ? (
                  <div className="gp-modal-submit-loading">
                    <span className="gp-spinner" /> Creating Secure Payment Session...
                  </div>
                ) : (
                  "Proceed to Secure Payment →"
                )}
              </button>
            </form>

          </>
        )}
      </div>
    </div>
  );
};


/* ─── Product Details Page ─────────────────────────────────── */
const ProductDetailsPage = ({ product, onClose, onAddToCart, onBuyNow, isInCart, onViewCart, cartCount }) => {
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const maxStock = Number(product?.quantity) || 0;
  const [qty, setQty] = useState(Math.max(1, maxStock > 0 ? Math.min(1, maxStock) : 1));
  const isOutOfStock = product.stock_status === "out_of_stock" || (maxStock <= 0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product.id]);

  useEffect(() => {
    if (maxStock > 0 && qty > maxStock) {
      setQty(maxStock);
    }
  }, [maxStock]);

  const decreaseQty = () => setQty((prev) => Math.max(1, prev - 1));
  const increaseQty = () => {
    if (maxStock > 0 && qty >= maxStock) return;
    setQty((prev) => (maxStock > 0 ? Math.min(maxStock, prev + 1) : prev + 1));
  };

  // Build images list
  const images = [];
  if (product.image) images.push(product.image);
  if (product.images && product.images.length > 0) {
    product.images.forEach((img) => {
      if (img.image && !images.includes(img.image)) images.push(img.image);
    });
  }

  const handleAddToCartClick = () => {
    onAddToCart({ ...product, selectedQty: qty });
  };

  const handleBuyNowClick = () => {
    onBuyNow({ ...product, selectedQty: qty });
  };

  return (
    <div className="gp-details-page-container">
      {/* Breadcrumb / Back button */}
      <div className="gp-details-breadcrumb">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button onClick={onClose} className="gp-details-back-btn">
            <ChevronLeft size={16} /> Back to Shop
          </button>
          <span className="gp-details-separator">/</span>
          <span className="gp-details-active-crumb">{product.title}</span>
        </div>

        <button
          className="gp-cart-btn"
          id="gp-view-cart-details"
          onClick={onViewCart}
          style={{ padding: "7px 15px", fontSize: "12.5px" }}
        >
          <ShoppingBag size={16} />
          <span>Cart</span>
          {cartCount > 0 && <span className="gp-cart-count">{cartCount}</span>}
        </button>
      </div>

      <div className="gp-details-grid">
        {/* Left Thumbnail list & Main Image */}
        <div className="gp-details-media-section">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="gp-details-thumbnails">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`gp-details-thumb-btn ${selectedImgIdx === idx ? "active" : ""}`}
                  onClick={() => setSelectedImgIdx(idx)}
                  onMouseEnter={() => setSelectedImgIdx(idx)}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="gp-details-thumb-img" />
                </button>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div className="gp-details-main-img-wrap">
            {images.length > 0 ? (
              <img src={images[selectedImgIdx]} alt={product.title} className="gp-details-main-img" />
            ) : (
              <div className="gp-details-img-placeholder">
                <Package size={80} strokeWidth={1} />
              </div>
            )}
          </div>
        </div>

        {/* Right Product Details Info */}
        <div className="gp-details-info-section">
          <div className="gp-details-header">
            <h2 className="gp-details-title">{product.title}</h2>
            <span className={`gp-details-stock-badge ${isOutOfStock ? "out" : "in"}`}>
              {isOutOfStock ? "Out of Stock" : "In Stock"}
            </span>
          </div>

          {/* Price section */}
          <div className="gp-details-price-card">
            {product.discount_percent > 0 && (
              <div className="gp-details-discount">-{product.discount_percent}% Off</div>
            )}
            <div className="gp-details-price-row">
              <span className="gp-details-price">{formatCurrency(product.price)}</span>
              {parseFloat(product.mrp) > parseFloat(product.price) && (
                <span className="gp-details-mrp">M.R.P.: {formatCurrency(product.mrp)}</span>
              )}
            </div>
            <p className="gp-details-tax-note">+ Delivery Charges Extra</p>
          </div>

          {/* Description */}
          <div className="gp-details-desc-box">
            <h4>Product Description</h4>
            <p>{product.description}</p>
          </div>

          {/* Purchase Options */}
          <div className="gp-details-actions-card">
            {!isOutOfStock && (
              <div className="gp-details-qty-row" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--gp-muted)" }}>Quantity:</label>
                <div className="gp-details-qty-selector" style={{ display: "flex", alignItems: "center", border: "1px solid var(--gp-border)", borderRadius: "8px", overflow: "hidden", background: "white", height: "34px", width: "120px" }}>
                  <button
                    type="button"
                    onClick={decreaseQty}
                    disabled={qty <= 1}
                    style={{ width: "36px", height: "100%", background: "#f8fafc", border: "none", borderRight: "1px solid var(--gp-border)", cursor: qty <= 1 ? "not-allowed" : "pointer", opacity: qty <= 1 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#64748b", transition: "background 0.2s" }}
                    className="gp-qty-btn-minus"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={maxStock > 0 ? maxStock : undefined}
                    value={qty}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQty(Math.max(1, maxStock > 0 ? Math.min(maxStock, val) : val));
                    }}
                    style={{ width: "100%", textAlign: "center", fontSize: "13px", fontWeight: "600", color: "#1e293b", border: "none", outline: "none" }}
                  />
                  <button
                    type="button"
                    onClick={increaseQty}
                    disabled={maxStock > 0 && qty >= maxStock}
                    style={{ width: "36px", height: "100%", background: "#f8fafc", border: "none", borderLeft: "1px solid var(--gp-border)", cursor: (maxStock > 0 && qty >= maxStock) ? "not-allowed" : "pointer", opacity: (maxStock > 0 && qty >= maxStock) ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#64748b", transition: "background 0.2s" }}
                    className="gp-qty-btn-plus"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="gp-details-buttons">
              <button
                className={`gp-details-btn-cart ${isInCart ? "added" : ""}`}
                onClick={handleAddToCartClick}
                disabled={isOutOfStock}
              >
                <ShoppingCart size={16} />
                {isInCart ? "Added to Cart ✓" : "Add to Cart"}
              </button>
              
              <button
                className="gp-details-btn-buy"
                onClick={handleBuyNowClick}
                disabled={isOutOfStock}
              >
                <Zap size={16} />
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


/* ─── Product Card ─────────────────────────────────────────── */
const ProductCard = ({ product, onAddToCart, onBuyNow, isInCart, onViewDetails }) => {
  const isOutOfStock = product.stock_status === "out_of_stock" || Number(product.quantity || 0) <= 0;
  const [currentIdx, setCurrentIdx] = useState(0);

  // Build list of all available images
  const images = [];
  if (product.image) images.push(product.image);
  if (product.images && product.images.length > 0) {
    product.images.forEach((img) => {
      if (img.image) images.push(img.image);
    });
  }

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="gp-card" id={`product-${product.id}`}>
      {/* Image */}
      <div 
        className="gp-card-img-wrap group" 
        style={{ overflow: "hidden", position: "relative", cursor: "pointer" }}
        onClick={() => onViewDetails(product)}
      >
        {images.length > 0 ? (
          <div 
            className="gp-card-img-slider"
            style={{ 
              display: "flex",
              height: "100%",
              width: "100%",
              transition: "transform 0.5s ease-in-out",
              transform: `translateX(-${currentIdx * 100}%)`
            }}
          >
            {images.map((img, idx) => (
              <div 
                key={idx} 
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  flexShrink: 0 
                }}
              >
                <img 
                  src={img} 
                  alt={`${product.title} - ${idx}`} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy" 
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="gp-card-img-placeholder">
            <Package size={64} strokeWidth={1.2} />
          </div>
        )}
        
        {/* Navigation arrows for multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="gp-carousel-arrow left"
              aria-label="Previous image"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={nextImage}
              className="gp-carousel-arrow right"
              aria-label="Next image"
            >
              <ChevronRight size={14} />
            </button>
            
            {/* Carousel dots indicators */}
            <div className="gp-carousel-dots">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrentIdx(i); }}
                  className={`gp-carousel-dot ${currentIdx === i ? "active" : ""}`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {product.discount_percent > 0 && (
          <span className="gp-discount-badge">−{product.discount_percent}% OFF</span>
        )}
        <span className={`gp-stock-badge ${isOutOfStock ? "out" : "in"}`}>
          {isOutOfStock ? "Out of Stock" : "In Stock"}
        </span>
      </div>

      {/* Body */}
      <div className="gp-card-body" style={{ cursor: "pointer" }} onClick={() => onViewDetails(product)}>
        <h3 className="gp-card-title">{product.title}</h3>

        <div className="gp-card-price-row">
          <span className="gp-price">{formatCurrency(product.price)}</span>
          {parseFloat(product.mrp) > parseFloat(product.price) && (
            <span className="gp-mrp">{formatCurrency(product.mrp)}</span>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="gp-card-footer">
        <button
          className={`gp-btn-cart ${isInCart ? "added" : ""}`}
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          id={`add-to-cart-${product.id}`}
          title={isOutOfStock ? "Out of stock" : "Add to cart"}
        >
          <ShoppingCart size={15} />
          {isInCart ? "In Cart ✓" : "Add to Cart"}
        </button>
        <button
          className="gp-btn-buy"
          onClick={() => onBuyNow(product)}
          disabled={isOutOfStock}
          id={`buy-now-${product.id}`}
          title={isOutOfStock ? "Out of stock" : "Buy Now"}
        >
          <Zap size={15} />
          Buy Now
        </button>
      </div>
    </div>
  );
};


/* ─── Cart Drawer ───────────────────────────────────────────── */
const CartDrawer = ({ isOpen, onClose, cartItems, onUpdateQty, onRemove, onCheckout }) => {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="gp-cart-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="gp-cart-drawer">
        {/* Header */}
        <div className="gp-cart-header">
          <h3>Shopping Cart</h3>
          <button className="gp-cart-close" onClick={onClose} aria-label="Close cart">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="gp-cart-body-scroll">
          {cartItems.length === 0 ? (
            <div className="gp-cart-empty">
              <span className="gp-cart-empty-icon">🛒</span>
              <p>Your cart is empty</p>
              <button className="gp-cart-empty-shop-btn" onClick={onClose}>
                Shop Now
              </button>
            </div>
          ) : (
            <div className="gp-cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="gp-cart-item">
                  {/* Thumbnail */}
                  <div className="gp-cart-item-thumb">
                    {item.image ? (
                      <img src={item.image} alt={item.title} />
                    ) : (
                      <div className="gp-cart-item-thumb-placeholder">
                        <Package size={16} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="gp-cart-item-info">
                    <h4>{item.title}</h4>
                    <p className="gp-cart-item-price">{formatCurrency(item.price)}</p>
                    
                    {/* Qty and Trash */}
                    <div className="gp-cart-item-actions">
                      <div className="gp-cart-item-qty-selector">
                        <button type="button" onClick={() => onUpdateQty(item.id, item.qty - 1)} disabled={item.qty <= 1}>-</button>
                        <span>{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, item.qty + 1)}
                          disabled={Number(item.quantity) > 0 && item.qty >= Number(item.quantity)}
                          title={Number(item.quantity) > 0 && item.qty >= Number(item.quantity) ? `Max stock limit (${item.quantity}) reached` : "Increase quantity"}
                        >+</button>
                      </div>
                      <button className="gp-cart-item-remove" onClick={() => onRemove(item.id)} title="Remove item">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="gp-cart-footer">
            <div className="gp-cart-total-row">
              <span>Total Amount:</span>
              <span className="gp-cart-total-price">{formatCurrency(totalAmount)}</span>
            </div>
            <button
              className="gp-cart-checkout-btn"
              onClick={onCheckout}
            >
              Place Order Enquiry ({cartItems.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


/* ─── Main Page ─────────────────────────────────────────────── */
const GoimomiProduct = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]         = useState([]);
  const [catalogues, setCatalogues]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [stockFilter, setStockFilter]   = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categoryOptions = useMemo(() => {
    const list = [];
    const set = new Set();

    // Only collect Master Categories
    catalogues.forEach((c) => {
      if (c.name && !set.has(c.name)) {
        set.add(c.name);
        list.push({ id: `cat-${c.id}`, name: c.name });
      }
    });

    products.forEach((p) => {
      if (p.catalogue_name && !set.has(p.catalogue_name)) {
        set.add(p.catalogue_name);
        list.push({ id: `pcat-${p.catalogue_name}`, name: p.catalogue_name });
      }
    });

    return list;
  }, [catalogues, products]);
  const [cartItems, setCartItems]       = useState(getCartItems());
  const [toast, setToast]               = useState(null);
  const [buyProduct, setBuyProduct]     = useState(null);
  const [isCartOpen, setIsCartOpen]     = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(
    searchParams.get("payment_success") === "true"
  );
  const successOrderId = searchParams.get("order_id");

  useEffect(() => {
    const pendingCartOrderId = localStorage.getItem("goimomi_pending_cart_order_id");
    if (
      searchParams.get("payment_success") === "true" &&
      successOrderId &&
      pendingCartOrderId === successOrderId
    ) {
      localStorage.removeItem("goimomi_cart");
      localStorage.removeItem("goimomi_pending_cart_order_id");
      setCartItems([]);
    }
  }, [searchParams, successOrderId]);

  const handleViewDetails = (product) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("id", product.id);
    setSearchParams(newParams);
  };

  const handleCloseDetails = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("id");
    setSearchParams(newParams);
  };

  useEffect(() => {
    const id = searchParams.get("id");
    if (id && products.length > 0) {
      const match = products.find((p) => p.id.toString() === id);
      if (match) {
        setSelectedProductDetails(match);
      }
    } else if (!id) {
      setSelectedProductDetails(null);
    }
  }, [searchParams, products]);

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("payment_success");
    newParams.delete("order_id");
    setSearchParams(newParams, { replace: true });
    setCartItems(getCartItems());
  };

  useEffect(() => {
    if (searchParams.get("cart") === "open") {
      setIsCartOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener("open-goimomi-cart", handleOpenCart);
    return () => window.removeEventListener("open-goimomi-cart", handleOpenCart);
  }, []);

  /* Fetch products & catalogues */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get("/api/goimomi-products/", { skipAuth: true }),
          api.get("/api/cataloguemasters/", { skipAuth: true }).catch(() => ({ data: [] }))
        ]);
        setProducts(prodRes.data || []);
        const catData = Array.isArray(catRes.data) ? catRes.data : catRes.data?.results || [];
        setCatalogues(catData);
      } catch (err) {
        console.error("Failed to fetch store data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* Show toast helper */
  const showToast = useCallback((msg, icon = "✅") => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 2800);
  }, []);

  /* Add to cart */
  const handleAddToCart = useCallback((product) => {
    const current = getCartItems();
    const exists = current.find((i) => i.id === product.id);
    const addQty = product.selectedQty || 1;
    const maxStock = Number(product.quantity) || 0;

    let updated;
    if (exists) {
      const targetQty = exists.qty + addQty;
      if (maxStock > 0 && targetQty > maxStock) {
        if (exists.qty >= maxStock) {
          showToast(`Cannot add more. Max stock limit (${maxStock}) reached for "${product.title}"`, "⚠️");
          return;
        }
        updated = current.map((i) => i.id === product.id ? { ...i, qty: maxStock } : i);
        showToast(`Quantity set to max available stock (${maxStock}) for "${product.title}"`, "ℹ️");
      } else {
        updated = current.map((i) => i.id === product.id ? { ...i, qty: targetQty } : i);
        showToast(`Quantity updated for "${product.title}"`);
      }
    } else {
      const initialQty = maxStock > 0 ? Math.min(addQty, maxStock) : addQty;
      updated = [...current, { ...product, qty: initialQty }];
      showToast(`"${product.title}" added to cart 🛒`);
    }
    saveCart(updated);
    setCartItems(updated);
  }, [showToast]);

  /* Remove from cart */
  const handleRemoveFromCart = useCallback((productId) => {
    const updated = getCartItems().filter((i) => i.id !== productId);
    saveCart(updated);
    setCartItems(updated);
  }, []);

  /* Update cart item quantity */
  const handleUpdateCartQty = useCallback((productId, newQty) => {
    const current = getCartItems();
    if (newQty < 1) {
      handleRemoveFromCart(productId);
      return;
    }
    const item = current.find((i) => i.id === productId);
    const maxStock = item ? (Number(item.quantity) || 0) : 0;
    
    let targetQty = newQty;
    if (maxStock > 0 && newQty > maxStock) {
      targetQty = maxStock;
      showToast(`Max available stock for "${item.title}" is ${maxStock}`, "⚠️");
    }

    const updated = current.map((i) => i.id === productId ? { ...i, qty: targetQty } : i);
    saveCart(updated);
    setCartItems(updated);
  }, [handleRemoveFromCart, showToast]);

  /* Checkout cart */
  const handleCartCheckout = useCallback(() => {
    setIsCartOpen(false);

    // Validate each cart item against available stock
    const validatedCart = cartItems.map((item) => {
      const maxStock = Number(item.quantity) || 0;
      if (maxStock > 0 && item.qty > maxStock) {
        return { ...item, qty: maxStock };
      }
      return item;
    });

    const wasAdjusted = validatedCart.some((item, idx) => item.qty !== cartItems[idx].qty);
    if (wasAdjusted) {
      saveCart(validatedCart);
      setCartItems(validatedCart);
      showToast("Some cart item quantities were adjusted to available stock.", "ℹ️");
    }

    const totalAmount = validatedCart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalMrp = validatedCart.reduce((sum, item) => sum + (parseFloat(item.mrp) || parseFloat(item.price)) * item.qty, 0);
    setBuyProduct({
      id: "cart",
      title: "Cart Items",
      price: totalAmount,
      mrp: totalMrp,
      quantity: 9999,
      isCartCheckout: true,
      description: validatedCart.map(item => `• ${item.title} (Qty: ${item.qty})`).join("\n"),
      cartItems: validatedCart
    });
  }, [cartItems, showToast]);


  /* Filtered list */
  const filtered = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const isPOutOfStock = p.stock_status === "out_of_stock" || Number(p.quantity || 0) <= 0;
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "out_of_stock" && isPOutOfStock) ||
      (stockFilter === "in_stock" && !isPOutOfStock);
    const matchesCategory =
      selectedCategory === "all" ||
      p.catalogue_name === selectedCategory ||
      p.sub_catalogue_name === selectedCategory ||
      (p.sub_catalogue_details && p.sub_catalogue_details.some((sc) => sc.name === selectedCategory));

    return matchesSearch && matchesStock && matchesCategory;
  });

  const cartIds = new Set(cartItems.map((i) => i.id));
  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="gp-page">

      {selectedProductDetails ? (
        <ProductDetailsPage
          product={selectedProductDetails}
          onClose={handleCloseDetails}
          onAddToCart={handleAddToCart}
          onBuyNow={setBuyProduct}
          isInCart={cartIds.has(selectedProductDetails.id)}
          onViewCart={() => setIsCartOpen(true)}
          cartCount={cartCount}
        />
      ) : (
        <>
          {/* ── Hero ── */}
          <section className="gp-hero">
            <div className="gp-hero-orb gp-hero-orb-1" />
            <div className="gp-hero-orb gp-hero-orb-2" />
            <div className="gp-hero-badge">
              <Star size={12} /> Goimomi Shop
            </div>
            <h1>Premium Products<br />Curated for You</h1>
            <p>Discover our exclusive collection of top-quality products with unbeatable prices.</p>
          </section>

          {/* ── Toolbar Console ── */}
          <div className="gp-toolbar">
            <div className="gp-toolbar-inner">
              
              {/* Combined Search & Category Bar */}
              <div className="gp-search-group">
                {/* Master Category Filter Dropdown */}
                <div className="gp-category-select-wrap">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="gp-category-select"
                    id="gp-category-filter"
                    aria-label="Filter by Category"
                  >
                    <option value="all">All Categories</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="gp-search-divider" />

                {/* Main Search Input */}
                <div className="gp-search">
                  <Search size={17} className="gp-search-icon" />
                  <input
                    id="gp-search-input"
                    type="text"
                    placeholder="Search products by name, description, tags…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="gp-search-clear-btn"
                      aria-label="Clear search"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Right Control Group: Stock Status & Cart */}
              <div className="gp-toolbar-right-group">
                {/* Segmented Stock filter */}
                <div className="gp-filter-btns">
                  {[
                    { key: "all", label: "All" },
                    { key: "in_stock", label: "In Stock" },
                    { key: "out_of_stock", label: "Out of Stock" },
                  ].map((f) => (
                    <button
                      key={f.key}
                      className={`gp-filter-btn ${stockFilter === f.key ? "active" : ""}`}
                      onClick={() => setStockFilter(f.key)}
                      id={`filter-${f.key}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Cart button */}
                <button
                  className="gp-cart-btn"
                  id="gp-view-cart"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingBag size={17} />
                  <span>Cart</span>
                  {cartCount > 0 && <span className="gp-cart-count">{cartCount}</span>}
                </button>
              </div>

            </div>
          </div>

          {/* ── Product Grid ── */}
          <section className="gp-grid-section">
            {!loading && (
              <p className="gp-result-count">
                Showing <strong>{filtered.length}</strong> product{filtered.length !== 1 ? "s" : ""}
              </p>
            )}

            <div className="gp-grid">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              ) : filtered.length === 0 ? (
                <div className="gp-empty">
                  <div className="gp-empty-icon">📦</div>
                  <h3>No products found</h3>
                  <p>Try adjusting your search or filter.</p>
                </div>
              ) : (
                filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onBuyNow={setBuyProduct}
                    isInCart={cartIds.has(product.id)}
                    onViewDetails={handleViewDetails}
                  />
                ))
              )}
            </div>
          </section>
        </>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="gp-toast" id="gp-toast">
          <span>{toast.icon}</span>
          {toast.msg}
        </div>
      )}

      {/* ── Order Success Modal ── */}
      {showSuccessModal && (
        <OrderSuccessModal orderId={successOrderId} onClose={handleCloseSuccessModal} />
      )}

      {/* ── Buy Now Modal ── */}
      {buyProduct && (
        <BuyNowModal product={buyProduct} onClose={() => setBuyProduct(null)} />
      )}

      {/* ── Floating Cart Button ── */}
      <button
        className="gp-floating-cart-btn"
        id="gp-floating-cart-widget"
        onClick={() => setIsCartOpen(true)}
        title="View Shopping Cart"
      >
        <ShoppingBag size={20} />
        <span>Cart</span>
        {cartCount > 0 && (
          <span className="gp-floating-cart-badge">{cartCount}</span>
        )}
      </button>

      {/* ── Cart Drawer ── */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCartCheckout}
      />

    </div>
  );
};

export default GoimomiProduct;
