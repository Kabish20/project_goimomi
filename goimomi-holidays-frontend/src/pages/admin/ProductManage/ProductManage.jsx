import React, { useState, useEffect } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Plus, Search, Package, RefreshCw, Tag, CheckCircle, XCircle } from "lucide-react";
import AdminSidebar from "../../../components/admin/AdminSidebar/AdminSidebar";
import AdminTopbar from "../../../components/admin/AdminTopbar/AdminTopbar";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

const ProductManage = () => {
  const [products, setProducts]           = useState([]);
  const [filtered, setFiltered]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [message, setMessage]             = useState("");
  const [searchTerm, setSearchTerm]       = useState("");
  const [stockFilter, setStockFilter]     = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/goimomi-products/");
      const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setProducts(data);
      setFiltered(data);
      setError("");
    } catch (err) {
      setError(`Failed to load products: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter whenever search or stock filter changes
  useEffect(() => {
    let result = products;
    if (searchTerm) {
      result = result.filter((p) =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (stockFilter !== "all") {
      result = result.filter((p) => p.stock_status === stockFilter);
    }
    setFiltered(result);
  }, [searchTerm, stockFilter, products]);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/api/goimomi-products/${id}/`);
      setMessage("Product deleted successfully!");
      setDeleteConfirm(null);
      fetchProducts();
    } catch (err) {
      setError("Failed to delete product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStock = async (product) => {
    const newStatus = product.stock_status === "in_stock" ? "out_of_stock" : "in_stock";
    try {
      // Optimistic state update
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, stock_status: newStatus } : p))
      );
      await api.patch(`/api/goimomi-products/${product.id}/`, { stock_status: newStatus });
      setMessage(`"${product.title}" status updated to ${newStatus === "in_stock" ? "Active" : "Inactive"}!`);
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      // Revert if API request fails
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, stock_status: product.stock_status } : p))
      );
      setError("Failed to update status.");
      setTimeout(() => setError(""), 2000);
    }
  };


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
                Manage Products
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">{products.length} total product{products.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchProducts}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2 text-sm"
              >
                <RefreshCw size={15} /> Refresh
              </button>
              <button
                onClick={() => navigate("/admin/products/add")}
                id="add-product-btn"
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

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex gap-4 flex-wrap items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="product-search"
                type="text"
                placeholder="Search by title or description…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              id="product-stock-filter"
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-700"
            >
              <option value="all">All Stock Status</option>
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-gray-500">
                <RefreshCw size={28} className="animate-spin mr-3 text-green-600" /> Loading products…
              </div>
            ) : filtered.length === 0 ? (
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
                    {filtered.map((product) => (
                      <tr key={product.id} className="hover:bg-green-50 transition-colors">
                        {/* Image */}
                        <td className="px-5 py-3">
                          {product.image ? (
                            <img src={product.image} alt={product.title} className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package size={20} className="text-gray-400" />
                            </div>
                          )}
                        </td>
                        {/* Title */}
                        <td className="px-5 py-3">
                          <p className="font-semibold text-gray-800 text-sm">{product.title}</p>
                          <p className="text-xs text-gray-400 line-clamp-1 max-w-[180px]">{product.description}</p>
                        </td>
                        {/* Price */}
                        <td className="px-5 py-3 font-bold text-green-700 text-sm">{formatCurrency(product.price)}</td>
                        {/* MRP */}
                        <td className="px-5 py-3 text-sm text-gray-500 line-through">{formatCurrency(product.mrp)}</td>
                        {/* Discount */}
                        <td className="px-5 py-3">
                          {product.discount_percent > 0 ? (
                            <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                              <Tag size={10} /> {product.discount_percent}% OFF
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        {/* Qty */}
                        <td className="px-5 py-3 text-sm font-medium text-gray-700">{product.quantity}</td>
                        {/* Stock Status */}
                        <td className="px-5 py-3">
                          <button
                            onClick={() => handleToggleStock(product)}
                            title="Click to Toggle Status (Active / Inactive)"
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border transition-all duration-150 active:scale-95 cursor-pointer select-none ${
                              product.stock_status === "in_stock"
                                ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                : "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                            }`}
                          >
                            {product.stock_status === "in_stock" ? (
                              <><CheckCircle size={11} /> Active</>
                            ) : (
                              <><XCircle size={11} /> Inactive</>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                              id={`edit-product-${product.id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(product)}
                              id={`delete-product-${product.id}`}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 size={15} />
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

        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Product?</h3>
            <p className="text-sm text-gray-500 mb-6">
              "<strong>{deleteConfirm.title}</strong>" will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                id={`confirm-delete-${deleteConfirm.id}`}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition"
              >
                {loading ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManage;
