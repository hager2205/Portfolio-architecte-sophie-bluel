
//  affichage de la modal

// déclaration des variable
const modale = document.querySelector(".modifier");
const containerModale = document.querySelector(".containerModale");
const xmark = document.querySelector(".containerModale .fa-xmark")

//afficher la modal au click sur "modifier"
modale.addEventListener("click", (event) => {

  containerModale.style.display = "flex"

})

// au click sur la croix la modal disparait
xmark.addEventListener("click", (event) => {
  
  containerModale.style.display = "none"

})
// au click en dehors de la modal, la modal disparait
containerModale.addEventListener("click", (event) => {

  if (event.target.className == "containerModale") {
    containerModale.style.display = "none";
  }
});


//affichage des works dans la modale 

const galleryModale = document.querySelector(".galleryModale")

async function displaygalleryModale() {
  galleryModale.innerHTML = "";
  const arrayWorks = await importWorks();
  arrayWorks.forEach((work) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const span = document.createElement("span");

    span.id = work.id;
    span.innerHTML = `<i class="fa-solid fa-trash-can" id="${work.id}"></i>`;
    img.src = work.imageUrl;
    figure.appendChild(img);
    figure.appendChild(span);
    galleryModale.appendChild(figure);
  });
  console.log("displaygalleryModale", token)
  deleteWork(token);
}

displaygalleryModale();


// supression d'un work dans la modale

function getToken() {
  return localStorage.getItem('token');// Fonction pour récupérer le token depuis le localStorage
}
const token = getToken(); // Récupère le token depuis le localStorage
console.log(token);



async function deleteWork(token) {
  const trashAll = document.querySelectorAll(".galleryModale span .fa-trash-can");
  console.log("deletworktoken", token);
  const arrayWorks = await importWorks();
  console.log("arrayWorks avant suppression:", arrayWorks);

  trashAll.forEach((trash) => {
    trash.addEventListener("click", async (event) => {
      // event.preventDefault();
      const id = trash.getAttribute("id");
      const init = {
        method: "DELETE",
        headers: {

          Authorization: `Bearer ${token}`
        },
      };
      console.log("Initialisation delete:", init);

      fetch(`http://localhost:5678/api/works/${id}`, init)
        .then((response) => {
          if (response.ok) {
            console.log("appel autoriser")
            trash.parentElement.parentElement.remove();

          }
          if (response.status === 401) {
            console.log("non autoriser", response.statusText)
          }
        
          // Suppression de l'élément du tableau
          console.log("Tableau avant suppression:", arrayWorks);
          const suppIndex = arrayWorks.findIndex(work => work.id == id);
          if (suppIndex !== -1) {
            arrayWorks.splice(suppIndex, 1);
            console.log("Tableau après suppression:", arrayWorks);
          }
          // Affichage du tableau mis à jour
          gallery.innerHTML = "";

          // galleryModale.innerHTML = "";
          affichageWorks();


        })
        .catch((error) => {
          console.error("Erreur lors de la suppression:", error);
        });


    });
  });
}


// faire apparaitre la deuxieme modale

const btnAddModal = document.querySelector(".modaleGallery button");
const modaleGallery2 = document.querySelector(".modaleGallery2");
const modaleGallery = document.querySelector(".modaleGallery");
const arrowleft = document.querySelector(".modaleGallery2 .fa-arrow-left");
const markAdd = document.querySelector(".modaleGallery2 .fa-xmark");

function displayAddModale() {
  btnAddModal.addEventListener("click", () => {
    modaleGallery2.style.display = "flex";
    modaleGallery.style.display = "none";
  });
  arrowleft.addEventListener("click", () => {
    modaleGallery2.style.display = "none";
    modaleGallery.style.display = "flex";
  });
  markAdd.addEventListener("click", () => {
    containerModale.style.display = "none";
    // window.location = "index.html";
  });
}
displayAddModale();

// prévisualiser l'image dans la modale
const previewImg = document.querySelector(".containerPreview img");
const previewInput = document.querySelector(".containerPreview input");
const previewLabel = document.querySelector(".containerPreview label");
const previewIcon = document.querySelector(".containerPreview .fa-image");
const previewP = document.querySelector(".containerPreview p");

// Ecouter les changement sur l'input file

previewInput.addEventListener("change", () => {
  const file = previewInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      previewImg.style.display = "flex";
      previewLabel.style.display = "none";
      previewIcon.style.display = "none";
      previewP.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

//Création de la liste de catégories dans l'input select
async function displayCategoryModale() {
  const select = document.querySelector(".modaleGallery2 select")
  const categorys = await importCategorys()
  categorys.forEach(category => {
    const option = document.createElement("option")
    option.value = category.id
    option.textContent = category.name
    select.appendChild(option)
  })
}
displayCategoryModale()


// ajouter un work

const form = document.querySelector(".modaleGallery2 form");
const title = document.querySelector(".modaleGallery2 #title");
const category = document.querySelector(".modaleGallery2 #category");
const file = document.querySelector(".modaleGallery2 input[type='file']");


form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Créer un objet FormData
  const formData = new FormData();
  formData.append("image", fileInput.files[0]);
  formData.append("title", title.value);
  formData.append("category", category.value);


  try {

    const token = localStorage.getItem('token')
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",

      headers: {

        "Authorization": `Bearer ${token}`

      },
      body: formData,
    });
    console.log(formData);

    const data = await response.json();
    console.log(data);
    console.log("Travail ajouté", data);
  
    closeModal();
    displaygalleryModale();
    affichageWorks();
  }

  catch (error) {
    if (error.response) {
      console.error("Statut de la réponse :", error.response.status);
      if (error.response.status === 500) {
        console.error("Erreur 500 (Internal Server Error) du serveur");
      } else {
        console.error("Données de la réponse :", error.response.data);
      }
    } else {
      console.error("Erreur lors de la requête :", error.message);
    }
  }

});
//  Fonction pour fermer la modal
function closeModal() {
  const modalContainer = document.querySelector(".containerModale");
  modalContainer.style.display = "none"; 
}

 // Vérifier si tous les champs du formulaire sont remplis
function verifForm(){
  const buttonValidForm = document.querySelector(".button-modale button");
  const form = document.querySelector(".modaleGallery2 form");
  const title = document.querySelector(".modaleGallery2 #title");
  const category = document.querySelector(".modaleGallery2 #category");
  const inputFile = document.querySelector(".containerPreview input");
  const  errorMessage = document.querySelector (".error-message")

  form.addEventListener("input", () => {
    if (title.value !== "" && category.value !== "" && inputFile.value !== "") {
      buttonValidForm.style.backgroundColor = "#1d6154";

      buttonValidForm.disabled = false;
      errorMessage.style.display = "none"; // Masquer le message d'erreur
    } else {
      buttonValidForm.style.backgroundColor = "gray";

      buttonValidForm.disabled = true;
      errorMessage.style.display = "block"; // Afficher le message d'erreur
    }
  });
}
verifForm();