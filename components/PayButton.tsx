"use client";

import React from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";

interface PayButtonProps {
  amount: number | undefined;
  currency: string | undefined;
  email: string | undefined;
  title: string | undefined;
  description: string;
  logoUrl: string;
}

const PayButton = ({
  amount,
  currency,
  email,
  title,
  description,
  logoUrl,
}: PayButtonProps) => {
  const router = useRouter();
  const formatRWF = (amount: number) => {
    return new Intl.NumberFormat("rw-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0, // RWF does not use decimal cents
    }).format(amount);
  };
  if (!amount || !currency || !email || !title || !description || !logoUrl) {
    throw new Error("All required props are missing");
  }

  const handlePay = async () => {
    try {
      const response = await axios.post("/api/paycourse", {
        amount,
        currency,
        email,
        title,
        description,
        logoUrl,
      });

      console.log("Payment successful", response.data);
      const redirectUrl = response.data.meta.authorization.redirect;
      console.log("URL FOR USER PAYMENT", redirectUrl);
      router.push(redirectUrl);
    } catch (error) {
      console.log("Error handling payment request", error);
    }
  };

  const handleWebHooks = async () => {
    try {
      const response = await axios.post("/api/webhook", {
        amount,
        currency,
        email,
        title,
        description,
        logoUrl,
      });
      console.log("Webhooks set up successfully", response.data);
    } catch {
      console.log("Webhooks set up failed");
    }
  };

  return (
    <Button onClick={handlePay} className="w-full">
      Enroll for {formatRWF(amount)}
    </Button>
  );
};

export default PayButton;
