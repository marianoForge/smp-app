"use client";

import { use, useEffect, useState } from "react";

export default function Users() {
  const [loading, setLoading] = useState(false);

  const fetchDataFromApi = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/v1/users/getUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response) {
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataFromApi();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Users
    </main>
  );
}
