import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import RestaurantDetail from "./RestaurantDetail";
import "./Home.css";

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [, setTick] = useState(0);

  const calculateDecayPrice = (originalSurplusPrice, pickupTime) => {
    if (!pickupTime) return originalSurplusPrice;
    const now = new Date();
    const [hours, minutes] = pickupTime.split(':');
    const target = new Date();
    target.setHours(parseInt(hours), parseInt(minutes), 0);

    const diffInMins = (target - now) / (1000 * 60);
    let finalPrice = parseFloat(originalSurplusPrice);

    if (diffInMins <= 0) return 0; // Transition to Donation Mode
    if (diffInMins < 30) finalPrice = finalPrice * 0.5;
    else if (diffInMins < 60) finalPrice = finalPrice * 0.8;

    return Math.round(finalPrice);
  };

  useEffect(() => {
    const q = query(collection(db, "listings"), where("quantity", ">", 0));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const itemData = doc.data();
        return { 
          id: doc.id, 
          ...itemData, 
          livePrice: calculateDecayPrice(itemData.surplusPrice, itemData.pickupTime) 
        };
      });

      const grouped = data.reduce((acc, item) => {
        if (!acc[item.vendorId]) {
          acc[item.vendorId] = { 
            id: item.vendorId,
            name: item.vendorName || "LOCAL_ESTABLISHMENT", 
            category: item.category || "GENERAL",
            location: item.location || "KOCHI, KERALA",
            image: item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
            items: [] 
          };
        }
        acc[item.vendorId].items.push(item);
        return acc;
      }, {});
      setRestaurants(Object.values(grouped));
    });

    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => { unsubscribe(); clearInterval(timer); };
  }, []);

  if (selectedVendor) return <RestaurantDetail vendor={selectedVendor} onBack={() => setSelectedVendor(null)} />;

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-meta"><span>SURPLUS_OS_v2.0</span><span>KOCHI_NODE</span></div>
        <h1 className="main-logo">SURPLUS<br/>SAVER</h1>
        <div className="location-strip"><span className="location-dot"></span> LIVE_IN: {restaurants[0]?.location || "KOCHI"}</div>
      </header>

      <main className="restaurant-grid">
        {restaurants.map(res => {
          const activeItems = res.items.filter(i => i.livePrice > 0);
          const donationItems = res.items.filter(i => i.livePrice === 0);
          const displayPrice = activeItems.length > 0 ? Math.min(...activeItems.map(i => i.livePrice)) : 0;

          return (
            <div key={res.id} className="res-card-v2" onClick={() => setSelectedVendor(res)}>
              <div className="res-visual" style={{ backgroundImage: `url(${res.image})` }}>
                <span className="res-category-tag">{res.category}</span>
                {donationItems.length > 0 && <span className="donation-active-badge">DONATION_ACTIVE</span>}
              </div>
              <div className="res-details">
                <div className="res-title-row"><h2>{res.name}</h2><span className="arrow-icon">↗</span></div>
                <div className="res-meta-row">
                  <span className="offer-count">{activeItems.length} OFFERS</span>
                  <span className="dist-tag">{res.location}</span>
                </div>
                <div className="price-decay-strip">
                  <span className="live-label">STARTING_AT:</span>
                  <span className="current-price">₹{displayPrice === 0 ? "FREE" : displayPrice}</span>
                  <span className="flash-icon">{displayPrice === 0 ? "♥" : "⚡"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
export default Home;