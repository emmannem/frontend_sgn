import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/models/empleado';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css'],
})
export class PersonalComponent implements OnInit {
  displayedColumns: string[] = [
    'nombres',
    'apellidos',
    'direccion',
    'telefono',
    'email',
    'id_rol.nombre',
    'acciones',
  ];
  dataSource = new MatTableDataSource<Empleado>();
  showRegisterForm: boolean = false;
  registerForm: FormGroup;
  roles = [
    { id: 1, nombre: 'Administrador' },
    { id: 2, nombre: 'Ayudante' },
  ];
  generos = [
    { value: 'M', viewValue: 'Masculino' },
    { value: 'F', viewValue: 'Femenino' },
  ];
  editMode: boolean = false;
  currentEmpleadoId: string | null = null;

  constructor(
    private empleadoService: EmpleadoService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      direccion: ['', Validators.required],
      genero: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      id_rol: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.loadEmpleados();
  }

  loadEmpleados(): void {
    this.empleadoService.getEmpleados().subscribe({
      next: (data: Empleado[]) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al cargar los empleados', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  openRegisterForm(): void {
    this.showRegisterForm = true;
    this.editMode = false;
    this.currentEmpleadoId = null;
    this.registerForm.reset();
  }

  closeRegisterForm(): void {
    this.showRegisterForm = false;
    this.registerForm.reset();
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      if (this.editMode && this.currentEmpleadoId) {
        this.empleadoService
          .updateEmpleado(this.currentEmpleadoId, this.registerForm.value)
          .subscribe({
            next: () => {
              this.snackBar.open(
                'Empleado actualizado exitosamente',
                'Cerrar',
                {
                  duration: 3000,
                }
              );
              this.loadEmpleados();
              this.registerForm.reset();
              this.closeRegisterForm();
            },
            error: (err) => {
              console.error(err);
              this.snackBar.open('Error al actualizar el empleado', 'Cerrar', {
                duration: 3000,
              });
            },
          });
      } else {
        this.empleadoService
          .registerEmpleado(this.registerForm.value)
          .subscribe({
            next: () => {
              this.snackBar.open('Empleado registrado exitosamente', 'Cerrar', {
                duration: 3000,
              });
              this.loadEmpleados();
              this.registerForm.reset();
              this.closeRegisterForm();
            },
            error: (err) => {
              console.error(err);
              this.snackBar.open('Error al registrar al empleado', 'Cerrar', {
                duration: 3000,
              });
            },
          });
      }
    }
  }

  editUsuario(usuario: Empleado): void {
    this.currentEmpleadoId = usuario.id_usuario;
    this.editMode = true;
    this.showRegisterForm = true;
    this.registerForm.patchValue({
      ...usuario,
      id_rol: usuario.id_rol.id_rol,
    });
  }

  deleteUsuario(usuario: Empleado): void {
    this.empleadoService.deleteEmpleado(usuario.id_usuario).subscribe({
      next: () => {
        this.snackBar.open('Empleado eliminado exitosamente', 'Cerrar', {
          duration: 3000,
        });
        this.loadEmpleados();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al eliminar el empleado', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }
}
