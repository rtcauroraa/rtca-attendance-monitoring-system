import { Trainee } from './Trainees';

export type AshorePasses = {
    id: number;
    trainee_id: number;
    duration_days: number;
    issued_at: Date;
    expires_at: Date;
    aboard_at: Date;
    status: string;
    trainee: Trainee;
};
