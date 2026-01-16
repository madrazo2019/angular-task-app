import { Injectable } from '@angular/core';
 import { HttpClient , HttpParams } from '@angular/common/http';
 import { inject } from '@angular/core';
import { Task } from '../models/task.model';
import { map, Observable } from 'rxjs';
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
      map(tasks => tasks.slice(0, 20)) // Limitar a 20 tareas para la demo
    );
   }
  // Eliminar una tarea
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/${id}`);
   }
  }
    


