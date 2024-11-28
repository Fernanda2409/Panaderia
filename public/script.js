document.getElementById('panForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const stock = document.getElementById('stock').value;
    const imagen = document.getElementById('imagen').value;
    const categoria = document.getElementById('categoria').value;

    await fetch('/pan/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion, precio, stock, imagen, categoria })
    });

    loadPanList();
});

async function loadPanList() {
    const res = await fetch('/pan');
    const panes = await res.json();

    const panList = document.getElementById('panList');
    panList.innerHTML = '';

    panes.forEach((pan) => {
        const panDiv = document.createElement('div');
        panDiv.className = 'pan';

        panDiv.innerHTML = `
            <img src="${pan.imagen}" alt="${pan.nombre}">
            <h3>${pan.nombre}</h3>
            <p>${pan.descripcion}</p>
            <p>Precio: $${pan.precio}</p>
            <p>Stock: ${pan.stock}</p>
            <p>Categoría: ${pan.categoria}</p>
            <button onclick="deletePan(${pan.id})">Eliminar</button>
            <button onclick="updatePan(${pan.id})">Actualizar</button>
        `;

        panList.appendChild(panDiv);
    });
}

async function deletePan(id) {
    await fetch(`/pan/eliminar/${id}`, { method: 'DELETE' });
    loadPanList();
}

async function updatePan(id) {
    const nombre = prompt('Nuevo nombre del pan:');
    const descripcion = prompt('Nueva descripción del pan:');
    const precio = prompt('Nuevo precio del pan:');
    const stock = prompt('Nuevo stock del pan:');
    const imagen = prompt('Nueva URL de la imagen:');
    const categoria = prompt('Nueva categoría (Día de Muertos o Halloween):');

    await fetch(`/pan/actualizar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion, precio, stock, imagen, categoria })
    });

    loadPanList();
}

document.addEventListener('DOMContentLoaded', loadPanList);
