import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonModal, IonTitle, IonToolbar, IonText, IonGrid, IonRow, IonFooter, IonImg, IonCol, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';

const IMAGENES_ANIMALES = ['./../../../assets/game/easy/animal1.png', './../../../assets/game/easy/animal2.png', './../../../assets/game/easy/animal3.png'];
const IMAGENES_HERRAMIENTAS = ['./../../../assets/game/medium/herramienta1.png', './../../../assets/game/medium/herramienta2.png', './../../../assets/game/medium/herramienta3.png', './../../../assets/game/medium/herramienta4.png', './../../../assets/game/medium/herramienta5.png'];
const IMAGENES_FRUTAS = ['./../../../assets/game/hard/1.png', './../../../assets/game/hard/2.png', './../../../assets/game/hard/3.png', './../../../assets/game/hard/4.png', './../../../assets/game/hard/5.png', './../../../assets/game/hard/6.png', './../../../assets/game/hard/7.png', './../../../assets/game/hard/8.png'];


interface Card {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

@Component({
  selector: 'app-juego',
  templateUrl: './juego.page.html',
  styleUrls: ['./juego.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonModal, IonTitle, IonToolbar, IonText, IonGrid, IonRow, IonFooter, IonImg, IonCol, IonButton, CommonModule, FormsModule ]
})
export class JuegoPage implements OnInit {
  nivel: string | null = '';
  grid: Card[][] = []; // Cambiado a 'grid' para alinearse con el HTML
  flippedCards: Card[] = [];
  showModal = false;
  timer: number = 0;
  interval: any;

  constructor(private route: ActivatedRoute, private firestoreService: FirestoreService, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.nivel = this.route.snapshot.paramMap.get('nivel');
    this.startGame(this.nivel);
  }

  startGame(difficulty: string | null) {
    this.startTimer();

    // Configuración de cartas según la dificultad
    const images = this.getImagesByDifficulty(difficulty);
    const shuffledImages = this.shuffleArray([...images, ...images]);

    // Configuración de filas y columnas según la dificultad
    let rows: number;
    let cols: number;
    if (difficulty === 'facil') {
        rows = 3;
        cols = 2;
    } else if (difficulty === 'medio') {
        rows = 5;
        cols = 2;
    } else if (difficulty === 'dificil') {
        rows = 4;
        cols = 4;
    } else {
        throw new Error('Dificultad no reconocida');
    }

    this.grid = [];
    let index = 0;
    for (let row = 0; row < rows; row++) {
        const rowCards: Card[] = [];
        for (let col = 0; col < cols; col++) {
            rowCards.push({
                id: index,
                image: shuffledImages[index],
                isFlipped: false,
                isMatched: false,
            });
            index++;
        }
        this.grid.push(rowCards);
    }
}


  startTimer() {
    this.timer = 0;
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.timer++;
    }, 1000);
  }

  getImagesByDifficulty(difficulty: string | null): string[] {
    switch (difficulty) {
      case 'facil':
        return IMAGENES_ANIMALES;
      case 'medio':
        return IMAGENES_HERRAMIENTAS;
      case 'dificil':
        return IMAGENES_FRUTAS;
      default:
        return [];
    }
  }

  flipCard(rowIndex: number, colIndex: number) {
    const card = this.grid[rowIndex][colIndex];

    if (card.isFlipped || card.isMatched || this.flippedCards.length === 2) {
      return;
    }

    card.isFlipped = true;
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.checkForMatch();
    }
  }

  async checkForMatch() {
    const [card1, card2] = this.flippedCards;

    if (card1.image === card2.image) {
      card1.isMatched = true;
      card2.isMatched = true;
      this.flippedCards = [];

      if (this.grid.reduce((acc, row) => acc.concat(row), []).every((card: Card) => card.isMatched)) {
        this.showModal = true;
        clearInterval(this.interval);

        const usuario = await this.authService.getUser();

        const data = {
          tiempo: this.timer,
          dificultad: this.nivel,
          usuario: usuario
        }

        this.firestoreService.createDocument('juegoMemoria', data);
      }
    } else {
      setTimeout(() => {
        card1.isFlipped = false;
        card2.isFlipped = false;
        this.flippedCards = [];
      }, 1000); // Espera un segundo antes de voltear las cartas de nuevo
    }
  }

  closeModal() {
    this.showModal = false;
  }

  shuffleArray(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  resetGame() {
    this.startGame(this.nivel);
  }

  volver() {
    this.router.navigate(['/home']);
  }
}
