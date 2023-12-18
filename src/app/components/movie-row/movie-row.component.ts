import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../services/tmdb.service';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-movie-row',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  template: `
    <section class="movie-row">
      <h2 class="row-title">{{ title }}</h2>
      <div class="row-container">
        <button 
          class="scroll-btn scroll-left" 
          (click)="scroll('left')"
          [class.visible]="showLeftArrow"
          aria-label="Scroll left">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        
        <div class="row-scroll" #scrollContainer (scroll)="onScroll()">
          @for (movie of movies; track movie.id) {
            <app-movie-card [movie]="movie" (selectMovie)="selectMovie.emit($event)"></app-movie-card>
          }
        </div>
        
        <button 
          class="scroll-btn scroll-right" 
          (click)="scroll('right')"
          [class.visible]="showRightArrow"
          aria-label="Scroll right">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </section>
  `,
  styles: [`
    .movie-row {
      position: relative;
      margin-bottom: var(--spacing-2xl);
    }

    .row-title {
      font-size: var(--font-size-xl);
      font-weight: 700;
      margin-bottom: var(--spacing-md);
      padding-left: var(--content-padding);
    }

    .row-container {
      position: relative;
    }

    .row-scroll {
      display: flex;
      gap: var(--spacing-md);
      padding: var(--spacing-lg) var(--content-padding);
      overflow-x: auto;
      scroll-behavior: smooth;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .row-scroll::-webkit-scrollbar {
      display: none;
    }

    .scroll-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 5;
      width: 48px;
      height: 100%;
      background: rgba(20, 20, 20, 0.7);
      border: none;
      color: var(--color-text-primary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity var(--transition-fast), background var(--transition-fast);
    }

    .scroll-btn:hover {
      background: rgba(20, 20, 20, 0.9);
    }

    .scroll-btn.visible {
      opacity: 1;
    }

    .movie-row:hover .scroll-btn.visible {
      opacity: 1;
    }

    .scroll-left {
      left: 0;
      border-radius: 0 var(--radius-md) var(--radius-md) 0;
    }

    .scroll-right {
      right: 0;
      border-radius: var(--radius-md) 0 0 var(--radius-md);
    }

    @media (max-width: 768px) {
      .row-title {
        font-size: var(--font-size-lg);
      }

      .scroll-btn {
        display: none;
      }
    }
  `]
})
export class MovieRowComponent {
  @Input() title = '';
  @Input() movies: Movie[] = [];
  @Output() selectMovie = new EventEmitter<Movie>();
  
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;
  
  showLeftArrow = false;
  showRightArrow = true;

  scroll(direction: 'left' | 'right'): void {
    const container = this.scrollContainer.nativeElement;
    const scrollAmount = container.clientWidth * 0.75;
    
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  }

  onScroll(): void {
    const container = this.scrollContainer.nativeElement;
    this.showLeftArrow = container.scrollLeft > 0;
    this.showRightArrow = container.scrollLeft < (container.scrollWidth - container.clientWidth - 10);
  }
}
