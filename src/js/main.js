'use strict';
//llamar las constantes del HTML que voy a usar

const drink = document.querySelector ('.js-drink');
const btn = document.querySelector ('.js-btn');
const reset = document.querySelector('.js-reset');
const listMenu = document.querySelector('.js-list');
const favorite = document.querySelector ('.js-favorite');

//creo const url para que sea más manejable
let url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita';

//necesitamos un listado para meter los cócteles y los favoritos, así que creo un array vacío
let listArrayCoctel =[];
let listArrayFavorite =[];

const coctelListFavorites = JSON.parse (localStorage.getItem ('drinks'));
if (coctelListFavorites) {
  listArrayFavorite=coctelListFavorites;
  renderFavoriteList (listArrayFavorite);
}

//"drink"sacado del api que es un array de objetos
fetch (url)
  .then((response) => response.json())
  .then((data) => {
    console.log (data);
    //muestra un array llamado "drink" de 6
    listArrayCoctel = data.drinks;
    renderCoctelList (listArrayCoctel); //dentro del fetch porque hasta que no se ejecute el "then" está vacío= pintate luego que tengas los datos
  });


//renderCoctelList- recorre la lista y va seleccionando los obj
function renderCoctelList (listArrayCoctel) {
  listMenu.innerHTML = '';
  for (const coctel of listArrayCoctel) {
    listMenu.innerHTML += renderCoctel(coctel);
  }
  addEventToCoctel ();
}


//Pinta todos los elementos favoritos de la lista, uso la contante de ul-favorite
function renderFavoriteList(listArrayFavorite) {
  favorite.innerHTML = '';
  for (const coctel of listArrayFavorite) {
    favorite.innerHTML += renderCoctel(coctel);
  }
  localStorage.setItem('drinks', JSON.stringify(listArrayFavorite));
}


//pintar el listado para que traiga de vuelta las margaritas, en ul-list
//variable coctel del for
//renderCoctel-lista de obj con 3 datos como queremos que sea cada uno de los objetos
function renderCoctel(coctel) {
  let html=`<li> 
<article class="brewCoctel js-brewCoctel" id="${coctel.idDrink}">
<h3 class="coctel_title">${coctel.strDrink}</h3>
<img src ="${coctel.strDrinkThumb}" alt="foto de cóctel">
</li>`;
  return html;
}


//necesitamos otro fetch para buscar el resto de cócteles
function handleClickSearch (ev) {
  ev.preventDefault();
  url= `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink.value}`;
  //recuperamos lo que nos ofrece el input js-drink
  fetch (url)
    .then((response) => response.json())
    .then((data) => {
      console.log (data);
      listArrayCoctel = data.drinks;
      renderCoctelList (listArrayCoctel);
    });
}

//addEventListener del li
function handleClickli (ev) {
  console.log (ev.currentTarget.id);
  //'selected' para que el toggle quite y añada
  ev.currentTarget.classList.toggle('selected');

  //Buscar con ese id en el listado de cocteles que coctel tiene el id del curren target, lo hacemos con un find (devuelve el objeto)
  const idSelected = ev.currentTarget.id;

  //find : devuelve el primer elemento que cumpla una condición // const de for =coctel
  const selectedCoctel = listArrayCoctel.find((coctel) => coctel.idDrink === idSelected);

  //findeIndex: devuelve la posición del array, o -1 sino está en el listado. Uso la constante vacía que cree
  const indexCoctel = listArrayFavorite.findIndex((coctel) => coctel.idDrink === idSelected);
  console.log(indexCoctel);

  //Comprobar si ya existe el favorito
  if (indexCoctel === -1) {
  //no está en el listado de favoritos
  //La guardo en el listado de favoritos: push
    listArrayFavorite.push(selectedCoctel);
  } else {
    //si está en el listado de favoritos eliminarlo
    //splice: elimina un elemento a partir de una posición
    listArrayFavorite.splice(indexCoctel, 1);
  }
  //Pintar en el listado HTML de favoritos:
  renderFavoriteList(listArrayFavorite);
}



//funcion dentro evento: para seleccionar un li saber a qué paleta estoy haciendo click
function addEventToCoctel() {
  const liElementsCoctel = document.querySelectorAll('.js-brewCoctel');
  for (const li of liElementsCoctel) {
    li.addEventListener ('click', handleClickli);
  }
}

//vaciar los favoritos con botón reset
function handleClickReset (event){
  event.preventDefault ();
  drink.value='';
  favorite.innerHTML ='';
  localStorage.removeItem ('drinks');
}

//evento búsqueda (botón)
btn.addEventListener ('click', handleClickSearch);
reset.addEventListener ('click', handleClickReset);