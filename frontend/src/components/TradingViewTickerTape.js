import { useEffect, useRef } from "react";

const TradingViewTickerTape = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Prevent multiple script injections
    if (document.getElementById("tradingview-ticker-script")) return;

    const script = document.createElement("script");
    script.id = "tradingview-ticker-script";
    script.type = "module";
    script.src = "https://widgets.tradingview-widget.com/w/en/tv-ticker-tape.js";
    script.async = true;

    document.body.appendChild(script);
  }, []);

  return (
    <div
      ref={containerRef}
      className="tradingview-container"
      style={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      <tv-ticker-tape
        symbols="FOREXCOM:SPXUSD,FOREXCOM:NSXUSD,FOREXCOM:DJI,FX:EURUSD,BITSTAMP:BTCUSD,BITSTAMP:ETHUSD,CMCMARKETS:GOLD"
        color-theme="dark"
        locale="en"
      ></tv-ticker-tape>
    </div>
  );
};

export default TradingViewTickerTape;