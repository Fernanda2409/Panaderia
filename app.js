const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;


const bd = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'n0m3l0',
    database: 'panaderia_desesperanza'
});


bd.connect((err) => {
    if (err) {
        console.log('Error al conectar a la BD:', err);
        return;
    }
    console.log('Conectado a la BD');
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


const validarPrecioYStock = (precio, stock) => {
    
    if (precio <= 0 || precio > 10000 || isNaN(precio)) {
        return 'El precio debe estar entre 1 y 10,000 pesos';
    }
    
    if (stock <= 0 || stock > 100 || isNaN(stock)) {
        return 'El stock debe estar entre 1 y 100 unidades';
    }
    return null;
};


app.post('/pan/crear', (req, res) => {
    const { nombre, precio, descripcion, stock, imagen, categoria } = req.body;

    
    const error = validarPrecioYStock(precio, stock);
    if (error) {
        return res.status(400).send(error);
    }

    const sql = 'INSERT INTO panes (nombre, descripcion, precio, stock, imagen, categoria) VALUES (?, ?, ?, ?, ?, ?)';
    bd.query(sql, [nombre, descripcion, precio, stock, imagen, categoria], (err) => {
        if (err) {
            console.log('Error al agregar pan:', err);
            return res.status(500).send('Error al agregar pan');
        }
        res.send('Pan agregado exitosamente');
    });
});


app.get('/pan', (req, res) => {
    const sql = 'SELECT * FROM panes';
    bd.query(sql, (err, results) => {
        if (err) {
            console.log('Error al obtener panes:', err);
            return res.status(500).send('Error al obtener panes');
        }
        res.json(results);
    });
});


app.delete('/pan/eliminar/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM panes WHERE id = ?';
    bd.query(sql, [id], (err) => {
        if (err) {
            console.log('Error al eliminar pan:', err);
            return res.status(500).send('Error al eliminar pan');
        }
        res.send('Pan eliminado exitosamente');
    });
});


app.put('/pan/actualizar/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, imagen, categoria } = req.body;


    const error = validarPrecioYStock(precio, stock);
    if (error) {
        return res.status(400).send(error);
    }

    const sql = 'UPDATE panes SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagen = ?, categoria = ? WHERE id = ?';
    bd.query(sql, [nombre, descripcion, precio, stock, imagen, categoria, id], (err) => {
        if (err) {
            console.log('Error al actualizar pan:', err);
            return res.status(500).send('Error al actualizar pan');
        }
        res.send('Pan actualizado exitosamente');
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
