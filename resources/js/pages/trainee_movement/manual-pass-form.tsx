import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
    Calendar as CalendarIcon,
    Check,
    ChevronsUpDown,
    TriangleAlertIcon,
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { toast } from 'sonner';
import { Trainee } from '@/@types/Trainees';
import { cn } from '@/lib/utils';

export default function ManualPassForm({
    trainees,
    onSuccessClose,
}: {
    trainees: Trainee[];
    onSuccessClose: () => void;
}) {
    const [traineeId, setTraineeId] = useState('');
    const [openCombobox, setOpenCombobox] = useState(false);
    const [direction, setDirection] = useState('GO_ASHORE');
    const [movementType, setMovementType] = useState('LIBERTY');

    const [issuedDate, setIssuedDate] = useState<Date | undefined>(new Date());
    const [issuedHour, setIssuedHour] = useState('08');
    const [issuedMinute, setIssuedMinute] = useState('00');

    const [expiresDate, setExpiresDate] = useState<Date | undefined>(
        new Date(),
    );
    const [expiresHour, setExpiresHour] = useState('17');
    const [expiresMinute, setExpiresMinute] = useState('00');

    const [loading, setLoading] = useState(false);

    const selectedTrainee = trainees.find((t) => String(t.id) === traineeId);

    const [aboardDate, setAboardDate] = useState<Date | undefined>(undefined);
    const [aboardHour, setAboardHour] = useState<string>('08');
    const [aboardMinute, setAboardMinute] = useState<string>('00');

    const [returnType, setReturnType] = useState<'ON_TIME' | 'LATE'>('ON_TIME');
    const [lateMinutes, setLateMinutes] = useState<number>(0);
    const [calculatedStatus, setCalculatedStatus] = useState<
        'ACTIVE' | 'COMPLETED'
    >('COMPLETED');

    const hours = Array.from({ length: 24 }, (_, i) =>
        String(i).padStart(2, '0'),
    );
    const minutes = Array.from({ length: 12 }, (_, i) =>
        String(i * 5).padStart(2, '0'),
    );

    useEffect(() => {
        if (issuedDate && !aboardDate) {
            setAboardDate(issuedDate);
            setAboardHour(issuedHour);
            setAboardMinute(issuedMinute);
        }

        if (!expiresDate || !aboardDate) return;

        const expiry = new Date(expiresDate);
        expiry.setHours(
            parseInt(expiresHour || '0', 10),
            parseInt(expiresMinute || '0', 10),
            0,
            0,
        );

        const aboard = new Date(aboardDate);
        aboard.setHours(
            parseInt(aboardHour || '0', 10),
            parseInt(aboardMinute || '0', 10),
            0,
            0,
        );

        const diffMs = aboard.getTime() - expiry.getTime();

        if (diffMs > 0) {
            const mins = Math.floor(diffMs / 1000 / 60);
            setReturnType('LATE');
            setLateMinutes(mins);
        } else {
            setReturnType('ON_TIME');
            setLateMinutes(0);
        }

        setCalculatedStatus('COMPLETED');
    }, [
        issuedDate,
        issuedHour,
        issuedMinute,
        expiresDate,
        expiresHour,
        expiresMinute,
        aboardDate,
        aboardHour,
        aboardMinute,
    ]);

    const createLocalISOString = (
        baseDate: Date,
        hoursStr: string,
        minutesStr: string,
    ) => {
        const hh = String(parseInt(hoursStr || '0', 10)).padStart(2, '0');
        const min = String(parseInt(minutesStr || '0', 10)).padStart(2, '0');
        const yyyy = baseDate.getFullYear();
        const mm = String(baseDate.getMonth() + 1).padStart(2, '0');
        const dd = String(baseDate.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}T${hh}:${min}:00`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Base Validations
        if (!traineeId) {
            toast.error('Please Select Trainee.', {
                position: 'top-center',
                style: {
                    '--normal-bg':
                        'light-dark(var(--destructive), color-mix(in oklab, var(--destructive) 60%, var(--background)))',
                    '--normal-text': 'var(--color-white)',
                    '--normal-border': 'transparent',
                } as React.CSSProperties,
            });
            return;
        }

        let finalIssuedAt: string | undefined;
        let finalExpiresAt: string | undefined;
        let finalAboardAt: string | undefined;

        if (direction === 'GO_ASHORE') {
            if (!issuedDate || !expiresDate) {
                toast.error(
                    'Departure and Expected Return dates are required for Go Ashore.',
                    {
                        position: 'top-center',
                        style: {
                            '--normal-bg': 'var(--background)',
                            '--normal-text': 'var(--destructive)',
                            '--normal-border': 'var(--destructive)',
                        } as React.CSSProperties,
                        icon: <TriangleAlertIcon />,
                    },
                );
                return;
            }
            finalIssuedAt = createLocalISOString(
                issuedDate,
                issuedHour,
                issuedMinute,
            );
            finalExpiresAt = createLocalISOString(
                expiresDate,
                expiresHour,
                expiresMinute,
            );

            if (aboardDate) {
                finalAboardAt = createLocalISOString(
                    aboardDate,
                    aboardHour,
                    aboardMinute,
                );
            }
        } else {
            // For processing a pure alternative 'RETURN_ABOARD' workflow if needed
            if (!aboardDate) {
                toast.error(
                    'Actual Return date is required for Return Aboard.',
                    {
                        position: 'top-center',
                        style: {
                            '--normal-bg': 'var(--background)',
                            '--normal-text': 'var(--destructive)',
                            '--normal-border': 'var(--destructive)',
                        } as React.CSSProperties,
                        icon: <TriangleAlertIcon />,
                    },
                );

                return;
            }
            finalAboardAt = createLocalISOString(
                aboardDate,
                aboardHour,
                aboardMinute,
            );
        }

        setLoading(true);
        router.post(
            'trainee_movements/manual-bypass',
            {
                trainee_id: traineeId,
                action_direction: direction,
                type: direction === 'GO_ASHORE' ? movementType : undefined,
                issued_at: finalIssuedAt,
                expires_at: finalExpiresAt,
                aboard_at: finalAboardAt, // ✨ Sending actual return timestamp to Laravel!
                status:
                    direction === 'GO_ASHORE' && aboardDate
                        ? calculatedStatus
                        : 'COMPLETED',
                late_minutes:
                    direction === 'GO_ASHORE' && returnType === 'LATE'
                        ? lateMinutes
                        : 0,
            },
            {
                onSuccess: () => {
                    toast.success(
                        'Bypass transaction processed successfully.',
                        {
                            position: 'top-center',
                            style: {
                                '--normal-bg': 'var(--background)',
                                '--normal-text':
                                    'light-dark(var(--color-green-600), var(--color-green-400))',
                                '--normal-border':
                                    'light-dark(var(--color-green-600), var(--color-green-400))',
                            } as React.CSSProperties,
                        },
                    );
                },
                onError: (errors) => {
                    Object.values(errors).forEach((message) => {
                        toast.error(message as string, {
                            position: 'top-center',
                            style: {
                                '--normal-bg':
                                    'light-dark(var(--destructive), color-mix(in oklab, var(--destructive) 60%, var(--background)))',
                                '--normal-text': 'var(--color-white)',
                                '--normal-border': 'transparent',
                            } as React.CSSProperties,
                        });
                    });
                },
                onFinish: () => setLoading(false),
            },
        );
    };

    const showReturnDateandTimeAbord = expiresDate < new Date();

    return (
        <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="max-w-md space-y-4 rounded-xl border bg-white p-2 shadow-sm md:p-6"
        >
            {/* Trainee Selection */}
            <div className="flex flex-col space-y-1">
                <Label className="mb-1">Select Trainee</Label>
                <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openCombobox}
                            className="h-10 w-full justify-between bg-transparent px-3 text-sm font-normal"
                        >
                            {selectedTrainee
                                ? `${selectedTrainee.first_name} ${selectedTrainee.last_name}`
                                : '-- Search / Select Trainee --'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-[var(--radix-popover-trigger-width)] p-0"
                        align="start"
                    >
                        <Command>
                            <CommandInput placeholder="Type name to search..." />
                            <CommandList onWheel={(e) => e.stopPropagation()}>
                                <CommandEmpty>No trainee found.</CommandEmpty>
                                <CommandGroup>
                                    {trainees.map((t) => {
                                        const fullName = `${t.first_name} ${t.last_name}`;
                                        return (
                                            <CommandItem
                                                key={t.id}
                                                value={fullName}
                                                onSelect={() => {
                                                    setTraineeId(String(t.id));
                                                    setOpenCombobox(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        'mr-2 h-4 w-4',
                                                        String(t.id) ===
                                                            traineeId
                                                            ? 'opacity-100'
                                                            : 'opacity-0',
                                                    )}
                                                />
                                                {fullName}
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Direction Selection */}
            <div className="space-y-1">
                <Label>Bypass Direction</Label>
                <Select value={direction} onValueChange={setDirection}>
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="GO_ASHORE">
                            Go Ashore (Authorize Departure)
                        </SelectItem>
                        <SelectItem value="RETURN_ABOARD">
                            Return Aboard (Log Return)
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* GO_ASHORE Specific Configuration */}
            {direction === 'GO_ASHORE' && (
                <div className="space-y-4 border-l-2 border-primary pl-3 transition-all">
                    <div className="space-y-1">
                        <Label>Classification</Label>
                        <Select
                            value={movementType}
                            onValueChange={setMovementType}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="LIBERTY">Liberty</SelectItem>
                                <SelectItem value="LEAVE">Leave</SelectItem>
                                <SelectItem value="OFFICIAL_BUSINESS">
                                    Official Business
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Ashore Date & Time */}
                    <div className="space-y-3">
                        <div className="flex flex-col space-y-1">
                            <Label>Ashore Date & Time</Label>
                            <div className="flex gap-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                'w-[60%] justify-start text-left font-normal',
                                                !issuedDate &&
                                                    'text-muted-foreground',
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {issuedDate ? (
                                                format(issuedDate, 'PPP')
                                            ) : (
                                                <span>Pick date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={issuedDate}
                                            onSelect={setIssuedDate}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <div className="flex w-[40%] gap-1">
                                    <Select
                                        value={issuedHour}
                                        onValueChange={setIssuedHour}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {hours.map((h) => (
                                                <SelectItem key={h} value={h}>
                                                    {h}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <span className="flex items-center text-muted-foreground">
                                        :
                                    </span>
                                    <Select
                                        value={issuedMinute}
                                        onValueChange={setIssuedMinute}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {minutes.map((m) => (
                                                <SelectItem key={m} value={m}>
                                                    {m}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Expected Return Date & Time */}
                        <div className="flex flex-col space-y-1">
                            <Label>Expected Aboard Date & Time</Label>
                            <div className="flex gap-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                'w-[60%] justify-start text-left font-normal',
                                                !expiresDate &&
                                                    'text-muted-foreground',
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {expiresDate ? (
                                                format(expiresDate, 'PPP')
                                            ) : (
                                                <span>Pick date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={expiresDate}
                                            onSelect={setExpiresDate}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <div className="flex w-[40%] gap-1">
                                    <Select
                                        value={expiresHour}
                                        onValueChange={setExpiresHour}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {hours.map((h) => (
                                                <SelectItem key={h} value={h}>
                                                    {h}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <span className="flex items-center text-muted-foreground">
                                        :
                                    </span>
                                    <Select
                                        value={expiresMinute}
                                        onValueChange={setExpiresMinute}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {minutes.map((m) => (
                                                <SelectItem key={m} value={m}>
                                                    {m}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Backlog Actual Return Block Nested Inside Go Ashore */}
                        {showReturnDateandTimeAbord && (
                            <div className="mt-4 space-y-3 rounded-lg border border-dashed border-emerald-500/30 bg-emerald-500/[0.02] p-4">
                                <div className="flex flex-col space-y-1">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-semibold tracking-wider text-emerald-600 uppercase">
                                            Paper Log Backlog Details
                                        </Label>
                                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                            Auto-Logging As COMPLETED
                                        </span>
                                    </div>
                                    <Label className="mt-2 text-xs">
                                        Actual Return Date & Time Aboard
                                    </Label>
                                    <div className="flex gap-2">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        'w-[60%] justify-start text-left font-normal',
                                                        !aboardDate &&
                                                            'text-muted-foreground',
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {aboardDate ? (
                                                        format(
                                                            aboardDate,
                                                            'PPP',
                                                        )
                                                    ) : (
                                                        <span>
                                                            Pick actual return
                                                            date
                                                        </span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={aboardDate}
                                                    onSelect={setAboardDate}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <div className="flex w-[40%] gap-1">
                                            <Select
                                                value={aboardHour}
                                                onValueChange={setAboardHour}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {hours.map((h) => (
                                                        <SelectItem
                                                            key={h}
                                                            value={h}
                                                        >
                                                            {h}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <span className="flex items-center text-muted-foreground">
                                                :
                                            </span>
                                            <Select
                                                value={aboardMinute}
                                                onValueChange={setAboardMinute}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {minutes.map((m) => (
                                                        <SelectItem
                                                            key={m}
                                                            value={m}
                                                        >
                                                            {m}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 border-t border-muted/60 pt-2 text-xs">
                                    <div>
                                        <span className="block text-[11px] text-muted-foreground">
                                            Return Classification
                                        </span>
                                        <span
                                            className={cn(
                                                'mt-0.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold',
                                                returnType === 'LATE'
                                                    ? 'bg-destructive/10 text-destructive'
                                                    : 'bg-emerald-500/10 text-emerald-600',
                                            )}
                                        >
                                            {returnType}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[11px] text-muted-foreground">
                                            Calculated Metrics
                                        </span>
                                        <span className="mt-0.5 inline-block font-mono text-[11px] font-medium text-slate-700">
                                            {returnType === 'LATE'
                                                ? `${lateMinutes} mins late`
                                                : 'On Time / Early'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* RETURN_ABOARD Standalone Date Pickers if Direction changes */}
            {direction === 'RETURN_ABOARD' && (
                <div className="space-y-3 border-l-2 border-emerald-500 pl-3 transition-all">
                    <div className="flex flex-col space-y-1">
                        <Label>Actual Return Date & Time</Label>
                        <div className="flex gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            'w-[60%] justify-start text-left font-normal',
                                            !aboardDate &&
                                                'text-muted-foreground',
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {aboardDate ? (
                                            format(aboardDate, 'PPP')
                                        ) : (
                                            <span>Pick return date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={aboardDate}
                                        onSelect={setAboardDate}
                                    />
                                </PopoverContent>
                            </Popover>
                            <div className="flex w-[40%] gap-1">
                                <Select
                                    value={aboardHour}
                                    onValueChange={setAboardHour}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {hours.map((h) => (
                                            <SelectItem key={h} value={h}>
                                                {h}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <span className="flex items-center text-muted-foreground">
                                    :
                                </span>
                                <Select
                                    value={aboardMinute}
                                    onValueChange={setAboardMinute}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {minutes.map((m) => (
                                            <SelectItem key={m} value={m}>
                                                {m}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Processing Override...' : 'Execute Override Action'}
            </Button>
        </form>
    );
}
