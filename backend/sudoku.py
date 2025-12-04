import copy
import random

class SudokuCSP:
    def __init__(self, initial_board=None):
        self.size = 9
        self.subgrid_size = 3
        
        if initial_board:
            self.board = initial_board
        else:
            self.board = [[0 for _ in range(self.size)] for _ in range(self.size)]
        self.domains = {}
        self.initialize_domains()
        self.arc_consistency_steps = []
    
    def initialize_domains(self):
        for row in range(self.size):
            for col in range(self.size):
                if self.board[row][col] != 0:
                    self.domains[(row, col)] = {self.board[row][col]}
                else:
                    self.domains[(row, col)] = set(range(1, 10))
    
    def get_arcs(self):
        arcs = []
        
        # Row constraints
        for row in range(self.size):
            for col1 in range(self.size):
                for col2 in range(self.size):
                    if col1 != col2:
                        arcs.append(((row, col1), (row, col2)))
        
        # Column constraints
        for col in range(self.size):
            for row1 in range(self.size):
                for row2 in range(self.size):
                    if row1 != row2:
                        arcs.append(((row1, col), (row2, col)))
        
        # Subgrid constraints
        for subgrid_row in range(0, self.size, self.subgrid_size):
            for subgrid_col in range(0, self.size, self.subgrid_size):
                cells = []
                for i in range(self.subgrid_size):
                    for j in range(self.subgrid_size):
                        cells.append((subgrid_row + i, subgrid_col + j))
                
                for i in range(len(cells)):
                    for j in range(len(cells)):
                        if i != j:
                            arcs.append((cells[i], cells[j]))
        
        # Remove duplicates while preserving order
        unique_arcs = []
        seen = set()
        for arc in arcs:
            if arc not in seen and (arc[1], arc[0]) not in seen:
                unique_arcs.append(arc)
                seen.add(arc)
        
        return unique_arcs
    
    def revise(self, xi, xj) :
        revised = False
        values_to_remove = set()
        
        for value in self.domains[xi]:
            # Check if there exists at least one value in domain of xj
            # that is compatible with current value in xi
            compatible = False
            
            for other_value in self.domains[xj]:
                if value != other_value:
                    compatible = True
                    break
            
            if not compatible:
                values_to_remove.add(value)
                revised = True
        
        # Remove inconsistent values
        self.domains[xi] -= values_to_remove
        
        # Record step for visualization
        if revised and values_to_remove:
            self.arc_consistency_steps.append({
                'arc': (xi, xj),
                'cell': xi,
                'removed_values': list(values_to_remove),
                'remaining_domain': list(self.domains[xi])
            })
        
        return revised
    
    def arc_consistency(self):
        arcs = self.get_arcs()
        queue = arcs.copy()
        
        while queue:
            xi, xj = queue.pop(0)
            
            if self.revise(xi, xj):
                # If domain of xi becomes empty, puzzle is inconsistent
                if not self.domains[xi]:
                    return False
                
                # Add all arcs pointing to xi (except xj)
                for xk in self.get_neighbors(xi):
                    if xk != xj:
                        queue.append((xk, xi))
        
        return True
    
    def get_neighbors(self, cell):
        row, col = cell
        neighbors = set()
        
        # Row neighbors
        for c in range(self.size):
            if c != col:
                neighbors.add((row, c))
        
        # Column neighbors
        for r in range(self.size):
            if r != row:
                neighbors.add((r, col))
        
        # Subgrid neighbors
        subgrid_row = (row // self.subgrid_size) * self.subgrid_size
        subgrid_col = (col // self.subgrid_size) * self.subgrid_size
        
        for i in range(self.subgrid_size):
            for j in range(self.subgrid_size):
                r = subgrid_row + i
                c = subgrid_col + j
                if (r, c) != (row, col):
                    neighbors.add((r, c))
        
        return list(neighbors)
    
    def update_board_from_domains(self):
        updated = 0
        for (row, col), domain in self.domains.items():
            if len(domain) == 1 and self.board[row][col] == 0:
                value = next(iter(domain))
                self.board[row][col] = value
                updated += 1
        
        return updated
    
    def solve_with_backtracking(self):
        return self.backtrack({})
    
    def backtrack(self, assignment):
        # If all cells are assigned, solution is complete
        if len(assignment) == self.size * self.size:
            return True
        
        # Select unassigned variable using MRV heuristic
        var = self.select_unassigned_variable(assignment)
        
        # Try values in order
        for value in self.order_domain_values(var, assignment):
            # Check if assignment is consistent
            if self.is_consistent(var, value, assignment):
                # Make assignment
                assignment[var] = value
                self.board[var[0]][var[1]] = value
                
                # Save current domains for backtracking
                old_domains = copy.deepcopy(self.domains)
                self.domains[var] = {value}
                
                # Apply forward checking (optional)
                if self.forward_check(var, value):
                    # Recursive call
                    if self.backtrack(assignment):
                        return True
                
                # Backtrack
                del assignment[var]
                self.board[var[0]][var[1]] = 0
                self.domains = old_domains
        
        return False
    
    def select_unassigned_variable(self, assignment):
        unassigned = []
        for row in range(self.size):
            for col in range(self.size):
                if (row, col) not in assignment:
                    unassigned.append((row, col, len(self.domains[(row, col)])))
        
        # Sort by domain size (MRV)
        unassigned.sort(key=lambda x: x[2])
        return (unassigned[0][0], unassigned[0][1])
    
    def order_domain_values(self, var, assignment) :
        """Order domain values using Least Constraining Value heuristic"""
        row, col = var
        values = list(self.domains[var])
        
        # Count constraints for each value
        constraints_count = []
        for value in values:
            count = 0
            for neighbor in self.get_neighbors(var):
                if neighbor not in assignment and value in self.domains[neighbor]:
                    count += 1
            constraints_count.append((value, count))
        
        # Sort by least constraining first
        constraints_count.sort(key=lambda x: x[1])
        return [item[0] for item in constraints_count]
    
    def is_consistent(self, var, value, assignment) :
        
        row, col = var
        # Check row
        for c in range(self.size):
            if (row, c) in assignment and assignment[(row, c)] == value:
                return False
        
        # Check column
        for r in range(self.size):
            if (r, col) in assignment and assignment[(r, col)] == value:
                return False
        
        # Check subgrid
        subgrid_row = (row // self.subgrid_size) * self.subgrid_size
        subgrid_col = (col // self.subgrid_size) * self.subgrid_size
        for i in range(self.subgrid_size):
            for j in range(self.subgrid_size):
                r = subgrid_row + i
                c = subgrid_col + j
                if (r, c) in assignment and assignment[(r, c)] == value:
                    return False
        
        return True
    
    def forward_check(self, var, value):
        for neighbor in self.get_neighbors(var):
            if value in self.domains[neighbor]:
                self.domains[neighbor].remove(value)
                if not self.domains[neighbor]:
                    return False  # Domain wipe-out
        return True
    
    def generate_random_puzzle(self, difficulty='easy'):
        """
        Generate a random Sudoku puzzle
        difficulty: 'easy', 'medium', or 'hard'
        """
        # Start with empty board
        self.board = [[0 for _ in range(self.size)] for _ in range(self.size)]
        self.initialize_domains()
        
        # Fill diagonal subgrids (they are independent)
        for i in range(0, self.size, self.subgrid_size):
            values = list(range(1, 10))
            random.shuffle(values)
            for j in range(self.subgrid_size):
                for k in range(self.subgrid_size):
                    self.board[i + j][i + k] = values[j * self.subgrid_size + k]
        
        # Solve the complete board
        self.initialize_domains()
        self.solve_with_backtracking()
        
        # Now remove numbers based on difficulty
        cells = [(i, j) for i in range(self.size) for j in range(self.size)]
        random.shuffle(cells)
        
        # Number of cells to keep based on difficulty
        difficulty_levels = {
            'easy': 40,    # Keep ~40 cells
            'medium': 30,  # Keep ~30 cells
            'hard': 25     # Keep ~25 cells
        }
        
        cells_to_keep = difficulty_levels.get(difficulty, 35)
        
        solution = copy.deepcopy(self.board)
        
        # Try removing cells while maintaining unique solution
        removed = 0
        for cell in cells:
            if removed >= self.size * self.size - cells_to_keep:
                break
            
            row, col = cell
            original_value = self.board[row][col]
            self.board[row][col] = 0
            
            # Check if puzzle still has unique solution
            test_solver = SudokuCSP(copy.deepcopy(self.board))
            if test_solver.solve_with_backtracking():
                # Check if solution is unique
                test_solver2 = SudokuCSP(copy.deepcopy(self.board))
                test_solver2.solve_with_backtracking()
                
                # Simple uniqueness check (not perfect but good enough)
                if test_solver.board == test_solver2.board:
                    removed += 1
                else:
                    self.board[row][col] = original_value
            else:
                self.board[row][col] = original_value
        
        self.solution = solution
        return self.board
    
    
    def validate_board(self):
        # Check rows
        for row in range(self.size):
            seen = set()
            for col in range(self.size):
                if self.board[row][col] != 0:
                    if self.board[row][col] in seen:
                        return False, f"Row {row + 1} has duplicate {self.board[row][col]}"
                    seen.add(self.board[row][col])
        
        # Check columns
        for col in range(self.size):
            seen = set()
            for row in range(self.size):
                if self.board[row][col] != 0:
                    if self.board[row][col] in seen:
                        return False, f"Column {col + 1} has duplicate {self.board[row][col]}"
                    seen.add(self.board[row][col])
        
        # Check subgrids
        for subgrid_row in range(0, self.size, self.subgrid_size):
            for subgrid_col in range(0, self.size, self.subgrid_size):
                seen = set()
                for i in range(self.subgrid_size):
                    for j in range(self.subgrid_size):
                        row = subgrid_row + i
                        col = subgrid_col + j
                        if self.board[row][col] != 0:
                            if self.board[row][col] in seen:
                                return False, f"Subgrid ({subgrid_row//3 + 1}, {subgrid_col//3 + 1}) has duplicate {self.board[row][col]}"
                            seen.add(self.board[row][col])
        
        return True, "Board is valid"
    
    def get_board_state(self):
        return {
            'board': self.board,
            'domains': {str(k): list(v) for k, v in self.domains.items()},
            'arc_steps': self.arc_consistency_steps
        }


def print_board(board):
    for row in board:
        print(" ".join(str(x) if x != 0 else "." for x in row))
    print()


def main():
    puzzle = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ]

    print("Initial Puzzle:")
    print_board(puzzle)

    csp = SudokuCSP(initial_board=puzzle)

    print("Running AC-3 consistency check...")
    ac3_result = csp.arc_consistency()
    print("AC-3 Result:", ac3_result)

    print("\nBoard After AC-3:")
    print_board(csp.board)

    print("Solving with Backtracking...")
    solved = csp.solve_with_backtracking()

    print("\nSolved:", solved)
    print("\nFinal Board:")
    print_board(csp.board)

    valid, msg = csp.validate_board()
    print("Validation:", msg)


if __name__ == "__main__":
    main()
