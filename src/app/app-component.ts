import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { TaskItem } from './task-item/task-item';
import { Task } from './models/task.model';
import { TaskService } from './services/task-service';
import { BehaviorSubject, Observable, catchError, finalize, of, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [TaskItem, CommonModule],
  template: `
  
<main class="container">
  <section>
    <h2>Lista de Tareas</h2>
    
    @if (loading$ | async) {
      <p>Cargando tareas...</p>
    }

    <div class="container">
      @for (task of tasks$ | async; track task.id) {
        <app-task-item 
          [task]="task" 
          (remove)="deleteTask($event)"
          (toggleComplete)="toggleTaskComplete($event)">
        </app-task-item>
      } @empty {
        @if (!(loading$ | async)) {
          <p>No hay tareas disponibles.</p>
        }
      }
    </div>
    
    @if (error$ | async; as error) {
      <p class="error">{{ error }}</p>
    }
  </section>
</main>
  `,
  styles: ``,
})
export class AppComponent implements OnInit {
  private taskService = inject(TaskService);
  
  // Observable subjects para manejar los estados
  private readonly tasksSubject = new BehaviorSubject<Task[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  // Exposer observables para el template
  tasks$ = this.tasksSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  ngOnInit() {
    this.getTasks();
  }

  getTasks() {
    this.loadingSubject.next(true);
    this.taskService.getTasks()
      .pipe(
        tap(tasks => {
          this.tasksSubject.next(tasks);
          this.errorSubject.next(null);
        }),
        catchError(err => {
          this.errorSubject.next('No se pudieron cargar las tareas.');
          this.tasksSubject.next([]);
          console.error('Error al cargar tareas:', err);
          return of([]);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe();
   }

  deleteTask(id: number) {
    const previousTasks = this.tasksSubject.value;
    const updatedTasks = previousTasks.filter(t => t.id !== id);
    this.tasksSubject.next(updatedTasks);

    this.taskService.deleteTask(id)
      .pipe(
        catchError(err => {
          // Si falla, revertimos el cambio
          alert('Error al eliminar la tarea');
          this.tasksSubject.next(previousTasks);
          console.error(`Error al eliminar tarea ${id}:`, err);
          return of();
        })
      )
      .subscribe();
  }

  toggleTaskComplete(id: number) {
    const currentTasks = this.tasksSubject.value;
    const task = currentTasks.find(t => t.id === id);
    
    if (task) {
      const previousCompleted = task.completed;
      const newCompleted = !task.completed;
      
      // Actualizar UI de forma optimista
      const updatedTasks = currentTasks.map(t => 
        t.id === id ? { ...t, completed: newCompleted } : t
      );
      this.tasksSubject.next(updatedTasks);

      // Persistir en el servidor
      this.taskService.updateTaskCompletion(id, newCompleted)
        .pipe(
          catchError(err => {
            // Si falla, revertir el cambio
            const revertedTasks = currentTasks.map(t => 
              t.id === id ? { ...t, completed: previousCompleted } : t
            );
            this.tasksSubject.next(revertedTasks);
            alert('Error al actualizar el estado de la tarea');
            console.error(`Error al actualizar tarea ${id}:`, err);
            return of();
          })
        )
        .subscribe();
    }
  }
}