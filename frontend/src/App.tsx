import {useState} from "react";
import Pomodoro from "@/components/Pomodoro.tsx";
import AuthButton from "@/components/AuthButton.tsx";
import Sparkles from "@/components/Sparkles.tsx";

type User = { email: string; token: string };

function App() {
    const [user, setUser] = useState<User | null>(() => {
        try {
            return JSON.parse(localStorage.getItem("user") ?? "null");
        } catch {
            return null;
        }
    });

    return (
        <div className="relative min-h-screen">
            <Sparkles/>
            <div className="absolute top-4 right-4">
                <AuthButton user={user} setUser={setUser}/>
            </div>
            <Pomodoro key={user?.email ?? "guest"} user={user}/>
        </div>
    );
}

export default App;
