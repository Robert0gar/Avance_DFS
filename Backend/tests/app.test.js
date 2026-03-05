const request = require("supertest");
const app = require("../src/app");
const db = require("../src/config/db");

// Datos para las pruebas
const adminUser = { email: "Roberto@gmail.com", password: "123456" };
let token = "";

beforeAll(async () => {
    // Obtenemos el token para las pruebas que requieren estar logueado
    const res = await request(app).post("/api/auth/login").send(adminUser);
    token = res.body.token;
});

afterAll(async () => {
    await db.end(); // Cerramos la conexión a la base de datos
});

describe("Suite de Pruebas - Panadería DFS", () => {
    
    // 1. Login Exitoso
    test("Login exitoso con credenciales correctas", async () => {
        const res = await request(app).post("/api/auth/login").send(adminUser);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
    });

    // 2. Login Fallido
    test("Login fallido con contraseña incorrecta", async () => {
        const res = await request(app).post("/api/auth/login").send({
            email: adminUser.email,
            password: "wrongpassword"
        });
        expect(res.statusCode).toBe(401);
    });

    // 3. Listar Registros
    test("Listar registros de productos", async () => {
        const res = await request(app)
            .get("/api/products")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("items");
    });

    // 4. Crear Registro (Admin)
    test("Crear un nuevo producto como admin", async () => {
        const res = await request(app)
            .post("/api/products")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Pan de Jest", price: 15, stock: 10 });
        expect(res.statusCode).toBe(201);
    });

    // 5. Acceso Permitido por Rol
    test("Acceso permitido a compras por tener token válido", async () => {
        const res = await request(app)
            .get("/api/purchases/my")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
    });

    // 6. Acceso Denegado por Rol
    test("Acceso denegado a panel admin sin token", async () => {
        const res = await request(app).post("/api/products").send({});
        expect(res.statusCode).toBe(401);
    });

    // 7. Validación Fallida
    test("Validación fallida al crear producto (campos vacíos)", async () => {
        const res = await request(app)
            .post("/api/products")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "", price: -10 }); // Datos inválidos
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    // 8. Filtros o Búsqueda (Simulado)
    test("Respuesta correcta al usar parámetros de búsqueda", async () => {
        const res = await request(app)
            .get("/api/products?search=pan")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
    });
});