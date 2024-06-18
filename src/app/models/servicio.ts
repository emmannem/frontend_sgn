export interface Servicio {
    id_service?: string;
    nombre: string;
    descripcion: string;
    tarifas: Tarifa[];
}

export interface Tarifa {
    id_tarifa?: string;
    precio_base: string;
    unidad_facturacion: string;
}
