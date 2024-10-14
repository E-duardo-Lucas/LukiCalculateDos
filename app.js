const app = new Vue({
    el: '#app',
    data: {
        operation: '', // Almacena la operación ingresada
        result: ''     // Almacena el resultado
    },
    methods: {
        append(value) {
            // Si se ingresa un operador, revisa la ley de signos
            if (this.isOperator(value)) {
                this.handleOperators(value);
            } else {
                this.operation += value;
            }
        },
        clearInput() {
            // Limpia la operación y el resultado
            this.operation = '';
            this.result = '';
        },
        calculate() {
            try {
                // Calcula la operación usando eval, para respetar la ley de los signos y los paréntesis
                this.result = eval(this.operation.replace(/×/g, '*').replace(/÷/g, '/'));
            } catch (error) {
                this.result = 'Error';
            }
        },
        backspace() {
            // Elimina el último carácter ingresado
            this.operation = this.operation.slice(0, -1);
        },
        isOperator(value) {
            // Revisa si el valor ingresado es un operador
            return ['+', '-', '*', '/'].includes(value);
        },
        handleOperators(value) {
            // Reemplaza operadores incorrectos si se intenta poner un operador después de otro
            const lastChar = this.operation.slice(-1);

            if (lastChar === '+' || lastChar === '-') {
                // Si hay un '+' o '-' antes, y se ingresa '*' o '/', reemplaza el anterior
                if (value === '*' || value === '/') {
                    this.operation = this.operation.slice(0, -1) + value;
                } else {
                    this.operation += value;
                }
            } else if (lastChar === '*' || lastChar === '/') {
                // Si hay un '*' o '/' antes, y se ingresa un '+' o '-', reemplaza el anterior
                if (value === '+' || value === '-') {
                    this.operation = this.operation.slice(0, -1) + value;
                } else {
                    this.operation += value;
                }
            } else {
                this.operation += value;
            }
        }
    }
});
