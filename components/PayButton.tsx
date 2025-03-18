"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Define the form schema with Zod
// Add preprocessing to remove whitespace from the phone number
const formSchema = z.object({
  phoneNumber: z
    .string()
    .transform((value) => value.replace(/\s+/g, "")) // Remove all whitespace
    .pipe(
      z
        .string()
        .regex(
          /^\+250\d{9}$/,
          "Phone number must start with +250 followed by 9 digits"
        )
    ),
});

// Update the PayButtonProps interface to make all props optional with default values
interface PayButtonProps {
  amount?: number;
  currency?: string;
  email?: string;
  title?: string;
  description?: string;
  logoUrl?: string;
}

const PayButton = ({
  amount = 5000,
  currency = "RWF",
  email = "user@example.com",
  title = "Course Enrollment",
  description = "Enroll in this course",
  logoUrl = "/placeholder.svg?height=50&width=50",
}: PayButtonProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const formatRWF = (amount: number) => {
    return new Intl.NumberFormat("rw-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0, // RWF does not use decimal cents
    }).format(amount);
  };

  const handlePay = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      // Clean the phone number (remove whitespace) and remove the + symbol
      const cleanPhoneNumber = values.phoneNumber.replace("+", "");

      const response = await axios.post("/api/paycourse", {
        amount,
        currency,
        email,
        title,
        description,
        logoUrl,
        phoneNumber: cleanPhoneNumber, // Send without the + symbol
      });

      console.log("Payment successful", response.data);
      const redirectUrl = response.data.meta.authorization.redirect;
      console.log("URL FOR USER PAYMENT", redirectUrl);
      router.push(redirectUrl);
    } catch (error) {
      console.log("Error handling payment request", error);
    } finally {
      setLoading(false);
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
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Enroll for {formatRWF(amount)}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pay with Mobile Money</DialogTitle>
          <DialogDescription>
            Enter your phone number to pay for the course
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handlePay)} className="space-y-6">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+250 781 234 567" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your Rwandan phone number starting with +250 followed
                    by 9 digits. Spaces are allowed (e.g., +250 781 234 567).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ${formatRWF(amount)}`
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PayButton;
