import React, { useState, useEffect } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import goimomilogo from "../../../assets/goimomilogo.png";
import { 
  Edit2, Trash2, Plus, Search, Package, RefreshCw, Tag, CheckCircle, 
  XCircle, ShoppingCart, Eye, Phone, Mail, MapPin, Calendar, Clock, X, ChevronDown, User, FileText, Truck, Upload, Download, Copy, Check, ExternalLink
} from "lucide-react";
import AdminSidebar from "../../../components/admin/AdminSidebar/AdminSidebar";
import AdminTopbar from "../../../components/admin/AdminTopbar/AdminTopbar";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);

const getMediaUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return url;
};

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

  // Manual Add Order State
  const [showManualModal, setShowManualModal] = useState(false);
  const [submittingManual, setSubmittingManual] = useState(false);
  const [manualForm, setManualForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    product_id: "",
    custom_product_title: "",
    quantity: 1,
    price: "",
    total_amount: "",
    status: "Confirmed",
    book_invoice_number: "",
    logistics_provider: "",
    tracking_number: "",
    bill_copy: null,
    trigger_shipped_email: true
  });

  const handleOpenManualModal = () => {
    setManualForm({
      name: "",
      phone: "",
      email: "",
      address: "",
      product_id: "",
      custom_product_title: "",
      quantity: 1,
      price: "",
      total_amount: "",
      status: "Confirmed",
      book_invoice_number: "",
      logistics_provider: "",
      tracking_number: "",
      bill_copy: null,
      trigger_shipped_email: true
    });
    setShowManualModal(true);
  };

  const handleManualProductChange = (prodId) => {
    if (!prodId) {
      setManualForm(prev => ({
        ...prev,
        product_id: "",
        price: "",
        total_amount: ""
      }));
      return;
    }
    if (prodId === "custom") {
      setManualForm(prev => ({
        ...prev,
        product_id: "",
        custom_product_title: prev.custom_product_title || ""
      }));
      return;
    }
    const selectedProd = products.find(p => String(p.id) === String(prodId));
    if (selectedProd) {
      const priceVal = selectedProd.price || 0;
      const qty = Number(manualForm.quantity) || 1;
      setManualForm(prev => ({
        ...prev,
        product_id: prodId,
        custom_product_title: "",
        price: priceVal,
        total_amount: priceVal * qty
      }));
    } else {
      setManualForm(prev => ({ ...prev, product_id: prodId }));
    }
  };

  const handleManualQuantityChange = (qty) => {
    const numQty = Math.max(1, Number(qty) || 1);
    setManualForm(prev => {
      const unitPrice = Number(prev.price) || 0;
      return {
        ...prev,
        quantity: numQty,
        total_amount: unitPrice ? unitPrice * numQty : prev.total_amount
      };
    });
  };

  const handleManualPriceChange = (priceVal) => {
    setManualForm(prev => {
      const p = Number(priceVal) || 0;
      const qty = Number(prev.quantity) || 1;
      return {
        ...prev,
        price: priceVal,
        total_amount: p ? p * qty : prev.total_amount
      };
    });
  };

  const handleSubmitManualOrder = async (e) => {
    e.preventDefault();

    if (!manualForm.name.trim()) {
      alert("Customer Name is required.");
      return;
    }
    if (!manualForm.phone.trim()) {
      alert("Phone Number is required.");
      return;
    }
    if (!manualForm.email.trim()) {
      alert("Email Address is required.");
      return;
    }
    if (!manualForm.address.trim()) {
      alert("Delivery Address is required.");
      return;
    }
    if (!manualForm.product_id && !manualForm.custom_product_title.trim()) {
      alert("Please select a Product from the catalog or enter a Custom Product Title.");
      return;
    }
    if (manualForm.price === "" || manualForm.price === null || isNaN(manualForm.price)) {
      alert("Unit Price is required.");
      return;
    }
    if (manualForm.status === "Shipped") {
      if (!manualForm.logistics_provider.trim()) {
        alert("Logistics Provider / Courier Name is required when status is Shipped.");
        return;
      }
      if (!manualForm.tracking_number.trim()) {
        alert("Tracking Number is required when status is Shipped.");
        return;
      }
    }

    setSubmittingManual(true);
    try {
      const formData = new FormData();
      formData.append("is_manual", "true");
      formData.append("name", manualForm.name.trim());
      formData.append("phone", manualForm.phone.trim());
      formData.append("email", manualForm.email.trim());
      formData.append("address", manualForm.address.trim());
      if (manualForm.product_id) {
        formData.append("product", manualForm.product_id);
      }
      if (manualForm.custom_product_title) {
        formData.append("custom_product_title", manualForm.custom_product_title.trim());
      }
      formData.append("quantity", manualForm.quantity);
      if (manualForm.price !== "") formData.append("price", manualForm.price);
      if (manualForm.total_amount !== "") formData.append("total_amount", manualForm.total_amount);
      formData.append("status", manualForm.status);
      if (manualForm.book_invoice_number) formData.append("book_invoice_number", manualForm.book_invoice_number.trim());
      if (manualForm.logistics_provider) formData.append("logistics_provider", manualForm.logistics_provider.trim());
      if (manualForm.tracking_number) formData.append("tracking_number", manualForm.tracking_number.trim());
      if (manualForm.bill_copy) formData.append("bill_copy", manualForm.bill_copy);
      if (manualForm.trigger_shipped_email) formData.append("trigger_shipped_email", "true");

      const res = await api.post("/api/goimomi-product-orders/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const newOrder = res.data.order || res.data;
      setMessage(res.data.message || `Manual Order #${newOrder.order_id || newOrder.id} created successfully! Notification email sent to ${newOrder.email || 'customer'} with CC to hello@goimomi.com & support@goimomi.com.`);
      setShowManualModal(false);
      fetchOrders();
      fetchProducts();
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      console.error("Error creating manual order:", err);
      const errMsg = err.response?.data?.error || err.response?.data?.detail || "Failed to create manual product order.";
      alert(`Manual Order Creation Error: ${errMsg}`);
    } finally {
      setSubmittingManual(false);
    }
  };

  // Common UI State
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyOrderDetails = (order) => {
    if (!order) return;
    try {
      const prodTitle = order.product_title || order.product_details?.title || "Product Order";
      let cartBreakdown = "";
      if (order.cart_items && order.cart_items.length > 0) {
        cartBreakdown = "\nCart Items Breakdown:\n" + order.cart_items.map(item => `  • ${item.title} (x${item.quantity}) - ${formatCurrency(item.price * item.quantity)}`).join("\n");
      }

      const textToCopy = `=== GOIMOMI HOLIDAYS - ORDER DETAILS ===
Order ID: ${order.order_id || `#${order.id}`}
Order Date: ${formatDate(order.created_at)}
Status: ${order.status || "Pending"}

--- CUSTOMER INFORMATION ---
Name: ${order.name || "N/A"}
Phone: ${order.phone || "N/A"}
Email: ${order.email || "N/A"}

--- DELIVERY ADDRESS ---
${order.address || "N/A"}

--- INVOICE & SHIPPING INFO ---
Book Invoice No.: ${order.book_invoice_number || "N/A"}
Logistics Provider: ${order.logistics_provider || "N/A"}
Tracking Number: ${order.tracking_number || "N/A"}

--- PRODUCT SUMMARY ---
Product: ${prodTitle}
Quantity: ${order.quantity || 1}
Unit Price: ${formatCurrency(order.price || (order.total_amount / (order.quantity || 1)))}
Total Amount: ${formatCurrency(order.total_amount)}${cartBreakdown}
=========================================`;

      navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    } catch (err) {
      console.error("Copy to clipboard error:", err);
      alert("Failed to copy order details.");
    }
  };

  const handleDownloadOrderPdf = (order) => {
    if (!order) return;
    try {
      const doc = new jsPDF();

      // Header Banner
      doc.setFillColor(20, 83, 45); // Emerald Green
      doc.rect(0, 0, 210, 36, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("GOIMOMI HOLIDAYS", 14, 18);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("CUSTOMER ORDER RECEIPT", 14, 27);

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`ORDER: ${order.order_id || `#${order.id}`}`, 145, 18);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Date: ${formatDate(order.created_at)}`, 145, 25);
      doc.text(`Status: ${(order.status || "Pending").toUpperCase()}`, 145, 31);

      let yPos = 46;

      // Customer Details Section Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, yPos, 88, 42, 3, 3, "FD");

      doc.setTextColor(20, 83, 45);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("CUSTOMER INFORMATION", 18, yPos + 8);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(order.name || "N/A", 18, yPos + 17);

      doc.setFont("helvetica", "normal");
      doc.text(`Phone: ${order.phone || "N/A"}`, 18, yPos + 25);
      doc.text(`Email: ${order.email || "N/A"}`, 18, yPos + 33);

      // Delivery Address Section Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(108, yPos, 88, 42, 3, 3, "FD");

      doc.setTextColor(20, 83, 45);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("DELIVERY ADDRESS", 112, yPos + 8);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      const addressLines = doc.splitTextToSize(order.address || "N/A", 80);
      doc.text(addressLines, 112, yPos + 17);

      yPos += 48;

      // Shipping & Invoice Details (If available)
      if (order.book_invoice_number || order.logistics_provider || order.tracking_number) {
        doc.setFillColor(240, 249, 255);
        doc.setDrawColor(186, 230, 253);
        doc.roundedRect(14, yPos, 182, 20, 3, 3, "FD");

        doc.setTextColor(3, 105, 161);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("INVOICE & SHIPPING DETAILS", 18, yPos + 7);

        doc.setTextColor(51, 65, 85);
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "normal");
        const shippingText = `Book Invoice: ${order.book_invoice_number || "N/A"}   |   Courier: ${order.logistics_provider || "N/A"}   |   Tracking #: ${order.tracking_number || "N/A"}`;
        doc.text(shippingText, 18, yPos + 14);

        yPos += 26;
      }

      // Products Table
      const tableHead = [["Item Description", "Qty", "Unit Price", "Total Amount"]];
      const tableBody = [];

      if (order.cart_items && order.cart_items.length > 0) {
        order.cart_items.forEach((item) => {
          tableBody.push([
            item.title || "Product Item",
            item.quantity || 1,
            `Rs. ${(item.price || 0).toLocaleString("en-IN")}`,
            `Rs. ${((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}`
          ]);
        });
      } else {
        const prodTitle = order.product_title || order.product_details?.title || "Product Item";
        const unitPrice = order.price || (order.total_amount / (order.quantity || 1));
        tableBody.push([
          prodTitle,
          order.quantity || 1,
          `Rs. ${(unitPrice || 0).toLocaleString("en-IN")}`,
          `Rs. ${(order.total_amount || 0).toLocaleString("en-IN")}`
        ]);
      }

      autoTable(doc, {
        head: tableHead,
        body: tableBody,
        startY: yPos,
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: [20, 83, 45], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { left: 14, right: 14 }
      });

      const finalY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : yPos + 30) + 10;

      // Summary Total Box
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(187, 247, 208);
      doc.roundedRect(120, finalY, 76, 18, 3, 3, "FD");

      doc.setTextColor(22, 101, 52);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("TOTAL AMOUNT:", 125, finalY + 11);
      doc.text(`Rs. ${(order.total_amount || 0).toLocaleString("en-IN")}`, 190, finalY + 11, { align: "right" });

      // Footer Note
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(148, 163, 184);
      doc.text("Thank you for choosing Goimomi Holidays.", 105, 282, { align: "center" });

      doc.save(`Order_${order.order_id || order.id}_Goimomi.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Failed to generate PDF document.");
    }
  };

  const handleDownloadPackingSlip = async (order) => {
    if (!order) return;
    const orderId = order.id;
    const orderRef = order.order_id || `GO-ORD-${orderId}`;
    try {
      // Fetch high-quality HTML-to-PDF packing slip from backend endpoint
      const res = await api.get(`/api/goimomi-product-orders/${orderId}/download-packing-slip/`, {
        responseType: 'blob'
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Packing_Slip_${orderRef}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (apiErr) {
      console.warn("Backend packing slip endpoint unavailable, generating client-side fallback PDF:", apiErr);
      try {
        const doc = new jsPDF();

        // Header Left: Title & Store Address
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("Packing Slip", 14, 20);

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(50, 50, 50);
        doc.text("Goimomi Shop", 14, 26);
        doc.text("5, Crescent Paark, Ground Floor,", 14, 30);
        doc.text("Sulaiman Hazrath St, opp. Jamal Mohamed Masjid,", 14, 34);
        doc.text("Tiruchirappalli, Tamil Nadu 620020, India", 14, 38);
        doc.text("support@goimomi.com | +91 81100 82222", 14, 42);

        // Header Right: Goimomi Logo Image
        try {
          doc.addImage(goimomilogo, 'PNG', 148, 10, 48, 18);
        } catch (logoErr) {
          doc.setFontSize(18);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(20, 83, 45);
          doc.text("goimomi", 196, 22, { align: "right" });
        }

        let yPos = 48;

        // From / To Header Bars (Solid Forest Green)
        doc.setFillColor(20, 83, 45);
        doc.rect(14, yPos, 88, 8, "F");
        doc.rect(108, yPos, 88, 8, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("FROM", 18, yPos + 5.5);
        doc.text("TO", 112, yPos + 5.5);

        // From / To Outer Box Borders
        doc.setDrawColor(20, 83, 45);
        doc.setLineWidth(0.3);
        doc.rect(14, yPos, 88, 40);
        doc.rect(108, yPos, 88, 40);

        // From Content
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "bold");
        doc.text("Goimomi Shop", 18, yPos + 14);

        doc.setFont("helvetica", "normal");
        doc.text("5, Crescent Paark, Ground Floor,", 18, yPos + 19);
        doc.text("Sulaiman Hazrath St, opp. Jamal Mohamed Masjid,", 18, yPos + 23.5);
        doc.text("Tiruchirappalli, Tamil Nadu 620020, India", 18, yPos + 28);
        doc.text("Ph: +91 81100 82222", 18, yPos + 32.5);
        doc.text("support@goimomi.com", 18, yPos + 36.5);

        // To Content
        doc.setFont("helvetica", "bold");
        doc.text(order.name || "N/A", 112, yPos + 14);

        doc.setFont("helvetica", "normal");
        const shipAddrLines = doc.splitTextToSize(order.address || "N/A", 80);
        doc.text(shipAddrLines, 112, yPos + 19);
        if (order.phone) {
          doc.text(`Ph: ${order.phone}`, 112, yPos + 32.5);
        }
        if (order.email) {
          doc.text(order.email, 112, yPos + 36.5);
        }

        yPos += 46;

        // Order Meta Summary Box (2 Columns)
        doc.rect(14, yPos, 182, 16);
        doc.line(105, yPos, 105, yPos + 16);

        // Col 1: Order Number
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text("Order Number", 59.5, yPos + 5, { align: "center" });
        doc.setFontSize(9.5);
        doc.text(orderRef, 59.5, yPos + 11.5, { align: "center" });

        // Col 2: Order Date & Time
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text("Order Date & Time", 150.5, yPos + 5, { align: "center" });
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(formatDate(order.created_at), 150.5, yPos + 11.5, { align: "center" });

        yPos += 22;

        // Product Items Table
        const tableHead = [["Product ID", "Product Name", "Quantity"]];
        const tableBody = [];

        const formatProdId = (rawId) => {
          if (rawId === null || rawId === undefined || rawId === "") return "—";
          if (typeof rawId === "object") {
            rawId = rawId.product_id || rawId.id || rawId.pk;
          }
          const strId = String(rawId).trim();
          if (!strId || strId.toLowerCase() === "none" || strId.toLowerCase() === "null" || strId.toLowerCase() === "undefined") return "—";
          if (strId.startsWith("GO-PRO-")) return strId;
          const digits = strId.replace(/\D/g, "");
          if (digits) return `GO-PRO-${digits.padStart(4, "0")}`;
          return `GO-PRO-${strId.padStart(4, "0")}`;
        };

        if (order.cart_items && order.cart_items.length > 0) {
          order.cart_items.forEach((item) => {
            const rawId = item.product_id || item.id || item.product || item.sku;
            tableBody.push([
              formatProdId(rawId),
              item.title || "Product Item",
              item.quantity || 1
            ]);
          });
        } else {
          const rawId = order.product_details?.product_id || order.product_id || (typeof order.product === 'object' ? order.product?.product_id || order.product?.id : null) || order.product_details?.id || order.product;
          const prodTitle = order.product_title || order.product_details?.title || "Product Item";
          tableBody.push([
            formatProdId(rawId),
            prodTitle,
            order.quantity || 1
          ]);
        }

        autoTable(doc, {
          head: tableHead,
          body: tableBody,
          startY: yPos,
          styles: { fontSize: 9, cellPadding: 5, halign: "left" },
          headStyles: { fillColor: [20, 83, 45], textColor: 255, fontStyle: "bold" },
          columnStyles: {
            0: { cellWidth: 45 },
            1: { cellWidth: 97 },
            2: { halign: "center", cellWidth: 40 }
          },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          margin: { left: 14, right: 14 }
        });

        doc.save(`Packing_Slip_${orderRef}.pdf`);
      } catch (clientErr) {
        console.error("Client side PDF generation error:", clientErr);
        alert("Failed to generate Packing Slip PDF.");
      }
    }
  };

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
      const term = productSearchTerm.toLowerCase();
      result = result.filter((p) => {
        const pId = (p.product_id || `GO-PRO-${String(p.id).padStart(4, '0')}`).toLowerCase();
        return (
          pId.includes(term) ||
          p.title?.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term)
        );
      });
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

      const res = await api.post(
        `/api/goimomi-product-orders/${shippingOrder.id}/send-shipping-email/`,
        formData
      );

      const updated = res.data.order || res.data;
      setOrders(prev => prev.map(o => o.id === shippingOrder.id ? { ...o, ...updated } : o));
      if (selectedOrder && selectedOrder.id === shippingOrder.id) {
        setSelectedOrder(prev => ({ ...prev, ...updated }));
      }
      setShowShippingModal(false);
      const targetEmail = shippingOrder.email || updated.email || "customer";
      const isSent = res.data.sent;
      if (isSent) {
        setMessage(`Order ${shippingOrder.order_id || shippingOrder.id} marked as Shipped! Notification email sent to ${targetEmail} with CC to hello@goimomi.com & support@goimomi.com.`);
      } else {
        setMessage(`Order ${shippingOrder.order_id || shippingOrder.id} updated to Shipped, but email dispatch reported an issue for ${targetEmail}.`);
      }
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      console.error("Error updating shipping status:", err);
      const errMsg = err.response?.data?.error || err.response?.data?.detail || JSON.stringify(err.response?.data) || "Failed to update shipping status.";
      alert(`Shipping Update Notice: ${errMsg}`);
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
                onClick={handleOpenManualModal}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm font-semibold shadow-xs"
                title="Manually record a product order enquiry or offline sale"
              >
                <Plus size={15} /> Manual Add Order
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
                    placeholder="Search by Product ID (e.g. GO-PRO-0001), title, or description…"
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
                          {["Product ID", "Image", "Title", "Price", "MRP", "Discount", "Qty", "Stock Status", "Actions"].map((h) => (
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
                              <span className="bg-emerald-50 text-emerald-900 font-mono font-bold text-xs px-2.5 py-1 rounded-md border border-emerald-200 shadow-sm inline-block">
                                {product.product_id || `GO-PRO-${String(product.id).padStart(4, '0')}`}
                              </span>
                            </td>
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
                              {(product.catalogue_name || (product.sub_catalogue_details && product.sub_catalogue_details.length > 0) || product.sub_catalogue_name) && (
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                  {product.catalogue_name && (
                                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                                      📁 {product.catalogue_name}
                                    </span>
                                  )}
                                  {product.sub_catalogue_details && product.sub_catalogue_details.length > 0 ? (
                                    product.sub_catalogue_details.map((sub) => (
                                      <span key={sub.id} className="bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                                        🏷️ {sub.name}
                                      </span>
                                    ))
                                  ) : product.sub_catalogue_name ? (
                                    <span className="bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                                      🏷️ {product.sub_catalogue_name}
                                    </span>
                                  ) : null}
                                </div>
                              )}
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
                <button
                  onClick={handleOpenManualModal}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm font-semibold shrink-0 shadow-xs"
                  title="Manually record a new product order"
                >
                  <Plus size={15} /> Add Manual Order
                </button>
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
                              <div className="flex flex-wrap gap-1 mt-1">
                                {order.book_invoice_number && (
                                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-sky-800 bg-sky-50 border border-sky-200 rounded-md">
                                    Book Inv: {order.book_invoice_number}
                                  </span>
                                )}
                                {order.bill_copy && (
                                  <a
                                    href={getMediaUrl(order.bill_copy)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-md transition"
                                    title="Click to open customer shipping bill copy"
                                  >
                                    <FileText size={10} /> Bill Copy
                                  </a>
                                )}
                              </div>
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
                              <div className="flex gap-1.5 justify-center items-center">
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
                                  title="View order details"
                                >
                                  <Eye size={13} /> View
                                </button>
                                <button
                                  onClick={() => handleDownloadOrderPdf(order)}
                                  className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-1 rounded-lg text-xs font-bold transition"
                                  title="Download Order Invoice PDF"
                                >
                                  <Download size={12} /> Invoice
                                </button>
                                <button
                                  onClick={() => handleDownloadPackingSlip(order)}
                                  className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white px-2 py-1 rounded-lg text-xs font-bold transition shadow-sm"
                                  title="Download Package Shipping / Packing Slip PDF"
                                >
                                  <FileText size={12} /> Packing Slip
                                </button>
                                <button
                                  onClick={() => handleCopyOrderDetails(order)}
                                  className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-xs transition"
                                  title="Copy order details to clipboard"
                                >
                                  <Copy size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs transition"
                                  title="Delete order"
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
                <div className="p-4 bg-gradient-to-r from-[#14532d] to-[#1a6b3d] text-white flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200 block">Customer Order Detail</span>
                    <h3 className="text-lg font-black mt-0.5">{selectedOrder.order_id || `#${selectedOrder.id}`}</h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopyOrderDetails(selectedOrder)}
                      className="px-2.5 py-1 bg-white/15 hover:bg-white/25 text-white rounded-md text-xs font-semibold flex items-center gap-1 transition"
                      title="Copy formatted order details"
                    >
                      {copySuccess ? <Check size={12} className="text-emerald-300" /> : <Copy size={12} />}
                      {copySuccess ? "Copied" : "Copy"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadOrderPdf(selectedOrder)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                      title="Download order receipt PDF"
                    >
                      <Download size={12} /> Invoice PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadPackingSlip(selectedOrder)}
                      className="px-2.5 py-1 bg-black hover:bg-gray-900 text-white rounded-md text-xs font-bold flex items-center gap-1 transition shadow-sm border border-white/20"
                      title="Download Package Shipping / Packing Slip PDF"
                    >
                      <FileText size={12} /> Packing Slip
                    </button>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition ml-1"
                      aria-label="Close"
                    >
                      <X size={18} />
                    </button>
                  </div>
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

                  {/* Uploaded Customer Shipping Bill / Receipt Copy Card */}
                  {selectedOrder.bill_copy && (
                    <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <FileText size={14} className="text-emerald-700" /> Saved Customer Shipping Bill / Receipt
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                          Uploaded
                        </span>
                      </h4>

                      <div className="flex items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-2 truncate">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs">
                            📄
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold text-gray-900 truncate" title={selectedOrder.bill_copy.split('/').pop()}>
                              {selectedOrder.bill_copy.split('/').pop()}
                            </p>
                            <p className="text-[10px] text-gray-500 font-medium">Saved Customer Shipping Receipt Copy</p>
                          </div>
                        </div>

                        <a
                          href={getMediaUrl(selectedOrder.bill_copy)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1 shrink-0"
                        >
                          <ExternalLink size={13} /> Open / View Bill Copy
                        </a>
                      </div>

                      {/* Image Thumbnail Preview if image */}
                      {/\.(jpg|jpeg|png|webp|gif)$/i.test(selectedOrder.bill_copy) && (
                        <div className="mt-2 pt-2 border-t border-emerald-200/60">
                          <a
                            href={getMediaUrl(selectedOrder.bill_copy)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group relative rounded-lg overflow-hidden border border-emerald-300 bg-white max-h-48 text-center"
                          >
                            <img
                              src={getMediaUrl(selectedOrder.bill_copy)}
                              alt="Shipping Bill Copy Preview"
                              className="w-full max-h-48 object-contain mx-auto py-1 transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                              <ExternalLink size={14} /> Click to View Full Image
                            </div>
                          </a>
                        </div>
                      )}
                    </div>
                  )}

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
                      type="button"
                      onClick={() => handleDownloadPackingSlip(selectedOrder)}
                      className="px-3 py-1.5 bg-black hover:bg-gray-900 text-white text-xs font-bold rounded-lg transition shadow flex items-center gap-1.5"
                      title="Download Package Shipping / Packing Slip PDF"
                    >
                      <FileText size={13} /> Packing Slip
                    </button>
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

      {/* MANUAL ADD PRODUCT ORDER MODAL */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100 max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-[#14532d] to-[#1a6b3d] text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white">
                  <Plus size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black leading-tight">Manually Add Product Order Details</h3>
                  <p className="text-xs text-emerald-200 mt-0.5">Record offline sales, custom customer enquiries, or backend orders</p>
                </div>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitManualOrder} className="p-6 overflow-y-auto space-y-5 flex-1">
              
              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <User size={14} className="text-emerald-700" /> Customer Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Customer Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Akbar Ali"
                      value={manualForm.name}
                      onChange={(e) => setManualForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +91 9876543210"
                      value={manualForm.phone}
                      onChange={(e) => setManualForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. customer@example.com"
                      value={manualForm.email}
                      onChange={(e) => setManualForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-1">Full Delivery Address *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Enter street, city, state, pincode..."
                      value={manualForm.address}
                      onChange={(e) => setManualForm(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Product & Pricing Information */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Package size={14} className="text-emerald-700" /> Product & Pricing Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-1">Select Product from Catalog *</label>
                    <select
                      value={manualForm.product_id || (manualForm.custom_product_title ? "custom" : "")}
                      onChange={(e) => handleManualProductChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                    >
                      <option value="">-- Choose Product (Or Custom Item) --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          [{p.product_id || `GO-PRO-${String(p.id).padStart(4, '0')}`}] {p.title} - ₹{p.price} ({p.stock_status === "in_stock" ? `Stock: ${p.quantity ?? 1}` : "Out of stock"})
                        </option>
                      ))}
                      <option value="custom">✏️ Enter Custom / Manual Product Title</option>
                    </select>
                  </div>

                  {(!manualForm.product_id || manualForm.custom_product_title) && (
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-bold mb-1">Custom Product Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Zam Zam Water 5L Bottle"
                        value={manualForm.custom_product_title}
                        onChange={(e) => setManualForm(prev => ({ ...prev, custom_product_title: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Quantity *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={manualForm.quantity}
                      onChange={(e) => handleManualQuantityChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Unit Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      step="any"
                      placeholder="e.g. 2400"
                      value={manualForm.price}
                      onChange={(e) => handleManualPriceChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-1">Total Order Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      step="any"
                      placeholder="Auto-calculated (Qty x Price)"
                      value={manualForm.total_amount}
                      onChange={(e) => setManualForm(prev => ({ ...prev, total_amount: e.target.value }))}
                      className="w-full px-3 py-2 bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice & Dispatch Details */}
              <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
                  <Truck size={14} className="text-sky-700" /> Book Invoice & Dispatch Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Initial Order Status *</label>
                    <select
                      value={manualForm.status}
                      onChange={(e) => setManualForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-sky-300 rounded-lg font-bold text-gray-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Pending">Pending</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Book Invoice No. (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. INV/2026/048"
                      value={manualForm.book_invoice_number}
                      onChange={(e) => setManualForm(prev => ({ ...prev, book_invoice_number: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-sky-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">
                      Logistics Provider / Courier {manualForm.status === "Shipped" ? "*" : "(Optional)"}
                    </label>
                    <input
                      type="text"
                      required={manualForm.status === "Shipped"}
                      list="logistics-manual-list"
                      placeholder="e.g. Blue Dart, Delhivery"
                      value={manualForm.logistics_provider}
                      onChange={(e) => setManualForm(prev => ({ ...prev, logistics_provider: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                    <datalist id="logistics-manual-list">
                      {logisticsProviders.map(lp => (
                        <option key={lp.id} value={lp.name} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">
                      Tracking Number {manualForm.status === "Shipped" ? "*" : "(Optional)"}
                    </label>
                    <input
                      type="text"
                      required={manualForm.status === "Shipped"}
                      placeholder="e.g. 1849209123"
                      value={manualForm.tracking_number}
                      onChange={(e) => setManualForm(prev => ({ ...prev, tracking_number: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-sky-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-1">Upload Bill Copy / Shipping Receipt (PDF / Image)</label>
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      onChange={(e) => setManualForm(prev => ({ ...prev, bill_copy: e.target.files[0] }))}
                      className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-100 file:text-sky-800 hover:file:bg-sky-200 cursor-pointer"
                    />
                  </div>

                  {manualForm.status === "Shipped" && manualForm.email && (
                    <div className="md:col-span-2 pt-1">
                      <label className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={manualForm.trigger_shipped_email}
                          onChange={(e) => setManualForm(prev => ({ ...prev, trigger_shipped_email: e.target.checked }))}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                        />
                        Automatically send Shipped notification email to customer ({manualForm.email})
                      </label>
                    </div>
                  )}

                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingManual}
                  className="px-6 py-2.5 bg-[#14532d] hover:bg-[#1a6b3d] text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50 flex items-center gap-2 transition"
                >
                  {submittingManual ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Saving Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={15} /> Save & Add Product Order
                    </>
                  )}
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
