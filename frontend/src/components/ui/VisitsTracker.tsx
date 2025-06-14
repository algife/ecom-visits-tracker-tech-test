"use client"
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToastContainer, type ToastProps } from "@/components/ui/toast";
import CountryStats from "@/models/CountryStats";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { SpotlightText } from "./spotlight-text";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030/api/v1";
const POLLING_INTERVAL = 1500; // 1.5 seconds
const PAUSE_DURATION = 1000; // 1 second in milliseconds

// Generate unique IDs for toasts
const generateId = () => Math.random().toString(36).substr(2, 9);

export default function VisitsTracker() {
  const [stats, setStats] = useState<CountryStats>({});
  const [countryCode, setCountryCode] = useState("");
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const pauseUntilRef = useRef<number>(0);
  const lastErrorRef = useRef<number>(0);
  const [isManualSubmit, setIsManualSubmit] = useState<boolean>();

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    const newToast: ToastProps = {
      id: generateId(),
      message,
      type
    };
    setToasts(current => [...current, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(current => current.filter(toast => toast.id !== id));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    setIsManualSubmit(true);
    e.preventDefault();
    if (!countryCode) {
      addToast('Please enter a country code', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/stats?countryCode=${countryCode}`, {
        method: 'POST',
      });

      if (response.ok) {
        addToast(`Visit from ${countryCode} recorded successfully!`, 'success');
        setCountryCode(""); // Reset input after submission
      } else {
        const error = await response.json();
        addToast(error.message || 'Failed to record visit', 'error');
      }
    } catch (error) {
      console.error('Error submitting country code:', error);
      addToast('Failed to connect to the server', 'error');
    } finally {
      setIsManualSubmit(false);
      await fetchStats(); // Force refresh stats immediately
    }
  }, [addToast, countryCode]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (value.length <= 2) { // Limit to 2 characters
      setCountryCode(value);
    }
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setStats(data);
      return data;
    } catch (error) {
      console.error('Error fetching stats:', error);

      // Only show toast for manual fetches (not polling)
      if (isManualSubmit) {
        addToast('Failed to fetch current statistics', 'error');
      }
      // Handle polling errors with pause logic
      else {
        const now = Date.now();
        // Only pause if this is a new error (not within last second)
        if (now - lastErrorRef.current > 1000) {
          pauseUntilRef.current = now + PAUSE_DURATION;
          lastErrorRef.current = now;
          console.log(`Polling paused until ${new Date(pauseUntilRef.current).toLocaleTimeString()}`);
        }
      }

      return stats;
    }
  };

  useEffect(() => {
    fetchStats(); // Initial fetch with manual flag

    // Set up auto polling
    const interval = setInterval(() => {
      fetchStats(); // Pass false to indicate this is a polling fetch
    }, POLLING_INTERVAL);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []); // Only run on mount

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-4xl mx-auto p-4"
      >
        <div className="mt-8 mb-4">
          <SpotlightText title={"Visit Tracker Demo"} subtitle={"made by Alexandre Giménez for Hypromotion"} />
        </div>

        <div className="mb-8 mt-8">
          <PlaceholdersAndVanishInput
            placeholders={["US", "GB", "FR", "DE", "ES", "IT"]}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            value={countryCode}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>Visits</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(stats).length > 0 ? (
              Object.entries(stats).map(([country, visits]) => (
                <TableRow key={country}>
                  <TableCell>{country.toUpperCase()}</TableCell>
                  <TableCell>{visits}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>-</TableCell>
                <TableCell>0</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>
    </>
  );
}