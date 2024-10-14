const app = new Vue({
    el: '#app',
    data: {
        operation: '',  // Almacena la operación ingresada
        result: '',     // Almacena el resultado
        isOpenParenthesis: true  // Controla si el siguiente paréntesis es '(' o ')'
    },
    methods: {
        append(value) {
            // Si es un operador, maneja la ley de signos
            if (this.isOperator(value)) {
                this.handleOperators(value);
            } else if (value === 'parenthesis') {
                // Lógica para alternar entre '(' y ')'
                this.toggleParenthesis();
            } else if (value === '.') {
                // Lógica para manejar puntos decimales
                const lastNumber = this.operation.split(/[\+\-\*\/\(\)]/).pop(); // Toma el último número antes de un operador
                if (!lastNumber.includes('.')) {
                    this.operation += value;
                }
            } else {
                this.operation += value;
            }
        },
        toggleParenthesis() {
            if (this.isOpenParenthesis) {
                this.operation += '(';
            } else {
                this.operation += ')';
            }
            this.isOpenParenthesis = !this.isOpenParenthesis;
        },
        clearInput() {
            // Limpia la operación y el resultado
            this.operation = '';
            this.result = '';
            this.isOpenParenthesis = true;  // Resetea el estado de los paréntesis
        },
        calculate() {
            try {
                // Calcula la operación respetando la ley de los signos y paréntesis
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
            // Verifica si el valor es un operador
            return ['+', '-', '*', '/'].includes(value);
        },
        handleOperators(value) {
            const lastChar = this.operation.slice(-1);

            if (lastChar === '+' || lastChar === '-') {
                if (value === '*' || value === '/') {
                    this.operation = this.operation.slice(0, -1) + value;
                } else {
                    this.operation += value;
                }
            } else if (lastChar === '*' || lastChar === '/') {
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
