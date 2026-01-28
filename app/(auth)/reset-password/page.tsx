"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft, RotateCw } from "lucide-react";
import Link from "next/link";

// 1. Define your form schema (Email only)
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const ResetPassword = () => {
  // 2. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 3. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Reset link sent to:", values);
  }

  const date = new Date();

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-[#0F172A] overflow-hidden text-white font-sans">
      {/* Background Gradients */}
      {/* Top Left Azure Gradient */}
      <div 
        className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "var(--color-azure-5010, #135BEC1A)" }}
      />
      {/* Bottom Right Blue Gradient */}
      <div 
        className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "var(--color-blue-3410, #312E811A)" }}
      />

      <div className="flex flex-col justify-center items-center gap-8 text-center w-full max-w-md px-4 z-10">
        
        {/* Main Card */}
        <div className="bg-[#1E293B]/50 border border-[#334155] shadow-2xl backdrop-blur-xl rounded-[16px] w-full p-8 md:p-10">
          
          {/* Card Header: Icon + Title + Description */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-[10px] bg-[#1d4ed8]/20 flex items-center justify-center border border-[#1d4ed8]/30">
              <RotateCw className="w-6 h-6 text-[#3b82f6]" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-bold text-2xl tracking-tight text-white">
                Reset your password
              </h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-[320px] mx-auto">
                Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
              </p>
            </div>
          </div>

          {/* Form Section */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel className="text-sm font-medium text-[#CBD5E1] capitalize">Email address</FormLabel>
                    <div className="relative group">
                      <Mail className="w-5 h-5 text-[#64748B] absolute top-2.5 left-3 transition-colors group-focus-within:text-[#94A3B8]" />
                      <FormControl>
                        <Input
                          className="pl-10 bg-[#0F172A] border-[#334155] text-white placeholder:text-[#475569] focus-visible:ring-[#3b82f6] focus-visible:border-[#3b82f6] h-10"
                          placeholder="name@company.com"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-medium h-10 rounded-md transition-all"
              >
                Send recovery link
              </Button>
            </form>
          </Form>

          {/* Back to Login Link */}
          <div className="mt-8 pt-6 border-t border-[#334155]/50">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to log in
            </Link>
          </div>
        </div>

        {/* Footer Copyright */}
        <div className="text-xs text-[#475569]">
          <p>© {date.getFullYear()} ScriptMark AI. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;