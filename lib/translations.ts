export const translations = {
  en: {
    // Navigation
    home: "Home",
    sports: "Sports",
    tickets: "My Tickets",
    wallet: "Wallet",
    profile: "Profile",
    search: "Search",
    admin: "Admin",

    // Common
    welcome: "Welcome to SmartSports RW",
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    view: "View",

    // Sports
    football: "Football",
    basketball: "Basketball",
    volleyball: "Volleyball",

    // Tickets
    buyTickets: "Buy Tickets",
    myTickets: "My Tickets",
    ticketPrice: "Ticket Price",

    // Wallet
    balance: "Balance",
    addMoney: "Add Money",
    withdraw: "Withdraw",

    // Store
    addToCart: "Add to Cart",
    checkout: "Checkout",
    price: "Price",
  },
  rw: {
    // Navigation
    home: "Ahabanza",
    sports: "Siporo",
    tickets: "Amatike Yanjye",
    wallet: "Igikoni",
    profile: "Umwirondoro",
    search: "Gushakisha",
    admin: "Ubuyobozi",

    // Common
    welcome: "Murakaza neza kuri SmartSports RW",
    loading: "Biratangura...",
    save: "Bika",
    cancel: "Hagarika",
    edit: "Hindura",
    delete: "Siba",
    view: "Reba",

    // Sports
    football: "Umupira w'amaguru",
    basketball: "Umupira w'ikibuno",
    volleyball: "Volleyball",

    // Tickets
    buyTickets: "Gura Amatike",
    myTickets: "Amatike Yanjye",
    ticketPrice: "Igiciro cy'Itike",

    // Wallet
    balance: "Amafaranga",
    addMoney: "Ongeraho Amafaranga",
    withdraw: "Kuramo Amafaranga",

    // Store
    addToCart: "Shyira mu Gitebo",
    checkout: "Kwishyura",
    price: "Igiciro",
  },
  fr: {
    // Navigation
    home: "Accueil",
    sports: "Sports",
    tickets: "Mes Billets",
    wallet: "Portefeuille",
    profile: "Profil",
    search: "Rechercher",
    admin: "Admin",

    // Common
    welcome: "Bienvenue sur SmartSports RW",
    loading: "Chargement...",
    save: "Enregistrer",
    cancel: "Annuler",
    edit: "Modifier",
    delete: "Supprimer",
    view: "Voir",

    // Sports
    football: "Football",
    basketball: "Basketball",
    volleyball: "Volleyball",

    // Tickets
    buyTickets: "Acheter des Billets",
    myTickets: "Mes Billets",
    ticketPrice: "Prix du Billet",

    // Wallet
    balance: "Solde",
    addMoney: "Ajouter de l'Argent",
    withdraw: "Retirer",

    // Store
    addToCart: "Ajouter au Panier",
    checkout: "Commander",
    price: "Prix",
  },
}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.en

export function useTranslation(language: Language = "en") {
  return {
    t: (key: TranslationKey) => translations[language][key] || translations.en[key],
    language,
  }
}
