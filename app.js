const app = new Vue({
    el: '#app',
    data: {
        operation: '',  // Almacena la operación ingresada
        result: '',     // Almacena el resultado
        barcode: '',    // Almacena el código de barras escaneado
        entrada: [
            {cBarras: '7501125104268', nombre: 'electrolit', precio: 21},
            {cBarras: '0987654567897', nombre: 'frijoles', precio: 16},
            // Puedes agregar más productos aquí
        ], // Lista de productos con código de barras
        historial: [],  // Almacena el historial de operaciones
        temporary: [],  // Almacena temporalmente la operación actual y el resultado
    },
    methods: {
        append(value) {
            // Verifica si el último carácter es un operador para evitar operadores consecutivos
            if (this.isOperator(value) && this.isOperator(this.operation.slice(-1))) {
                return; // No permite agregar dos operadores seguidos
            }
            this.operation += value; // Agrega el valor ingresado a la operación
            this.calculate(); // Calcula automáticamente después de agregar
            this.scrollToEnd(); // Desplaza el input hacia la derecha
            this.updateTemporaryDB(); // Actualiza el localStorage temporal
        },
        clearInput() {
            this.operation = '';
            this.result = ''; // Limpia el campo de resultado
            this.barcode = ''; // Limpia el campo de código de barras
            localStorage.removeItem('temporaryDB'); // Elimina el almacenamiento temporal
        },
        calculate() {
            const finalOperation = this.cleanOperation(this.operation);
            if (finalOperation) {
                try {
                    this.result = eval(finalOperation); // Evalúa la operación
                } catch (error) {
                    this.result = 'Error'; // Muestra error en caso de fallo en la evaluación
                }
            } else {
                this.result = 'Error'; // Muestra error si no hay operación válida
            }
        },
        cleanOperation(operation) {
            return operation
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/%/g, '/100')
                .replace(/[+\-*/]$/, '') // Elimina operadores al final
                .trim(); // Elimina espacios al principio y final
        },
        calculateAndContinue() {
            const finalOperation = this.cleanOperation(this.operation);
            if (finalOperation) {
                try {
                    const result = eval(finalOperation); // Evalúa la operación
                    this.result = result; // Guarda el resultado
                    this.operation = result.toString(); // Actualiza la operación con el resultado para seguir operando

                    // Guardar en historialDB
                    const date = new Date().toLocaleString(); // Fecha actual
                    const historyItem = { operation: this.operation, result: this.result, date: date };
                    this.historial.push(historyItem);
                    localStorage.setItem('historialDB', JSON.stringify(this.historial));

                    // Limpiar temporaryDB al finalizar operación
                    localStorage.removeItem('temporaryDB');
                } catch (error) {
                    this.result = 'Error'; // Muestra error en caso de fallo en la evaluación
                }
            } else {
                this.result = 'Error'; // Muestra error si no hay operación válida
            }
        },
        backspace() {
            this.operation = this.operation.slice(0, -1); // Elimina el último carácter
            this.calculate(); // Recalcula después de borrar
            this.scrollToEnd(); // Desplaza el input hacia la derecha
            this.updateTemporaryDB(); // Actualiza el localStorage temporal
        },
        scanBarcode(barcode) {
            const product = this.entrada.find(item => item.cBarras === barcode);
            if (product) {
                this.addPriceToOperation(product.precio);
                this.barcode = ''; // Limpia el campo de código de barras después de usarlo
                this.calculate(); // Recalcula después de agregar el precio
                this.scrollToEnd(); // Desplaza el input hacia la derecha
                this.updateTemporaryDB(); // Actualiza el localStorage temporal
            } else {
                alert('Producto no encontrado'); // Alerta si el producto no se encuentra
                this.barcode = '';
            }
        },
        addPriceToOperation(price) {
            if (this.operation.length > 0) {
                this.operation += this.isOperator(this.operation.slice(-1)) ? `${price}` : ` + ${price}`;
            } else {
                this.operation += `${price}`;
            }
        },
        updateTemporaryDB() {
            const temporaryItem = { operation: this.operation, result: this.result };
            localStorage.setItem('temporaryDB', JSON.stringify(temporaryItem));
        },
        scrollToEnd() {
            const displayInput = document.getElementById('display'); // Obtiene el elemento del input
            setTimeout(() => {
                displayInput.scrollLeft = displayInput.scrollWidth; // Desplaza el scroll al final
            }, 0); // Ajuste el tiempo a 0 milisegundos
        },        
        isOperator(value) {
            return ['+', '-', '*', '/'].includes(value); // Verifica si es un operador
        }
    },

    created() {
        const historialDB = JSON.parse(localStorage.getItem('historialDB')) || [];
        this.historial = historialDB;

        const temporaryDB = JSON.parse(localStorage.getItem('temporaryDB'));
        if (temporaryDB) {
            this.operation = temporaryDB.operation;
            this.result = temporaryDB.result;
        }    
    }
});
