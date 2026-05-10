import {useEffect, useRef, useState, type SetStateAction, useCallback} from "react";
import {Button} from '@/components/ui/button';
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import {Play, Pause, RotateCcw, Trash2, Plus} from "lucide-react";
import {cn} from "@/lib/utils";
import {Toaster} from "@/components/ui/sonner";
import { getAuthHeaders } from '@/utils/auth';

type Mode = "focus" | "short" | "long";

const DURATIONS: Record<Mode, number> = {
    focus: 25 * 60,
    short: 5 * 60,
    long: 15 * 60,
};

const MODE_LABEL: Record<Mode, string> = {
    focus: "Focus",
    short: "Short Break",
    long: "Long Break",
};

type Task = {
    id: string;
    name: string;
    done: boolean;
    seconds: number;
};

function format(sec: number) {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

function playBeep() {
    try {
        const AC = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AC();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = 880;
        o.connect(g);
        g.connect(ctx.destination);
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
        o.start();
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
        o.stop(ctx.currentTime + 0.65);
    } catch {
    }
}

type Props = {
    user: { email: string; token: string } | null;
}

function Pomodoro( { user } : Props ) {
    const [mode, setMode] = useState<Mode>("focus");
    const [remaining, setRemaining] = useState(DURATIONS.focus);
    const [running, setRunning] = useState(false);
    const [completedFocus, setCompletedFocus] = useState(0); // count of completed focus sessions
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
    const [taskInput, setTaskInput] = useState("");

    const modeRef = useRef(mode);
    const activeRef = useRef(activeTaskId);
    const tasksRef = useRef(tasks);

    // Fetch tasks from the backend
    const fetchTasks = useCallback(async () => {
        if (!user?.token) return;
        try {
            const response = await fetch('http://localhost:4000/api/tasks', {
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            const mappedTasks = data.map((t: any) => ({
                id: t._id,
                name: t.name,
                done: t.completed,
                seconds: t.completedTime || 0,
            }));
            setTasks(mappedTasks);
            if (mappedTasks.length > 0) setActiveTaskId(mappedTasks[0].id);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }, [user]); // O

    // Fetch tasks when user logs in or out
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]); // Depends on fetchTasks, not user directly

    useEffect(() => {
        modeRef.current = mode;
    }, [mode]);

    useEffect(() => {
        activeRef.current = activeTaskId;
    }, [activeTaskId]);

    useEffect(() => {
        tasksRef.current = tasks;
    }, [tasks]);

    useEffect(() => {
        if (!running) return;

        const id = setInterval(() => {
            setRemaining((r) => {
                if (r <= 1) {
                    handleComplete();
                    return 0;
                }
                return r - 1;
            });

            if (modeRef.current === "focus" && activeRef.current) {
                setTasks((prevTasks) =>
                    prevTasks.map((t) => {
                        if (String(t.id) === String(activeRef.current)) {
                            if (t.done) return t; // Stop counting if task is finished!
                            return {...t, seconds: (t.seconds || 0) + 1};
                        }
                        return t;
                    })
                );
            }
        }, 1000);

        return () => clearInterval(id)
    }, [running, activeTaskId]);

    useEffect(() => {
        const syncWithBackend = async () => {
            if (!user?.token) return;        // ← anonymous, skip
            const currentActiveId = activeRef.current;
            if (!currentActiveId) return;

            const currentTask = tasksRef.current.find(
                (t) => String(t.id) === String(currentActiveId)
            );
            if (!currentTask) return;

            try {
                await fetch(`http://localhost:4000/api/tasks/${currentActiveId}`, {
                    method: 'PATCH',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({
                        completedTime: currentTask.seconds,
                        completed: currentTask.done,
                    }),
                });
            } catch (err) {
                console.error("Sync failed:", err);
            }
        };

        if (!running) syncWithBackend();

        const heartbeat = setInterval(() => {
            if (running) syncWithBackend();
        }, 10_000);

        return () => clearInterval(heartbeat);
    }, [running, user]);

    function handleComplete() {
        playBeep();
        setRunning(false);
        if (modeRef.current === "focus") {
            const next = completedFocus + 1;
            setCompletedFocus(next);
            const nextMode: Mode = next % 4 === 0 ? "long" : "short";
            switchMode(nextMode, true);
        } else {
            switchMode("focus", true);
        }
    }

    function switchMode(m: Mode, autoStart = false) {
        setMode(m);
        setRemaining(DURATIONS[m]);
        if (autoStart) setTimeout(() => setRunning(true), 500);
    }

    function reset() {
        setRunning(false);
        setRemaining(DURATIONS[mode]);
    }

    async function addTask() {
        const name = taskInput.trim();
        if (!name) return;

        if (!user?.token) {
            // anonymous — local only
            const localTask: Task = {
                id: crypto.randomUUID(),
                name,
                done: false,
                seconds: 0,
            };
            setTasks((ts) => [...ts, localTask]);
            setTaskInput("");
            setActiveTaskId((current) => current ?? localTask.id);
            return;
        }

        // Authenticated — save to backend
        try {
            const response = await fetch('http://localhost:4000/api/tasks', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({name, completedTime: 0, completed: false}),
            });
            const savedTask = await response.json();
            console.log("status:", response.status);
            console.log("savedTask:", savedTask);
            const mappedTask: Task = {
                id: savedTask._id,
                name: savedTask.name,
                done: savedTask.completed,
                seconds: savedTask.completedTime || 0
            };
            setTasks((ts) => [...ts, mappedTask]);
            setTaskInput("");
            if (!activeTaskId) setActiveTaskId(mappedTask.id);
        } catch (error) {
            console.error("Add error:", error);
        }
    }

    async function deleteTask(id: string) {
        setTasks((ts) => ts.filter((t) => t.id !== id));
        if (activeTaskId === id) setActiveTaskId(null);

        if (!user?.token) return; // Anonymous — local only, no fetch needed

        try {
            const response = await fetch(`http://localhost:4000/api/tasks/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

            if (response.ok) {
                setTasks((ts) => ts.filter((t) => t.id !== id));
                if (activeTaskId === id) setActiveTaskId(null);
                console.log("deleting id:", id);
            } else {
                console.error("Failed to delete from database");
                console.log("Failed deleting id:", id);
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    }

    const total = DURATIONS[mode];
    const progress = 1 - remaining / total;
    const radius = 140;
    const circumference = 2 * Math.PI * radius;
    const sessionInCycle = (completedFocus % 4) + (mode === "focus" ? 1 : 0);
    const sessionDisplay = mode === "focus" ? Math.min(sessionInCycle, 4) : Math.min(completedFocus % 4 || 4, 4);

    return (
        <main className="min-h-screen flex flex-col items-center bg-background text-foreground font-sans px-4 py-10">
            <Toaster/>
            <h1 className="text-2xl font-semibold tracking-tight mb-8">
                My<span className="text-primary">Pomodoro</span>
            </h1>
            {/* Mode tabs */}
            <div className="flex gap-1 p-1 rounded-full bg-card mb-8">
                {(["focus", "short", "long"] as Mode[]).map((m) => (
                    <button key={m} onClick={() => {
                        setRunning(false);
                        switchMode(m);
                    }} className={cn(
                        "px-4 py-1.5 text-sm rounded-full transition-colors",
                        mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                    )}>
                        {MODE_LABEL[m]}
                    </button>
                ))}
            </div>

            {/* Circular timer */}
            <div className="relative w-[320px] h-80 flex items-center justify-center rounded-full">
                <svg className="absolute inset-0 -rotate-90" width="320" height="320" viewBox="0 0 320 320">
                    <circle cx="160" cy="160" r={radius} stroke="var(--color-border)" strokeWidth="10" fill="none"/>
                    <circle cx="160" cy="160" r={radius} stroke="var(--color-primary)" strokeWidth="10" fill="none"
                            strokeLinecap="round" strokeDasharray={circumference}
                            strokeDashoffset={circumference * (1 - progress)}
                            style={{transition: "stroke-dashoffset 1s linear"}}/>
                </svg>
                <div className="flex flex-col items-center">
                    <span
                        className="text-6xl font-mono font-light tabular-nums tracking-tight">{format(remaining)}</span>
                    <span
                        className="text-sm text-muted-foreground mt-2 uppercase tracking-widest">{MODE_LABEL[mode]}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3 mt-8">
                <Button size="lg" onClick={() => setRunning((r) => !r)} className="rounded-full px-8">
                    {running ? <><Pause className="w-4 h-4 mr-2"/>Pause</> : <><Play className="w-4 h-4 mr-2"/>Start</>}
                </Button>
                <Button size="lg" variant="secondary" onClick={reset} className="rounded-full px-6">
                    <RotateCcw className="w-4 h-4 mr-2"/>Reset
                </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
                Session {Math.max(1, sessionDisplay)} of 4 </p>

            {/* Tasks */}
            <section className="w-full max-w-md mt-12">
                <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-3">Tasks</h2>
                <div className="flex gap-2 mb-4">
                    <Input value={taskInput} onChange={(e: {
                        target: { value: SetStateAction<string>; };
                    }) => setTaskInput(e.target.value)}
                           onKeyDown={(e: { key: string; }) => e.key === "Enter" && addTask()}
                           placeholder="What are you working on?" className="bg-card border-border"
                           aria-label="New task name"/>
                    <Button onClick={addTask} className="rounded-md">
                        <Plus className="w-4 h-4 mr-1"/>Add
                    </Button>
                </div>

                <ul className="space-y-2">
                    {tasks.map((t) => (
                        <li key={t.id} onClick={() => setActiveTaskId(t.id)} className={cn(
                            "group flex items-center gap-3 px-4 py-3 rounded-lg bg-card border border-transparent cursor-pointer transition-all",
                            activeTaskId === t.id && "border-primary shadow-[0_0_0_1px_var(--color-primary)]",
                        )}>
                            <Checkbox checked={t.done} onCheckedChange={async (checked) => {
                                // Update UI immediately
                                setTasks((prev) => prev.map((task) =>
                                    task.id === t.id ? {...task, done: !!checked} : task
                                ));

                                // Tell the database it's completed
                                try {
                                    await fetch(`http://localhost:4000/api/tasks/${t.id}`, {
                                        method: 'PATCH',
                                        headers: {'Content-Type': 'application/json'},
                                        body: JSON.stringify({completed: !!checked})
                                    });
                                } catch (err) {
                                    console.error("Failed to update completion status", err);
                                }
                            }} onClick={(e) => e.stopPropagation()} // Prevents changing the active task
                            />
                            <span className={cn("flex-1 text-sm", t.done && "line-through text-muted-foreground")}>
                {t.name}
              </span>
                            <span className="text-xs font-mono text-muted-foreground tabular-nums">
                {format(t.seconds)}
              </span>
                            <button onClick={(e) => {
                                e.stopPropagation();
                                deleteTask(t.id);
                            }}
                                    className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                    aria-label="Delete task">
                                <Trash2 className="w-4 h-4"/>
                            </button>
                        </li>
                    ))}
                    {tasks.length === 0 && (
                        <li className="text-center text-sm text-muted-foreground py-6">
                            No tasks yet. Add one to start tracking focus time. </li>
                    )}
                </ul>
            </section>
        </main>
    )
}

export default Pomodoro;
