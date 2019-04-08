export class GenericError {
    constructor(
        public name: string,
        public message: string,
        public cause: any,
        ) { }
}
