'use strict';

//llamar las constantes del HTML que voy a usar
const drink = document.querySelector('.js-drink');
const btn = document.querySelector('.js-btn');
const reset = document.querySelector('.js-reset');
const listMenu = document.querySelector('.js-list');
const favorite = document.querySelector('.js-favorite');


//creo const url para que sea más manejable
let url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita';

//listado para meter los cócteles y los favoritos
let listArrayCoctel = [];
let listArrayFavorite = [];

//7. guardar en el LocalS los favoritos, línea 60 se mandan los favoritos
const coctelListFavorites = JSON.parse(localStorage.getItem('drinks'));
if (coctelListFavorites) {
  listArrayFavorite = coctelListFavorites;
  renderFavoriteList(listArrayFavorite);
}

//2. hacer FETCH para atender la petición del botón.
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    listArrayCoctel = data.drinks;
    renderCoctelList(listArrayCoctel); //dentro del fetch porque hasta que no se ejecute el "then" está vacío= pintate luego que tengas los datos
  });

//3.renderCoctelList-recorre la lista y va seleccionando los obj
function renderCoctelList(listArrayCoctel) {
  listMenu.innerHTML = '';
  for (const coctel of listArrayCoctel) {
    listMenu.innerHTML += renderCoctel(coctel);
  }
  addEventToCoctel();
  removeAddSelected ();
}

//6.Pinta todos los elementos favoritos de la lista, uso la contante de ul-favorite
function renderFavoriteList(listArrayFavorite) {
  favorite.innerHTML = '';
  for (const coctel of listArrayFavorite) {
    let imgCoctel = '';
    if (!coctel.strDrinkThumb) {
      imgCoctel =`https://via.placeholder.com/400x600/ffffff/001799.png?text=Cóctel ${coctel.strDrink}`;
    } else {imgCoctel = coctel.strDrinkThumb;
    }

    favorite.innerHTML += `<li class= "li-coctel"> 
<section>
<article class="brewCoctel js-fav-brewCoctel" id="${coctel.idDrink}">
<h3 class="coctel_title">${coctel.strDrink}<i class="fa-regular js-fa-regular fa-lemon" id=${coctel.idDrink}></i></h3>
<img class="imgcoctel" src ="${imgCoctel}" alt="foto de cóctel">
</article>
</section>
</li>`;
  }
  removeToFavorite();
  //7.guardar en el LocalS los favoritos.
  localStorage.setItem('drinks', JSON.stringify(listArrayFavorite));
}


//4.pintar el listado para que traiga de vuelta las margaritas, en ul-list
//variable 'coctel' del for
function renderCoctel(coctel) {
  let imgCoctel = '';
  if (!coctel.strDrinkThumb) {
    imgCoctel =`https://via.placeholder.com/400x600/ffffff/001799.png?text=Cóctel ${coctel.strDrink}`;
  } else {imgCoctel = coctel.strDrinkThumb;
  }

  let html = `<li class= "li-coctel"> 
<section>
<article class="brewCoctel js-brewCoctel" id="${coctel.idDrink}">
<h3 class="coctel_title">${coctel.strDrink}</h3>
<img class="imgcoctel" src ="${imgCoctel}" alt="foto de cóctel">
</article>
</section>
</li>`;
  return html;
}


//5.necesitamos otro fetch para buscar el resto de cócteles
function handleClickSearch(ev) {
  ev.preventDefault();
  url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink.value}`;
  //recuperamos lo que nos ofrece el input js-drink
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      listArrayCoctel = data.drinks;
      renderCoctelList(listArrayCoctel);
    });
}

//9.función de addEventListener de li, saber si está ya en la lista o no.
function handleClickli(event) {
  console.log(event.currentTarget.id);
  const idSelected = event.currentTarget.id;
  const selectedCoctel = listArrayCoctel.find(
    (coctel) => coctel.idDrink === idSelected);
  const indexCoctel = listArrayFavorite.findIndex(
    (coctel) => coctel.idDrink === idSelected);
  console.log(indexCoctel);
  if (indexCoctel === -1) {
    event.currentTarget.classList.add('selected');
    listArrayFavorite.push(selectedCoctel);
  } else {
    event.currentTarget.classList.remove('selected');
    listArrayFavorite.splice(indexCoctel, 1);
  }
  renderFavoriteList(listArrayFavorite);
}

//11.función de addEventListener del icono
function handleClickLemon (event){
  event.preventDefault();
  const idSelected = event.currentTarget.id;
  const indexCoctel = listArrayFavorite.findIndex(
    (coctel) => coctel.idDrink === idSelected
  );
  listArrayFavorite.splice(indexCoctel, 1);
  renderFavoriteList(listArrayFavorite);
  removeAddSelected ();
}

//13.vaciar los favoritos y resfrecar página con botón reset
function handleClickReset(event) {
  event.preventDefault();
  drink.value = '';
  favorite.innerHTML = '';
  localStorage.removeItem('drinks');
  location.reload();
}

//8. evento dentro de función,añadir favorito haciendo click sobre él.
function addEventToCoctel() {
  const liElementsCoctel = document.querySelectorAll('.js-brewCoctel');
  for (const li of liElementsCoctel) {
    li.addEventListener('click', handleClickli);
  }
}
//10. evento dentro de función; eliminar de favoritos usando el icono.
function removeToFavorite() {
  const iconLemon = document.querySelectorAll('.js-fa-regular');
  for (const icon of iconLemon) {
    icon.addEventListener('click', handleClickLemon);
  }
}

//14.quitar/añadir la selección de la lista de favoritos, sobre li
function removeAddSelected (){
  const brewList =document.querySelectorAll ('.js-brewCoctel');
  for (let remSel of brewList) {
    const checkCoctel = listArrayFavorite.find(
      (item) => item.idDrink === remSel.id); //item.idDrink=objeto y remSel es id (es como un dni) porque lo cojo de HTML.
    if (checkCoctel) {
      remSel.classList.add('selected');
    } else {
      remSel.classList.remove('selected');
    }
  }
}

//1.evento búsqueda (botón)
btn.addEventListener('click', handleClickSearch);

//12.evento reset (botón)
reset.addEventListener('click', handleClickReset);
