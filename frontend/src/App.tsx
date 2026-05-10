import { useState } from "react";
import Pomodoro from "@/components/Pomodoro.tsx";
import AuthButton from "@/components/AuthButton.tsx";

type User = { email: string; token: string };

function App() {
    const [user, setUser] = useState<User | null>(null);

    return (
        <div className="relative min-h-screen">
            <div className="absolute top-4 right-4">
                <AuthButton user={user} setUser={setUser} />
            </div>
            <Pomodoro user={user} />
        </div>
    );
}

export default App;
