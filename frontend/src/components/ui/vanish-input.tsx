"use client";

import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import { useState } from "react";

export function PlaceholdersAndVanishInputDemo() {
  const [inputValue, setInputValue] = useState("");
  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
    setInputValue(""); // Clear input after submission
  };
  return (
    <div className="h-[40rem] flex flex-col justify-center  items-center px-4">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
        value={inputValue}
      />
    </div>
  );
}
