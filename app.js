//Funtanillas, Belén Primer Parcial Laboratorio 3
class Vehiculo {
    id = "";
    modelo = "";
    anoFab = "";
    velMax = "";
    constructor(id, modelo, anoFab, velMax) {
        this.id = id;
        this.modelo = modelo;
        this.anoFab = anoFab;
        this.velMax = velMax;
    }

    mostrarInfo() {
        return `${this.modelo}, Año Fabricacion: ${this.anoFab}, Velocidad Maxima: ${this.velMax}`;
    }
}
class Terrestre extends Vehiculo {
    cantPue = 0;
    cantRue = 0;
    constructor(id, modelo, anoFab, velMax, cantPue, cantRue) {
        super(id, modelo, anoFab, velMax);
        this.cantPue = cantPue || 0;
        this.cantRue = cantRue || 0;
    }

    mostrarInfo() {
        return `${super.mostrarInfo()}, Cant. Puertas: ${this.cantPue}, Cant.Ruedas: ${this.cantRue}`;
    }
}

class Aereo extends Vehiculo {
    altMax = 0;
    autonomia = 0;
    constructor(id, modelo, anoFab, velMax, altMax, autonomia) {
        super(id, modelo, anoFab, velMax);
        this.altMax = altMax || 0;
        this.autonomia = autonomia || 0;
    }

    mostrarInfo() {
        return `${super.mostrarInfo()}, Altura Max: ${this.altMax}, Autonomia: ${this.autonomia}`;
    }
}

window.addEventListener('load', function () {
    // Almaceno los datos iniciales en formato JSON
    const jsonString =
        `[
            { "id":14, "modelo": "Ferrari F100", "anoFab": 1998, "velMax": 400, "cantPue": 2, "cantRue": 4 },
            { "id":51, "modelo": "Dodge Viper", "anoFab": 1991, "velMax": 266, "cantPue": 2, "cantRue": 4 },
            { "id":67, "modelo": "Boeing CH-47 Chinook", "anoFab": 1962, "velMax": 302, "altMax": 6, "autonomia": 1200 },
            { "id":666, "modelo": "Aprilia RSV 1000 R", "anoFab": 2004, "velMax": 280, "cantPue": 0, "cantRue": 2 },
            { "id": 872, "modelo": "Boeing 747-400", "anoFab": 1989, "velMax": 988, "altMax": 13, "autonomia": 13450 },
            { "id": 742, "modelo": "Cessna CH-1 SkyhookR", "anoFab": 1953, "velMax": 174, "altMax": 3, "autonomia": 870 }
        ]`;


    // Parseo el string JSON y mapeo las instancias a "Terrestre" o "Aereo"
    let data = JSON.parse(jsonString).map(obj => {
        if (obj.cantRue !== undefined) {
            return new Terrestre(obj.id, obj.modelo, obj.anoFab, obj.velMax, obj.cantPue, obj.cantRue);
        } else {
            return new Aereo(obj.id, obj.modelo, obj.anoFab, obj.velMax, obj.altMax, obj.autonomia);
        }
    });

    const tableBody = document.getElementById('tableBody');
    const abmForm = document.getElementById('formABM');
    const formDatos = document.getElementById('formDatos');
    const tipoFiltro = document.getElementById('tipoFiltro');
    let editingVehiculo = null;

    function renderTable(filter = 'todos') {
        tableBody.innerHTML = '';
        let filteredData = data;

        if (filter === 'terrestre') {
            filteredData = data.filter(obj => obj instanceof Terrestre);
        } else if (filter === 'aereo') {
            filteredData = data.filter(obj => obj instanceof Aereo);
        }

        filteredData.forEach(obj => {
            row = document.createElement('tr');
            td1 = document.createElement('td');
            td2 = document.createElement('td');
            td3 = document.createElement('td');
            td4 = document.createElement('td');
            td5 = document.createElement('td');
            td6 = document.createElement('td');
            td7 = document.createElement('td');
            td8 = document.createElement('td');
            td9 = document.createElement('td');
            td1.textContent = obj.id;
            td2.textContent = obj.modelo;
            td3.textContent = obj.anoFab;
            td4.textContent = obj.velMax;
            td5.textContent = obj instanceof Terrestre ? obj.cantPue : '';
            td6.textContent = obj instanceof Aereo ? obj.altMax : '';
            td7.textContent = obj instanceof Aereo ? obj.autonomia : '';
            td8.textContent = obj instanceof Terrestre ? obj.cantRue : '';

            // botón de editar
            let editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.classList.add('btn-editar');
            editButton.addEventListener('click', () => {
                editVehiculo(obj.id);
            });

            // botón de eliminar
            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.classList.add('btn-eliminar');
            deleteButton.addEventListener('click', () => {
                eliminarVehiculo(obj.id);
            });
            td9.appendChild(deleteButton);
            td9.appendChild(editButton);
            row.appendChild(td1);
            row.appendChild(td2);
            row.appendChild(td3);
            row.appendChild(td4);
            row.appendChild(td5);
            row.appendChild(td6);
            row.appendChild(td7);
            row.appendChild(td8);
            row.appendChild(td9);
            tableBody.appendChild(row);
        });
    }

    function eliminarVehiculo(id) {
        const confirmar = confirm('¿Estás seguro de que deseas eliminar este vehiculo?');
        if (!confirmar) return;

        // Filtro la lista de vehiculos para eliminar el que tiene el ID dado
        data = data.filter(obj => obj.id !== id);
        renderTable(tipoFiltro.value);

        alert('El vehiculo ha sido eliminado exitosamente.');
    }


    function calcularPromedioVelMax() {
        const vehiculosFiltrados = data.filter(obj => {
            if (tipoFiltro.value === 'terrestre' && obj instanceof Terrestre) return true;
            if (tipoFiltro.value === 'aereo' && obj instanceof Aereo) return true;
            return tipoFiltro.value === 'todos';
        });

        const totalVelMax = vehiculosFiltrados.reduce((sum, obj) => sum + obj.velMax, 0);
        const promedio = totalVelMax / vehiculosFiltrados.length || 0;
        document.getElementById('promedioVelMax').textContent = `Promedio de velocidad máxima: ${promedio.toFixed(2)}`;
    }

    function editVehiculo(id) {
        const vehiculo = data.find(v => v.id === id);
        if (vehiculo) {
            document.getElementById('id').value = vehiculo.id;
            document.getElementById('modelo').value = vehiculo.modelo;
            document.getElementById('anoFab').value = vehiculo.anoFab;
            document.getElementById('velMax').value = vehiculo.velMax;

            // Llenar los campos específicos según el tipo de vehiculo
            if (vehiculo instanceof Terrestre) {
                document.getElementById('cantPue').value = vehiculo.cantPue || '';
                document.getElementById('altMax').value = '';
                document.getElementById('autonomia').value = '';
                document.getElementById('cantRue').value = vehiculo.cantRue || '';
            } else if (vehiculo instanceof Aereo) {
                document.getElementById('altMax').value = vehiculo.altMax || '';
                document.getElementById('autonomia').value = vehiculo.autonomia || '';
                document.getElementById('cantPue').value = '';
            }

            formDatos.style.display = 'none';
            abmForm.style.display = 'flex';
            editingVehiculo = vehiculo;
        }
    }


    function saveVehiculo(event) {
        event.preventDefault();
        const id = document.getElementById('id').value;
        const modelo = document.getElementById('modelo').value;
        const anoFab = parseInt(document.getElementById('anoFab').value, 10);
        const velMax = parseInt(document.getElementById('velMax').value, 10);
        const cantPue = parseInt(document.getElementById('cantPue').value, 10) || null;
        const altMax = parseInt(document.getElementById('altMax').value, 10) || null;
        const autonomia = parseInt(document.getElementById('autonomia').value, 10) || null;
        const cantRue = parseInt(document.getElementById('cantRue').value, 10) || null;


        if (editingVehiculo) {
            editingVehiculo.modelo = modelo;
            editingVehiculo.anoFab = anoFab;
            editingVehiculo.velMax = velMax;

            if (editingVehiculo instanceof Terrestre) {
                editingVehiculo.cantPue = cantPue;
                editingVehiculo.cantRue = cantRue;
            } else if (editingVehiculo instanceof Aereo) {
                editingVehiculo.altMax = altMax;
                editingVehiculo.autonomia = autonomia;
            }
        } else {
            const newId = data.length + 1;
            if (cantPue !== null) {
                data.push(new Terrestre(newId, modelo, anoFab, velMax, cantPue, cantRue));
            } else {
                data.push(new Aereo(newId, modelo, anoFab, velMax, altMax, autonomia));
            }
        }

        abmForm.style.display = 'none';
        formDatos.style.display = 'flex';
        editingVehiculo = null;

        row = document.createElement('tr');
        celda1 = document.createElement("td");
        celda2 = document.createElement("td");
        celda3 = document.createElement("td");
        celda4 = document.createElement("td");
        celda5 = document.createElement("td");
        celda6 = document.createElement("td");
        celda7 = document.createElement("td");
        celda8 = document.createElement("td");
        celda1.textContent = id;
        celda2.textContent = modelo;
        celda3.textContent = anoFab;
        celda4.textContent = velMax;
        celda5.textContent = cantPue;
        celda6.textContent = altMax;
        celda7.textContent = autonomia;
        celda8.textContent = cantRue;
        row.appendChild(celda1);
        row.appendChild(celda2);
        row.appendChild(celda3);
        row.appendChild(celda4);
        row.appendChild(celda5);
        row.appendChild(celda6);
        row.appendChild(celda7);
        row.appendChild(celda8);
        tableBody.appendChild(row);
        renderTable(tipoFiltro.value);
    }

    renderTable();

    // Listeners
    tipoFiltro.addEventListener('change', () => {
        renderTable(tipoFiltro.value);
    });

    // CALCULAR PROMEDIO DE VELOCIDAD MAX
    document.getElementById('btnCalcular').addEventListener('click', calcularPromedioVelMax);

    // MOSTRAR EL FORMULARIO ABM CUANDO SE HACE CLIC EN "Agregar Persona"
    document.getElementById('btnAgregar').addEventListener('click', () => {
        document.getElementById('abmForm').reset();
        formDatos.style.display = 'none';
        abmForm.style.display = 'flex';
        editingVehiculo = null;
    });

    // GUARDAR LOS DATOS AL HACER SUBMIT
    document.getElementById('abmForm').addEventListener('submit', saveVehiculo);

    // OCULTAR EL FORMULARIO ABM CUANDO SE HACE CLIC EN "Cancelar"
    document.getElementById('btnCancelar').addEventListener('click', () => {
        abmForm.style.display = 'none';
        formDatos.style.display = 'flex';
    });
});

function ordenarTabla(n) {
    const table = document.getElementById('tablaVehiculos');
    let switching = true, shouldSwitch, rows, i, x, y, dir = 'asc', switchcount = 0;

    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName('TD')[n];
            y = rows[i + 1].getElementsByTagName('TD')[n];
            if (dir === 'asc') {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir === 'desc') {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else if (switchcount === 0 && dir === 'asc') {
            dir = 'desc';
            switching = true;
        }
    }
}
