import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const VendorScanner = () => {
  const [scannedData, setScannedData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = (result) => {
    if (result && result[0]?.rawValue) {
      try {
        const data = JSON.parse(result[0].rawValue);
        setScannedData(data);
      } catch (err) {
        console.error("Invalid QR Format");
      }
    }
  };

  const confirmPickup = async () => {
    setLoading(true);
    try {
      // Use the ID from the QR to mark the item as 'collected' in Firebase
      const listingRef = doc(db, "listings", scannedData.id.split('-')[0]); 
      await updateDoc(listingRef, { status: "COLLECTED" });
      
      alert("SUCCESS: Food Handed Over!");
      setScannedData(null);
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="scanner-container">
      {!scannedData ? (
        <div className="camera-view">
          <Scanner 
            onScan={handleScan} 
            constraints={{ facingMode: 'environment' }} // Force Back Camera
          />
          <div className="scanner-overlay"></div>
        </div>
      ) : (
        <div className="verification-card">
          <h3>VERIFY_PICKUP</h3>
          <p><strong>ITEM:</strong> {scannedData.item}</p>
          <p><strong>VENDOR:</strong> {scannedData.vendor}</p>
          <button onClick={confirmPickup} disabled={loading} className="confirm-btn">
            {loading ? "PROCESSING..." : "CONFIRM_COLLECTION ↗"}
          </button>
          <button onClick={() => setScannedData(null)} className="cancel-btn">RESCAN</button>
        </div>
      )}
    </div>
  );
};

export default VendorScanner;