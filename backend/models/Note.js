class Note {
  constructor(data) {
    this.nom = data['Noms & prénoms Eleve 0'] || data.nom; // Adjust based on CSV structure
    this.francais = parseFloat(data.FRANÇAIS) || 0;
    this.anglais = parseFloat(data.ANGLAIS) || 0;
    this.mathematiques = parseFloat(data['MATHÉMATIQUES']) || 0;
    this.sciencesPhysiques = parseFloat(data['SCIENCES PHYSIQUES']) || 0;
    this.ecm = parseFloat(data.ECM) || 0;
    this.informatique = parseFloat(data.INFORMATIQUE) || 0;
    this.presentationMetier = parseFloat(data['PRÉSENTATION DU MÉTIER']) || 0;
    this.hygieneSecu = parseFloat(data['HYGIÈNE, SÉCU. ENVI.']) || 0;
    this.technologies = parseFloat(data.TECHNOLOGIES) || 0;
    this.dessinTechniques = parseFloat(data['DESSIN TECHNIQUES']) || 0;
    this.travauxElectricite = parseFloat(data['TRAVAUX ÉLECTRICITÉ']) || 0;
    this.eps = parseFloat(data.EPS) || 0;
    this.tm = parseFloat(data.TM) || 0;
    this.moyenne = parseFloat(data.MOYENNE) || 0;
    this.rang = data.RANG || '';
    this.sequence = data.sequence || 1;
    this.classe = data.classe || 'A1 ELEC';
    // New fields for teacher and subject tracking
    this.enseignantId = data.enseignantId || null;
    this.matiereId = data.matiereId || null;
    this.coefficient = data.coefficient || 1;
  }

  // Calculate average if not provided
  calculateMoyenne(coefficients) {
    const subjects = [
      { note: this.francais, coeff: coefficients.francais || 4 },
      { note: this.anglais, coeff: coefficients.anglais || 3 },
      { note: this.mathematiques, coeff: coefficients.mathematiques || 4 },
      { note: this.sciencesPhysiques, coeff: coefficients.sciencesPhysiques || 2 },
      { note: this.ecm, coeff: coefficients.ecm || 1 },
      { note: this.informatique, coeff: coefficients.informatique || 1 },
      { note: this.presentationMetier, coeff: coefficients.presentationMetier || 2 },
      { note: this.hygieneSecu, coeff: coefficients.hygieneSecu || 1 },
      { note: this.technologies, coeff: coefficients.technologies || 3 },
      { note: this.dessinTechniques, coeff: coefficients.dessinTechniques || 0 },
      { note: this.travauxElectricite, coeff: coefficients.travauxElectricite || 6 },
      { note: this.eps, coeff: coefficients.eps || 2 },
      { note: this.tm, coeff: coefficients.tm || 1 }
    ];

    let totalPoints = 0;
    let totalCoeff = 0;

    subjects.forEach(subject => {
      if (!isNaN(subject.note)) {
        totalPoints += subject.note * subject.coeff;
        totalCoeff += subject.coeff;
      }
    });

    this.moyenne = totalCoeff > 0 ? totalPoints / totalCoeff : 0;
    return this.moyenne;
  }
}

module.exports = Note;