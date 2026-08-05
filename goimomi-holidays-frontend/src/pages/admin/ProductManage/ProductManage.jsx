import React, { useState, useEffect } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";
import { 
  Edit2, Trash2, Plus, Search, Package, RefreshCw, Tag, CheckCircle, 
  XCircle, ShoppingCart, Eye, Phone, Mail, MapPin, Calendar, Clock, X, ChevronDown, User, FileText, Truck, Upload
} from "lucide-react";
import AdminSidebar from "../../../components/admin/AdminSidebar/AdminSidebar";
import AdminTopbar from "../../../components/admin/AdminTopbar/AdminTopbar";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const ProductManage = () => {
  const [activeTab, setActiveTab] = useState("catalog"); // "catalog" or "orders"
  const navigate = useNavigate();

  // Products Catalog State
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [stockFilter, setStockFilter] = useState("all");
  const [productSearchTerm, setProductSearchTerm] = useState("");

  // Customer Orders State
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderSearchTerm, setOrderSearchTerm] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Book Invoice & Dispatch State
  const [bookInvoiceNo, setBookInvoiceNo] = useState("");
  const [logisticsProvider, setLogisticsProvider] = useState("");
  const [trackingNo, setTrackingNo] = useState("");
  const [savingInvoice, setSavingInvoice] = useState(false);
  const [orderInvoiceSaved, setOrderInvoiceSaved] = useState(false);
  const [logisticsProviders, setLogisticsProviders] = useState([]);

  // Shipping Modal State
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [shippingOrder, setShippingOrder] = useState(null);
  const [shippingProvider, setShippingProvider] = useState("");
  const [shippingTrackingNo, setShippingTrackingNo] = useState("");
  const [shippingBillFile, setShippingBillFile] = useState(null);
  const [submittingShipping, setSubmittingShipping] = useState(false);

  // Common UI State
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchLogisticsProviders();
  }, []);

  const fetchLogisticsProviders = async () => {
    try {
      const res = await api.get("/api/logistics-providers/");
      const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setLogisticsProviders(data);
    } catch (err) {
      console.error("Notice fetching logistics providers:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await api.get("/api/goimomi-products/");
      const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(`Failed to load products: ${err.message}`);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await api.get("/api/goimomi-product-orders/");
      const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Filter Products
  useEffect(() => {
    let result = products;
    if (productSearchTerm) {
      result = result.filter((p) =>
        p.title?.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(productSearchTerm.toLowerCase())
      );
    }
    if (stockFilter !== "all") {
      result = result.filter((p) => p.stock_status === stockFilter);
    }
    setFilteredProducts(result);
  }, [productSearchTerm, stockFilter, products]);

  // Filter Orders
  useEffect(() => {
    let result = orders;
    if (orderSearchTerm) {
      const term = orderSearchTerm.toLowerCase();
      result = result.filter((o) =>
        o.order_id?.toLowerCase().includes(term) ||
        o.name?.toLowerCase().includes(term) ||
        o.phone?.toLowerCase().includes(term) ||
        o.email?.toLowerCase().includes(term) ||
        o.product_title?.toLowerCase().includes(term) ||
        o.address?.toLowerCase().includes(term)
      );
    }
    if (orderStatusFilter !== "all") {
      result = result.filter((o) => o.status === orderStatusFilter);
    }
    setFilteredOrders(result);
  }, [orderSearchTerm, orderStatusFilter, orders]);

  // Handle Product Actions
  const handleDeleteProduct = async (id) => {
    try {
      setLoadingProducts(true);
      await api.delete(`/api/goimomi-products/${id}/`);
      setMessage("Product deleted successfully!");
      setDeleteConfirmProduct(null);
      fetchProducts();
    } catch (err) {
      setError("Failed to delete product. Please try again.");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleToggleStock = async (product) => {
    const newStatus = product.stock_status === "in_stock" ? "out_of_stock" : "in_stock";
    try {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, stock_status: newStatus } : p))
      );
      await api.patch(`/api/goimomi-products/${product.id}/`, { stock_status: newStatus });
      setMessage(`"${product.title}" status updated to ${newStatus === "in_stock" ? "Active" : "Inactive"}!`);
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, stock_status: product.stock_status } : p))
      );
      setError("Failed to update status.");
      setTimeout(() => setError(""), 2500);
    }
  };

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (orderId, newStatus, orderObj) => {
    if (newStatus === "Shipped") {
      const orderToShip = orderObj || orders.find(o => o.id === orderId) || selectedOrder;
      if (orderToShip) {
        setShippingOrder(orderToShip);
        setShippingProvider(orderToShip.logistics_provider || "");
        setShippingTrackingNo(orderToShip.tracking_number || "");
        setShippingBillFile(null);
        setShowShippingModal(true);
        return;
      }
    }

    try {
      await api.patch(`/api/goimomi-product-orders/${orderId}/`, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
      setMessage(`Order ${selectedOrder?.order_id || ''} status updated to ${newStatus}`);
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status.");
    }
  };

  const handleConfirmShipping = async (e) => {
    e.preventDefault();
    if (!shippingOrder) return;
    setSubmittingShipping(true);
    try {
      const formData = new FormData();
      formData.append("status", "Shipped");
      formData.append("logistics_provider", shippingProvider.trim());
      formData.append("tracking_number", shippingTrackingNo.trim());
      formData.append("trigger_shipped_email", "true");
      if (shippingBillFile) {
        formData.append("bill_copy", shippingBillFile);
      }

      const res = await api.patch(
        `/api/goimomi-product-orders/${shippingOrder.id}/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updated = res.data;
      setOrders(prev => prev.map(o => o.id === shippingOrder.id ? { ...o, ...updated } : o));
      if (selectedOrder && selectedOrder.id === shippingOrder.id) {
        setSelectedOrder(prev => ({ ...prev, ...updated }));
      }
      setShowShippingModal(false);
      setMessage(`Order ${shippingOrder.order_id || shippingOrder.id} marked as Shipped! Notification email sent to ${shippingOrder.email || "customer"}.`);
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      console.error("Error updating shipping status:", err);
      alert("Failed to update shipping status.");
    } finally {
      setSubmittingShipping(false);
    }
  };

  // Handle Order Delete
  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setBookInvoiceNo(order.book_invoice_number || "");
    setLogisticsProvider(order.logistics_provider || "");
    setTrackingNo(order.tracking_number || "");
    setOrderInvoiceSaved(false);
  };

  const handleSaveInvoiceDetails = async () => {
    if (!selectedOrder) return;
    setSavingInvoice(true);
    try {
      const payload = {
        book_invoice_number: bookInvoiceNo.trim(),
        logistics_provider: logisticsProvider.trim(),
        tracking_number: trackingNo.trim()
      };
      await api.patch(`/api/goimomi-product-orders/${selectedOrder.id}/`, payload);
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, ...payload } : o));
      setSelectedOrder(prev => ({ ...prev, ...payload }));
      setOrderInvoiceSaved(true);
      setMessage(`Book Invoice & Shipping details saved for order ${selectedOrder.order_id || selectedOrder.id}!`);
      setTimeout(() => setMessage(""), 3000);
      setTimeout(() => setOrderInvoiceSaved(false), 2500);
    } catch (err) {
      console.error("Error saving invoice details:", err);
      alert("Failed to save invoice details.");
    } finally {
      setSavingInvoice(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this customer order enquiry?")) {
      try {
        await api.delete(`/api/goimomi-product-orders/${orderId}/`);
        setOrders(prev => prev.filter(o => o.id !== orderId));
        if (selectedOrder?.id === orderId) setSelectedOrder(null);
        setMessage("Order deleted successfully!");
        setTimeout(() => setMessage(""), 2500);
      } catch (err) {
        console.error("Error deleting order:", err);
        alert("Failed to delete order.");
      }
    }
  };

  // Calculate order metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const confirmedOrdersCount = orders.filter(o => o.status === 'Confirmed' || o.status === 'Completed').length;

  return (
    <div className="flex bg-gray-100 h-full overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminTopbar />
        <div className="flex-1 overflow-y-auto p-6">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Package size={22} className="text-green-600" />
                Goimomi Products & Orders
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage product inventory and view customer purchase enquiries
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { fetchProducts(); fetchOrders(); }}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2 text-sm"
              >
                <RefreshCw size={15} /> Refresh
              </button>
              <button
                onClick={() => navigate("/admin/products/add")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm font-semibold"
              >
                <Plus size={15} /> Add Product
              </button>
            </div>
          </div>

          {/* Alerts */}
          {message && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm flex items-center gap-2">
              <CheckCircle size={16} /> {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm flex items-center gap-2">
              <XCircle size={16} /> {error}
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-xl px-4 pt-2 shadow-xs">
            <button
              onClick={() => setActiveTab("catalog")}
              className={`py-3 px-6 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
                activeTab === "catalog"
                  ? "border-green-600 text-green-700 bg-green-50/50 rounded-t-lg"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Package size={18} /> Products Catalog ({products.length})
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`py-3 px-6 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
                activeTab === "orders"
                  ? "border-green-600 text-green-700 bg-green-50/50 rounded-t-lg"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <ShoppingCart size={18} /> Customer Orders & Enquiries ({orders.length})
              {pendingOrdersCount > 0 && (
                <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {pendingOrdersCount} Pending
                </span>
              )}
            </button>
          </div>

          {/* TAB 1: PRODUCTS CATALOG */}
          {activeTab === "catalog" && (
            <>
              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex gap-4 flex-wrap items-center">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by title or description…"
                    value={productSearchTerm}
                    onChange={(e) => setProductSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-700"
                >
                  <option value="all">All Stock Status</option>
                  <option value="in_stock">In Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loadingProducts ? (
                  <div className="flex items-center justify-center py-20 text-gray-500">
                    <RefreshCw size={28} className="animate-spin mr-3 text-green-600" /> Loading products…
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <Package size={48} className="mx-auto mb-3 opacity-40" />
                    <p className="font-semibold">No products found</p>
                    <p className="text-sm mt-1">Adjust your filters or add a new product.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          {["Image", "Title", "Price", "MRP", "Discount", "Qty", "Stock Status", "Actions"].map((h) => (
                            <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-green-50 transition-colors">
                            <td className="px-5 py-3">
                              {product.image ? (
                                <img src={product.image} alt={product.title} className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                              ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Package size={20} className="text-gray-400" />
                                </div>
                              )}
                            </td>
                            <td className="px-5 py-3">
                              <p className="font-semibold text-gray-800 text-sm">{product.title}</p>
                              <p className="text-xs text-gray-400 line-clamp-1 max-w-[180px]">{product.description}</p>
                            </td>
                            <td className="px-5 py-3 font-semibold text-gray-800 text-sm">{formatCurrency(product.price)}</td>
                            <td className="px-5 py-3 text-xs text-gray-400 line-through">
                              {product.mrp ? formatCurrency(product.mrp) : "—"}
                            </td>
                            <td className="px-5 py-3 text-xs font-medium text-green-700">
                              {product.mrp && product.mrp > product.price
                                ? `${Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF`
                                : "—"}
                            </td>
                            <td className="px-5 py-3 text-sm text-gray-700">{product.quantity ?? 1}</td>
                            <td className="px-5 py-3">
                              <button
                                onClick={() => handleToggleStock(product)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition ${
                                  product.stock_status === "in_stock"
                                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                                    : "bg-red-100 text-red-800 hover:bg-red-200"
                                }`}
                              >
                                {product.stock_status === "in_stock" ? (
                                  <>
                                    <CheckCircle size={12} /> In Stock
                                  </>
                                ) : (
                                  <>
                                    <XCircle size={12} /> Out of Stock
                                  </>
                                )}
                              </button>
                            </td>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                  title="Edit Product"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                                  title="Delete Product"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: CUSTOMER ORDERS & ENQUIRIES */}
          {activeTab === "orders" && (
            <>
              {/* Order Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</p>
                      <h3 className="text-2xl font-black text-gray-900 mt-1">{orders.length}</h3>
                    </div>
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                      <ShoppingCart size={20} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Orders</p>
                      <h3 className="text-2xl font-black text-amber-600 mt-1">{pendingOrdersCount}</h3>
                    </div>
                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                      <Clock size={20} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Confirmed Orders</p>
                      <h3 className="text-2xl font-black text-emerald-600 mt-1">{confirmedOrdersCount}</h3>
                    </div>
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                      <CheckCircle size={20} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Sales Value</p>
                      <h3 className="text-2xl font-black text-gray-900 mt-1">{formatCurrency(totalRevenue)}</h3>
                    </div>
                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                      <Tag size={20} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex gap-4 flex-wrap items-center">
                <div className="relative flex-1 min-w-[220px]">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by customer name, phone, email, order ID, or product…"
                    value={orderSearchTerm}
                    onChange={(e) => setOrderSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-700"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loadingOrders ? (
                  <div className="flex items-center justify-center py-20 text-gray-500">
                    <RefreshCw size={28} className="animate-spin mr-3 text-green-600" /> Loading customer orders…
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <ShoppingCart size={48} className="mx-auto mb-3 opacity-40" />
                    <p className="font-semibold">No customer product orders found</p>
                    <p className="text-sm mt-1">Orders submitted through product checkout will appear here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px]">
                      <thead className="bg-[#14532d] text-white">
                        <tr>
                          <th className="text-left py-3.5 px-4 text-xs font-bold uppercase tracking-wider">Order ID</th>
                          <th className="text-left py-3.5 px-4 text-xs font-bold uppercase tracking-wider">Customer Details</th>
                          <th className="text-left py-3.5 px-4 text-xs font-bold uppercase tracking-wider">Product Purchased</th>
                          <th className="text-left py-3.5 px-4 text-xs font-bold uppercase tracking-wider">Total Amount</th>
                          <th className="text-left py-3.5 px-4 text-xs font-bold uppercase tracking-wider">Delivery Address</th>
                          <th className="text-left py-3.5 px-4 text-xs font-bold uppercase tracking-wider">Status</th>
                          <th className="text-left py-3.5 px-4 text-xs font-bold uppercase tracking-wider">Date</th>
                          <th className="text-center py-3.5 px-4 text-xs font-bold uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-green-50/60 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-gray-900 whitespace-nowrap">
                              <div>{order.order_id || `#${order.id}`}</div>
                              {order.book_invoice_number && (
                                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold text-sky-800 bg-sky-50 border border-sky-200 rounded-md">
                                  Book Inv: {order.book_invoice_number}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-gray-900">{order.name}</p>
                              <div className="text-xs text-gray-500 space-y-0.5 mt-0.5">
                                <p className="flex items-center gap-1"><Phone size={12} className="text-gray-400" /> {order.phone}</p>
                                {order.email && <p className="flex items-center gap-1"><Mail size={12} className="text-gray-400" /> {order.email}</p>}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-semibold text-gray-800 line-clamp-1 max-w-[200px]">
                                {order.product_title || order.product_details?.title || "Product Order"}
                              </p>
                              <p className="text-xs text-gray-500 font-medium">Qty: {order.quantity}</p>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-emerald-800 whitespace-nowrap">
                              {formatCurrency(order.total_amount)}
                            </td>
                            <td className="py-3.5 px-4 text-xs text-gray-600 max-w-[220px] truncate" title={order.address}>
                              {order.address}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value, order)}
                                className={`px-2.5 py-1 rounded-full text-xs font-bold border outline-none cursor-pointer ${
                                  order.status === 'Confirmed'
                                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                                    : order.status === 'Shipped'
                                    ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                                    : order.status === 'Delivered'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : order.status === 'Cancelled'
                                    ? 'bg-red-50 text-red-800 border-red-300'
                                    : 'bg-amber-50 text-amber-800 border-amber-300'
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-xs text-gray-500 whitespace-nowrap">
                              {formatDate(order.created_at)}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex gap-1.5 justify-center">
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, "Shipped", order)}
                                  className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded-lg text-xs font-bold transition shadow-sm"
                                  title="Ship order & upload bill copy"
                                >
                                  <Truck size={13} /> Ship
                                </button>
                                <button
                                  onClick={() => handleSelectOrder(order)}
                                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg text-xs font-semibold transition"
                                >
                                  <Eye size={13} /> View
                                </button>
                                <button
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-lg text-xs font-semibold transition"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* CUSTOMER ORDER DETAIL MODAL */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
                
                {/* Modal Header */}
                <div className="p-5 bg-gradient-to-r from-[#14532d] to-[#1a6b3d] text-white flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200">Customer Order Detail</span>
                    <h3 className="text-xl font-black mt-0.5">{selectedOrder.order_id || `#${selectedOrder.id}`}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                  
                  {/* Customer Info Card */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <User size={14} className="text-emerald-700" /> Customer Information
                    </h4>
                    <p className="text-base font-bold text-gray-900">{selectedOrder.name}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-xs text-gray-700">
                      <div className="flex items-center gap-1.5">
                        <Phone size={13} className="text-gray-400" />
                        <span className="font-semibold">{selectedOrder.phone}</span>
                      </div>
                      {selectedOrder.email && (
                        <div className="flex items-center gap-1.5 truncate">
                          <Mail size={13} className="text-gray-400" />
                          <span className="font-semibold truncate">{selectedOrder.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delivery Address Card */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <MapPin size={14} className="text-emerald-700" /> Delivery Address
                    </h4>
                    <p className="text-xs text-gray-800 font-medium leading-relaxed whitespace-pre-line">
                      {selectedOrder.address}
                    </p>
                  </div>

                  {/* Book Invoice & Dispatch Information Card */}
                  <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-200 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-sky-800 flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><FileText size={14} className="text-sky-700" /> Feed Book Invoice & Shipping Info</span>
                      {orderInvoiceSaved && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Saved!</span>}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Book Invoice No.</label>
                        <input
                          type="text"
                          placeholder="e.g. INV/2026/048"
                          value={bookInvoiceNo}
                          onChange={(e) => setBookInvoiceNo(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-sky-200 rounded-lg font-mono text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Logistics Provider</label>
                        <input
                          type="text"
                          list="logistics-providers-list"
                          placeholder="e.g. Blue Dart, Delhivery"
                          value={logisticsProvider}
                          onChange={(e) => setLogisticsProvider(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-sky-200 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        />
                        <datalist id="logistics-providers-list">
                          {logisticsProviders.map(lp => (
                            <option key={lp.id} value={lp.name} />
                          ))}
                        </datalist>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Tracking Number</label>
                        <input
                          type="text"
                          placeholder="e.g. 1849209123"
                          value={trackingNo}
                          onChange={(e) => setTrackingNo(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-sky-200 rounded-lg font-mono text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={handleSaveInvoiceDetails}
                        disabled={savingInvoice}
                        className="px-4 py-1.5 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-lg shadow transition disabled:opacity-50"
                      >
                        {savingInvoice ? "Saving..." : "Save Invoice & Shipping Details"}
                      </button>
                    </div>
                  </div>

                  {/* Product Order Summary */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <Package size={14} className="text-emerald-700" /> Product Summary
                    </h4>
                    
                    <div className="flex justify-between items-center text-sm pt-1 border-b border-gray-200 pb-2">
                      <span className="font-bold text-gray-900">
                        {selectedOrder.product_title || selectedOrder.product_details?.title || "Product Item"}
                      </span>
                      <span className="font-bold text-emerald-800">
                        {formatCurrency(selectedOrder.total_amount)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 pt-1">
                      <div>Quantity: <strong className="text-gray-900">{selectedOrder.quantity}</strong></div>
                      <div>Unit Price: <strong className="text-gray-900">{formatCurrency(selectedOrder.price || (selectedOrder.total_amount / (selectedOrder.quantity || 1)))}</strong></div>
                    </div>

                    {selectedOrder.cart_items && selectedOrder.cart_items.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200 text-xs">
                        <p className="font-bold text-gray-700 mb-1">Cart Items Breakdown:</p>
                        <ul className="space-y-1 pl-2">
                          {selectedOrder.cart_items.map((item, idx) => (
                            <li key={idx} className="flex justify-between text-gray-600">
                              <span>• {item.title} (x{item.quantity})</span>
                              <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Status & Date */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Order Status</label>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Order Date</label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 flex items-center gap-1.5 h-[36px]">
                        <Calendar size={13} className="text-gray-400" />
                        {formatDate(selectedOrder.created_at)}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center gap-2">
                  <button
                    onClick={() => handleDeleteOrder(selectedOrder.id)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg transition border border-red-200 flex items-center gap-1"
                  >
                    <Trash2 size={13} /> Delete Order
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, "Shipped", selectedOrder)}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition shadow flex items-center gap-1.5"
                    >
                      <Truck size={14} /> Ship Order & Bill
                    </button>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="px-4 py-1.5 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold rounded-lg transition"
                    >
                      Close
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

      {/* SHIPPED DISPATCH DETAILS MODAL */}
      {showShippingModal && shippingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-[#14532d] text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Truck size={20} />
                <h3 className="text-lg font-black">Dispatch & Ship Order #{shippingOrder.order_id || shippingOrder.id}</h3>
              </div>
              <button onClick={() => setShowShippingModal(false)} className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmShipping} className="p-6 space-y-4">
              <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5">
                <CheckCircle size={18} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold">Automated Customer & Company Email Dispatch</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5 leading-relaxed">
                    Submitting will mark order as <strong>Shipped</strong> and automatically send an email to <strong>{shippingOrder.email || "Customer"}</strong> (with CC to <strong>hello@goimomi.com & support@goimomi.com</strong>) with courier details, tracking link, and attached bill copy.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Logistics Provider / Courier Name *
                </label>
                <input
                  type="text"
                  required
                  list="logistics-providers-modal-list"
                  placeholder="e.g. Blue Dart, Delhivery, DTDC, India Post"
                  value={shippingProvider}
                  onChange={(e) => setShippingProvider(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <datalist id="logistics-providers-modal-list">
                  {logisticsProviders.map(lp => (
                    <option key={lp.id} value={lp.name} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Ref No. / Waybill Tracking No. *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1849209123 or REF-94820"
                  value={shippingTrackingNo}
                  onChange={(e) => setShippingTrackingNo(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Upload Bill Copy / Shipping Receipt (PDF / Image)
                </label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => setShippingBillFile(e.target.files[0])}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
                {shippingBillFile && (
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                    <FileText size={12} /> Selected file: {shippingBillFile.name}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowShippingModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingShipping}
                  className="px-5 py-2 bg-[#14532d] hover:bg-[#1a6b3d] text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submittingShipping ? "Processing..." : "Save & Send Shipping Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        </div>
      </div>
    </div>
  );
};

export default ProductManage;
