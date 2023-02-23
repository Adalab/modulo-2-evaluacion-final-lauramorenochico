'use strict';
//llamar las constantes del HTML que vamos a usar

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

//"drink"sacado del api que es un array de objetos
fetch (url)
  .then((response) => response.json())
  .then((data) => {
    console.log (data);
    //muestra un array llamado "drink" de 6
    listArrayCoctel = data.drinks;
    renderCoctelList (listArrayCoctel);
  });


//renderCoctelList- recorre la lista y va seleccionando los obj
function renderCoctelList (listArrayCoctel) {
  listMenu.innerHTML = ''
  for (const coctel of listArrayCoctel) {
    listMenu.innerHTML += renderCoctel(coctel);
  }
}
//addEventToPalette();}


//pintar el listado para que traiga de vuelta las margaritas, en ul-list //variable coctel del for //comillas ``//renderCoctel-lista de obj con 3 datos como queremos que sea cada uno de los objetos
function renderCoctel (coctel) {
  let html=`<li> 
<article class="brewCoctel js-brewCoctel id=${coctel.idDrink}">
<h3 class="coctel_title">${coctel.strDrink}</h3>
<img src = ${coctel.strDrinkThumb} alt="foto de cóctel">
</li>`;
  return html;
}


//función del evento //necesitamos otro fetch para buscar el resto de cócteles
function handleClickSearch (ev) {
  ev.preventDefault();
  console.log('entro');
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


//evento del botón buscar
btn.addEventListener ('click', handleClickSearch);