
export class Product {
    constructor(
        public itemId: string,
        public name: string,
        public description: string,
        public price: number,
        public availability: Availability) { }
}

export class Availability {
    constructor(
        public quantity: number) { }
}
