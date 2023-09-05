# Netflex 🎬

A modern Netflix clone built with Angular 17, featuring a sleek dark UI, movie browsing with The Movie Database (TMDB) API, and responsive design.

![Netflex Screenshot](https://via.placeholder.com/1200x600/141414/e50914?text=Netflex)

## ✨ Features

- **Modern UI**: Netflix-inspired dark theme with smooth animations
- **Hero Banner**: Dynamic featured content with backdrop images
- **Movie Rows**: Horizontal scrolling carousels with hover effects
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **TMDB Integration**: Real movie and TV show data
- **Standalone Components**: Using Angular 17's latest patterns

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/netflex.git
cd netflex

# Install dependencies
npm install

# Start development server
npm start
```

Visit `http://localhost:4200` to view the app.

### TMDB API Key (Optional)

To fetch real movie data, get a free API key from [TMDB](https://www.themoviedb.org/settings/api) and update:

```typescript
// src/environments/environment.ts
export const environment = {
  tmdb: {
    apiKey: 'YOUR_API_KEY_HERE',
    // ...
  }
};
```

> The app works without an API key using fallback sample data.

### Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# View at http://localhost:3000
```

## 🛠️ Tech Stack

- **Framework**: Angular 17 (Standalone Components)
- **Styling**: CSS Custom Properties, Dark Theme
- **API**: The Movie Database (TMDB)
- **Icons**: Inline SVG

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── hero-banner/    # Featured content banner
│   │   ├── movie-card/     # Individual movie card
│   │   ├── movie-row/      # Horizontal scrolling row
│   │   └── navbar/         # Navigation header
│   ├── services/
│   │   └── tmdb.service.ts # TMDB API integration
│   └── app.component.ts    # Main app composition
├── environments/           # Environment configs
└── styles.css             # Global styles & theme
```

## 📜 License

MIT License - Built for educational purposes.

## 🙏 Credits

- Movie data provided by [TMDB](https://www.themoviedb.org/)
- Inspired by Netflix's user interface
