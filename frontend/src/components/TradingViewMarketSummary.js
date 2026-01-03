import { useEffect, useRef } from "react";

const TradingViewMarketSummary = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Prevent multiple script injections
    if (document.getElementById("tradingview-market-summary-script")) return;

    const script = document.createElement("script");
    script.id = "tradingview-market-summary-script";
    script.type = "module";
    script.src = "https://widgets.tradingview-widget.com/w/en/tv-market-summary.js";
    script.async = true;

    document.body.appendChild(script);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      <tv-market-summary
        direction="horizontal"
        color-theme="dark"
        locale="en"
      ></tv-market-summary>
    </div>
  );
};

export default TradingViewMarketSummary;