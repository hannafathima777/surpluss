import "./Home.css";

function Home() {
  const surplusItems = [
    { id: 1, shop: "RESTAURANT A", item: "PASTA BOX", price: "$3", time: "11:00 PM" },
    { id: 2, shop: "BAKERY B", item: "PASTRY BAG", price: "$2", time: "10:30 PM" },
  ];

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>SURPLUS SAVER</h1>
        <span>[MAP VIEW]</span>
      </header>

      <div className="line thick"></div>
      
      <div className="feed">
        {surplusItems.map(item => (
          <div key={item.id} className="item-card">
            <div className="item-details">
              <span className="shop-name">{item.shop}</span>
              <h2>{item.item}</h2>
              <p>COLLECT BY: {item.time}</p>
            </div>
            <button className="reserve-btn">
              {item.price} <br/> RESERVE
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;