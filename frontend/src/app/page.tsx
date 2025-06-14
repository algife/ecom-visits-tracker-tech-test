"use client"
import { useEffect } from "react";
import VisitsTracker from "../components/ui/VisitsTracker";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030/api/v1";

export default function Home() {

  const warmUpApi = async () => {
    const response = await fetch(`${API_URL}/ping`);
    if (!response.ok) {
      throw new Error('API Not available');
    }
    const data = await response.json();

    return data;
  }

  useEffect(() => {
    warmUpApi();
  });


  return (
    <VisitsTracker />
  );
}
