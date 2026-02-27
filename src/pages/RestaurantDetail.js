import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, runTransaction } from "firebase/firestore";

function RestaurantDetail({ vendor, onBack }) {
  const [userRole, setUserRole] = useState("CONSUMER");

  // 1. Fetch the logged-in user's role on mount
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
    // SECURITY: Prevent non-shelters from claiming ₹0 items
    if (item.livePrice === 0 && userRole !== "SHELTER") {
      alert("NGO_ACCESS_ONLY: This item is now reserved for donation.");
      return;
    }

    const itemRef = doc(db, "listings", item.id);
    try {
      await runTransaction(db, async (transaction) => {
        const itemDoc = await transaction.get(itemRef);
        const newQuantity = itemDoc.data().quantity - 1;
        if (newQuantity >= 0) {
          transaction.update(itemRef, { quantity: newQuantity });
        } else {
          throw "ITEM_SOLD_OUT";
        }
      });
      alert(item.livePrice === 0 ? "DONATION_CLAIMED_SUCCESS" : "RESERVATION_SUCCESS");
    } catch (e) {
      alert("ERROR: " + e);
    }
  };

  return (
    <div className="home-container detail-view">
      <nav className="detail-nav">
        <button className="back-pill" onClick={onBack}>← RETURN</button>
      </nav>

      <header className="res-profile">
        <h1 className="res-name-title">{vendor.name}</h1>
      </header>

      <div className="menu-section">
        {vendor.items.map(item => {
          const isDonation = item.livePrice === 0;
          const isShelter = userRole === "SHELTER";

          return (
            <div key={item.id} className={`menu-item-v2 ${isDonation ? 'donation-mode' : ''}`}>
              <div className="item-info">
                <h3>{item.itemName}</h3>
                <div className="price-row">
                  <span className="current-price">₹{item.livePrice}</span>
                  {isDonation && <span className="ngo-tag">NGO_EXCLUSIVE</span>}
                </div>
              </div>

              <button 
                className="action-trigger"
                onClick={() => handleReserve(item)}
                disabled={item.quantity <= 0 || (isDonation && !isShelter)}
              >
                {item.quantity <= 0 ? "SOLD_OUT" : 
                 isDonation ? (isShelter ? "CLAIM_FREE +" : "DONATED") : 
                 "RESERVE +"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RestaurantDetail;