"use client";
import React from "react";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import { Button } from "@/components/ui/button";

const PayPage = () => {
  const config = {
    public_key: "FLWPUBK_TEST-6898a32ce9c41c8d648badabd9a53eb3-X",
    tx_ref: Date.now().toString(),
    amount: 1000,
    currency: "RWF",
    payment_options: "mobilemoney,ussd, card",
    customer: {
      email: "icaleb130@gmail.com",
      phone_number: "0781347661",
      name: "john doe",
    },
    customizations: {
      title: "My store",
      description: "Payment for items in cart",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };

  const fwConfig = {
    ...config,
    text: "Pay me nigga",
    callback: (response: any) => {
      console.log(response);
      closePaymentModal(); // this will close the modal programmatically
    },
    onClose: () => {},
  };
  return (
    <div>
      <FlutterWaveButton {...fwConfig} className="p-3 bg-orange-500" />
    </div>
  );
};

export default PayPage;
