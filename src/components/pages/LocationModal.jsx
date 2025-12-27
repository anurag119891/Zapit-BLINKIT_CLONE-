import React, { useEffect, useState, useCallback } from "react";
import { X, MapPin, Search, Navigation, Loader2, MapPinned } from "lucide-react";
import "../css/LocationModal.css";

export default function LocationModal({ open, onClose, onSelectLocation }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY;

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  useEffect(() => {
    if (open) {
      setInput("");
      setSuggestions([]);
    }
  }, [open]);

  const fetchPredictions = useCallback(
    debounce(async (query) => {
      if (!query || query.length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await fetch(
          `https://api.locationiq.com/v1/autocomplete?key=${API_KEY}&q=${query}&limit=5&dedupe=1`
        );
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        }
      } catch (error) {
        console.error("Location Error:", error);
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchPredictions(input);
  }, [input, fetchPredictions]);

  const handleSelect = (item) => {
    onSelectLocation({
      formatted_address: item.display_name,
      lat: item.lat,
      lng: item.lon,
      city: item.address?.city || item.address?.town || item.address?.village,
      state: item.address?.state,
    });
    onClose();
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const response = await fetch(
            `https://us1.locationiq.com/v1/reverse?key=${API_KEY}&lat=${latitude}&lon=${longitude}&format=json`
          );
          if (response.ok) {
            const data = await response.json();
            onSelectLocation({
              formatted_address: data.display_name,
              lat: latitude,
              lng: longitude,
              city: data.address?.city || data.address?.town || data.address?.village,
              state: data.address?.state,
            });
            onClose();
          }
        } catch (error) {
          alert("Could not fetch location details.");
        } finally {
          setLoading(false);
        }
      },
      () => setLoading(false)
    );
  };

  if (!open) return null;

  return (
    <div className="loc-overlay" onMouseDown={onClose}>
      <div className="loc-card" onMouseDown={(e) => e.stopPropagation()}>
        <div className="loc-card-header">
          <div className="loc-header-main">
            <MapPinned size={22} className="text-teal" />
            <h3>Select Delivery Location</h3>
          </div>
          <button className="loc-card-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="loc-card-body">
          <div className="loc-input-wrapper">
            <Search size={18} className="loc-search-icon" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search for area, street, or landmark..."
              autoFocus
            />
          </div>

          <button 
            className={`loc-current-btn ${loading ? 'loading' : ''}`} 
            onClick={useCurrentLocation}
            disabled={loading}
          >
            {loading ? <Loader2 className="spinner" /> : <Navigation size={18} />}
            <span>{loading ? "Detecting location..." : "Use Current Location"}</span>
          </button>

          <div className="loc-divider">
            <span>{input.length >= 3 ? "Search Results" : "Suggestions"}</span>
          </div>

          <div className="loc-results-list">
            {suggestions.length > 0 ? (
              suggestions.map((s, index) => (
                <div key={index} className="loc-item" onClick={() => handleSelect(s)}>
                  <div className="loc-item-icon">
                    <MapPin size={18} />
                  </div>
                  <div className="loc-item-text">
                    <span className="loc-main-text">{s.display_name.split(",")[0]}</span>
                    <span className="loc-sub-text">{s.display_name.split(",").slice(1).join(", ")}</span>
                  </div>
                </div>
              ))
            ) : (
              input.length < 3 && (
                <div className="loc-empty">
                  <p>Start typing to find your address</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}