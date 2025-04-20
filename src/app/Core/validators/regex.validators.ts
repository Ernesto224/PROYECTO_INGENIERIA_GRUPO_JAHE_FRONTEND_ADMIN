export const ExpresionesRegulares = {
    descripciones: /^[a-zA-Z0-9\s.,áéíóúÁÉÍÓÚñÑ]{10,500}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    passwordSegura: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,16}$/,
};
