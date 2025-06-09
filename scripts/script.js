if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('Service Worker enregistré'))
    .catch(err => console.log('Erreur Service Worker', err));
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('mesuresForm');
  const confirmation = document.getElementById('confirmation');

  // Validation en temps réel pour les champs obligatoires
  document.querySelectorAll('input[required]').forEach(input => {
    input.addEventListener('input', function() {
      if (this.checkValidity()) {
        this.style.borderLeft = '3px solid rgb(71, 139, 71)';
      } else {
        this.style.borderLeft = '3px solid #ff0000';
      }
    });
  });

  function calculateValues(data) {
    // Calcul des moyennes
    const moyenneVerticale = (parseFloat(data.grandModeleVertical1) + parseFloat(data.grandModeleVertical2) + parseFloat(data.grandModeleVertical3)) / 3;
    const moyenneHorizontale = (parseFloat(data.grandModeleHorizontal1) + parseFloat(data.grandModeleHorizontal2) + parseFloat(data.grandModeleHorizontal3)) / 3;

    // Ajoutez d'autres calculs ici si nécessaire

    return {
      ...data,
      moyenneVerticale: moyenneVerticale,
      moyenneHorizontale: moyenneHorizontale
    };
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
      date: form.date.value,
      om: form.om.value,
      bogieNo: form.bogieNo.value,
      typeNo: form.typeNo.value,
      fabrick: form.fabrick.value,
      anneeFab: form.anneeFab.value,
      autre: form.autre.value,
      localisation: form.localisation.value,
      serieRoue: form.serieRoue.value,
      jeuAxialJm: form.jeuAxialJm.value,
      grandModeleVertical1: form.grandModeleVertical1.value,
      grandModeleVertical2: form.grandModeleVertical2.value,
      grandModeleVertical3: form.grandModeleVertical3.value,
      grandModeleHorizontal1: form.grandModeleHorizontal1.value,
      grandModeleHorizontal2: form.grandModeleHorizontal2.value,
      grandModeleHorizontal3: form.grandModeleHorizontal3.value,
    };

    const calculatedData = calculateValues(formData);
    localStorage.setItem('mesuresData', JSON.stringify(calculatedData));

    confirmation.style.display = 'block';
    setTimeout(() => {
      confirmation.style.display = 'none';
      window.location.href = 'resultats.html';
    }, 1500);
  });
});


function loadResultats() {
  const data = JSON.parse(localStorage.getItem('mesuresData'));
  const rapportContent = document.getElementById('rapportContent');

  if (data) {
    const lignes = [
      ["Date", data.date || 'N/A'],
      ["OM", data.om || 'N/A'],
      ["Bogie N°", data.bogieNo || 'N/A'],
      ["Type N°", data.typeNo || 'N/A'],
      ["Fabrick", data.fabrick || 'N/A'],
      ["Année de Fabrication", data.anneeFab || 'N/A'],
      ["Autre", data.autre || 'N/A'],
      ["Localisation", data.localisation || 'N/A'],
      ["N° de série de la roue", data.serieRoue || 'N/A'],
      ["Jeu Axial 'Jm' mesuré", data.jeuAxialJm || 'N/A'],
      ["Grand Modèle Vertical 1", data.grandModeleVertical1 || 'N/A'],
      ["Grand Modèle Vertical 2", data.grandModeleVertical2 || 'N/A'],
      ["Grand Modèle Vertical 3", data.grandModeleVertical3 || 'N/A'],
      ["Grand Modèle Horizontal 1", data.grandModeleHorizontal1 || 'N/A'],
      ["Grand Modèle Horizontal 2", data.grandModeleHorizontal2 || 'N/A'],
      ["Grand Modèle Horizontal 3", data.grandModeleHorizontal3 || 'N/A'],
    ];

    rapportContent.innerHTML = lignes.map(
      ([label, value]) => `<tr><td>${label}</td><td>${value}</td></tr>`
    ).join('');
  } else {
    rapportContent.innerHTML = `<tr><td colspan="2">Aucune donnée disponible.</td></tr>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const bodyId = document.body.id;

  if (bodyId === 'page-mesures') {
    handleMesuresForm();
  } else if (bodyId === 'page-resultats') {
    loadResultats();
  }
});


