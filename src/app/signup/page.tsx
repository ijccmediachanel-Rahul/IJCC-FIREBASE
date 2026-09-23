
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Loader2, CheckCircle2, ShieldCheck, Mail, KeyRound, Eye, EyeOff } from 'lucide-react';
import { logUserSignupToGoogleSheet, sendSignupOTP, verifySignupOTP } from '@/lib/actions';
import { useAuth } from '@/context/auth-context';

function SignupForm() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/profile';
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.replace(redirectUrl);
    }
  }, [user, authLoading, router, redirectUrl]);

  // 60-second cooldown timer for resending OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSendOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      toast({
        variant: 'destructive',
        title: 'Invalid Email',
        description: 'Please enter a valid email address first.',
      });
      return;
    }

    setSendingOtp(true);
    try {
      const res = await sendSignupOTP(email);
      if (res.success && res.token) {
        setOtpToken(res.token);
        setOtpSent(true);
        setResendCooldown(60);
        toast({
          title: 'OTP Sent!',
          description: `A 6-digit verification code has been sent to ${email.trim()}.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to Send OTP',
          description: res.message || 'Could not send verification email.',
        });
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Something went wrong.',
      });
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.trim().length !== 6) {
      toast({
        variant: 'destructive',
        title: 'Invalid OTP',
        description: 'Please enter the 6-digit code received on your email.',
      });
      return;
    }

    setVerifyingOtp(true);
    try {
      const res = await verifySignupOTP(email, otp, otpToken);
      if (res.success) {
        setEmailVerified(true);
        toast({
          title: 'Email Verified! ✓',
          description: 'Your email has been verified. You can now complete your profile details.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Verification Failed',
          description: res.message || 'Invalid or expired OTP. Please try again.',
        });
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Could not verify OTP.',
      });
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailVerified) {
      toast({
        variant: 'destructive',
        title: 'Email Not Verified',
        description: 'Please verify your email address with OTP before creating your account.',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Passwords do not match.',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Weak Password',
        description: 'Password must be at least 6 characters long.',
      });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Update Auth display name
      try {
        await updateProfile(user, { displayName: fullName.trim() });
      } catch (profileErr) {
        console.warn("Could not update display name in auth profile:", profileErr);
      }

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: fullName.trim(),
        email: user.email,
        phoneNumber: phoneNumber.trim(),
        createdAt: new Date(),
        membershipTier: "none",
        emailVerified: true,
      });

      // Background sync to Google Sheet (non-blocking)
      logUserSignupToGoogleSheet({
        uid: user.uid,
        displayName: fullName.trim(),
        email: user.email || email.trim(),
        phoneNumber: phoneNumber.trim(),
        createdAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        membershipTier: "none",
      }).catch((sheetErr) => console.warn("Google Sheet sync failed:", sheetErr));

      toast({ title: 'Success', description: 'Account created successfully!' });
      window.location.href = redirectUrl;
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: error.message,
      });
      setLoading(false);
    }
  };

  if (authLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container flex min-h-[calc(100vh-200px)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-lg border-border/80">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Create an Account</CardTitle>
          <CardDescription>
            Verify your email with OTP to register with IJCC
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Step 1: Email Address with Send OTP */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="email" className="font-semibold text-sm">
                  Email Address
                </Label>
                {emailVerified && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={emailVerified || sendingOtp}
                    className={emailVerified ? "bg-muted/50 border-emerald-300 text-muted-foreground" : ""}
                    required
                  />
                </div>
                {!emailVerified && (
                  <Button
                    type="button"
                    variant={otpSent ? "secondary" : "default"}
                    onClick={handleSendOtp}
                    disabled={sendingOtp || resendCooldown > 0 || !email}
                    className="whitespace-nowrap shrink-0"
                  >
                    {sendingOtp ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : resendCooldown > 0 ? (
                      `Resend (${resendCooldown}s)`
                    ) : otpSent ? (
                      "Resend OTP"
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* OTP Verification Box */}
            {otpSent && !emailVerified && (
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="otp" className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" />
                    Enter 6-Digit OTP Code
                  </Label>
                  <span className="text-[11px] text-muted-foreground">Valid for 10 mins</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="text-center font-mono text-lg tracking-widest bg-background"
                    autoFocus
                  />
                  <Button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={verifyingOtp || otp.length !== 6}
                    className="min-w-[100px] shrink-0"
                  >
                    {verifyingOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify OTP"}
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground text-center">
                  Check your inbox (or spam folder) for code from IJCC.
                </p>
              </div>
            )}

            {/* Step 2: Full Name, Phone, Password (unlocked after email verification) */}
            <div className={`space-y-4 transition-all duration-300 ${!emailVerified ? "opacity-60 pointer-events-none" : "opacity-100"}`}>
              {!emailVerified && (
                <div className="rounded-lg bg-muted/60 p-2.5 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5 border border-dashed border-border">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>Please verify your email above to continue</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!emailVerified}
                  required={emailVerified}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={!emailVerified}
                  required={emailVerified}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={!emailVerified}
                    className="pr-10"
                    required={emailVerified}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={!emailVerified}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={!emailVerified}
                    className="pr-10"
                    required={emailVerified}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    disabled={!emailVerified}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full rounded-full mt-2"
                disabled={loading || !emailVerified}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm pt-2">
          <p className="text-muted-foreground">Already have an account?&nbsp;</p>
          <Link
            href={redirectUrl && redirectUrl !== '/profile' ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login'}
            className="font-semibold text-primary hover:underline"
          >
            Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
