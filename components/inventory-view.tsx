"use client";

import { motion } from "framer-motion";
import { Vehicle } from "./vehicle-showcase";

export const InventoryView = ({ vehicles }: { vehicles: Vehicle[] }) => {
  return (
    <div className="md:max-w-[500px] max-w-[calc(100dvw-80px)] w-full pb-6">
      <div className="flex flex-col gap-3">
        {vehicles.map((vehicle, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 hover:border-green-600 dark:hover:border-green-400 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {vehicle.year} {vehicle.model}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  {vehicle.trim}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    vehicle.available
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-300'
                  }`}>
                    {vehicle.available ? 'In Stock' : 'Order Only'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  ${vehicle.price.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
