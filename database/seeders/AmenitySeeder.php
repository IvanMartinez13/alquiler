<?php

namespace Database\Seeders;

use App\Models\Amenity;
use Illuminate\Database\Seeder;

class AmenitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            // Internet & trabajo
            [
                'code' => 'wifi',
                'icon' => 'fas fa-wifi',
                'name' => [
                    'es' => 'Wifi',
                    'en' => 'Wi-Fi',
                    'de' => 'WLAN',
                ],
                'description' => [
                    'es' => 'Conexión a internet disponible en toda la propiedad.',
                    'en' => 'Internet connection available throughout the property.',
                    'de' => 'Internetverbindung in der gesamten Unterkunft verfuegbar.',
                ],
            ],
            [
                'code' => 'workspace',
                'icon' => 'fas fa-laptop',
                'name' => [
                    'es' => 'Zona de trabajo',
                    'en' => 'Workspace',
                    'de' => 'Arbeitsbereich',
                ],
                'description' => [
                    'es' => 'Espacio cómodo para trabajar con mesa y silla.',
                    'en' => 'Comfortable workspace with desk and chair.',
                    'de' => 'Bequemer Arbeitsbereich mit Tisch und Stuhl.',
                ],
            ],
            [
                'code' => 'desk',
                'icon' => 'fas fa-table',
                'name' => [
                    'es' => 'Escritorio',
                    'en' => 'Desk',
                    'de' => 'Schreibtisch',
                ],
                'description' => [
                    'es' => 'Escritorio disponible para trabajar o estudiar.',
                    'en' => 'Desk available for work or study.',
                    'de' => 'Schreibtisch zum Arbeiten oder Lernen verfuegbar.',
                ],
            ],

            // Climatización
            [
                'code' => 'air-conditioning',
                'icon' => 'fas fa-snowflake',
                'name' => [
                    'es' => 'Aire acondicionado',
                    'en' => 'Air conditioning',
                    'de' => 'Klimaanlage',
                ],
                'description' => [
                    'es' => 'Sistema de climatización para mantener una temperatura agradable.',
                    'en' => 'Cooling system to maintain a comfortable indoor temperature.',
                    'de' => 'Klimasystem fuer eine angenehme Innentemperatur.',
                ],
            ],
            [
                'code' => 'heating',
                'icon' => 'fas fa-fire',
                'name' => [
                    'es' => 'Calefacción',
                    'en' => 'Heating',
                    'de' => 'Heizung',
                ],
                'description' => [
                    'es' => 'Calefacción disponible para los meses fríos.',
                    'en' => 'Heating available for colder months.',
                    'de' => 'Heizung fuer die kalten Monate verfuegbar.',
                ],
            ],
            [
                'code' => 'fan',
                'icon' => 'fas fa-fan',
                'name' => [
                    'es' => 'Ventilador',
                    'en' => 'Fan',
                    'de' => 'Ventilator',
                ],
                'description' => [
                    'es' => 'Ventilador disponible para mayor confort.',
                    'en' => 'Fan available for extra comfort.',
                    'de' => 'Ventilator fuer zusaetzlichen Komfort verfuegbar.',
                ],
            ],

            // Cocina y comedor
            [
                'code' => 'kitchen',
                'icon' => 'fas fa-utensils',
                'name' => [
                    'es' => 'Cocina equipada',
                    'en' => 'Equipped kitchen',
                    'de' => 'Ausgestattete Kueche',
                ],
                'description' => [
                    'es' => 'Cocina con utensilios y electrodomésticos básicos.',
                    'en' => 'Kitchen with essential appliances and utensils.',
                    'de' => 'Kueche mit Grundausstattung und wichtigen Geraeten.',
                ],
            ],
            [
                'code' => 'kitchenette',
                'icon' => 'fas fa-utensil-spoon',
                'name' => [
                    'es' => 'Zona de cocina',
                    'en' => 'Kitchenette',
                    'de' => 'Kuechenzeile',
                ],
                'description' => [
                    'es' => 'Zona de cocina compacta para preparar comidas sencillas.',
                    'en' => 'Compact kitchenette for preparing simple meals.',
                    'de' => 'Kompakte Kuechenzeile fuer einfache Mahlzeiten.',
                ],
            ],
            [
                'code' => 'fridge',
                'icon' => 'fas fa-cube',
                'name' => [
                    'es' => 'Nevera',
                    'en' => 'Refrigerator',
                    'de' => 'Kuehlschrank',
                ],
                'description' => [
                    'es' => 'Nevera disponible para conservar alimentos y bebidas.',
                    'en' => 'Refrigerator available for food and drinks.',
                    'de' => 'Kuehlschrank fuer Lebensmittel und Getraenke vorhanden.',
                ],
            ],
            [
                'code' => 'microwave',
                'icon' => 'fas fa-broadcast-tower',
                'name' => [
                    'es' => 'Microondas',
                    'en' => 'Microwave',
                    'de' => 'Mikrowelle',
                ],
                'description' => [
                    'es' => 'Microondas disponible para calentar comida rápidamente.',
                    'en' => 'Microwave available for quickly heating food.',
                    'de' => 'Mikrowelle zum schnellen Erwaermen von Speisen vorhanden.',
                ],
            ],
            [
                'code' => 'coffee-machine',
                'icon' => 'fas fa-coffee',
                'name' => [
                    'es' => 'Cafetera',
                    'en' => 'Coffee machine',
                    'de' => 'Kaffeemaschine',
                ],
                'description' => [
                    'es' => 'Cafetera disponible en la cocina.',
                    'en' => 'Coffee machine available in the kitchen.',
                    'de' => 'Kaffeemaschine in der Kueche vorhanden.',
                ],
            ],
            [
                'code' => 'kettle',
                'icon' => 'fas fa-mug-hot',
                'name' => [
                    'es' => 'Hervidor de agua',
                    'en' => 'Kettle',
                    'de' => 'Wasserkocher',
                ],
                'description' => [
                    'es' => 'Hervidor eléctrico para preparar bebidas calientes.',
                    'en' => 'Electric kettle for preparing hot drinks.',
                    'de' => 'Elektrischer Wasserkocher fuer heisse Getraenke.',
                ],
            ],
            [
                'code' => 'dishwasher',
                'icon' => 'fas fa-soap',
                'name' => [
                    'es' => 'Lavavajillas',
                    'en' => 'Dishwasher',
                    'de' => 'Geschirrspueler',
                ],
                'description' => [
                    'es' => 'Lavavajillas disponible para mayor comodidad.',
                    'en' => 'Dishwasher available for added convenience.',
                    'de' => 'Geschirrspueler fuer mehr Komfort vorhanden.',
                ],
            ],
            [
                'code' => 'dining-area',
                'icon' => 'fas fa-chair',
                'name' => [
                    'es' => 'Zona de comedor',
                    'en' => 'Dining area',
                    'de' => 'Essbereich',
                ],
                'description' => [
                    'es' => 'Espacio de comedor dentro de la propiedad.',
                    'en' => 'Dining space inside the property.',
                    'de' => 'Essbereich innerhalb der Unterkunft.',
                ],
            ],

            // Lavandería
            [
                'code' => 'washer',
                'icon' => 'fas fa-tshirt',
                'name' => [
                    'es' => 'Lavadora',
                    'en' => 'Washing machine',
                    'de' => 'Waschmaschine',
                ],
                'description' => [
                    'es' => 'Lavadora disponible para estancias cortas o largas.',
                    'en' => 'Washing machine available for short and long stays.',
                    'de' => 'Waschmaschine fuer kurze und lange Aufenthalte verfuegbar.',
                ],
            ],
            [
                'code' => 'dryer',
                'icon' => 'fas fa-wind',
                'name' => [
                    'es' => 'Secadora',
                    'en' => 'Dryer',
                    'de' => 'Trockner',
                ],
                'description' => [
                    'es' => 'Secadora para ropa disponible en la propiedad.',
                    'en' => 'Clothes dryer available in the property.',
                    'de' => 'Waeschetrockner in der Unterkunft vorhanden.',
                ],
            ],
            [
                'code' => 'iron',
                'icon' => 'fas fa-border-top-left',
                'name' => [
                    'es' => 'Plancha',
                    'en' => 'Iron',
                    'de' => 'Buegeleisen',
                ],
                'description' => [
                    'es' => 'Plancha disponible para la ropa.',
                    'en' => 'Iron available for clothes.',
                    'de' => 'Buegeleisen fuer Kleidung vorhanden.',
                ],
            ],

            // Baño
            [
                'code' => 'private-bathroom',
                'icon' => 'fas fa-bath',
                'name' => [
                    'es' => 'Baño privado',
                    'en' => 'Private bathroom',
                    'de' => 'Privates Badezimmer',
                ],
                'description' => [
                    'es' => 'Baño privado de uso exclusivo para los huéspedes.',
                    'en' => 'Private bathroom exclusively for guests.',
                    'de' => 'Privates Badezimmer zur exklusiven Nutzung durch Gaeste.',
                ],
            ],
            [
                'code' => 'bathtub',
                'icon' => 'fas fa-bath',
                'name' => [
                    'es' => 'Bañera',
                    'en' => 'Bathtub',
                    'de' => 'Badewanne',
                ],
                'description' => [
                    'es' => 'Bañera disponible en el baño.',
                    'en' => 'Bathtub available in the bathroom.',
                    'de' => 'Badewanne im Badezimmer vorhanden.',
                ],
            ],
            [
                'code' => 'shower',
                'icon' => 'fas fa-shower',
                'name' => [
                    'es' => 'Ducha',
                    'en' => 'Shower',
                    'de' => 'Dusche',
                ],
                'description' => [
                    'es' => 'Ducha disponible en la propiedad.',
                    'en' => 'Shower available in the property.',
                    'de' => 'Dusche in der Unterkunft vorhanden.',
                ],
            ],
            [
                'code' => 'hair-dryer',
                'icon' => 'fas fa-wind',
                'name' => [
                    'es' => 'Secador de pelo',
                    'en' => 'Hair dryer',
                    'de' => 'Haartrockner',
                ],
                'description' => [
                    'es' => 'Secador de pelo disponible para los huéspedes.',
                    'en' => 'Hair dryer available for guests.',
                    'de' => 'Haartrockner fuer Gaeste vorhanden.',
                ],
            ],
            [
                'code' => 'towels',
                'icon' => 'fas fa-scroll',
                'name' => [
                    'es' => 'Toallas',
                    'en' => 'Towels',
                    'de' => 'Handtuecher',
                ],
                'description' => [
                    'es' => 'Toallas incluidas durante la estancia.',
                    'en' => 'Towels included during the stay.',
                    'de' => 'Handtuecher waehrend des Aufenthalts inklusive.',
                ],
            ],
            [
                'code' => 'toiletries',
                'icon' => 'fas fa-pump-soap',
                'name' => [
                    'es' => 'Artículos de aseo',
                    'en' => 'Toiletries',
                    'de' => 'Pflegeprodukte',
                ],
                'description' => [
                    'es' => 'Se proporcionan productos básicos de aseo.',
                    'en' => 'Basic toiletries are provided.',
                    'de' => 'Grundlegende Pflegeprodukte werden bereitgestellt.',
                ],
            ],

            // Habitación
            [
                'code' => 'bed-linen',
                'icon' => 'fas fa-bed',
                'name' => [
                    'es' => 'Ropa de cama',
                    'en' => 'Bed linen',
                    'de' => 'Bettwaesche',
                ],
                'description' => [
                    'es' => 'Ropa de cama incluida en la reserva.',
                    'en' => 'Bed linen included with the reservation.',
                    'de' => 'Bettwaesche in der Reservierung enthalten.',
                ],
            ],
            [
                'code' => 'wardrobe',
                'icon' => 'fas fa-archive',
                'name' => [
                    'es' => 'Armario',
                    'en' => 'Wardrobe',
                    'de' => 'Kleiderschrank',
                ],
                'description' => [
                    'es' => 'Armario o espacio de almacenamiento para ropa.',
                    'en' => 'Wardrobe or storage space for clothes.',
                    'de' => 'Kleiderschrank oder Stauraum fuer Kleidung.',
                ],
            ],
            [
                'code' => 'extra-pillows',
                'icon' => 'fas fa-cloud',
                'name' => [
                    'es' => 'Almohadas adicionales',
                    'en' => 'Extra pillows',
                    'de' => 'Zusaetzliche Kissen',
                ],
                'description' => [
                    'es' => 'Almohadas adicionales disponibles bajo solicitud.',
                    'en' => 'Extra pillows available on request.',
                    'de' => 'Zusaetzliche Kissen auf Anfrage verfuegbar.',
                ],
            ],
            [
                'code' => 'blackout-curtains',
                'icon' => 'fas fa-moon',
                'name' => [
                    'es' => 'Cortinas opacas',
                    'en' => 'Blackout curtains',
                    'de' => 'Verdunkelungsvorhaenge',
                ],
                'description' => [
                    'es' => 'Cortinas opacas para un mejor descanso.',
                    'en' => 'Blackout curtains for better rest.',
                    'de' => 'Verdunkelungsvorhaenge fuer besseren Schlaf.',
                ],
            ],

            // Entretenimiento
            [
                'code' => 'tv',
                'icon' => 'fas fa-tv',
                'name' => [
                    'es' => 'Televisión',
                    'en' => 'TV',
                    'de' => 'Fernseher',
                ],
                'description' => [
                    'es' => 'Televisión de pantalla plana con canales disponibles.',
                    'en' => 'Flat-screen TV with available channels.',
                    'de' => 'Flachbildfernseher mit verfuegbaren Kanaelen.',
                ],
            ],
            [
                'code' => 'smart-tv',
                'icon' => 'fas fa-tv',
                'name' => [
                    'es' => 'Smart TV',
                    'en' => 'Smart TV',
                    'de' => 'Smart-TV',
                ],
                'description' => [
                    'es' => 'Smart TV con acceso a aplicaciones de streaming.',
                    'en' => 'Smart TV with access to streaming apps.',
                    'de' => 'Smart-TV mit Zugriff auf Streaming-Apps.',
                ],
            ],
            [
                'code' => 'streaming-services',
                'icon' => 'fas fa-play-circle',
                'name' => [
                    'es' => 'Servicios de streaming',
                    'en' => 'Streaming services',
                    'de' => 'Streaming-Dienste',
                ],
                'description' => [
                    'es' => 'Acceso a plataformas de streaming o posibilidad de conectarlas.',
                    'en' => 'Access to streaming platforms or ability to connect them.',
                    'de' => 'Zugang zu Streaming-Plattformen oder Moeglichkeit zur Verbindung.',
                ],
            ],
            [
                'code' => 'board-games',
                'icon' => 'fas fa-chess-board',
                'name' => [
                    'es' => 'Juegos de mesa',
                    'en' => 'Board games',
                    'de' => 'Brettspiele',
                ],
                'description' => [
                    'es' => 'Juegos de mesa disponibles para ocio en familia o grupo.',
                    'en' => 'Board games available for family or group entertainment.',
                    'de' => 'Brettspiele fuer Unterhaltung mit Familie oder Gruppe vorhanden.',
                ],
            ],

            // Exterior y vistas
            [
                'code' => 'balcony',
                'icon' => 'fas fa-building',
                'name' => [
                    'es' => 'Balcón',
                    'en' => 'Balcony',
                    'de' => 'Balkon',
                ],
                'description' => [
                    'es' => 'Balcón privado con espacio exterior.',
                    'en' => 'Private balcony with outdoor space.',
                    'de' => 'Privater Balkon mit Aussenbereich.',
                ],
            ],
            [
                'code' => 'terrace',
                'icon' => 'fas fa-sun',
                'name' => [
                    'es' => 'Terraza',
                    'en' => 'Terrace',
                    'de' => 'Terrasse',
                ],
                'description' => [
                    'es' => 'Terraza privada o compartida para disfrutar del exterior.',
                    'en' => 'Private or shared terrace to enjoy the outdoors.',
                    'de' => 'Private oder gemeinschaftliche Terrasse fuer den Aussenbereich.',
                ],
            ],
            [
                'code' => 'garden',
                'icon' => 'fas fa-seedling',
                'name' => [
                    'es' => 'Jardín',
                    'en' => 'Garden',
                    'de' => 'Garten',
                ],
                'description' => [
                    'es' => 'Zona ajardinada dentro de la propiedad.',
                    'en' => 'Garden area within the property.',
                    'de' => 'Gartenbereich innerhalb der Unterkunft.',
                ],
            ],
            [
                'code' => 'barbecue',
                'icon' => 'fas fa-fire-alt',
                'name' => [
                    'es' => 'Barbacoa',
                    'en' => 'Barbecue',
                    'de' => 'Grillmoeglichkeit',
                ],
                'description' => [
                    'es' => 'Barbacoa disponible en zona exterior.',
                    'en' => 'Barbecue available in the outdoor area.',
                    'de' => 'Grillmoeglichkeit im Aussenbereich vorhanden.',
                ],
            ],
            [
                'code' => 'outdoor-furniture',
                'icon' => 'fas fa-couch',
                'name' => [
                    'es' => 'Mobiliario exterior',
                    'en' => 'Outdoor furniture',
                    'de' => 'Gartenmoebel',
                ],
                'description' => [
                    'es' => 'Muebles de exterior para disfrutar de terraza, patio o jardín.',
                    'en' => 'Outdoor furniture for terrace, patio or garden use.',
                    'de' => 'Aussenmoebel fuer Terrasse, Patio oder Garten.',
                ],
            ],
            [
                'code' => 'sea-view',
                'icon' => 'fas fa-water',
                'name' => [
                    'es' => 'Vistas al mar',
                    'en' => 'Sea view',
                    'de' => 'Meerblick',
                ],
                'description' => [
                    'es' => 'La propiedad ofrece vistas al mar.',
                    'en' => 'The property offers sea views.',
                    'de' => 'Die Unterkunft bietet Meerblick.',
                ],
            ],
            [
                'code' => 'mountain-view',
                'icon' => 'fas fa-mountain',
                'name' => [
                    'es' => 'Vistas a la montaña',
                    'en' => 'Mountain view',
                    'de' => 'Bergblick',
                ],
                'description' => [
                    'es' => 'La propiedad ofrece vistas a la montaña.',
                    'en' => 'The property offers mountain views.',
                    'de' => 'Die Unterkunft bietet Bergblick.',
                ],
            ],
            [
                'code' => 'city-view',
                'icon' => 'fas fa-city',
                'name' => [
                    'es' => 'Vistas a la ciudad',
                    'en' => 'City view',
                    'de' => 'Stadtblick',
                ],
                'description' => [
                    'es' => 'La propiedad ofrece vistas a la ciudad.',
                    'en' => 'The property offers city views.',
                    'de' => 'Die Unterkunft bietet Stadtblick.',
                ],
            ],

            // Servicios del edificio / acceso
            [
                'code' => 'parking',
                'icon' => 'fas fa-parking',
                'name' => [
                    'es' => 'Parking',
                    'en' => 'Parking',
                    'de' => 'Parkplatz',
                ],
                'description' => [
                    'es' => 'Plaza de aparcamiento incluida o disponible en el alojamiento.',
                    'en' => 'On-site parking included or available.',
                    'de' => 'Parkplatz vor Ort inklusive oder verfuegbar.',
                ],
            ],
            [
                'code' => 'free-parking',
                'icon' => 'fas fa-parking',
                'name' => [
                    'es' => 'Parking gratuito',
                    'en' => 'Free parking',
                    'de' => 'Kostenloser Parkplatz',
                ],
                'description' => [
                    'es' => 'Aparcamiento gratuito disponible para los huéspedes.',
                    'en' => 'Free parking available for guests.',
                    'de' => 'Kostenloser Parkplatz fuer Gaeste verfuegbar.',
                ],
            ],
            [
                'code' => 'street-parking',
                'icon' => 'fas fa-road',
                'name' => [
                    'es' => 'Parking en la calle',
                    'en' => 'Street parking',
                    'de' => 'Strassenparkplatz',
                ],
                'description' => [
                    'es' => 'Posibilidad de aparcar en la vía pública cercana.',
                    'en' => 'Street parking available nearby.',
                    'de' => 'Parkmoeglichkeit in der Naehe auf der Strasse.',
                ],
            ],
            [
                'code' => 'elevator',
                'icon' => 'fas fa-arrow-up',
                'name' => [
                    'es' => 'Ascensor',
                    'en' => 'Elevator',
                    'de' => 'Aufzug',
                ],
                'description' => [
                    'es' => 'El edificio dispone de ascensor.',
                    'en' => 'The building has an elevator.',
                    'de' => 'Das Gebaeude verfuegt ueber einen Aufzug.',
                ],
            ],
            [
                'code' => 'private-entrance',
                'icon' => 'fas fa-door-open',
                'name' => [
                    'es' => 'Entrada privada',
                    'en' => 'Private entrance',
                    'de' => 'Privater Eingang',
                ],
                'description' => [
                    'es' => 'Acceso independiente a la propiedad.',
                    'en' => 'Independent access to the property.',
                    'de' => 'Unabhaengiger Zugang zur Unterkunft.',
                ],
            ],
            [
                'code' => 'self-check-in',
                'icon' => 'fas fa-key',
                'name' => [
                    'es' => 'Check-in autónomo',
                    'en' => 'Self check-in',
                    'de' => 'Selbst Check-in',
                ],
                'description' => [
                    'es' => 'Entrada independiente con cerradura inteligente o caja de llaves.',
                    'en' => 'Independent entry via smart lock or lockbox.',
                    'de' => 'Eigenstaendiger Zugang per Smart Lock oder Schluesselbox.',
                ],
            ],
            [
                'code' => 'doorman',
                'icon' => 'fas fa-concierge-bell',
                'name' => [
                    'es' => 'Recepción o conserjería',
                    'en' => 'Reception or concierge',
                    'de' => 'Rezeption oder Concierge',
                ],
                'description' => [
                    'es' => 'Servicio de recepción o conserjería disponible.',
                    'en' => 'Reception or concierge service available.',
                    'de' => 'Rezeptions- oder Concierge-Service verfuegbar.',
                ],
            ],

            // Piscina y wellness
            [
                'code' => 'pool',
                'icon' => 'fas fa-swimming-pool',
                'name' => [
                    'es' => 'Piscina',
                    'en' => 'Swimming pool',
                    'de' => 'Pool',
                ],
                'description' => [
                    'es' => 'Acceso a piscina privada o compartida.',
                    'en' => 'Access to a private or shared swimming pool.',
                    'de' => 'Zugang zu einem privaten oder gemeinschaftlichen Pool.',
                ],
            ],
            [
                'code' => 'private-pool',
                'icon' => 'fas fa-swimming-pool',
                'name' => [
                    'es' => 'Piscina privada',
                    'en' => 'Private pool',
                    'de' => 'Privater Pool',
                ],
                'description' => [
                    'es' => 'Piscina de uso exclusivo para los huéspedes.',
                    'en' => 'Pool for the exclusive use of guests.',
                    'de' => 'Pool zur exklusiven Nutzung durch Gaeste.',
                ],
            ],
            [
                'code' => 'hot-tub',
                'icon' => 'fas fa-hot-tub',
                'name' => [
                    'es' => 'Jacuzzi',
                    'en' => 'Hot tub',
                    'de' => 'Whirlpool',
                ],
                'description' => [
                    'es' => 'Jacuzzi o bañera de hidromasaje disponible.',
                    'en' => 'Hot tub or whirlpool available.',
                    'de' => 'Whirlpool oder Sprudelbad verfuegbar.',
                ],
            ],
            [
                'code' => 'spa',
                'icon' => 'fas fa-spa',
                'name' => [
                    'es' => 'Spa',
                    'en' => 'Spa',
                    'de' => 'Spa',
                ],
                'description' => [
                    'es' => 'Acceso a instalaciones de spa o bienestar.',
                    'en' => 'Access to spa or wellness facilities.',
                    'de' => 'Zugang zu Spa- oder Wellnessbereichen.',
                ],
            ],
            [
                'code' => 'gym',
                'icon' => 'fas fa-dumbbell',
                'name' => [
                    'es' => 'Gimnasio',
                    'en' => 'Gym',
                    'de' => 'Fitnessraum',
                ],
                'description' => [
                    'es' => 'Gimnasio o zona de entrenamiento disponible.',
                    'en' => 'Gym or workout area available.',
                    'de' => 'Fitnessraum oder Trainingsbereich verfuegbar.',
                ],
            ],

            // Familiar / accesibilidad / mascotas
            [
                'code' => 'pet-friendly',
                'icon' => 'fas fa-paw',
                'name' => [
                    'es' => 'Se admiten mascotas',
                    'en' => 'Pet friendly',
                    'de' => 'Haustiere erlaubt',
                ],
                'description' => [
                    'es' => 'La propiedad admite mascotas bajo ciertas condiciones.',
                    'en' => 'Pets are allowed under certain conditions.',
                    'de' => 'Haustiere sind unter bestimmten Bedingungen erlaubt.',
                ],
            ],
            [
                'code' => 'family-friendly',
                'icon' => 'fas fa-baby',
                'name' => [
                    'es' => 'Ideal para familias',
                    'en' => 'Family friendly',
                    'de' => 'Familienfreundlich',
                ],
                'description' => [
                    'es' => 'Alojamiento adecuado para familias con niños.',
                    'en' => 'Accommodation suitable for families with children.',
                    'de' => 'Unterkunft geeignet fuer Familien mit Kindern.',
                ],
            ],
            [
                'code' => 'crib',
                'icon' => 'fas fa-baby-carriage',
                'name' => [
                    'es' => 'Cuna',
                    'en' => 'Crib',
                    'de' => 'Kinderbett',
                ],
                'description' => [
                    'es' => 'Cuna disponible bajo solicitud.',
                    'en' => 'Crib available on request.',
                    'de' => 'Kinderbett auf Anfrage verfuegbar.',
                ],
            ],
            [
                'code' => 'high-chair',
                'icon' => 'fas fa-chair',
                'name' => [
                    'es' => 'Trona',
                    'en' => 'High chair',
                    'de' => 'Hochstuhl',
                ],
                'description' => [
                    'es' => 'Trona para niños disponible bajo solicitud.',
                    'en' => 'High chair for children available on request.',
                    'de' => 'Hochstuhl fuer Kinder auf Anfrage verfuegbar.',
                ],
            ],
            [
                'code' => 'accessible',
                'icon' => 'fas fa-wheelchair',
                'name' => [
                    'es' => 'Accesible',
                    'en' => 'Accessible',
                    'de' => 'Barrierefrei',
                ],
                'description' => [
                    'es' => 'Propiedad con características de accesibilidad.',
                    'en' => 'Property with accessibility features.',
                    'de' => 'Unterkunft mit barrierefreien Merkmalen.',
                ],
            ],

            // Seguridad y normas
            [
                'code' => 'smoke-detector',
                'icon' => 'fas fa-bell',
                'name' => [
                    'es' => 'Detector de humo',
                    'en' => 'Smoke detector',
                    'de' => 'Rauchmelder',
                ],
                'description' => [
                    'es' => 'La propiedad dispone de detector de humo.',
                    'en' => 'The property has a smoke detector.',
                    'de' => 'Die Unterkunft verfuegt ueber einen Rauchmelder.',
                ],
            ],
            [
                'code' => 'fire-extinguisher',
                'icon' => 'fas fa-fire-extinguisher',
                'name' => [
                    'es' => 'Extintor',
                    'en' => 'Fire extinguisher',
                    'de' => 'Feuerloescher',
                ],
                'description' => [
                    'es' => 'Extintor disponible en la propiedad.',
                    'en' => 'Fire extinguisher available in the property.',
                    'de' => 'Feuerloescher in der Unterkunft vorhanden.',
                ],
            ],
            [
                'code' => 'first-aid-kit',
                'icon' => 'fas fa-first-aid',
                'name' => [
                    'es' => 'Botiquín',
                    'en' => 'First aid kit',
                    'de' => 'Erste-Hilfe-Set',
                ],
                'description' => [
                    'es' => 'Botiquín básico disponible para emergencias.',
                    'en' => 'Basic first aid kit available for emergencies.',
                    'de' => 'Grundlegendes Erste-Hilfe-Set fuer Notfaelle vorhanden.',
                ],
            ],
            [
                'code' => 'safe',
                'icon' => 'fas fa-lock',
                'name' => [
                    'es' => 'Caja fuerte',
                    'en' => 'Safe',
                    'de' => 'Safe',
                ],
                'description' => [
                    'es' => 'Caja fuerte disponible para objetos de valor.',
                    'en' => 'Safe available for valuables.',
                    'de' => 'Safe fuer Wertsachen vorhanden.',
                ],
            ],
            [
                'code' => 'no-smoking',
                'icon' => 'fas fa-smoking-ban',
                'name' => [
                    'es' => 'No fumadores',
                    'en' => 'Non-smoking',
                    'de' => 'Nichtraucher',
                ],
                'description' => [
                    'es' => 'No se permite fumar dentro de la propiedad.',
                    'en' => 'Smoking is not allowed inside the property.',
                    'de' => 'Rauchen ist innerhalb der Unterkunft nicht erlaubt.',
                ],
            ],

            // Ubicación / extras premium
            [
                'code' => 'beach-access',
                'icon' => 'fas fa-umbrella-beach',
                'name' => [
                    'es' => 'Acceso a la playa',
                    'en' => 'Beach access',
                    'de' => 'Strandzugang',
                ],
                'description' => [
                    'es' => 'La propiedad ofrece acceso cercano o directo a la playa.',
                    'en' => 'The property offers nearby or direct beach access.',
                    'de' => 'Die Unterkunft bietet nahegelegenen oder direkten Strandzugang.',
                ],
            ],
            [
                'code' => 'ski-storage',
                'icon' => 'fas fa-skiing',
                'name' => [
                    'es' => 'Guardaesquís',
                    'en' => 'Ski storage',
                    'de' => 'Skiaufbewahrung',
                ],
                'description' => [
                    'es' => 'Espacio para guardar material de esquí.',
                    'en' => 'Storage space for ski equipment.',
                    'de' => 'Aufbewahrungsmoeglichkeit fuer Skiausruestung.',
                ],
            ],
            [
                'code' => 'breakfast',
                'icon' => 'fas fa-coffee',
                'name' => [
                    'es' => 'Desayuno disponible',
                    'en' => 'Breakfast available',
                    'de' => 'Fruehstueck verfuegbar',
                ],
                'description' => [
                    'es' => 'Posibilidad de incluir desayuno durante la estancia.',
                    'en' => 'Breakfast can be included during the stay.',
                    'de' => 'Fruehstueck kann waehrend des Aufenthalts hinzugebucht werden.',
                ],
            ],
            [
                'code' => 'airport-shuttle',
                'icon' => 'fas fa-shuttle-van',
                'name' => [
                    'es' => 'Traslado al aeropuerto',
                    'en' => 'Airport shuttle',
                    'de' => 'Flughafentransfer',
                ],
                'description' => [
                    'es' => 'Servicio de traslado al aeropuerto disponible.',
                    'en' => 'Airport transfer service available.',
                    'de' => 'Flughafentransfer verfuegbar.',
                ],
            ],
            [
                'code' => 'car-rental',
                'icon' => 'fas fa-car',
                'name' => [
                    'es' => 'Alquiler de coche cercano',
                    'en' => 'Nearby car rental',
                    'de' => 'Autovermietung in der Naehe',
                ],
                'description' => [
                    'es' => 'Opción de alquiler de coche cercana o gestionada por el alojamiento.',
                    'en' => 'Nearby car rental option or arranged by the host.',
                    'de' => 'Autovermietung in der Naehe oder durch die Unterkunft organisiert.',
                ],
            ],
        ];

        foreach ($items as $item) {
            Amenity::query()->updateOrCreate(
                ['code' => $item['code']],
                [
                    'name' => $item['name'],
                    'description' => $item['description'],
                    'icon' => $item['icon'],
                    'is_active' => true,
                ],
            );
        }
    }
}
