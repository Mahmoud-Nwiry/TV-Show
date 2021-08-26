//You can edit ALL of the code here
const showBox = document.querySelector('.show-box');
const showSelect = document.querySelector('.show-select');
const selectEpisode = document.querySelector('.episode');
const searchInpt = document.querySelector('.search');
const displaying = document.querySelector('.displaying');
const home = document.querySelector('.home');
const loading = document.querySelector('.loading');
const pagination_element = document.getElementById('pagination');

const icon = document.querySelector('.mneu-icon img');
const nav = document.querySelector('nav .container');

icon.addEventListener('click',()=>{
  nav.classList.toggle('active');
})
document.addEventListener('click',(e)=>{
  if(e.target !== icon && e.target !== nav &&
     e.target !== showSelect && e.target !== selectEpisode &&
      e.target !== searchInpt){
    if(nav.classList.contains('active')){
      nav.classList.toggle('active');
    }
  }
})

let response = getData();
function getData(){
  return (
    getAllShows().map(e=>{
      let obj = {
        id : e.id,
        name : e.name,
        image : {...e.image},
        rating : {...e.rating},
        runtime : e.runtime,
        status : e.status,
        genres : [...e.genres],
        summary : e.summary,
        date : e.premiered
      }
      return obj;
    }).sort((a,b)=>{
      if ( a.name.toLowerCase() < b.name.toLowerCase() ){
        return -1;
      }
      if ( a.name.toLowerCase() > b.name.toLowerCase() ){
        return 1;
      }
      return 0;
    })
  );
}


let current_page = 1;
let rows = 16;

response.map(e=>{
  let elem = `<option value${e.name} >${e.name}</option>`;
  showSelect.innerHTML += elem;
})

function showdata(){
  loading.style.display = "flex";
  searchInpt.value = '';
  selectEpisode.innerHTML = '';

  DisplayList(response, showBox, rows, current_page);
  SetupPagination(response, pagination_element, rows);
  selectEpisode.style.display = 'none'
  loading.style.display = "none";
}

showdata();

home.addEventListener('click',(e)=>{
  e.preventDefault();
  response = getData();
  current_page = 1;
  showdata();
})

function makePageForEpisodes(elem, select) {
  showBox.innerHTML = '';
  let x = 0;
  
  for(let i in elem){
    let show = document.createElement("div");
    show.classList.add('show');
    
    let title = document.createElement('h3');
    title.classList.add('title');
    titleText = getName(elem[i].name,elem[i].season,elem[i].number);

    title.innerHTML = titleText;
    show.append(title);
    
    let imgBox = document.createElement('div');
    imgBox.classList.add('img-box');
    let img = document.createElement('img');
    if(elem[i].image !== null){
      img.src = elem[i].image.medium;
    }else{
      img.classList.add('no-found');
      img.src = "data:image/jpeg;base64,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";
    }
    imgBox.append(img);

    let rtAndDscpt = document.createElement('div');
    if(select === showSelect){
      let detalis = document.createElement('div');
      detalis.classList.add('details');
      let detalisBox = document.createElement('div');
      detalisBox.classList.add('detalisBox');
      let rated = document.createElement('p');
      rated.classList.add('rated');
      let runtime = document.createElement('p');
      runtime.classList.add('runtime');
      let status = document.createElement('p');
      status.classList.add('status');
      let genres = document.createElement('p');
      genres.classList.add('genres');
      let date = document.createElement('p');
      date.classList.add('date');
      
      rated.innerHTML = `<span>Rated:</span> ${elem[i].rating.average}`;
      status.innerHTML = `<span>Status:</span> ${elem[i].status}`;
      runtime.innerHTML = `<span>Runtime:</span> ${elem[i].runtime}`;
      genres.innerHTML = `<span>Genres:</span> ${elem[i].genres.join(' | ')}`;
      date.innerHTML = `<span>Date:</span> ${elem[i].date}`
      
      detalisBox.append(rated);
      detalisBox.append(runtime);
      detalis.append(detalisBox);
      detalis.append(status);
      detalis.append(genres);
      detalis.append(date);
      rtAndDscpt.append(detalis);
    }

    
    let summary = document.createElement('div');
    summary.classList.add('text');
    if(elem[i].summary !== null && elem[i].summary !== ""){
      summary.innerHTML = '<h4>Discreption:</h4>';
      if(elem[i].summary.length > 200){
        let str = '';
        for(let x = 3; x< 196 ;x++){
          if(elem[i].summary[x] !== undefined)
          str += elem[i].summary[x];
        }
        summary.innerHTML +=`<p>${str} <a class="seeMore" href="#">...see more</a></p>`;
        let seeMore = summary.querySelector('.seeMore');
        seeMore.addEventListener('click',(e)=>{
          e.preventDefault();
          summary.innerHTML = `<h4>Discreption:</h4>${elem[i].summary}`;
        })
      }
      else{
        summary.innerHTML += elem[i].summary;
      }
    }else{
      summary.innerHTML = '<h3>Discreption:</h3><p>No Discreption</p>';
    }

    rtAndDscpt.append(summary);
    imgBox.append(rtAndDscpt);
    show.append(imgBox);
    
    if(select === showSelect){
      selectEpisode.style.display = 'none';
      showSelect.style.display = 'inline-block'
      let button = document.createElement('button');
      button.classList.add('watch');
      button.innerHTML = 'Watch Now';
      button.id = elem[i].id;
      
      button.addEventListener('click',()=>{
        newShowSelect(button.id);
      })
      
      show.append(button);
    }else{
      selectEpisode.style.display = 'inline-block';
      showSelect.style.display = 'none'
    }
    
    showBox.append(show);
  }
  if(selectEpisode.style.display === 'inline-block'){
    displaying.innerHTML = `Displaying ${elem.length}/${response.length} Episodes.`;
  }else{
    displaying.innerHTML = `Displaying ${elem.length}/${response.length} Shows.`;
  }
}

function getName(title,season,number){
  
  let str = title;

  if(typeof season === "number"){
    if(season < 10){
      str += ` - S0${season}`
    }else{
      str += ` - S${season}`
    }
  }
  if(typeof number === "number"){
    if(number < 10){
      str += `E0${number}`
    }else{
      str += `E${number}`
    }
  }
  return str;
}

showSelect.addEventListener('change',(e)=>{
  if(nav.classList.contains('active')){
    nav.classList.toggle('active');
  }
  newShowSelect(response[showSelect.selectedIndex].id);
});

selectEpisode.addEventListener('change',(e)=>{
  if(nav.classList.contains('active')){
    nav.classList.toggle('active');
  }
  searchInpt.value = e.target.value;
  search();
})

function newShowSelect(elem){
  loading.style.display = "flex";
  pagination_element.innerHTML = '';
  fetch(`https://api.tvmaze.com/shows/${elem}/episodes`)
  .then(res=>res.json())
  .then(data=>{
    response = data;
    current_page = 1;
    data.map(e=>{
      selectEpisode.innerHTML += `<option value="${e.name}" >${getName(e.name,e.season,e.number)}</option>`
    })
    DisplayList(data, showBox, rows, current_page, selectEpisode);
    SetupPagination(data, pagination_element, rows, selectEpisode);
  }).then(()=>{
    loading.style.display = "none";
  });
}

searchInpt.addEventListener('keyup',search);


function search(){
  let text = searchInpt.value.trim().toLowerCase();
  let resultCount = 0;
  pagination_element.innerHTML = '';
  current_page = 1;

  let result = response.filter(e=>{
    if(e.name.toLowerCase().includes(text) || e.summary.toLowerCase().includes(text)){
      resultCount++;
     return e;
    }else if(e.genres !== null && e.genres !== undefined){
     if(e.genres.join().toLowerCase().includes(text)){
       resultCount++;
       return e;
     }
    }
  })
  let x = showSelect;
  if(selectEpisode.style.display === 'inline-block'){
    displaying.innerHTML = `Found ${resultCount} Episodes.`;
    x = selectEpisode;
  }else{
    displaying.innerHTML = `Found ${resultCount} Shows.`;
  }
  showBox.innerHTML = ''
  DisplayList(result, showBox, rows, current_page,x);
  SetupPagination(result, pagination_element, rows,x);
  
}

// pagination
function DisplayList (items, wrapper, rows_per_page, page, select = showSelect){
  wrapper.innerHTML = "";
	page--;

  let start = rows_per_page * page;
	let end = start + rows_per_page;
	let paginatedItems = items.slice(start, end);

  makePageForEpisodes(paginatedItems,select);
}

function SetupPagination (items, wrapper, rows_per_page, select = showSelect) {
	wrapper.innerHTML = "";
	let page_count = Math.ceil(items.length / rows_per_page);
	for (let i = 1; i < page_count + 1; i++) {
		let btn = PaginationButton(i, items, select);
		wrapper.appendChild(btn);
	}
}

function PaginationButton (page, items, select) {
	let button = document.createElement('button');
	button.innerText = page;

	if (current_page == page) button.classList.add('active');

	button.addEventListener('click', function () {
		current_page = page;
		DisplayList(items, showBox, rows, current_page, select);

		let current_btn = document.querySelector('.pagenumbers button.active');
		current_btn.classList.remove('active');

		button.classList.add('active');
	});

	return button;
}
