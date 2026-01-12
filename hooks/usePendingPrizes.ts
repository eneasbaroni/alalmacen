import { useEffect, useState } from "react";

export function usePendingPrizes(userEmail?: string | null) {
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) {
      setPendingCount(0);
      setLoading(false);
      return;
    }

    const fetchPendingPrizes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/transactions/pending-count", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail }),
        });

        if (!response.ok) {
          throw new Error("Error fetching pending prizes");
        }

        const data = await response.json();
        setPendingCount(data.count || 0);
      } catch (error) {
        console.error("Error fetching pending prizes:", error);
        setPendingCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPrizes();
  }, [userEmail]);

  return { pendingCount, loading };
}
