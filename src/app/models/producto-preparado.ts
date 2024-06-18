import { Ingrediente } from "./ingrediente";

// / receta.ts
export interface Receta {
    id: string;
    cantidad: number;
    ingrediente: Ingrediente;
}

// producto.ts
export interface ProductoPreparado {
    id_producto: string;
    nombre: string;
    descripcion: string;
    SKU: string;
    precio: string;
    create_at: string;
    modified_at: string;
    estado: string;
    receta: Receta[];
}