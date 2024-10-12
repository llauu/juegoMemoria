import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, LoadingController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class HomePage {
  loading!: HTMLIonLoadingElement;


  constructor(public authService: AuthService, private router: Router, private loadingCtrl: LoadingController) {
    this.loadingCtrl.create()
      .then(loading => {
        this.loading = loading;
      });
  }

  iniciarJuego(nivel: 'facil' | 'medio' | 'dificil') {
    this.router.navigate(['/juego', nivel]);
  }

  cerrarSesion() {
    this.loading.present();

    this.authService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .finally(() => {
        this.loading.dismiss();
      });
  }

  irRanking() {
    this.router.navigate(['/ranking']);
  }
}
