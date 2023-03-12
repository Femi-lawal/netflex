import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled">
      <div class="navbar-left">
        <a href="/" class="logo">
          <span class="logo-text">NETFLEX</span>
        </a>
        <ul class="nav-links">
          <li><a href="#" class="active">Home</a></li>
          <li><a href="#">TV Shows</a></li>
          <li><a href="#">Movies</a></li>
          <li><a href="#">New & Popular</a></li>
          <li><a href="#">My List</a></li>
        </ul>
      </div>
      <div class="navbar-right">
        <button class="icon-btn" aria-label="Search">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
        <button class="icon-btn" aria-label="Notifications">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>
        <div class="profile">
          <img [src]="profileImage" alt="Profile" class="profile-img">
          <svg class="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: var(--z-navbar);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--content-padding);
      height: var(--navbar-height);
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
      transition: background var(--transition-normal);
    }

    .navbar.scrolled {
      background: var(--color-background);
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
    }

    .navbar-left {
      display: flex;
      align-items: center;
      gap: var(--spacing-2xl);
    }

    .logo {
      text-decoration: none;
    }

    .logo-text {
      font-size: var(--font-size-2xl);
      font-weight: 800;
      color: var(--color-primary);
      letter-spacing: 2px;
    }

    .nav-links {
      display: flex;
      list-style: none;
      gap: var(--spacing-lg);
    }

    .nav-links a {
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
      font-weight: 500;
      transition: color var(--transition-fast);
    }

    .nav-links a:hover,
    .nav-links a.active {
      color: var(--color-text-primary);
    }

    .navbar-right {
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
    }

    .icon-btn {
      background: transparent;
      border: none;
      color: var(--color-text-primary);
      cursor: pointer;
      padding: var(--spacing-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity var(--transition-fast);
    }

    .icon-btn:hover {
      opacity: 0.7;
    }

    .profile {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      cursor: pointer;
    }

    .profile-img {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
    }

    .dropdown-arrow {
      color: var(--color-text-primary);
      transition: transform var(--transition-fast);
    }

    .profile:hover .dropdown-arrow {
      transform: rotate(180deg);
    }

    @media (max-width: 1024px) {
      .nav-links {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .logo-text {
        font-size: var(--font-size-xl);
      }
    }
  `]
})
export class NavbarComponent {
  isScrolled = false;
  profileImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect fill='%23e50914' width='32' height='32' rx='4'/%3E%3Ctext fill='white' font-family='sans-serif' font-size='16' font-weight='bold' x='50%25' y='50%25' text-anchor='middle' dy='.35em'%3EN%3C/text%3E%3C/svg%3E";

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled = window.scrollY > 50;
      });
    }
  }
}
