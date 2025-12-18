import React, { useEffect, useMemo, useState } from "react";
import { BASE_URL } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setOrders } from "../../store/orderSlice";
import { Link } from "react-router-dom"
import Products from "../Products/Products";
import axios from "axios";
import "./Dashboard.css";

const STATUS_OPTIONS = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

function inr(n) {
  try {
    return Number(n).toLocaleString("en-IN", { style: "currency", currency: "INR" });
  } catch {
    return `₹${n}`;
  }
}

function formatDate(d) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d || "—";
  }
}

const Dashboard = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);
  const [status, setStatus] = useState("All")
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // for status change spinner

  console.log(orders)

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/admin/dashboard`, { withCredentials: true });
      dispatch(setOrders(res?.data?.data || []));
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

const onChangeStatus = async (orderId, newStatus) => {
  const previousOrders = [...orders];
  const updatedOrders = orders.map((o) =>
    o.orderId === orderId ? { ...o, orderStatus: newStatus } : o
  );
  dispatch(setOrders(updatedOrders));
  setUpdatingId(orderId);

  try {
    const res = await axios.patch(
      `${BASE_URL}/admin/${orderId}/${newStatus}`,
      {},
      { withCredentials: true }
    );

    if (!res?.data?.success) {
      dispatch(setOrders(previousOrders)); 
    }
  } catch (err) {
    console.log(err);
    dispatch(setOrders(previousOrders)); 
  } finally {
    setUpdatingId(null);
  }
};


  const totalCount = useMemo(() => orders?.length || 0, [orders]);
  const totalRevenue = useMemo(
    () => (orders || []).reduce((acc, o) => acc + (o?.totalAmount || 0), 0),
    [orders]
  );


  const filteredOrders = status === "All" ? orders : orders.filter((order) => order.orderStatus.toLowerCase() === status.toLowerCase())

  return (
    <div className="dashboard">
      <div className="dashboard-head">
        <div>
          <h1>Noor-e-Chandani — Admin Dashboard</h1>
          <p className="muted">Latest orders with inline status update</p>
        </div>
        <div className="summary-cards">
          <div className="summary-card">
            <div className="sc-title">Total Orders</div>
            <div className="sc-value">{totalCount}</div>
          </div>
          <div className="summary-card">
            <div className="sc-title">Revenue</div>
            <div className="sc-value">{inr(totalRevenue)}</div>
          </div>
        </div>
        <div>
          <Link to="/products">
            <button>Products</button>
          </Link>
        </div>
        <div>
          <select value={status} className="option-btn" onChange={(e) => setStatus(e.target.value)}>
              <option value="All">All orders</option>
              {STATUS_OPTIONS.map((status, index) => {
                return (
                  <option key={index} value={status}>
                    {status}
                  </option>
                )
              })} 
          </select>
        </div>
      </div>

      <div className="dashboard-orders">
        {loading ? (
          <div className="loader">Loading orders…</div>
        ) : !orders || orders.length === 0 ? (
          <div className="empty">No orders found.</div>
        ) : (
          filteredOrders.map((order) => {
            const addr = order?.shippingAddress || {};
            return (<div className="order-container" key={order._id}>
            <hr />
              <div  className="order-card">
            
                <div className="order-card__head">
                  <div className="id-line">
                    <span className="mono"> Order Id - #{order.orderId || "—"}</span>
                    <span className="tag"> Payment Status - {order.paymentStatus || "—"}</span>
                  </div>
                  <div className="time-line">Placed: {formatDate(order.createdAt)}</div>
                </div>

                <div className="order-grid">
                  <div className="og-col">
                    <div className="og-label">Customer</div>
                    <div className="og-value">
                      {addr?.fullName || "—"}
                      <div className="sub mono">{addr?.phone || "—"}</div>
                    </div>
                  </div>

                  <div className="og-col">
                    <div className="og-label">User ID</div>
                    <div className="og-value mono">{order.userId || "—"}</div>
                  </div>

                  <div className="og-col">
                    <div className="og-label">Address</div>
                    <div className="og-value">
                      {addr?.street ? `${addr.street}, ` : ""}
                      {addr?.city ? `${addr.city}, ` : ""}
                      {addr?.state ? `${addr.state}, ` : ""}
                      {addr?.pincode ? `${addr.pincode}, ` : ""}
                      {addr?.country || ""}
                    </div>
                  </div>

                  <div className="og-col">
                    <div className="og-label">Total</div>
                    <div className="og-value">{inr(order.totalAmount)}</div>
                  </div>

                  <div className="og-col">
                    <div className="og-label">Order Status</div>
                    <div className="og-value">
                      <select
                        className="status-select"
                        value={order.orderStatus}
                        onChange={(e) => onChangeStatus(order.orderId, e.target.value)}
                        disabled={updatingId === order.orderId}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} > 
                            {s}
                          </option>
                        ))}
                      </select>
                      {updatingId === order.orderId && <span className="tiny muted">&nbsp;Updating…</span>}
                    </div>
                  </div>
                </div>

                <div className="items">
                  {(order.items || []).map((it) => (
                    <div key={it._id} className="item">
                      <div className="info">
                        <div className="name">{it.name}</div>
                        {it.color && <div className="product-color">Colour: {it.color}</div> }
                        <div className="meta">
                          <span className="mono">x{it.quantity}</span>
                          <span>·</span>
                          <span>{inr(it.price)}</span>
                          <span>·</span>
                          
                        </div>
                        {it.customDetails.isCustom && ( <>
                          <p>Glass Type: {it.customDetails.glassType}</p>
                          <p>Wax: {it.customDetails.waxType}</p>
                       { it.customDetails.messageType !== "none" &&  <p>Message Type: {it.customDetails.messageType}</p>   }
                        { it.customDetails.messageText !== "" &&  <p>Message Text: {it.customDetails.messageText}</p> }
                         { it.customDetails.layers !== "" && <p>Layers: {it.customDetails.layers}</p> }
                        { it.customDetails.layer1Color !== "" &&  <p>Top Layer colour: {it.customDetails.layer1Color}</p> }
                       { it.customDetails.layer2Color !== "" &&   <p>Bottom Layer colour: {it.customDetails.layer2Color}</p> }
                         { it.customDetails.fragrance !== "" &&   <p>Fragrance: {it.customDetails.fragrance}</p> }

                       </> )}
                      </div>
                      <div className="line-total mono">{inr((it.price || 0) * (it.quantity || 0))}</div>
                    </div>
                  ))}
                </div>
            </div> 
            </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Dashboard;
