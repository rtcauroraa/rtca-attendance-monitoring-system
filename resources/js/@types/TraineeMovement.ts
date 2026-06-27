import { Trainee } from './Trainees';

export type TraineeMovement = {
    id: number;
    trainee_id: number;
    duration: number;
    issued_at: Date;
    expires_at: Date;
    returned_at: Date;
    return_type: String;
    aboard_at: Date;
    late_minutes: number;
    status: string;
    trainee: Trainee;
};
