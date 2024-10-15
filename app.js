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
            this.scrollToEnd(); // Desplaza el input hacia la derecha
        },
        clearInput() {
            this.operation = '';
            this.result = ''; // Limpia el campo de resultado
            this.barcode = ''; // Limpia el campo de código de barras
        },
        calculate() {
            try {
                // Cambia el % a /100 para calcular el porcentaje
                const finalOperation = this.operation
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/')
                    .replace(/%/g, '/100')
                    .trim(); // Elimina espacios al principio y final
                
                // Elimina operadores al final de la operación
                const cleanedOperation = finalOperation.replace(/[+\-*/]$/, ''); 

                // Asegúrate de que hay al menos un número antes de evaluar
                if (cleanedOperation) {
                    this.result = eval(cleanedOperation); // Evalúa la operación
                } else {
                    this.result = 'Error'; // Muestra error si no hay operación válida
                }
            } catch (error) {
                this.result = 'Error'; // Muestra error en caso de fallo en la evaluación
            }
        },
        calculateAndContinue() {
            try {
                // Cambia el % a /100 para calcular el porcentaje
                const finalOperation = this.operation
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/')
                    .replace(/%/g, '/100')
                    .trim(); // Elimina espacios al principio y final
                
                // Elimina operadores al final de la operación
                const cleanedOperation = finalOperation.replace(/[+\-*/]$/, ''); 

                // Asegúrate de que hay al menos un número antes de evaluar
                if (cleanedOperation) {
                    const result = eval(cleanedOperation); // Evalúa la operación
                    this.result = result; // Guarda el resultado
                    this.operation = result.toString(); // Actualiza la operación con el resultado para seguir operando
                } else {
                    this.result = 'Error'; // Muestra error si no hay operación válida
                }
            } catch (error) {
                this.result = 'Error'; // Muestra error en caso de fallo en la evaluación
            }
        },
        backspace() {
            this.operation = this.operation.slice(0, -1); // Elimina el último carácter
            this.calculate(); // Recalcula después de borrar
            this.scrollToEnd(); // Desplaza el input hacia la derecha
        },
        scanBarcode(barcode) {
            const product = this.entrada.find(item => item.cBarras === barcode);
            if (product) {
                if (this.operation.length > 0) {
                    if (this.isOperator(this.operation.slice(-1))) {
                        // Si hay un operador al final, añade solo el precio sin operador
                        this.operation += `${product.precio}`;
                    } else {
                        // Si no hay un operador al final, añade el precio con '+'
                        this.operation += ` + ${product.precio}`;
                    }
                } else {
                    // Si no hay nada en la operación, añade solo el precio sin operador
                    this.operation += `${product.precio}`;
                }
                this.barcode = ''; // Limpia el campo de código de barras después de usarlo
                this.calculate(); // Recalcula después de agregar el precio
                this.scrollToEnd(); // Desplaza el input hacia la derecha
            } else {
                alert('Producto no encontrado'); // Alerta si el producto no se encuentra
            }
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
    }    
});
