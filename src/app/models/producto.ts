export interface Producto {
  id_producto: string;
  nombre: string;
  descripcion: string;
  SKU: string;
  precio: number;
  create_at: string;
  modified_at: string;
  estado: string;
  inventario: {
    id_producto_inventario: string;
    stock: number;
    stock_min: number;
    modified_inven: string;
  };
}
