import {useCallback, useEffect, useRef, useState} from "react";
import {getAuthHeaders} from '@/utils/auth';

type Mode = "focus" | "short" | "long";

export const DURATIONS: Record<Mode, number> = {
    focus: 25 * 60,
    short: 5 * 60,
    long: 15 * 60,
};

export type Task = {
    id: string;
    name: string;
    done: boolean;
    seconds: number;
};

// shape returned from the backend
type ServerTask = {
    _id: string;
    name: string;
    completed?: boolean;
    completedTime?: number;
};
export function format(sec: number) {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

function playBeep() {
    try {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        const ctx = new (AC as typeof AudioContext)();
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
            // Audio API not supported or user blocked it, fail silently
    }
}

type User = { email: string; token: string } | null;

const API = import.meta.env.VITE_API_URL;

export function usePomodoro(user: User) {
    const [mode, setMode] = useState<Mode>("focus");
    const [remaining, setRemaining] = useState(DURATIONS.focus);
    const [running, setRunning] = useState(false);
    const [completedFocus, setCompletedFocus] = useState(0);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
    const [taskInput, setTaskInput] = useState("");

    const modeRef = useRef(mode);
    const activeRef = useRef(activeTaskId);
    const tasksRef = useRef(tasks);

    // const API = import.meta.env.VITE_API_URL;

    useEffect(() => { modeRef.current = mode; }, [mode]);
    useEffect(() => { activeRef.current = activeTaskId; }, [activeTaskId]);
    useEffect(() => { tasksRef.current = tasks; }, [tasks]);

    const switchMode = useCallback((m: Mode, autoStart = false) => {
        setMode(m);
        setRemaining(DURATIONS[m]);
        if (autoStart) setTimeout(() => setRunning(true), 500);
    }, []);

    const handleComplete = useCallback(() => {
        playBeep();
        setRunning(false);
        if (modeRef.current === "focus") {
            const next = completedFocus + 1;
            setCompletedFocus(next);
            switchMode(next % 4 === 0 ? "long" : "short", true);
        } else {
            switchMode("focus", true);
        }
    }, [completedFocus, switchMode]);

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user?.token) {
                setTasks([]);
                setActiveTaskId(null);
                return;
            }
            try {
                const response = await fetch(`${API}/api/tasks`, {
                    headers: getAuthHeaders(),
                });

                const data = await response.json();
                const mappedTasks: Task[] = (data as ServerTask[]).map((t) => ({
                    id: t._id,
                    name: t.name,
                    done: !!t.completed,
                    seconds: t.completedTime || 0,
                }));
                setTasks(mappedTasks);
                if (mappedTasks.length > 0) setActiveTaskId(mappedTasks[0].id);
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchTasks();
    }, [user]);


    useEffect(() => {
        if (!running) return;
        const id = setInterval(() => {
            setRemaining((r) => {
                if (r <= 1) { handleComplete(); return 0; }
                return r - 1;
            });
            if (modeRef.current === "focus" && activeRef.current) {
                setTasks((prev) => prev.map((t) => {
                    if (String(t.id) === String(activeRef.current)) {
                        if (t.done) return t;
                        return {...t, seconds: (t.seconds || 0) + 1};
                    }
                    return t;
                }));
            }
        }, 1000);
        return () => clearInterval(id);
    }, [running, handleComplete]);

    useEffect(() => {
        const syncWithBackend = async () => {
            if (!user?.token) return;
            const currentActiveId = activeRef.current;
            if (!currentActiveId) return;
            const currentTask = tasksRef.current.find(
                (t) => String(t.id) === String(currentActiveId)
            );
            if (!currentTask) return;
            try {
                await fetch(`${API}/api/tasks/${currentActiveId}`, {
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
        const heartbeat = setInterval(() => { if (running) syncWithBackend(); }, 10_000);
        return () => clearInterval(heartbeat);
    }, [running, user]);


    function reset() {
        setRunning(false);
        setRemaining(DURATIONS[mode]);
    }

    async function addTask() {
        const name = taskInput.trim();
        if (!name) return;
        if (!user?.token) {
            const localTask: Task = {
                id: crypto.randomUUID(),
                name, done: false, seconds: 0,
            };
            setTasks((ts) => [...ts, localTask]);
            setTaskInput("");
            setActiveTaskId((current) => current ?? localTask.id);
            return;
        }
        try {
            const response = await fetch(`${API}/api/tasks`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({name, completedTime: 0, completed: false}),
            });
            const savedTask = await response.json();
            const mappedTask: Task = {
                id: (savedTask as ServerTask)._id,
                name: savedTask.name,
                done: !!savedTask.completed,
                seconds: savedTask.completedTime || 0,
            };
            setTasks((ts) => [...ts, mappedTask]);
            setTaskInput("");
            setActiveTaskId((current) => current ?? mappedTask.id);
        } catch (error) {
            console.error("Add error:", error);
        }
    }

    async function deleteTask(id: string) {
        setTasks((ts) => ts.filter((t) => t.id !== id));
        if (activeTaskId === id) setActiveTaskId(null);
        if (!user?.token) return;
        try {
            const response = await fetch(`${API}/api/tasks/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (!response.ok) console.error("Failed to delete from database");
        } catch (error) {
            console.error("Delete error:", error);
        }
    }

    async function toggleTask(id: string, checked: boolean) {
        setTasks((prev) => prev.map((task) =>
            task.id === id ? {...task, done: checked} : task
        ));
        if (!user?.token) return;
        try {
            await fetch(`${API}/api/tasks/${id}`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({completed: checked}),
            });
        } catch (err) {
            console.error("Failed to update completion status", err);
        }
    }

    const total = DURATIONS[mode];
    const progress = 1 - remaining / total;
    const radius = 140;
    const circumference = 2 * Math.PI * radius;
    const sessionInCycle = (completedFocus % 4) + (mode === "focus" ? 1 : 0);
    const sessionDisplay = mode === "focus"
        ? Math.min(sessionInCycle, 4)
        : Math.min(completedFocus % 4 || 4, 4);

    return {
        mode, remaining, running, setRunning,
        tasks, activeTaskId, setActiveTaskId,
        taskInput, setTaskInput,
        progress, radius, circumference, sessionDisplay,
        switchMode, reset, addTask, deleteTask, toggleTask,
        MODE_LABEL: { focus: "Focus", short: "Short Break", long: "Long Break" } as Record<Mode, string>,
    };
}
