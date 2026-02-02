"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
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
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // 1. Define your form schema
  const formSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(5, {
      message: "Password must be at least 5 characters.",
    }),
  });
  // 2. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });


  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false, // Important: prevent auto redirect to handle errors
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        return;
      }

      toast.success("Logged in successfully");
      router.push("/"); // Redirect to dashboard
      router.refresh(); // Ensure server components update
    } catch (error) {
      console.error("Login error:", error); // Now it is used
      toast.error("Something went wrong");
    }
  }

  const date = new Date();

  return (
    <div className="flex justify-center items-center min-h-screen text-white">
      <div className="flex flex-col justify-center items-center gap-8 text-center">
        <div className="flex flex-col justify-center items-center">
          <Image src="/images/logo.svg" alt="logo" width={48} height={48} />
          <h3 className="font-bold lg:text-2xl text-xl tracking-[-0.6px]">
            PassMark Admin
          </h3>
          <p className="text-sm text-[#94A3B8]">
            Admin Dashboard Authentication
          </p>
        </div>
        <div className="border border-[#1E293B] shadow-2xl backdrop-blur-sm rounded-[16px] w-full md:w-[400px] h-[426px] p-[33px]">
          <div className="flex flex-col gap-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <div className="relative">
                        <Mail className="w-5 h-6 text-[#64748B] absolute top-[11px] left-[11px]" />
                        <FormControl>
                          <Input
                            className="pl-10"
                            placeholder="admin@scriptmark.ai"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      {/* This component handles the error message display automatically */}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <LockKeyhole className="w-5 h-6 text-[#64748B] absolute top-[11px] left-[11px]" />
                        <div
                          onClick={() => setShowPassword(!showPassword)}
                          className="w-5 h-6 text-[#64748B] absolute top-[11px] right-[11px] cursor-pointer"
                        >
                          {showPassword ? <Eye /> : <EyeOff />}
                        </div>
                        <FormControl>
                          <Input
                            className="px-10"
                            type={showPassword ? "text" : "password"}
                            placeholder="******"
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
                  className="w-full bg-[#135BEC] hover:bg-[#135becf2] border border-[#00000000] h-[46px] text-sm font-semibold"
                >
                  Sign In
                </Button>
              </form>
            </Form>
          </div>
        </div>
        <div className="flex flex-col text-xs text-[#475569]">
          <p>© {date.getFullYear()} ScriptMark AI. All rights reserved.</p>
          <div className="flex justify-center items-center gap-1">
            <Link href="/login">Privacy Policy</Link>·
            <Link href="/login">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
