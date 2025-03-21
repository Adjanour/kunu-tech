// BinMonitor.tsx
import React, { useEffect } from "react";
import { useCollectorStore } from "@/store/useCollectorStore";

const BinMonitor = () => {
  const { bins, updateBinFillLevel } = useCollectorStore();

  useEffect(() => {
    const monitorBins = async () => {
      for (const bin of bins) {
        if (bin.fillLevelPercentage !== undefined && bin.fillLevelPercentage >= 100) {
          await updateBinFillLevel(bin.id, bin.fillLevelPercentage);
        }
      }
    };

    monitorBins();
  }, [bins]);

  return null; // This component runs in the background
};

export default BinMonitor;