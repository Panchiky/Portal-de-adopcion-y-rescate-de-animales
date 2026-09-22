import React, { useState } from 'react';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonInput, IonButton, IonIcon } from '@ionic/react';
import { searchOutline, documentTextOutline, notificationsOutline, personOutline, heart } from 'ionicons/icons';
import './Explorar.css';

interface Animal {
  id: number;
  name: string;
  species: string;
  gender: string;
  age: string;
  size: string;
  status: string;
  tags: string[];
  description: string;
  shelter: string;
  location: string;
  distance: string;
  health: string;
  image: string;
}

const ANIMALS_DATA: Animal[] = [
  {
    id: 1,
    name: "Milo",
    species: "Gato mestizo",
    gender: "Macho",
    age: "2 años",
    size: "Mediano",
    status: "DISPONIBLE",
    tags: ["Sociable", "Tranquilo", "Energía media"],
    description: "Compañero sociable que disfruta las siestas al sol y busca un hogar estable y amoroso.",
    shelter: "Huellas Felices",
    location: "Valparaíso",
    distance: "a 14 km",
    health: "Salud: vacunas, desparasitación y esterilización al día.",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Luna",
    species: "Gato naranja",
    gender: "Hembra",
    age: "4 años",
    size: "Mediano",
    status: "DISPONIBLE",
    tags: ["Juguetona", "Cariñosa", "Curiosa"],
    description: "Una gata llena de energía que adora jugar con juguetes colgantes y recibir mimos en la barbilla.",
    shelter: "Refugio Patitas",
    location: "Viña del Mar",
    distance: "a 18 km",
    health: "Salud: esterilizada, vacunas al día y test negativo.",
    image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Rocky",
    species: "Perro mestizo",
    gender: "Macho",
    age: "1 año",
    size: "Grande",
    status: "DISPONIBLE",
    tags: ["Muy activo", "Fiel", "Protector"],
    description: "Rocky es un cachorro grande con mucha energía, ideal para personas activas que disfruten salir a correr.",
    shelter: "Amigos Peludos",
    location: "Limache",
    distance: "a 5 km",
    health: "Salud: vacunado y desparasitado.",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

const Explorar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Animal actual y siguiente (usando operador módulo para hacer un ciclo infinito)
  const currentAnimal = ANIMALS_DATA[currentIndex];
  const nextAnimal = ANIMALS_DATA[(currentIndex + 1) % ANIMALS_DATA.length];

  const handleNextAnimal = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % ANIMALS_DATA.length);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="explore-content">
        <IonGrid className="explore-grid">
          <IonRow className="explore-row">
            
            {/* --- BARRA LATERAL (Desktop) --- */}
            <IonCol size="12" sizeMd="3" sizeLg="2.5" className="sidebar">
              <div className="sidebar-header">
                <div className="logo">
                  <span className="dot"></span> PatitasGo
                </div>
                <span className="logo-subtitle">ADOPCIÓN Y RESCATE</span>
              </div>

              <div className="nav-menu">
                <div className="nav-item active">
                  <IonIcon icon={searchOutline} />
                  <span>Explorar</span>
                </div>
                <div className="nav-item">
                  <IonIcon icon={documentTextOutline} />
                  <span>Postulaciones</span>
                </div>
                <div className="nav-item">
                  <IonIcon icon={notificationsOutline} />
                  <span>Alertas</span>
                </div>
                <div className="nav-item">
                  <IonIcon icon={personOutline} />
                  <span>Perfil</span>
                </div>
              </div>

              <div className="help-box">
                <h4>¿Necesitas ayuda?</h4>
                <p>Revisa preguntas frecuentes o contacta al refugio.</p>
                <IonButton expand="block" color="light" className="btn-help">
                  Centro de ayuda
                </IonButton>
              </div>
            </IonCol>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <IonCol size="12" sizeMd="9" sizeLg="9.5" className="main-content">
              
              <div className="top-section">
                <div className="header-info">
                  <div>
                    <h1 className="page-title">Explorar animales</h1>
                    <p className="page-subtitle">Ficha completa y una siguiente opción, sin gestos de rechazo.</p>
                  </div>
                  <div className="location-badge">
                    {ANIMALS_DATA.length} animales • 25 km
                  </div>
                </div>

                <div className="search-filter-container">
                  <div className="search-bar">
                    <IonInput placeholder="Buscar por nombre, especie o refugio"></IonInput>
                  </div>
                  <IonButton fill="outline" color="dark" className="btn-filter">
                    Filtros
                  </IonButton>
                </div>
              </div>

              <div className="cards-layout">
                
                {/* --- TARJETA PRINCIPAL DINÁMICA --- */}
                <div className="main-animal-card">
                  <img 
                    src={currentAnimal.image} 
                    alt={currentAnimal.name} 
                    className="main-animal-img"
                  />
                  <div className="main-animal-details">
                    <span className="status-badge">{currentAnimal.status}</span>
                    <h2 className="animal-name">{currentAnimal.name}</h2>
                    <p className="animal-stats">
                      {currentAnimal.species} • {currentAnimal.gender} • {currentAnimal.age} • {currentAnimal.size}
                    </p>
                    
                    <div className="tags-container">
                      {currentAnimal.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>

                    <p className="animal-desc">
                      {currentAnimal.description}
                    </p>

                    <h4 className="section-subtitle">Refugio y ubicación</h4>
                    <p className="text-muted">{currentAnimal.shelter} • {currentAnimal.location} • {currentAnimal.distance}</p>
                    
                    <p className="text-muted">{currentAnimal.health}</p>

                    <IonButton expand="block" color="success" className="btn-postular" routerLink={`/animales/${currentAnimal.id}/postular`}>
                      Postular para adoptar
                    </IonButton>

                    <div className="action-buttons">
                      <IonButton fill="outline" color="dark" className="btn-secondary">
                        <IonIcon icon={heart} color="danger" slot="start" />
                        Añadir a favoritos
                      </IonButton>
                      <IonButton fill="outline" color="dark" className="btn-secondary">
                        Apadrinar
                      </IonButton>
                    </div>
                  </div>
                </div>

                {/* --- TARJETA DE SIGUIENTE ANIMAL (Al hacer clic avanza) --- */}
                <div className="next-animal-card" onClick={handleNextAnimal} style={{ cursor: 'pointer' }}>
                  <span className="next-label">SIGUIENTE ANIMAL</span>
                  <img 
                    src={nextAnimal.image} 
                    alt={nextAnimal.name} 
                    className="next-animal-img"
                  />
                  <div className="next-animal-details">
                    <h3 className="animal-name-small">{nextAnimal.name}</h3>
                    <p className="animal-stats-small">{nextAnimal.species} • {nextAnimal.gender} • {nextAnimal.age}</p>
                    <p className="text-muted-small">{nextAnimal.shelter} • {nextAnimal.location} • {nextAnimal.distance}</p>
                    
                    <IonButton expand="block" fill="outline" color="dark" className="btn-ver-ficha" onClick={(e) => { e.stopPropagation(); handleNextAnimal(); }}>
                      Ver ficha de {nextAnimal.name} →
                    </IonButton>
                  </div>
                </div>

              </div>
            </IonCol>

          </IonRow>
        </IonGrid>

        {/* --- BARRA DE NAVEGACIÓN INFERIOR (Solo para móviles) --- */}
        <div className="mobile-bottom-nav">
          <div className="nav-item-mobile active">
            <IonIcon icon={searchOutline} />
            <span>Explorar</span>
          </div>
          <div className="nav-item-mobile">
            <IonIcon icon={documentTextOutline} />
            <span>Postulaciones</span>
          </div>
          <div className="nav-item-mobile">
            <IonIcon icon={notificationsOutline} />
            <span>Alertas</span>
          </div>
          <div className="nav-item-mobile">
            <IonIcon icon={personOutline} />
            <span>Perfil</span>
          </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Explorar;