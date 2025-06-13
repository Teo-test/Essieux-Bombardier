// Configuration
const CONFIG = {
  formId: 'mesuresForm',
  confirmationId: 'confirmation',
  resultatsPageId: 'page-resultats',
  storageKeys: {
    formInputs: 'formInputs',
    mesuresData: 'mesuresData'
  }
};

// Service Worker Registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('Service Worker enregistré'))
    .catch(err => console.error('Erreur Service Worker:', err));
}

// Utility Functions
const getElement = id => document.getElementById(id);
const getFormData = form => Object.fromEntries(new FormData(form).entries());
const saveToStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const loadFromStorage = key => JSON.parse(localStorage.getItem(key) || '{}');
const clearStorage = () => Object.values(CONFIG.storageKeys).forEach(key => localStorage.removeItem(key));

// Form Handling
const handleFormInput = input => {
  input.style.borderLeft = input.checkValidity() 
    ? '3px solid rgb(71, 139, 71)' 
    : '3px solid #ff0000';
  saveFormInputs();
};

const saveFormInputs = () => {
  const form = getElement(CONFIG.formId);
  if (form) saveToStorage(CONFIG.storageKeys.formInputs, getFormData(form));
};

const loadFormInputs = () => {
  const form = getElement(CONFIG.formId);
  if (!form) return;

  const savedData = loadFromStorage(CONFIG.storageKeys.formInputs);
  Object.entries(savedData).forEach(([key, value]) => {
    const input = form.querySelector(`[name="${key}"]`);
    if (input) input.value = value || '';
  });
};

const calculateValues = data => ({
  ...data,
  moyenneVerticale: ([
    data.grandModeleVertical1,
    data.grandModeleVertical2,
    data.grandModeleVertical3
  ].reduce((sum, val) => sum + parseFloat(val || 0), 0) / 3).toFixed(3),
  moyenneHorizontale: ([
    data.grandModeleHorizontal1,
    data.grandModeleHorizontal2,
    data.grandModeleHorizontal3
  ].reduce((sum, val) => sum + parseFloat(val || 0), 0) / 3).toFixed(3)
});

// Resultats Page
const loadResultats = () => {
  const rapportContent = getElement('rapportContent');
  const data = loadFromStorage(CONFIG.storageKeys.mesuresData);
  
  if (!rapportContent || !Object.keys(data).length) {
    rapportContent.innerHTML = `<tr><td colspan="2">Aucune donnée disponible.</td></tr>`;
    return;
  }

  const fields = [
    ['Date', 'date'],
    ['OM', 'om'],
    ['Bogie N°', 'bogieNo'],
    ['Type N°', 'typeNo'],
    ['Fabrick', 'fabrick'],
    ['Année de Fabrication', 'anneeFab'],
    ['Autre', 'autre'],
    ['Localisation', 'localisation'],
    ['N° de série de la roue', 'serieRoue'],
    ['Jeu Axial "Jm" mesuré', 'jeuAxialJm'],
    ['Grand Modèle Vertical 1', 'grandModeleVertical1'],
    ['Grand Modèle Vertical 2', 'grandModeleVertical2'],
    ['Grand Modèle Vertical 3', 'grandModeleVertical3'],
    ['Grand Modèle Horizontal 1', 'grandModeleHorizontal1'],
    ['Grand Modèle Horizontal 2', 'grandModeleHorizontal2'],
    ['Grand Modèle Horizontal 3', 'grandModeleHorizontal3'],
    ['Moyenne Verticale', 'moyenneVerticale'],
    ['Moyenne Horizontale', 'moyenneHorizontale']
  ];

  rapportContent.innerHTML = fields.map(([label, key]) => 
    `<tr><td>${label}</td><td>${data[key] || 'N/A'}</td></tr>`
  ).join('');
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  const form = getElement(CONFIG.formId);
  const confirmation = getElement(CONFIG.confirmationId);

  if (form) {
    loadFormInputs();
    
    form.querySelectorAll('input[required]').forEach(input => 
      input.addEventListener('input', () => handleFormInput(input))
    );

    form.addEventListener('submit', e => {
      e.preventDefault();
      const formData = getFormData(form);
      const calculatedData = calculateValues(formData);
      
      saveToStorage(CONFIG.storageKeys.mesuresData, calculatedData);
      
      confirmation.style.display = 'block';
      setTimeout(() => {
        confirmation.style.display = 'none';
        window.location.href = 'resultats.html';
      }, 1500);
    });
  }

  if (document.body.id === CONFIG.resultatsPageId) {
    loadResultats();
  }
});

window.addEventListener('beforeunload', clearStorage);