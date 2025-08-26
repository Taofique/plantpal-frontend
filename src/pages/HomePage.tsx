// src/pages/HomePage.tsx
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { getPublicPlants } from "../api/plantService";
import type { TPlant } from "../types/plant";
import type { Variants } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      // nice staggered entrance
      staggerChildren: 0.06,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const, // 👈 fixes the type error
    },
  },
};

function SkeletonCard() {
  return (
    <div
      className="mb-6 break-inside-avoid rounded-2xl overflow-hidden shadow-sm bg-gradient-to-br from-green-50 to-green-100 animate-pulse"
      style={{ contentVisibility: "auto" as any }}
    >
      <div className="w-full bg-neutral-100" style={{ aspectRatio: "4/3" }} />
      <div className="p-4">
        <div className="h-4 w-2/3 bg-green-200 rounded" />
      </div>
    </div>
  );
}

function PlantCard({ plant }: { plant: TPlant }) {
  const [loaded, setLoaded] = useState(false);

  const src = plant.imageUrl || "/placeholder-plant.png";
  const alt = plant.name ? `Photo of ${plant.name}` : "Plant photo";

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      className="group mb-6 break-inside-avoid rounded-2xl overflow-hidden shadow-[0_6px_24px_-12px_rgba(16,185,129,0.45)] bg-white relative"
      style={{ willChange: "transform", contentVisibility: "auto" as any }}
    >
      {/* Image wrapper gives a soft background so 'contain' looks intentional */}
      <div className="relative bg-neutral-100">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={[
            "w-full h-auto object-contain block",
            // blur-up effect
            loaded ? "opacity-100 blur-0" : "opacity-80 blur-[4px]",
            "transition-all duration-500 ease-out",
          ].join(" ")}
        />
        {/* Soft radial glow for aesthetics */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(1200px 200px at 50% 100%, rgba(16,185,129,0.25), transparent)",
          }}
        />
        {/* Bottom gradient name plate */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="p-4">
            <div
              className="rounded-xl px-3 py-1.5 bg-gradient-to-r from-green-600/80 to-emerald-500/80 text-white text-sm font-semibold 
                            backdrop-blur-sm shadow-md group-hover:shadow-lg transition-shadow"
            >
              {plant.name}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function HomePage() {
  const [plants, setPlants] = useState<TPlant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getPublicPlants();
        if (alive) setPlants(data);
      } catch (error) {
        console.error("Failed to fetch plants", error);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Optional: shuffle once for a dynamic masonry feel
  const shuffled = useMemo(() => {
    if (!plants?.length) return [];
    return [...plants].sort(() => Math.random() - 0.5);
  }, [plants]);

  return (
    <div className="relative min-h-screen">
      {/* Subtle page background gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(240,253,244,1) 0%, rgba(236,253,245,1) 35%, rgba(255,255,255,1) 100%)",
        }}
      />

      {/* Page header (optional) */}
      <header className="px-4 sm:px-6 lg:px-8 pt-8 pb-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-green-800 tracking-tight">
          Explore Plants
        </h1>
        <p className="mt-2 text-green-700/80">
          A curated gallery of beautiful greenery
        </p>
      </header>

      {/* Masonry columns container */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="px-4 sm:px-6 lg:px-8 pb-12"
      >
        {/* Masonry via CSS columns */}
        <div className="mx-auto max-w-6xl columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : shuffled.map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
        </div>
      </motion.section>
    </div>
  );
}
