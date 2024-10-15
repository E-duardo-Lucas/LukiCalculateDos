const app = new Vue({
    el: '#app',
    data: {
        operation: '',  // Almacena la operación ingresada
        result: '',     // Almacena el resultado
        barcode: '',    // Almacena el código de barras escaneado
        lastOperator: '', // Almacena el último operador utilizado
        entrada: [
            {cBarras: '7501125104268', nombre: 'electrolit', precio: 21},
            {cBarras: '0987654567897', nombre: 'frijoles', precio: 16},
            // Puedes agregar más productos aquí
        ] // Lista de productos con código de barras
    },
    methods: {
        append(value) {
            // Verifica si el último carácter es un operador para evitar operadores consecutivos
            if (this.isOperator(value) && this.isOperator(this.operation.slice(-1))) {
                return; // No permite agregar dos operadores seguidos
            }
            this.operation += value; // Agrega el valor ingresado a la operación
            this.calculate(); // Calcula automáticamente después de agregar
        },
        clearInput() {
            this.operation = '';
            this.result = ''; // Limpia el campo de resultado
            this.barcode = ''; // Limpia el campo de código de barras
            this.lastOperator = ''; // Resetea el último operador
        },
        calculate() {
            try {
                this.result = eval(this.operation.replace(/×/g, '*').replace(/÷/g, '/'));
            } catch (error) {
                this.result = 'Error'; // Muestra error en caso de fallo en la evaluación
            }
        },
        backspace() {
            this.operation = this.operation.slice(0, -1); // Elimina el último carácter
            this.calculate(); // Recalcula después de borrar
        },
        scanBarcode(barcode) {
            const product = this.entrada.find(item => item.cBarras === barcode);
            if (product) {
                if (this.operation.length > 0) {
                    this.operation += ` + ${product.precio}`; // Suma el precio al final de la operación
                } else {
                    this.operation += `${product.precio}`; // Añade el precio directamente si no hay operación
                }
                this.barcode = ''; // Limpia el campo de código de barras después de usarlo
                this.calculate(); // Recalcula después de agregar el precio
            } else {
                alert('Producto no encontrado'); // Alerta si el producto no se encuentra
            }
        },
        isOperator(value) {
            return ['+', '-', '*', '/'].includes(value); // Verifica si es un operador
        }
    }    
});
