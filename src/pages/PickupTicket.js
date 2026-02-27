import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const PickupTicket = ({ reservation }) => {
  // reservation object contains: id, itemName, price, vendorName
  
  return (
    <div className="ticket-card">
      <div className="ticket-header">
        <span className="system-status">SECURE VOUCHER</span>
      </div>
      
      <div className="qr-wrapper">
        <QRCodeSVG 
          value={JSON.stringify({
            id: reservation.id,
            item: reservation.itemName,
            vendor: reservation.vendorName
          })} 
          size={180}
          level={"H"} // High error correction (works even if screen is cracked)
          includeMargin={true}
        />
      </div>

      <div className="ticket-info">
        <div className="info-row">
          <span className="info-label">ORDER ID: </span>
          <span className="info-value">#{reservation.id.slice(0, 8)}</span>
        </div>
        <div className="info-row">
          <span className="info-label">ITEM: </span>
          <span className="info-value">{reservation.itemName}</span>
        </div>
        <div className="info-row price-row">
          <span className="info-label">AMOUNT DUE: </span>
          <span className="info-value">₹{reservation.price}</span>
        </div>
      </div>
      
      <div className="ticket-footer">
        PRESENT AT COUNTER FOR SCAN
      </div>
    </div>
  );
};

export default PickupTicket;