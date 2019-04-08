import { GenericError } from './generic-error.model';

export class GenericResult {
    constructor(
        public success: boolean,
        public description: string,
        public error?: GenericError,
        public code?: string) { }
}
