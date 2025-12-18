# Sudoku Solver with Constraint Satisfaction Problem (CSP)

An interactive Sudoku solver application that implements CSP algorithms with visual arc consistency demonstration. This project features both automatic puzzle generation and a custom board mode, providing an educational visualization of how constraint propagation works in solving Sudoku puzzles.

## Features

### Core Functionality
- **Intelligent Solver**: Implements AC-3 (Arc Consistency Algorithm #3) with backtracking
- **Arc Consistency Visualization**: Step-by-step animation showing how constraints propagate through the puzzle
- **Domain Tracking**: Real-time visualization of possible values for each cell
- **Puzzle Generation**: Generate random puzzles in three difficulty levels (easy, medium, hard)
- **Custom Board Mode**: Create and solve your own Sudoku puzzles
- **Validation System**: Real-time validation with detailed error feedback
- **Statistics Dashboard**: Track solving performance metrics

### Algorithms Implemented
- **AC-3 (Arc Consistency)**: Constraint propagation algorithm that reduces domains
- **Backtracking with MRV**: Minimum Remaining Values heuristic for efficient search
- **Least Constraining Value**: Smart value ordering for reduced backtracking
- **Forward Checking**: Early detection of constraint violations

## Technology Stack

### Backend
- Python 3
- Flask (Web framework)
- Flask-CORS (Cross-origin resource sharing)

### Frontend
- React 19.2
- Vite (Build tool)
- TailwindCSS 4 (Styling)
- React Router (Navigation)
- Framer Motion (Animations)
- Recharts (Statistics visualization)
- Lucide React (Icons)

## Project Structure

```
CSP-to-solve-Sudoku/
├── backend/
│   ├── app.py              # Flask API server
│   └── sudoku.py           # CSP solver implementation
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Board/      # Sudoku board components
│   │   │   ├── Controls/   # Game controls and inputs
│   │   │   ├── Info/       # Statistics and visualization
│   │   │   ├── Layout/     # Layout components
│   │   │   └── Welcome/    # Welcome screen components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main application component
│   └── package.json        # Frontend dependencies
└── README.md               # This file
```

## Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install flask flask-cors
```

3. Run the Flask server:
```bash
python app.py
```

The backend server will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

## Usage

### Playing a Generated Puzzle

1. Open the application in your browser
2. Select a difficulty level (Easy, Medium, or Hard)
3. Click "Start Game"
4. Fill in the cells or click "Solve" to see the CSP algorithm in action
5. Watch the arc consistency visualization to understand the solving process

### Custom Board Mode

1. Select "Custom Mode" from the welcome screen
2. Create your own Sudoku puzzle by filling in the cells
3. Click "Validate Board" to check if the puzzle is solvable
4. Click "Solve" to see the solution

### Arc Consistency Visualization

The application provides detailed visualization of the arc consistency algorithm:
- **Domain Updates**: See how possible values are eliminated from cells
- **Step-by-Step Animation**: Watch constraints propagate through the board
- **Cell Highlighting**: Visual feedback showing which cells are being processed
- **Domain Viewer**: Inspect the remaining possible values for any cell

## API Endpoints

### POST `/api/solve`
Solve a Sudoku puzzle using CSP algorithms

**Request Body:**
```json
{
  "board": [[5,3,0,...], ...]  // 9x9 array with 0 for empty cells
}
```

**Response:**
```json
{
  "solved_board": [[5,3,4,...], ...],
  "domains": {...},
  "time_arc": 0.023,
  "time_backtrack": 0.015,
  "total_time": 0.038,
  "message": "Puzzle solved successfully!"
}
```

### GET `/api/generate?difficulty=medium`
Generate a random Sudoku puzzle

**Query Parameters:**
- `difficulty`: "easy", "medium", or "hard"

**Response:**
```json
{
  "puzzle": [[5,0,0,...], ...],
  "difficulty": "medium",
  "message": "Generated medium puzzle"
}
```

### POST `/api/validate`
Validate if a Sudoku puzzle is valid (no rule violations)

**Request Body:**
```json
{
  "board": [[5,3,0,...], ...]
}
```

**Response:**
```json
{
  "is_valid": true,
  "message": "Board is valid"
}
```

### POST `/api/arc-consistency`
Apply arc consistency and return detailed steps

**Request Body:**
```json
{
  "board": [[5,3,0,...], ...]
}
```

**Response:**
```json
{
  "is_consistent": true,
  "board_after_arc": [[5,3,4,...], ...],
  "domains": {...},
  "arc_steps": [...],
  "cells_updated": 15,
  "time": 0.023
}
```

### POST `/api/check-consistency`
Check if a board has at least one valid solution

**Request Body:**
```json
{
  "board": [[5,3,0,...], ...]
}
```

**Response:**
```json
{
  "has_solution": true,
  "message": "Board has at least one solution",
  "invalid_cells": [],
  "arc_consistency_steps": [...],
  "domains": {...}
}
```

### GET `/api/health`
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "service": "Sudoku CSP Backend",
  "version": "1.0"
}
```

## Algorithm Details

### Arc Consistency (AC-3)

The AC-3 algorithm enforces arc consistency by iteratively removing values from variable domains that can never be part of any solution:

1. Initialize a queue with all arcs (constraint pairs)
2. For each arc (Xi, Xj), remove values from Xi's domain that are inconsistent with Xj
3. If Xi's domain changes, add all arcs (Xk, Xi) back to the queue
4. Continue until queue is empty or a domain becomes empty (inconsistent puzzle)

### Backtracking with Heuristics

When arc consistency alone doesn't solve the puzzle, backtracking search is used:

- **MRV (Minimum Remaining Values)**: Choose the variable with the fewest legal values
- **Least Constraining Value**: Order values by how many choices they leave for other variables
- **Forward Checking**: Propagate constraints after each assignment

## Development

### Running Tests

Backend tests:
```bash
cd backend
python -m pytest
```

Frontend tests:
```bash
cd frontend
npm test
```

### Building for Production

Frontend build:
```bash
cd frontend
npm run build
```

### Linting

```bash
cd frontend
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is an academic assignment for AI coursework.

## Acknowledgments

- Constraint Satisfaction Problem algorithms based on Russell & Norvig's "Artificial Intelligence: A Modern Approach"
- AC-3 algorithm implementation inspired by classic CSP literature
- UI/UX design inspired by modern puzzle game interfaces

## Contact

For questions or issues, please open an issue in the repository.
