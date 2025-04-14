const form = document.getElementById('termsForm');
const submitButton = document.getElementById('submitButton');
const rutEmpresaInput = document.getElementById('rutEmpresa');
const rutRepresentanteInput = document.getElementById('rutRepresentante');
const numeroDocumentoInput = document.getElementById('numeroDocumento');
const acceptTerms = document.getElementById('acceptTerms');

// Función para validar RUT chileno
function validarRut(rut) {
    // Eliminar puntos y guión
    rut = rut.replace(/\./g, '').replace(/-/g, '');
    
    // Verificar formato básico
    if (!/^[0-9]{1,8}[0-9kK]$/.test(rut)) {
        return false;
    }
    
    // Separar número y dígito verificador
    const numero = rut.slice(0, -1);
    const dv = rut.slice(-1).toUpperCase();
    
    // Calcular dígito verificador
    let suma = 0;
    let multiplicador = 2;
    
    for (let i = numero.length - 1; i >= 0; i--) {
        suma += parseInt(numero.charAt(i)) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    
    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
    
    return dv === dvCalculado;
}

// Función para formatear RUT
function formatearRut(rut) {
    // Eliminar puntos y guión
    rut = rut.replace(/\./g, '').replace(/-/g, '');
    
    // Separar número y dígito verificador
    const numero = rut.slice(0, -1);
    const dv = rut.slice(-1).toUpperCase();
    
    // Formatear número con puntos
    let rutFormateado = '';
    for (let i = 0; i < numero.length; i++) {
        if (i > 0 && (numero.length - i) % 3 === 0) {
            rutFormateado += '.';
        }
        rutFormateado += numero.charAt(i);
    }
    
    // Agregar guión y dígito verificador
    return rutFormateado + '-' + dv;
}

// Función para validar número de documento (8 dígitos)
function validarNumeroDocumento(numero) {
    return /^\d{8}$/.test(numero);
}

// Función para validar el formulario
function validateForm() {
    const isRutEmpresaValid = validarRut(rutEmpresaInput.value);
    const isRutRepresentanteValid = validarRut(rutRepresentanteInput.value);
    const isNumeroDocumentoValid = validarNumeroDocumento(numeroDocumentoInput.value);
    const isTermsAccepted = acceptTerms.checked;

    // Mostrar mensajes de error si es necesario
    mostrarError(rutEmpresaInput, isRutEmpresaValid, 'RUT de empresa inválido');
    mostrarError(rutRepresentanteInput, isRutRepresentanteValid, 'RUT de representante inválido');
    mostrarError(numeroDocumentoInput, isNumeroDocumentoValid, 'El número de documento debe tener 8 dígitos');

    // Verificar si todos los campos son válidos
    const isFormValid = isRutEmpresaValid && isRutRepresentanteValid && isNumeroDocumentoValid && isTermsAccepted;
    
    // Habilitar o deshabilitar el botón
    submitButton.disabled = !isFormValid;
    
    // Para depuración
    console.log('Estado de validación:', {
        rutEmpresa: isRutEmpresaValid,
        rutRepresentante: isRutRepresentanteValid,
        numeroDocumento: isNumeroDocumentoValid,
        termsAccepted: isTermsAccepted,
        formValid: isFormValid
    });
}

// Función para mostrar errores
function mostrarError(input, isValid, mensaje) {
    const formGroup = input.parentElement;
    let errorElement = formGroup.querySelector('.error-message');
    
    if (!isValid && input.value !== '') {
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = mensaje;
        input.classList.remove('valid');
        input.classList.add('error');
    } else {
        if (errorElement) {
            errorElement.remove();
        }
        input.classList.remove('error');
        if (isValid && input.value !== '') {
            input.classList.add('valid');
        } else {
            input.classList.remove('valid');
        }
    }
}

// Eventos para formatear RUT mientras se escribe
rutEmpresaInput.addEventListener('input', function(e) {
    let valor = e.target.value.replace(/\./g, '').replace(/-/g, '');
    if (valor.length > 0) {
        e.target.value = formatearRut(valor);
    }
    validateForm();
});

rutRepresentanteInput.addEventListener('input', function(e) {
    let valor = e.target.value.replace(/\./g, '').replace(/-/g, '');
    if (valor.length > 0) {
        e.target.value = formatearRut(valor);
    }
    validateForm();
});

// Evento para validar número de documento
numeroDocumentoInput.addEventListener('input', function(e) {
    // Solo permitir números
    e.target.value = e.target.value.replace(/\D/g, '');
    validateForm();
});

// Evento para validar checkbox
acceptTerms.addEventListener('change', validateForm);

// Inicializar la validación al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    validateForm();
});

// Manejo del envío del formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!submitButton.disabled) {
        // Redirigir a la página de éxito
        window.location.href = 'success.html';
    }
});

// Detectar scroll para aplicar padding a la columna de imagen
document.addEventListener('DOMContentLoaded', function() {
    const imageColumn = document.querySelector('.image-column');
    const header = document.querySelector('.main-header');
    
    if (imageColumn && header) {
        window.addEventListener('scroll', function() {
            const headerHeight = header.offsetHeight;
            const scrollPosition = window.scrollY;
            
            if (scrollPosition > headerHeight) {
                imageColumn.classList.add('sticky');
            } else {
                imageColumn.classList.remove('sticky');
            }
        });
    }
});