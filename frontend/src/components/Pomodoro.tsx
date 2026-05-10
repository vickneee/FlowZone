import {type SetStateAction} from "react";
import {Button} from '@/components/ui/button';
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import {Play, Pause, RotateCcw, Trash2, Plus} from "lucide-react";
import {cn} from "@/lib/utils";
import {Toaster} from "@/components/ui/sonner";
import {usePomodoro, format} from '@/hooks/usePomodoro';

type Props = {
    user: { email: string; token: string } | null;
}

function Pomodoro({user}: Props) {
    const {
        mode, remaining, running, setRunning,
        tasks, activeTaskId, setActiveTaskId,
        taskInput, setTaskInput,
        progress, radius, circumference, sessionDisplay,
        switchMode, reset, addTask, deleteTask, toggleTask,
        MODE_LABEL,
    } = usePomodoro(user);

    return (
        <main className="min-h-screen flex flex-col items-center bg-background text-foreground font-sans px-4 py-10">
            <Toaster/>
            <h1 style={{fontFamily: "Permanent Marker", fontWeight: 400}} className="text-6xl font-semibold my-4 shadow-lg">
                <span className="text-primary">Flow Zone</span>
            </h1>
            {/* Mode tabs */}
            <div className="flex gap-1 p-1 rounded-full bg-card mb-8">
                {(["focus", "short", "long"] as const).map((m) => (
                    <button key={m} onClick={() => {
                        setRunning(false);
                        switchMode(m);
                    }} className={cn("px-4 py-1.5 text-sm rounded-full transition-colors",
                        mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
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

            {/* Session info */}
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
                            <Checkbox checked={t.done}
                                      onCheckedChange={(checked) => toggleTask(t.id, !!checked)}
                                      onClick={(e) => e.stopPropagation()}/>
                            <span className={cn("flex-1 text-sm", t.done && "line-through text-muted-foreground")}>{t.name}</span>
                            <span className="text-xs font-mono text-muted-foreground tabular-nums">{format(t.seconds)}</span>
                            <button onClick={(e) => {
                                e.stopPropagation();
                                void deleteTask(t.id);
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
