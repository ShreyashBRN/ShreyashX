"use client";

import { OtpInput, type OtpVariant } from "@/components/otp-input";

const variants: OtpVariant[] = ["classic", "underline", "pill", "filled"];

export default function OtpInputPreview() {
  return <OtpInput variants={variants} />;
}