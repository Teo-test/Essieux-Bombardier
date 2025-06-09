if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("service-worker.js")
      .then(() => console.log("Service Worker enregistré"))
      .catch(err => console.error("Erreur SW:", err));
  });
}

let mesures = [];

function ajouterMesure() {
  const label = document.getElementById('label').value;
  const valeur = document.getElementById('valeur').value;
  if (!label || !valeur) return;

  mesures.push({ label, valeur });
  afficherMesures();
}

function afficherMesures() {
  const liste = document.getElementById('liste');
  liste.innerHTML = '';
  mesures.forEach(m => {
    const li = document.createElement('li');
    li.textContent = `${m.label} : ${m.valeur} cm`;
    liste.appendChild(li);
  });
}

function genererPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Mesures", 10, 10);
  mesures.forEach((m, i) => {
    doc.text(`${m.label} : ${m.valeur} cm`, 10, 20 + i * 10);
  });

  doc.save("mesures.pdf");
}