import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

type User = {
    email: string;
    token: string;
};

type Props = {
    user: User | null;
    setUser: (user: User | null) => void;
}

export default function AuthButton({user, setUser}: Props ) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const API = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();  // ← stops page reload
        if (!email.trim() || password.trim().length < 6) return;

        setLoading(true);
        try {
            const endpoint = mode === "signin" ? "signin" : "signup";

            const response = await fetch(`${API}/api/users/${endpoint}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password}),
            });

            const data = await response.json();
            if (!response.ok) {
                return console.error(data.error || "Authentication failed");
            }

            localStorage.setItem('user', JSON.stringify({ email: data.email, token: data.token }));
            setUser({ email: data.email || email, token: data.token });
            setOpen(false);
            setEmail("");
            setPassword("");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user'); // Clear user from localStorage
        setUser(null);
    };

    if (user) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{user.email}</span>
                <Button variant="outline" size="lg" className="text-gray-300 hover:text-white" onClick={handleLogout}>
                    Sign Out
                </Button>
            </div>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="text-gray-300 hover:text-white">
                    Sign In
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{mode === "signin" ? "Sign in" : "Create account"}</DialogTitle>
                    <DialogDescription>
                        {mode === "signin"
                            ? "Welcome back. Enter your credentials."
                            : "Sign up with your email and a password."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                               autoComplete="email" aria-labelledby="email"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required minLength={6} value={password}
                               onChange={(e) => setPassword(e.target.value)}
                               autoComplete={mode === "signin" ? "current-password" : "new-password"}
                               aria-labelledby="password"/>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Sign up"}
                    </Button>
                </form>
                <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                        className="text-sm text-muted-foreground hover:text-foreground text-center w-full">
                    {mode === "signin"
                        ? "Don't have an account? Sign up"
                        : "Already have an account? Sign in"}
                </button>
            </DialogContent>
        </Dialog>
    );
}
