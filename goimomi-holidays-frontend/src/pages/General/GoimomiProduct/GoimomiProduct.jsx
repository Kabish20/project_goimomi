import React, { useState, useEffect, useCallback } from "react";
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


const BuyNowModal = ({ product, onClose }) => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", qty: product.selectedQty || 1, address: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const decreaseQty = () => {
    setForm((p) => ({ ...p, qty: Math.max(1, p.qty - 1) }));
  };

  const increaseQty = () => {
    setForm((p) => ({ ...p, qty: Math.min(product.quantity, p.qty + 1) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        product: product.isCartCheckout ? null : product.id,
        quantity: form.qty,
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
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
      
      if (response.data && response.data.payment_url) {
        if (product.isCartCheckout) {
          localStorage.removeItem("goimomi_cart");
        }
        window.location.href = response.data.payment_url;
      } else {
        alert("Failed to initiate payment. Please try again.");
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
                  <label htmlFor="gp-buy-email">Email ID (optional)</label>
                  <input id="gp-buy-email" name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handleChange} />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="gp-buy-email">Email ID (optional)</label>
                    <input id="gp-buy-email" name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handleChange} />
                  </div>
                  <div>
                    <label>Quantity</label>
                    <div className="flex items-center border border-gray-200 rounded-lg h-[34px] overflow-hidden bg-white mt-1">
                      <button
                        type="button"
                        onClick={decreaseQty}
                        className="w-10 h-full bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition text-gray-500 font-bold border-r border-gray-200 text-sm select-none"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center text-sm font-semibold text-gray-700">
                        {form.qty}
                      </span>
                      <button
                        type="button"
                        onClick={increaseQty}
                        className="w-10 h-full bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition text-gray-500 font-bold border-l border-gray-200 text-sm select-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}


              <div>
                <label htmlFor="gp-buy-address">Address *</label>
                <textarea id="gp-buy-address" name="address" required placeholder="Enter delivery address…" value={form.address} onChange={handleChange} rows={2} />
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
  const [qty, setQty] = useState(1);
  const isOutOfStock = product.stock_status === "out_of_stock";

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
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={onClose} className="gp-details-back-btn">
            ← Back to Shop
          </button>
          <span className="gp-details-separator">/</span>
          <span className="gp-details-active-crumb">{product.title}</span>
        </div>

        <button
          className="gp-cart-btn"
          id="gp-view-cart-details"
          onClick={onViewCart}
          style={{ padding: "8px 16px" }}
        >
          {cartCount > 0 && <span className="gp-cart-count">{cartCount}</span>}
          <ShoppingBag size={16} />
          Cart
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
            <p className="gp-details-tax-note">Inclusive of all taxes</p>
          </div>

          {/* Description */}
          <div className="gp-details-desc-box">
            <h4>Product Description</h4>
            <p>{product.description}</p>
          </div>

          {/* Purchase Options */}
          <div className="gp-details-actions-card">
            {!isOutOfStock && (
              <div className="gp-details-qty-row" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--gp-muted)" }}>Quantity:</label>
                <div className="gp-details-qty-selector" style={{ display: "flex", alignItems: "center", border: "1px solid var(--gp-border)", borderRadius: "8px", overflow: "hidden", background: "white", height: "34px", width: "110px" }}>
                  <button
                    type="button"
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    style={{ width: "32px", height: "100%", background: "#f8fafc", border: "none", borderRight: "1px solid var(--gp-border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#64748b", transition: "background 0.2s" }}
                    className="gp-qty-btn-minus"
                  >
                    -
                  </button>
                  <span style={{ flex: 1, textAlign: "center", fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((prev) => Math.min(product.quantity, prev + 1))}
                    style={{ width: "32px", height: "100%", background: "#f8fafc", border: "none", borderLeft: "1px solid var(--gp-border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#64748b", transition: "background 0.2s" }}
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
  const isOutOfStock = product.stock_status === "out_of_stock";
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
                        <button type="button" onClick={() => onUpdateQty(item.id, item.qty - 1)}>-</button>
                        <span>{item.qty}</span>
                        <button type="button" onClick={() => onUpdateQty(item.id, item.qty + 1)}>+</button>
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
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [stockFilter, setStockFilter]   = useState("all");
  const [cartItems, setCartItems]       = useState(getCartItems());
  const [toast, setToast]               = useState(null);
  const [buyProduct, setBuyProduct]     = useState(null);
  const [isCartOpen, setIsCartOpen]     = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(
    searchParams.get("payment_success") === "true"
  );
  const successOrderId = searchParams.get("order_id");

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

  /* Fetch products */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/api/goimomi-products/", { skipAuth: true });
        setProducts(res.data || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
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
    let updated;
    if (exists) {
      updated = current.map((i) => i.id === product.id ? { ...i, qty: i.qty + addQty } : i);
      showToast(`Quantity updated for "${product.title}"`);
    } else {
      updated = [...current, { ...product, qty: addQty }];
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
    const updated = current.map((i) => i.id === productId ? { ...i, qty: newQty } : i);
    saveCart(updated);
    setCartItems(updated);
  }, [handleRemoveFromCart]);

  /* Checkout cart */
  const handleCartCheckout = useCallback(() => {
    setIsCartOpen(false);
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalMrp = cartItems.reduce((sum, item) => sum + (parseFloat(item.mrp) || parseFloat(item.price)) * item.qty, 0);
    setBuyProduct({
      id: "cart",
      title: "Cart Items",
      price: totalAmount,
      mrp: totalMrp,
      quantity: 99,
      isCartCheckout: true,
      description: cartItems.map(item => `• ${item.title} (Qty: ${item.qty})`).join("\n"),
      cartItems: cartItems
    });
  }, [cartItems]);


  /* Filtered list */
  const filtered = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesStock = stockFilter === "all" || p.stock_status === stockFilter;
    return matchesSearch && matchesStock;
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
              <Star size={12} /> Goimomi Store
            </div>
            <h1>Premium Products<br />Curated for You</h1>
            <p>Discover our exclusive collection of top-quality products with unbeatable prices.</p>
          </section>

          {/* ── Toolbar ── */}
          <div className="gp-toolbar">
            <div className="gp-toolbar-inner">
              {/* Search */}
              <div className="gp-search">
                <Search size={16} className="gp-search-icon" />
                <input
                  id="gp-search-input"
                  type="text"
                  placeholder="Search products…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Stock filter */}
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
                {cartCount > 0 && <span className="gp-cart-count">{cartCount}</span>}
                <ShoppingBag size={16} />
                Cart
              </button>
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
