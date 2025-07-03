# Deployment Instructions

## GitHub Pages Deployment

### Option 1: Automated Deployment (Recommended)

1. **Push to GitHub**:
   - Make sure your repository is named `StockTradingGame`
   - Push all code to the `main` branch

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll down to "Pages" section
   - Select source as "GitHub Actions"

3. **The workflow will automatically**:
   - Build the project
   - Deploy to GitHub Pages
   - Your site will be available at `https://yourusername.github.io/StockTradingGame`

### Option 2: Manual Deployment

1. **Update package.json**:
   - Change the `homepage` field to: `"https://yourusername.github.io/StockTradingGame"`
   - Replace `yourusername` with your GitHub username

2. **Build and deploy**:
   ```bash
   npm run build
   npm run deploy
   ```

3. **Enable GitHub Pages**:
   - Go to repository settings
   - Set source to "gh-pages" branch

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm start
   ```

3. **Open browser**:
   - Navigate to `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Troubleshooting

- If you get a blank page, check that the `homepage` field in `package.json` matches your GitHub Pages URL
- Make sure the repository name matches the path in the homepage URL
- Check that GitHub Pages is enabled in repository settings

## Features to Test

1. **Time Controls**: Play/pause, speed adjustment, fast forward
2. **Stock Selection**: Click on different stocks in the sidebar
3. **Trading**: Buy and sell stocks using the trading panel
4. **Portfolio**: Monitor your portfolio value and performance
5. **Chart**: Interactive stock price chart with tooltips
6. **Transaction History**: View your trading history
7. **Date Selection**: Change the starting date of the simulation 