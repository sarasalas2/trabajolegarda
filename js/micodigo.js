
const select = document.getElementById('categoria');
const menu = document.getElementById('menu');

function generarPrecio() {
  return (Math.random() * 10 + 8).toFixed(2); 
}


function cargarMenu(categoria) {
 
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`)
  .then(response =>{
    if(!response.ok){
        throw new Error(`No se encontraron los datos ${response.status}`)
    }
    return response.json();
  })
    .then(data => {
      menu.innerHTML = '';
      data.meals.forEach(plato => {
        const precio = generarPrecio(); // Genera un nuevo precio para cada plato
        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = `
          <img src="${plato.strMealThumb}" alt="${plato.strMeal}">
          <div class="item-content">
            <h3 class="item-title">${plato.strMeal}</h3>
            <p class="item-price">${precio}</p>
          </div>
        `;
        menu.appendChild(item);
      });
    })
    .catch(error =>{
      console.log(`Error al obtener los datos ${error.message}`);
    })
    
    .finally(()=>{
      console.log(`Peticion terminada`);
    })
};

if (select && menu) {
  
  cargarMenu(select.value);

  
  select.addEventListener('change', () => {
    cargarMenu(select.value);
  });
}


////////////////////////////////////////////

// CARRITO DE COMPRAS
const contenedor = document.getElementById('platos');
const carrito = [];
const tablaCarrito = document.getElementById('carrito');
const totalGeneral = document.getElementById('total_general');


const selectPedido = document.getElementById('categoria');

function cargarPlatos(categoria) {
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`No se encontraron los datos ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      contenedor.innerHTML = ''; 
      data.meals.forEach(plato => {
        const precio = generarPrecio(); 
        const div = document.createElement('div');

        div.innerHTML = `
          <img src="${plato.strMealThumb}" width="100"><br>
          <strong>${plato.strMeal}</strong><br>
          <span>Precio: $${precio}</span><br>
          <button class="agregar-carrito">Agregar al carrito</button>
          <hr>
        `;
        
        
        contenedor.appendChild(div);
        
        const boton = div.querySelector('.agregar-carrito');
        boton.addEventListener('click', () => {
          

          const existente = carrito.find(item => item.nombre === plato.strMeal);
          if (existente) {
            existente.cantidad += 1;
          } else {
            carrito.push({
              nombre: plato.strMeal,
              precio: parseFloat(precio),
              cantidad: 1
            });
          }
          actualizarCarrito();
        });
      });
    })
    .catch(err => {
      console.error('Error al cargar platos:', err);
      contenedor.innerHTML = 'Error al cargar los platos.';
    });
}


if (contenedor && tablaCarrito && totalGeneral && selectPedido) {
  cargarPlatos(selectPedido.value);
  selectPedido.addEventListener('change', () => {
    cargarPlatos(selectPedido.value);
  });
}



selectPedido.addEventListener('change', () => {
  cargarPlatos(selectPedido.value);
});
// console.log("precio",generarPrecio());
/////////////////////////////////
//carrito 
function actualizarCarrito() {
  tablaCarrito.innerHTML = ''; 
  let total = 0; 

  carrito.forEach((item, index) => {
    const precio = parseFloat(item.precio) || 0;
    const subtotal = precio * item.cantidad;
    total += subtotal;
  
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.nombre}</td>
      <td>$${precio.toFixed(2)}</td>
      <td>${item.cantidad}</td>
      <td>$${subtotal.toFixed(2)}</td>
      <td><button class="btn btn-danger btn-sm boton_eliminar" data-index="${index}">Eliminar</button></td>
    `;
    tablaCarrito.appendChild(row);
  });

  totalGeneral.textContent = `$${total.toFixed(2)}`;  


  agregarEventosEliminar();
}

 
  
  
function agregarEventosEliminar() {
  tablaCarrito.querySelectorAll('.boton_eliminar').forEach(btn => {
    btn.addEventListener('click', () => {
      // Convierte a número entero
      const index = parseInt(btn.getAttribute('data-index'), 10);
      carrito.splice(index, 1);

      actualizarCarrito();
    });
  });
};
  



////////////////////////////
//modal
const botonModal = document.getElementById('botonCompra');
const modal = document.getElementById('btnModalCompra');
const confirmarCompra = document.getElementById('btnConfirmarCompra');
const tabla_factura = document.getElementById('tabla_factura');
const totalFactura = document.getElementById('total_factura');  // Para mostrar el total en el modal
console.log(totalFactura);

botonModal.addEventListener('click', () => {
  tabla_factura.innerHTML = '';
  let total = 0;

  if (carrito.length === 0) {
    alert('No hay platos en el carrito');
  } else {
    carrito.forEach(item => {
      const precio = parseFloat(item.precio) || 0;
      const subtotal = precio * item.cantidad;
      total += subtotal;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.nombre}</td>
        <td>$${precio.toFixed(2)}</td>
        <td>${item.cantidad}</td>
        <td>$${subtotal.toFixed(2)}</td>
      `;
      tabla_factura.appendChild(row);
    });

    totalFactura.textContent = `$${total.toFixed(2)}`;  
  }
});


confirmarCompra.addEventListener('click', () => {
  carrito.length = 0;
  actualizarCarrito();
  alert('Compra confirmada. ¡VUELVA PRONTO SUMERCE!');

  const cierreModal = bootstrap.Modal.getInstance(modal);
  if (cierreModal) {
    cierreModal.hide(); // Cierra el modal correctamente
  }

  tabla_factura.innerHTML = ''; //vacia la factura

  
});



