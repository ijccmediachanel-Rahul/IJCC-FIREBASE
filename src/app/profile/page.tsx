
"use client";

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { doc, getDoc, setDoc, updateDoc, DocumentData } from 'firebase/firestore';
import { updateProfile, User } from "firebase/auth";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [profileData, setProfileData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [name, setName] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const fetchProfileData = useCallback(async (currentUser: User) => {
    setLoading(true);
    try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            setProfileData(data);
            setName(data.displayName || currentUser.displayName || '');
        } else {
            // If doc doesn't exist (e.g., user signed up but doc creation failed), create it.
            const initialData = {
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName || '',
                photoURL: currentUser.photoURL || null,
                createdAt: new Date(),
                membershipTier: "none",
            };
            await setDoc(userDocRef, initialData);
            setProfileData(initialData);
            setName(initialData.displayName);
            console.log("Created user document for the first time.");
        }
    } catch (error) {
        console.error("Failed to fetch or create profile data:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load profile data.' });
        // Fallback to auth data to prevent crashing UI
        setProfileData({ email: currentUser.email });
        setName(currentUser.displayName || '');
    } finally {
        setLoading(false);
    }
  }, [toast]);


  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchProfileData(user);
    }
  }, [user, fetchProfileData]);

  
  const updateUserProfile = async (userId: string, dataToUpdate: Partial<DocumentData>) => {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, dataToUpdate);
  
      if (auth.currentUser) {
          const authUpdateData: { displayName?: string } = {};
          if (dataToUpdate.displayName) {
            authUpdateData.displayName = dataToUpdate.displayName;
          }
          if (Object.keys(authUpdateData).length > 0) {
            await updateProfile(auth.currentUser, authUpdateData);
          }
      }
  };


  const handleUpdateProfile = async () => {
    if (!user) return;
    setUpdating(true);

    try {
        const updatedData: {displayName: string;} = {
            displayName: name,
        };

        await updateUserProfile(user.uid, updatedData);
        
        // Optimistically update local state to reflect changes immediately
        setProfileData(prev => ({...prev, ...updatedData}));
        
        toast({ title: 'Success', description: 'Profile updated successfully!' });

    } catch (error: any) {
        console.error("Profile update failed:", error);
         toast({
            variant: "destructive",
            title: "Update Failed",
            description: "An unexpected error occurred while updating your profile.",
        });
    } finally {
        setUpdating(false);
    }
  };


  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Success', description: 'Logged out successfully!' });
      router.push('/login');
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };
  
  if (authLoading || loading || !user || !profileData) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return user?.email?.charAt(0).toUpperCase() || 'U';
    const nameParts = name.split(' ');
    if (nameParts.length > 1 && nameParts[1]) {
        return nameParts[0].charAt(0) + nameParts[1].charAt(0);
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="container py-12">
       <div className="mx-auto max-w-lg">
          <Card>
            <CardHeader className="items-center text-center">
                <div className="relative">
                    <Avatar className="h-24 w-24 mb-4 text-3xl">
                        <AvatarImage src={profileData?.photoURL || undefined} alt={name || 'User'} />
                        <AvatarFallback>{getInitials(name)}</AvatarFallback>
                    </Avatar>
                </div>
                <CardTitle className="font-headline text-3xl">Profile</CardTitle>
                <CardDescription>Your personal account details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Your Name"
                  />
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="font-semibold">{user.email}</p>
                </div>
                {profileData && profileData.createdAt && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Joined On</p>
                    <p className="font-semibold text-sm">
                      {(() => {
                        const val = profileData.createdAt;
                        try {
                          if (val && typeof val.toDate === "function") {
                            return val.toDate().toLocaleDateString();
                          }
                          const d = new Date(val);
                          if (!isNaN(d.getTime())) {
                            return d.toLocaleDateString();
                          }
                          return String(val);
                        } catch {
                          return "";
                        }
                      })()}
                    </p>
                  </div>
                )}
                {profileData && profileData.membershipTier && (
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Membership Status</p>
                        <p className="font-semibold text-sm capitalize">{profileData.membershipTier}</p>
                    </div>
                )}
                 <Button onClick={handleUpdateProfile} className="w-full" disabled={updating}>
                    {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </CardContent>
            <CardFooter>
                 <Button onClick={handleLogout} className="w-null" variant="outline">
                    Logout
                </Button>
            </CardFooter>
          </Card>
       </div>
    </div>
  );
}
