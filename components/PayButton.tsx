"use client";
import { closePaymentModal, FlutterWaveButton } from "flutterwave-react-v3";
import React from "react";

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
  if (!amount || !currency || !email || !title || !description || !logoUrl) {
    throw new Error("All required props are missing");
  }
  const config = {
    public_key: "FLWPUBK_TEST-6898a32ce9c41c8d648badabd9a53eb3-X",
    tx_ref: Date.now().toString(),
    amount: amount,
    currency: "RWF",
    payment_options: "ussd",
    customer: {
      email: email,
      phone_number: "070********",
      name: "john doe",
    },
    customizations: {
      title: title,
      description: description,
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };

  const fwConfig = {
    ...config,
    text: `Enroll for ${amount}`,
    callback: (response: any) => {
      console.log("The Flutterwave payment response", response);
      closePaymentModal(); // this will close the modal programmatically
    },
    onClose: () => {},
  };

  return (
    <FlutterWaveButton
      {...fwConfig}
      className="bg-primary text-primary-foreground hover:bg-primary/90 p-3 w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
    />
  );
};

export default PayButton;
