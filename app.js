document.querySelectorAll(".bottom-nav button").forEach(button => {
  button.addEventListener("click", () => {
    const page = button.dataset.page;

    // Changer la section visible
    document.querySelectorAll(".page").forEach(p => {
      p.classList.remove("active");
    });
    document.getElementById(page).classList.add("active");

    // Mettre à jour les boutons de la barre de navigation
    document.querySelectorAll(".bottom-nav button").forEach(b => {
      b.classList.remove("active");
    });
    button.classList.add("active");
  });
});