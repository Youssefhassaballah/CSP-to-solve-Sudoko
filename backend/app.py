from sudoku import SudokuCSP
import time
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/solve', methods=['POST'])
def solve_sudoku():
    """Solve a Sudoku puzzle"""
    data = request.json
    board = data.get('board')
    
    if not board or len(board) != 9 or any(len(row) != 9 for row in board):
        return jsonify({'error': 'Invalid board format. Must be 9x9 grid.'}), 400
    
    # Validate input board
    solver = SudokuCSP(board)
    is_valid, message = solver.validate_board()
    
    if not is_valid:
        return jsonify({'error': f'Invalid puzzle: {message}'}), 400
    
    # Apply arc consistency first
    start_time = time.time()
    arc_consistent = solver.arc_consistency()
    arc_time = time.time() - start_time
    
    if not arc_consistent:
        return jsonify({'error': 'Puzzle is inconsistent (no solution)'}), 400
    
    # Update board from domains (singleton assignments)
    solver.update_board_from_domains()
    
    # If not solved, use backtracking
    if any(0 in row for row in solver.board):
        start_time = time.time()
        solved = solver.solve_with_backtracking()
        backtrack_time = time.time() - start_time
        
        if not solved:
            return jsonify({'error': 'Puzzle has no solution'}), 400
    else:
        backtrack_time = 0
    
    return jsonify({
        'solved_board': solver.board,
        'arc_consistency_steps': solver.arc_consistency_steps,
        'time_arc': arc_time,
        'time_backtrack': backtrack_time,
        'total_time': arc_time + backtrack_time,
        'message': 'Puzzle solved successfully!'
    })

@app.route('/api/generate', methods=['GET'])
def generate_puzzle():
    """Generate a random Sudoku puzzle"""
    difficulty = request.args.get('difficulty', 'medium')
    
    if difficulty not in ['easy', 'medium', 'hard']:
        return jsonify({'error': 'Difficulty must be easy, medium, or hard'}), 400
    
    solver = SudokuCSP()
    puzzle = solver.generate_random_puzzle(difficulty)
    
    return jsonify({
        'puzzle': puzzle,
        'difficulty': difficulty,
        'message': f'Generated {difficulty} puzzle'
    })

@app.route('/api/validate', methods=['POST'])
def validate_puzzle():
    """Validate if a Sudoku puzzle is valid"""
    data = request.json
    board = data.get('board')
    
    if not board or len(board) != 9 or any(len(row) != 9 for row in board):
        return jsonify({'error': 'Invalid board format. Must be 9x9 grid.'}), 400
    
    solver = SudokuCSP(board)
    is_valid, message = solver.validate_board()
    
    return jsonify({
        'is_valid': is_valid,
        'message': message
    })

@app.route('/api/arc-consistency', methods=['POST'])
def apply_arc_consistency():
    """Apply arc consistency and return steps"""
    data = request.json
    board = data.get('board')
    
    if not board or len(board) != 9 or any(len(row) != 9 for row in board):
        return jsonify({'error': 'Invalid board format. Must be 9x9 grid.'}), 400
    
    solver = SudokuCSP(board)
    is_valid, message = solver.validate_board()
    
    if not is_valid:
        return jsonify({'error': f'Invalid puzzle: {message}'}), 400
    
    # Apply arc consistency
    start_time = time.time()
    arc_consistent = solver.arc_consistency()
    arc_time = time.time() - start_time
    
    # Update board from singleton domains
    updated = solver.update_board_from_domains()
    
    return jsonify({
        'is_consistent': arc_consistent,
        'board_after_arc': solver.board,
        'domains': {str(k): list(v) for k, v in solver.domains.items()},
        'arc_steps': solver.arc_consistency_steps,
        'cells_updated': updated,
        'time': arc_time,
        'message': 'Arc consistency applied successfully'
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Sudoku CSP Backend',
        'version': '1.0'
    })
    
# app.py (add this endpoint)
@app.route('/api/check-consistency', methods=['POST'])
def check_consistency():
    """Check if the current board state has at least one solution"""
    data = request.json
    board = data.get('board')
    
    if not board or len(board) != 9 or any(len(row) != 9 for row in board):
        return jsonify({'error': 'Invalid board format. Must be 9x9 grid.'}), 400
    
    # Create a copy of the board
    board_copy = [row[:] for row in board]
    
    # Check if the board is valid
    solver = SudokuCSP(board_copy)
    is_valid, message = solver.validate_board()
    
    if not is_valid:
        return jsonify({
            'has_solution': False,
            'message': f'Board is invalid: {message}',
            'invalid_cells': find_invalid_cells(board_copy)
        })
    
    # Apply arc consistency first
    arc_consistent = solver.arc_consistency()
    
    if not arc_consistent:
        return jsonify({
            'has_solution': False,
            'message': 'Board is inconsistent (no solution possible)',
            'invalid_cells': []
        })
    
    # If board is already solved, it's consistent
    if all(0 not in row for row in solver.board):
        return jsonify({
            'has_solution': True,
            'message': 'Board is solved and consistent',
            'invalid_cells': []
        })
    
    # Try to solve with backtracking (with timeout)
    start_time = time.time()
    solved = solver.solve_with_backtracking()
    
    if solved:
        return jsonify({
            'has_solution': True,
            'message': 'Board has at least one solution',
            'invalid_cells': []
        })
    else:
        return jsonify({
            'has_solution': False,
            'message': 'Board has no solution',
            'invalid_cells': find_contradiction_cells(board_copy, solver)
        })


def find_invalid_cells(board):
    """Find cells that violate Sudoku rules"""
    invalid_cells = []
    
    # Check rows
    for row in range(9):
        seen = {}
        for col in range(9):
            value = board[row][col]
            if value != 0:
                if value in seen:
                    invalid_cells.append((row, col))
                    invalid_cells.extend(seen[value])
                else:
                    seen[value] = [(row, col)]
    
    # Check columns
    for col in range(9):
        seen = {}
        for row in range(9):
            value = board[row][col]
            if value != 0:
                if value in seen:
                    invalid_cells.append((row, col))
                    invalid_cells.extend(seen[value])
                else:
                    seen[value] = [(row, col)]
    
    # Check subgrids
    for grid_row in range(0, 9, 3):
        for grid_col in range(0, 9, 3):
            seen = {}
            for i in range(3):
                for j in range(3):
                    row = grid_row + i
                    col = grid_col + j
                    value = board[row][col]
                    if value != 0:
                        if value in seen:
                            invalid_cells.append((row, col))
                            invalid_cells.extend(seen[value])
                        else:
                            seen[value] = [(row, col)]
    
    return list(set(invalid_cells))


def find_contradiction_cells(board, solver):
    """Find cells that likely caused the contradiction"""
    # This is a simplified version - in practice you might want
    # to use more sophisticated contradiction detection
    contradiction_cells = []
    
    # Check for cells with empty domains after arc consistency
    for (row, col), domain in solver.domains.items():
        if board[row][col] == 0 and len(domain) == 0:
            contradiction_cells.append((row, col))
    
    return contradiction_cells


if __name__ == '__main__':
    app.run(debug=True, port=5000)