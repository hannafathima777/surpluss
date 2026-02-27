import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, runTransaction } from "firebase/firestore";
import PickupTicket from "../pages/PickupTicket"; 
import "./Home.css"; 

function RestaurantDetail({ vendor, onBack }) {
  const [userRole, setUserRole] = useState("CONSUMER");
  const [activeTicket, setActiveTicket] = useState(null);
  
  // Track which item is currently being reserved
  const [reservingId, setReservingId] = useState(null); 
  // Track which items were successfully reserved in this session
  const [sessionReserved, setSessionReserved] = useState([]);

  useEffect(() => {
    const fetchRole = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      }
    };
    fetchRole();
  }, []);

  const handleReserve = async (item) => {
    // 1. Prevent double clicks or unauthorized claims
    if (reservingId) return;
    
    if (item.livePrice === 0 && userRole !== "SHELTER") {
      alert("NGO_ACCESS_ONLY: This item is now reserved for donation.");
      return;
    }

    setReservingId(item.id); // Set local "processing" state

    const itemRef = doc(db, "listings", item.id);
    try {
      await runTransaction(db, async (transaction) => {
        const itemDoc = await transaction.get(itemRef);
        if (!itemDoc.exists()) throw "OFFER_EXPIRED";

        const newQuantity = itemDoc.data().quantity - 1;
        if (newQuantity >= 0) {
          transaction.update(itemRef, { quantity: newQuantity });
        } else {
          throw "ITEM_SOLD_OUT";
        }
      });

      // 2. Add to session history to show "RESERVED" message on button
      setSessionReserved(prev => [...prev, item.id]);

      // SUCCESS: Generate the digital ticket
      setActiveTicket({
        id: item.id + "-" + Math.random().toString(36).substring(2, 7).toUpperCase(),
        itemName: item.itemName,
        price: item.livePrice,
        vendorName: vendor.name
      });

    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      setReservingId(null); // Clear processing state
    }
  };

  return (
    <div className="home-container detail-view">
      <nav className="detail-nav">
        <button className="back-pill" onClick={onBack}>← RETURN_TO_FEED</button>
        <span className="nav-id">RES_ID: {vendor.id.slice(0, 6)}</span>
      </nav>

      <header className="res-profile">
        <div className="category-pill">{vendor.category}</div>
        <h1 className="res-name-title">{vendor.name}</h1>
        <div className="res-stats">
          <div className="stat-block">
             <span className="label">PICKUP_ZONE</span>
             <span className="value">{vendor.location}</span>
          </div>
          <div className="stat-block">
             <span className="label">ROLE_STATUS</span>
             <span className="value">{userRole}</span>
          </div>
        </div>
      </header>

      <div className="line thick" style={{backgroundColor: 'black', height: '6px', margin: '1.5rem 0'}}></div>

      <section className="menu-section">
        <h3 className="section-header">ACTIVE_SURPLUS_BUNDLES</h3>
        
        {vendor.items.map(item => {
          const isDonation = item.livePrice === 0;
          const isShelter = userRole === "SHELTER";
          const isProcessing = reservingId === item.id;
          const hasJustReserved = sessionReserved.includes(item.id);

          return (
            <div key={item.id} className={`menu-item-v2 ${isDonation ? 'donation-mode' : ''} ${item.quantity === 0 ? 'sold-out' : ''}`}>
              <div className="item-info">
                <div className="item-header-row">
                  <h3>{item.itemName}</h3>
                  <span className="qty-counter">{item.quantity} LEFT</span>
                </div>
                
                <p className="item-subtext">COLLECTION_WINDOW: {item.pickupTime}</p>

                <div className="price-row">
                  <span className="current-price">₹{item.livePrice}</span>
                  {isDonation && <span className="ngo-tag">NGO_EXCLUSIVE</span>}
                </div>
              </div>

              {/* DYNAMIC BUTTON LOGIC */}
              <button 
                className={`action-trigger ${hasJustReserved ? 'status-success' : ''}`}
                onClick={() => handleReserve(item)}
                disabled={item.quantity <= 0 || (isDonation && !isShelter) || isProcessing || hasJustReserved}
              >
                {item.quantity <= 0 ? "SOLD_OUT" : 
                 isProcessing ? "PROCESSING..." : 
                 hasJustReserved ? "✓ RESERVED" :
                 isDonation ? (isShelter ? "CLAIM_FREE +" : "DONATED") : 
                 "RESERVE +"}
              </button>
            </div>
          );
        })}
      </section>

      {/* SUCCESS MODAL */}
      {activeTicket && (
        <div className="qr-overlay">
          <div className="auth-card qr-modal">
            <div className="system-tag">RESERVATION_CONFIRMED</div>
            <PickupTicket reservation={activeTicket} />
            <button 
              className="auth-submit" 
              onClick={() => setActiveTicket(null)}
            >
              CLOSE_TICKET
            </button>
          </div>
        </div>
      )}

      <footer className="detail-footer">
        <p>RESERVATION SECURES LIVE PRICE FOR 30 MINUTES</p>
      </footer>
    </div>
  );
}

export default RestaurantDetail;