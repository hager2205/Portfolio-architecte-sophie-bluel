

const gallery = document.querySelector(".gallery")
const filters = document.querySelector(".filters")


async function importWorks(){
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
}

importWorks()

// affichage des works

 async function affichageWorks(){
    gallery.innerHTML ="";
    const arrayWorks =  await importWorks();
    arrayWorks.forEach((work) => {
createWorks(work);
 });
    
}

affichageWorks();

//creation du work et lui appliquer le style

function createWorks( work){
    const figure = document.createElement("figure")
    const img = document.createElement("img")
    const figcaption = document.createElement("figcaption")
    img.src = work.imageUrl;
    figcaption.textContent = work.title;
    figure.classList.add(".gallery");
    figure.appendChild (img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
}

console.log(createWorks);

//tableau des categories

 async function importCategorys(){
    const response = await fetch("http://localhost:5678/api/categories");
    return await response.json();

}

//creation des buttons

async function displayCategorysButtons(){
    const categorys = await importCategorys();
    console.log(categorys);
    categorys.forEach((category) => {
        const btn = document.createElement("button");
        btn.textContent = category.name;
        btn.id = category.id;
        filters.appendChild(btn);
    });
}
displayCategorysButtons();


// /filtrer au click le boutton categorie

async function filterCategory(){
    const works = await importWorks();
    const buttons = document.querySelectorAll(".filters button");
    buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
            btnId = e.target.id;
           gallery.innerHTML = "";
            if (btnId !=="0"){
                 const worksTriCategory = works.filter((work) => {
                    return  work.categoryId == btnId
                 });

            worksTriCategory.forEach((work)=>{
                createWorks(work);
            });
    }
    else{
        affichageWorks();
    }
        });

    });
}

filterCategory();



// / Passer en mode administrateur

const banner = document.querySelector(".banner");
const iconModifier = document.querySelector(".modifier");
const loglink = document.querySelector(".loglink");
const adm = document.querySelector(".adm")
const filter = document.querySelector(".filters")

function getToken() {
    return localStorage.getItem('token');
}

function initializeUI() {
    const token = getToken();
    if (token) {
        console.log('Retrieved token:', token);
        filter.style.display="none"
        banner.style.display = "flex";
        iconModifier.style.display = "flex";
        loglink.textContent = "logout";
        loglink.addEventListener("click", ()=>{
            localStorage.removeItem("token")
            
        })
        adm.addEventListener("click", ()=>{
            localStorage.removeItem("token")
            
        })
       
    } else {
        console.log('No token found.');
        banner.style.display = "none";
        iconModifier.style.display = "none";
        loglink.textContent = "login"; 
    }
}


initializeUI();

