'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Car} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useToast} from '@/hooks/use-toast';
import {supabase} from '@/lib/supabase';
import {isAdmin} from "@/lib/utils";

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {toast} = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const {data, error} = await supabase.auth.signInWithPassword({
                email,
                password,
            });


            if (isAdmin(data.user)) {
                console.log('Пользователь — администратор!')
            }

            console.log({data})

            if (error) {
                throw error;
            }

            if (data.session) {
                router.push('/admin');
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md">
                <div className="bg-white px-8 py-12 shadow-xl rounded-lg">
                    <div className="flex justify-center mb-8">
                        <Car className="h-12 w-12 text-blue-700"/>
                    </div>

                    <h1 className="text-2xl font-bold text-center mb-8">
                        Admin Login
                    </h1>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}