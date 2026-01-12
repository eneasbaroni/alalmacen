import { useEffect, useState } from "react";

interface UserData {
  _id: string;
  email: string;
  name?: string;
  points: number;
  role: string;
  dni?: number;
  prizes: unknown[];
  createdAt: string;
  updatedAt: string;
}

export function useUser(email?: string | null) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    if (!email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `/api/user?email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUser(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [email]);

  return { user, loading, error, refetch: fetchUser };
}
