import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingController, IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonFooter, IonButton } from '@ionic/angular/standalone';
import { Firestore, collection, query, where, orderBy, limit, getDocs, collectionData } from '@angular/fire/firestore';
import { Router } from '@angular/router';


@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonFooter, IonButton, CommonModule, FormsModule]
})
export class RankingPage implements OnInit {
  topEasyPlayers: any[] = [];
  topMediumPlayers: any[] = [];
  topHardPlayers: any[] = [];
  loading!: HTMLIonLoadingElement;

  constructor(private firestore: Firestore, private router: Router, private loadingCtrl: LoadingController) {}

  ngOnInit() {
    this.loadingCtrl.create()
      .then(loading => {
        this.loading = loading;
        this.loading.present();
        this.getTopPlayers();
      });
  }


  async getTopPlayers() {
    let col = collection(this.firestore, 'juegoMemoria');
    const observable = collectionData(col);

    observable.subscribe((data) => {
      this.topEasyPlayers = data.filter(juego => juego['dificultad'] === 'facil');
      this.topMediumPlayers = data.filter(juego => juego['dificultad'] === 'medio');
      this.topHardPlayers = data.filter(juego => juego['dificultad'] === 'dificil');

      this.topEasyPlayers.sort((a, b) => a['tiempo'] - b['tiempo']);
      this.topMediumPlayers.sort((a, b) => a['tiempo'] - b['tiempo']);
      this.topHardPlayers.sort((a, b) => a['tiempo'] - b['tiempo']);

      this.topEasyPlayers = this.topEasyPlayers.slice(0, 5);
      this.topMediumPlayers = this.topMediumPlayers.slice(0, 5);
      this.topHardPlayers = this.topHardPlayers.slice(0, 5);

      
      this.loading.dismiss();
    });

    
  }

  volver() {
    this.router.navigate(['/home']);
  }


}
