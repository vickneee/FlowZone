import {type FormEvent, useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription, DialogTrigger,
} from "@/components/ui/dialog";
// import { toast } from "sonner";
// import {LogOut} from "lucide-react";

type User = {
    email: string;
};

export default function AuthButton() {
    const [user, setUser] = useState<User | null>(null);
    // const [session, setSession] = useState<Session | null>(null);
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading] = useState(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email.trim() || password.trim().length < 3) return;
        setUser({email: email.trim()});
        setOpen(false);
        setEmail("");
        setPassword("");
    };

    const handleLogout = () => {
        setUser(null);
    };

    if (user) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{user.email}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                    Sign Out
                </Button>
            </div>
        );
    }

    return (
        <>
            <Button size="lg" onClick={() => setOpen(true)}>Sign In</Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
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
                                <Input id="email" type="email" required value={email}
                                       onChange={(e) => setEmail(e.target.value)} autoComplete="email"
                                       aria-labelledby="email"/>
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
                </DialogTrigger>
            </Dialog>
        </>
    );
}
