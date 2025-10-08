"use client";

import { motion } from "framer-motion";

export interface ComparisonData {
  models: string[];
  categories: {
    name: string;
    specs: string[];
  }[];
}

export const ComparisonView = ({ data }: { data: ComparisonData }) => {
  return (
    <div className="md:max-w-[500px] max-w-[calc(100dvw-80px)] w-full pb-6">
      <motion.div
        className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900">
                <th className="text-left p-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Feature
                </th>
                {data.models.map((model, index) => (
                  <th
                    key={index}
                    className="text-left p-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                  >
                    {model}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.categories.map((category, catIndex) => (
                <>
                  <tr key={`cat-${catIndex}`} className="border-t border-zinc-200 dark:border-zinc-700">
                    <td
                      colSpan={data.models.length + 1}
                      className="p-3 text-xs font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900"
                    >
                      {category.name}
                    </td>
                  </tr>
                  {category.specs.map((_, specIndex) => (
                    <motion.tr
                      key={`spec-${catIndex}-${specIndex}`}
                      className="border-t border-zinc-100 dark:border-zinc-800"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.05 * (catIndex + specIndex) }}
                    >
                      <td className="p-3 text-sm text-zinc-600 dark:text-zinc-400">
                        {category.specs[specIndex]}
                      </td>
                      {data.models.map((_, modelIndex) => (
                        <td
                          key={modelIndex}
                          className="p-3 text-sm text-zinc-900 dark:text-zinc-100"
                        >
                          <span className="text-green-600 dark:text-green-400">✓</span>
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
