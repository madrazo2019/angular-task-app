import { Injectable } from '@angular/core';
 import { HttpClient , HttpParams } from '@angular/common/http';
 import { inject } from '@angular/core';
import { Task } from '../models/task.model';
import { map, Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root',
})
export class TaskService {

  private http = inject(HttpClient);
  private apiBaseUrl = `${environment.apiBaseUrl}/todos`;

   private tasks: Task[] = [];
  // Obtener la lista de tareas
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiBaseUrl).pipe(
      map(tasks => tasks.slice(0, 20)), // Limitar a 20 tareas para la demo
      catchError(error => {
        console.error('Error al obtener las tareas:', error);
        return throwError(() => new Error('No se pudieron cargar las tareas. Por favor intente más tarde.'));
      })
    );
   }
  // Eliminar una tarea
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error al eliminar la tarea ${id}:`, error);
        return throwError(() => new Error(`No se pudo eliminar la tarea. Por favor intente más tarde.`));
      })
    );
   }
  }
    


