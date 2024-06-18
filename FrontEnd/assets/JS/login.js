const email = document.getElementById("email")
const password = document.getElementById("password")
const formConnexion = document.querySelector("form")
const messageErreur = document.querySelector(".login p");


formConnexion.addEventListener("submit", async (event) => {
    event.preventDefault();

   //vérifier email ou mot de pass
  

   const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (emailInput && passwordInput) {
    const userEmail = emailInput.value;
    const userPassword = passwordInput.value;
    console.log("userEmail", userEmail)
    console.log(password, userPassword);
    console.log(userEmail, userPassword);

 

    
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
            email: email.value,
            password: password.value,
        }),

    }).then (response=> response.json())
    .then (data=>{
    // Vérifier si la réponse contient un token 
       console.log("data",data)
        if (data.token) {
// Stocker le token dans le navigateur 
            localStorage.setItem("token", data.token);
         
// Rediriger vers la page d'accueil 
console.log("before redirection");
            window.location.replace("index.html");
        } else {
// Afficher un message d'erreur 
            email.classList.add("inputErrorLogin");
            password.classList.add("inputErrorLogin");
            messageErreur.textContent = "Votre email ou votre mot de passe est incorrect";
        }
    })
  
   
    .catch((error) => {
        console.error("Erreur lors de la connexion :", error);
    });
}
});







