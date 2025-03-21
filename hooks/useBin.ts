import { useEffect } from "react";
import { useBinStore } from "../store/useBinStore";

export const useBins = () => {
  const { bins, loadBins } = useBinStore();

  useEffect(() => {
    loadBins();
  }, []);

  return bins;
};

export const useCollectorBins = (collectorId: string) => {
  const { collectorBins, loadCollectorBins } = useBinStore();

  useEffect(() => {
    if (collectorId) loadCollectorBins(collectorId);
  }, [collectorId]);

  return collectorBins;
};
