import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { TPlant } from "../types/plant";

type Props = {
  className?: string;
  placeholder?: string;
};

export default function PlantSearchBox({
  className = "",
  placeholder = "Search plants...",
}: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TPlant[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const apiBaseUrl = import.meta.env.VITE_API_URL; // fallback for dev

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `${apiBaseUrl}/plants/search?q=${encodeURIComponent(query)}&limit=5`
        );
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Search failed", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchResults, 300);
    return () => clearTimeout(delay);
  }, [query, apiBaseUrl]);

  return (
    <div className={`relative ${className}`} style={{ minWidth: 220 }}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
        <FaSearch />
      </div>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-3 py-2 rounded-md bg-white text-black text-sm
                   placeholder-gray-400 focus:outline-none w-full"
      />

      {query && (
        <div className="absolute mt-1 w-full bg-white shadow-lg rounded-md z-50">
          <ul className="max-h-60 overflow-y-auto">
            {loading ? (
              <li className="p-2 text-gray-500 text-sm">Loading...</li>
            ) : results.length > 0 ? (
              results.map((plant) => (
                <li
                  key={plant.id}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`/plants/preview/${plant.id}`)}
                >
                  {plant.imageUrl && (
                    <img
                      src={plant.imageUrl}
                      alt={plant.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                  )}
                  <span className="text-sm text-gray-700">{plant.name}</span>
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500 text-sm">No items found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
