import { useState, useEffect } from "react";
import { getPublicPlants } from "../api/plantService";
import type { TPlant } from "../types/plant";

export default function HomePage() {
  const [plants, setPlants] = useState<TPlant[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPublicPlants();
        setPlants(data);
      } catch (error) {
        console.error("Failed to fetch plants", error);
      }
    })();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
      {plants.map((plant) => (
        <div
          key={plant.id}
          className="w-full max-w-xs bg-gradient-to-br from-green-100 to to-green-200 rounded-xl shadow-lg overflow-hidden hover:scale-105 transition"
        >
          <img
            src={plant.imageUrl}
            alt={plant.name}
            className="w-full h-48 object-cover"
          />

          <div className="p-4 text-center">
            <h3 className="text-lg font-semibold text-green-800">
              {plant.name}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
