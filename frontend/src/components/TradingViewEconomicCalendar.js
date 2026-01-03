import { useEffect, useRef } from "react";

const TradingViewEconomicCalendar = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Prevent multiple script injections
    if (document.getElementById("tradingview-economic-calendar-script")) return;

    const script = document.createElement("script");
    script.id = "tradingview-economic-calendar-script";
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "dark",
      isTransparent: false,
      locale: "en",
      countryFilter: "ar,au,br,ca,cn,fr,de,in,id,it,jp,kr,mx,ru,sa,za,tr,gb,us,eu",
      importanceFilter: "-1,0,1",
      width: 400,
      height: 550
    });

    if (containerRef.current) {
      const widgetContainer = containerRef.current.querySelector('.tradingview-widget-container__widget');
      if (widgetContainer) {
        widgetContainer.appendChild(script);
      }
    }
  }, []);

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a 
          href="https://www.tradingview.com/economic-calendar/" 
          rel="noopener nofollow" 
          target="_blank"
          className="text-blue-400 hover:text-blue-300"
        >
          <span>Economic Calendar</span>
        </a>
        <span className="text-gray-400"> by TradingView</span>
      </div>
    </div>
  );
};

export default TradingViewEconomicCalendar;