"use client";

import { motion } from "framer-motion";
import { Camera, ImageIcon } from "lucide-react";

type Props = {
  destination?: string;
  heroImageQuery?: string;
  galleryQueries?: string[];
};

export default function DestinationGallery({
  destination,
}: Props) {
  const placeholders = [
    "Main Attraction",
    "Local Food",
    "City View",
    "Hidden Gem",
  ];

  return (
    <section className="space-y-5">

      <div className="flex items-center gap-2">
        <Camera className="text-cyan-400" size={18} />
        <h2 className="text-xl font-semibold">
          Destination Gallery
        </h2>
      </div>

      {/* Hero */}

      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: .25 }}
        className="
          relative
          h-80
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-gradient-to-br
          from-cyan-500/20
          via-slate-900
          to-black
        "
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">

          <ImageIcon
            className="mb-4 text-cyan-400"
            size={48}
          />

          <h3 className="text-2xl font-bold">
            {destination}
          </h3>

          <p className="mt-2 text-slate-400">
            Hero image will appear here
          </p>

        </div>
      </motion.div>

      {/* Gallery */}

      <div className="grid grid-cols-2 gap-4">

        {placeholders.map((item, index) => (
          <motion.div
            key={item}
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: index * .08,
            }}
            whileHover={{
              y: -4,
            }}
            className="
              h-40
              rounded-2xl
              border
              border-white/10
              bg-white/5
              backdrop-blur-xl
              flex
              flex-col
              items-center
              justify-center
            "
          >
            <ImageIcon
              className="mb-3 text-cyan-400"
              size={28}
            />

            <p className="font-medium">
              {item}
            </p>

            <span className="mt-1 text-xs text-slate-500">
              Coming Soon
            </span>

          </motion.div>
        ))}

      </div>

    </section>
  );
}