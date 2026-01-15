import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
//import { App } from './app/app';
import { AppComponent } from './app/app-component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient() // ⬅️ Necesario para que funcione HttpClient en el servicio
  ]
}).catch((err) => console.error(err));
