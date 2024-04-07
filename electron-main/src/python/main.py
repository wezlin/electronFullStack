from greet import greet
from square import square
import sys

def main():
    if len(sys.argv) < 2:
        print("Usage: main.py <function_name> [arguments...]")
        return

    function_name = sys.argv[1]

    if function_name == 'greet':
        greet_name = sys.argv[2] if len(sys.argv) > 2 else "John"
        result = greet(greet_name)
    elif function_name == 'square':
        square_number = int(sys.argv[2]) if len(sys.argv) > 2 else 5
        result = square(square_number)
    else:
        result = f"Unknown function: {function_name}"

    print(result)

if __name__ == "__main__":
    main()
