import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Servicio, Tarifa } from 'src/app/models/servicio';
import { ServiciosService } from 'src/app/services/servicios.service';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent {
  displayedColumns: string[] = [
    'nombre',
    'descripcion',
    'tarifas', // Nueva columna
    'acciones',
  ];
  dataSource = new MatTableDataSource<Servicio>();
  showRegisterForm: boolean = false;
  showAddStockForm: boolean = false;
  registerForm: FormGroup;
  editMode: boolean = false;
  errorMessage: string | null = null;
  currentServicioId: string | null | undefined = null;

  unidad_tarifas: string[] = [
    'HORA',
    'FRACCION'
  ];
  get tarifas(): FormArray {
    return this.registerForm.get('tarifas') as FormArray;
  }
  addTarifa(): void {
    if (this.tarifas.length < 2) {
      const tarifaForm = this.fb.group({
        precio_base: ['', Validators.required],
        unidad_facturacion: ['', Validators.required]
      });
      this.tarifas.push(tarifaForm);
    } else {
      this.errorMessage = "Solo se pueden agregar dos tarifas.";
    }
  }
  removeTarifa(index: number): void {
    this.tarifas.removeAt(index);
  }
  constructor(
    private serviciosService: ServiciosService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      tarifas: this.fb.array([], [this.maxTwoTarifasValidator, this.differentUnidadFacturacionValidator])
    });


  }
  ngOnInit() {
    this.loadServicios();
  }

  loadServicios(): void {
    this.serviciosService.getServicios().subscribe({
      next: (data: Servicio[]) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al cargar los ingredientes', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  openRegisterForm(): void {
    this.showRegisterForm = true;
    this.editMode = false;
    this.currentServicioId = null;
    this.registerForm.reset();

    this.tarifas.clear();
    this.errorMessage = null;
  }

  closeRegisterForm(): void {
    this.showRegisterForm = false;
    this.registerForm.reset();
  }



  onSubmit(): void {
    if (this.registerForm.valid) {
      if (this.editMode && this.currentServicioId) {
        this.serviciosService
          .updateServicio(this.currentServicioId, this.registerForm.value)
          .subscribe({
            next: () => {
              this.snackBar.open(
                'Ingrediente actualizado exitosamente',
                'Cerrar',
                {
                  duration: 3000,
                }
              );
              this.loadServicios();
              this.registerForm.reset();
              this.closeRegisterForm();
            },
            error: (err) => {
              console.error(err);
              this.snackBar.open(
                'Error al actualizar el ingrediente',
                'Cerrar',
                {
                  duration: 3000,
                }
              );
            },
          });
      } else {
        this.serviciosService
          .registerServicio(this.registerForm.value)
          .subscribe({
            next: () => {
              this.snackBar.open(
                'Servicio registrado exitosamente',
                'Cerrar',
                {
                  duration: 3000,
                }
              );
              this.loadServicios();
              this.registerForm.reset();
              this.closeRegisterForm();
            },
            error: (err) => {
              console.error(err);
              this.snackBar.open(
                'Error al registrar el Servicio',
                'Cerrar',
                {
                  duration: 3000,
                }
              );
            },
          });
      }
    }
  }



  // Validator to ensure no more than two tarifas
  maxTwoTarifasValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      return formArray.length <= 2 ? null : { maxTwoTarifas: true };
    };
  }

  // Validator to ensure different unidad_facturacion
  differentUnidadFacturacionValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      const unidadFacturaciones = formArray.controls.map(c => c.get('unidad_facturacion')?.value);
      const uniqueUnidadFacturaciones = Array.from(new Set(unidadFacturaciones));
      return unidadFacturaciones.length === uniqueUnidadFacturaciones.length ? null : { differentUnidadFacturacion: true };
    };
  }

  editIngrediente(servicio: Servicio): void {
    this.editMode = true;
    this.showRegisterForm = true;
    this.currentServicioId = servicio.id_service; // Asegúrate de tener la propiedad correcta para el ID del servicio

    // Resetear el formulario y las tarifas
    this.registerForm.reset();
    this.tarifas.clear();

    // Llenar el formulario con los datos del servicio seleccionado
    this.registerForm.patchValue({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
    });

    // Llenar las tarifas del servicio seleccionado
    servicio.tarifas.forEach(tarifa => {
      const tarifaForm = this.fb.group({
        precio_base: [tarifa.precio_base, Validators.required],
        unidad_facturacion: [tarifa.unidad_facturacion, Validators.required]
      });
      this.tarifas.push(tarifaForm);
    });
  }
  deleteIngrediente(ingrediente: Servicio): void {
    this.serviciosService
      .deleteServicio(ingrediente.id_service)
      .subscribe({
        next: (response) => {
          this.snackBar.open(response, 'Cerrar', {
            duration: 3000,
          });
          this.loadServicios();
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al eliminar el ingrediente', 'Cerrar', {
            duration: 3000,
          });
        },
      });
  }




}
