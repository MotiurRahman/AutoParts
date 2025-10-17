export type Part = {
    id: number;
    name: string;
    brand: string;
    price: number;
    stock: number;
    category: string;
    created_at?: string;
};

export type AuthResponse = { token: string };
