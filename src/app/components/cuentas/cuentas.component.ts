import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Cuenta } from 'src/app/models/cuenta';
import { CuentaService } from 'src/app/services/cuenta.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Servicio } from 'src/app/models/servicio';
import { ServiciosService } from 'src/app/services/servicios.service';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from 'src/app/services/producto.service';
import { ProductoPreparado } from 'src/app/models/producto-preparado';

@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.css'],
})
export class CuentasComponent implements OnInit {
  displayedColumns: string[] = ['titular', 'fecha_apert', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<Cuenta>();
  productos: Producto[] = [];
  productosPreparados: ProductoPreparado[] = [];
  servicios: Servicio[] = [];
  showRegisterForm: boolean = false;
  showAddServicioForm: boolean = false;
  showAddProductoForm: boolean = false;
  showPaymentDetail: boolean = false;
  registerForm: FormGroup;
  addServicioForm: FormGroup;
  addProductoForm: FormGroup;
  paymentDetail: any = null;
  editMode: boolean = false;
  currentCuentaId: string | null = null;

  constructor(
    private cuentaService: CuentaService,
    private productoService: ProductoService,
    private serviciosService: ServiciosService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      nombre_titular: ['', Validators.required],
    });

    this.addServicioForm = this.fb.group({
      servicios: [[], Validators.required],
    });

    this.addProductoForm = this.fb.group({
      productos: this.fb.array([], Validators.required),
    });
  }

  ngOnInit(): void {
    this.loadCuentas();
    this.loadProductos();
    this.loadProductosPreparados();
    this.loadServicios();
  }

  loadCuentas(): void {
    this.cuentaService.getCuentas().subscribe({
      next: (data: Cuenta[]) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  loadProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (data: Producto[]) => {
        this.productos = data.filter(
          (producto) => producto.estado === 'ACTIVO'
        );
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  loadProductosPreparados(): void {
    this.productoService.getProductosPreparados().subscribe({
      next: (data: ProductoPreparado[]) => {
        this.productosPreparados = data.filter(
          (producto) => producto.estado === 'ACTIVO'
        );
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  loadServicios(): void {
    this.serviciosService.getServicios().subscribe({
      next: (data: Servicio[]) => {
        this.servicios = data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  openRegisterForm(): void {
    this.showRegisterForm = true;
  }

  closeRegisterForm(): void {
    this.showRegisterForm = false;
    this.registerForm.reset();
    this.editMode = false;
    this.currentCuentaId = null;
  }

  openEditForm(cuenta: Cuenta): void {
    this.currentCuentaId = cuenta.id_cuenta;
    this.editMode = true;
    this.registerForm.patchValue({
      nombre_titular: cuenta.titular,
    });
    this.showRegisterForm = true;
  }

  openAddServicioForm(cuentaId: string): void {
    this.currentCuentaId = cuentaId;
    this.showAddServicioForm = true;
  }

  closeAddServicioForm(): void {
    this.showAddServicioForm = false;
    this.addServicioForm.reset();
  }

  openAddProductoForm(cuentaId: string): void {
    this.currentCuentaId = cuentaId;
    this.showAddProductoForm = true;
  }

  closeAddProductoForm(): void {
    this.showAddProductoForm = false;
    this.addProductoForm.reset();
    this.productosFormArray.clear();
  }

  get productosFormArray(): FormArray {
    return this.addProductoForm.get('productos') as FormArray;
  }

  addProducto(): void {
    const productoGroup = this.fb.group({
      sku: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
    });
    this.productosFormArray.push(productoGroup);
  }

  removeProducto(index: number): void {
    this.productosFormArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const nombre_titular = this.registerForm.value.nombre_titular;
      if (this.editMode && this.currentCuentaId) {
        this.cuentaService
          .updateCuenta(this.currentCuentaId, { nombre_titular })
          .subscribe({
            next: () => {
              this.snackBar.open('Cuenta actualizada exitosamente', 'Cerrar', {
                duration: 3000,
              });
              this.loadCuentas();
              this.closeRegisterForm();
            },
            error: (err) => {
              console.error(err);
              this.snackBar.open('Error al actualizar la cuenta', 'Cerrar', {
                duration: 3000,
              });
            },
          });
      } else {
        this.cuentaService.registerCuenta(nombre_titular).subscribe({
          next: (data: Cuenta) => {
            this.snackBar.open('Cuenta registrada exitosamente', 'Cerrar', {
              duration: 3000,
            });
            this.loadCuentas();
            this.closeRegisterForm();
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open('Error al registrar la cuenta', 'Cerrar', {
              duration: 3000,
            });
          },
        });
      }
    }
  }

  onAddServicioSubmit(): void {
    if (this.addServicioForm.valid && this.currentCuentaId) {
      const servicioIds = this.addServicioForm.value.servicios;
      this.cuentaService
        .addServiciosToCuenta(this.currentCuentaId, servicioIds)
        .subscribe({
          next: (data: Cuenta) => {
            this.snackBar.open(
              'Servicios añadidos exitosamente a la cuenta',
              'Cerrar',
              {
                duration: 3000,
              }
            );
            this.loadCuentas();
            this.closeAddServicioForm();
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open(
              'Error al añadir los servicios a la cuenta',
              'Cerrar',
              {
                duration: 3000,
              }
            );
          },
        });
    }
  }

  onAddProductoSubmit(): void {
    if (this.addProductoForm.valid && this.currentCuentaId) {
      const productos = this.addProductoForm.value.productos;
      this.cuentaService
        .addProductosToCuenta(this.currentCuentaId, productos)
        .subscribe({
          next: (data: Cuenta) => {
            this.snackBar.open(
              'Productos añadidos exitosamente a la cuenta',
              'Cerrar',
              {
                duration: 3000,
              }
            );
            this.loadCuentas();
            this.closeAddProductoForm();
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open(
              'Error al añadir los productos a la cuenta',
              'Cerrar',
              {
                duration: 3000,
              }
            );
          },
        });
    }
  }

  deleteCuenta(cuentaId: string): void {
    this.cuentaService.deleteCuenta(cuentaId).subscribe({
      next: (data: Cuenta) => {
        this.snackBar.open('Cuenta cancelada exitosamente', 'Cerrar', {
          duration: 3000,
        });
        this.loadCuentas();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al cancelar la cuenta', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  pagarCuenta(cuentaId: string): void {
    this.currentCuentaId = cuentaId;
    const detallesPago: any = {
      productos: null,
      servicios: null,
    };

    this.cuentaService.pagarProductos(cuentaId).subscribe({
      next: (data: any) => {
        detallesPago.productos = data;
        this.cuentaService.pagarServicios(cuentaId).subscribe({
          next: (data: any) => {
            detallesPago.servicios = data;
            this.paymentDetail = detallesPago;
            this.showPaymentDetail = true;
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open('Error al pagar los servicios', 'Cerrar', {
              duration: 3000,
            });
          },
        });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al pagar los productos', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  closePaymentDetail(): void {
    this.showPaymentDetail = false;
    this.paymentDetail = null;
    this.loadCuentas(); // Recargar las cuentas cuando se cierre el detalle de pago
  }

  imprimirDetalle(): void {
    const printContents = document.getElementById('payment-detail')?.innerHTML;
    if (printContents) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  }
}
