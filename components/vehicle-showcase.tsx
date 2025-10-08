"use client";

import { motion } from "framer-motion";

export interface Vehicle {
  model: string;
  trim: string;
  year: number;
  price: number;
  image: string;
  features: string[];
  available: boolean;
}

export const VehicleShowcase = ({ vehicle }: { vehicle: Vehicle }) => {
  return (
    <motion.div
      className="md:max-w-[500px] max-w-[calc(100dvw-80px)] w-full pb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
        <div className="relative h-64 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold text-zinc-300 dark:text-zinc-600">
              {vehicle.model}
            </div>
          </div>
          {vehicle.available && (
            <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Available Now
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {vehicle.year} {vehicle.model}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {vehicle.trim}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Starting at</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                ${vehicle.price.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
              Key Features
            </h4>
            <ul className="space-y-2">
              {vehicle.features.map((feature, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
