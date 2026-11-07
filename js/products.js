/**
 * Crisp Store - Products Database & Data Models
 * Figma Design: Crisp (node-id: 69:3253)
 */

const CRISP_PRODUCTS = [
  {
    id: 1,
    name: "Floral Print Summer Slip Dress",
    category: "dresses",
    categoryLabel: "Summer Dresses",
    price: 68.00,
    originalPrice: 85.00,
    badge: "SALE",
    badgeType: "sale",
    rating: 4.9,
    reviewsCount: 38,
    image: "assets/images/prod-1.jpg",
    altImage: "assets/images/prod-1-alt.jpg",
    colors: [
      { name: "Vanilla Floral", hex: "#f5f0eb", default: true },
      { name: "Midnight Navy", hex: "#1c2331" },
      { name: "Crimson Red", hex: "#a82020" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true,
    isNew: false,
    isPopular: true,
    isFeatured: true,
    sku: "CRISP-DR-001",
    shortDesc: "A fluid, airy midi slip dress tailored in breathable woven cotton with delicate floral accents.",
    description: "Embrace sun-drenched afternoons and effortless evening gatherings with our signature Floral Print Summer Slip Dress. Designed with gentle spaghetti straps, an understated V-neckline, and an airy midi silhouette that drapes gracefully with every step.",
    fabric: "100% Organic Lightweight Woven Cotton. Machine wash delicate at 30°C. Cool iron on reverse."
  },
  {
    id: 2,
    name: "Linen Sleeveless Tiered Sundress",
    category: "dresses",
    categoryLabel: "Summer Dresses",
    price: 94.00,
    originalPrice: null,
    badge: "NEW",
    badgeType: "new",
    rating: 5.0,
    reviewsCount: 24,
    image: "assets/images/prod-2.jpg",
    altImage: "assets/images/prod-3.jpg",
    colors: [
      { name: "Natural Ecru", hex: "#e8e3d9", default: true },
      { name: "Soft Terracotta", hex: "#c97a63" },
      { name: "Onyx Black", hex: "#111111" }
    ],
    sizes: ["S", "M", "L"],
    inStock: true,
    isNew: true,
    isPopular: true,
    isFeatured: true,
    sku: "CRISP-DR-002",
    shortDesc: "Pure French linen tiered sundress offering relaxed sophistication and natural cooling comfort.",
    description: "Crafted from premium washed linen, this tiered dress combines effortless vacation elegance with city-ready versatility. Finished with a clean round neck, hidden side pockets, and gentle gathering throughout each tier.",
    fabric: "100% French Washed Linen. Hand wash or gentle machine cycle. Line dry in shade."
  },
  {
    id: 3,
    name: "Silk Blend Halter Neck Maxi Dress",
    category: "dresses",
    categoryLabel: "Evening & Occasion",
    price: 128.00,
    originalPrice: 160.00,
    badge: "-20%",
    badgeType: "sale",
    rating: 4.8,
    reviewsCount: 52,
    image: "assets/images/prod-3.jpg",
    altImage: "assets/images/prod-4.jpg",
    colors: [
      { name: "Champagne Pearl", hex: "#f1eee7", default: true },
      { name: "Emerald Glaze", hex: "#1f4a38" },
      { name: "Obsidian", hex: "#141416" }
    ],
    sizes: ["XS", "S", "M", "L"],
    inStock: true,
    isNew: false,
    isPopular: true,
    isFeatured: true,
    sku: "CRISP-DR-003",
    shortDesc: "Lustrous silk blend floor-length maxi with an alluring halter neck and sweeping hemline.",
    description: "An absolute head-turner for golden hour cocktails and sunset galas. The fluid silhouette flows seamlessly over contours, complemented by a self-tying neck sash and deep back plunge.",
    fabric: "65% Mulberry Silk, 35% Organic Rayon. Dry clean recommended."
  },
  {
    id: 4,
    name: "Structured Cotton Poplin Shirt Dress",
    category: "dresses",
    categoryLabel: "Workwear & Casual",
    price: 82.00,
    originalPrice: null,
    badge: "HOT",
    badgeType: "hot",
    rating: 4.9,
    reviewsCount: 47,
    image: "assets/images/prod-4.jpg",
    altImage: "assets/images/prod-5.jpg",
    colors: [
      { name: "Crisp White", hex: "#ffffff", default: true },
      { name: "Sky Chambray", hex: "#9bbcd4" },
      { name: "Classic Navy", hex: "#1d2939" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true,
    isNew: false,
    isPopular: true,
    isFeatured: true,
    sku: "CRISP-DR-004",
    shortDesc: "Tailored cotton poplin shirt dress featuring mother-of-pearl buttons and a detachable waist tie.",
    description: "Smart, crisp and eternally modern. Wear it buttoned up with oxfords for Monday meetings, or unbuttoned over swimwear with leather slides for relaxed weekends by the coast.",
    fabric: "100% GOTS Certified Organic Cotton Poplin. Warm iron or steam."
  },
  {
    id: 5,
    name: "Minimalist Ribbed Knit Camisole Top",
    category: "tops",
    categoryLabel: "Tops & Basics",
    price: 42.00,
    originalPrice: null,
    badge: "NEW",
    badgeType: "new",
    rating: 4.7,
    reviewsCount: 31,
    image: "assets/images/prod-5.jpg",
    altImage: "assets/images/prod-6.jpg",
    colors: [
      { name: "Sand Melange", hex: "#dfd7cb", default: true },
      { name: "Pure Chalk", hex: "#fafafa" },
      { name: "Espresso", hex: "#2b221d" }
    ],
    sizes: ["XS", "S", "M", "L"],
    inStock: true,
    isNew: true,
    isPopular: false,
    isFeatured: true,
    sku: "CRISP-TP-001",
    shortDesc: "Fine-gauge ribbed knit camisole with squared neckline and clean supportive stretch.",
    description: "The ideal foundational layer. Spun with whisper-light combed cotton yarns and micro-ribbed for a second-skin fit that retains its shape wear after wear.",
    fabric: "92% Combed Cotton, 8% Elastane. Wash cold inside out."
  },
  {
    id: 6,
    name: "Oversized Linen Relaxed Resort Shirt",
    category: "tops",
    categoryLabel: "Tops & Shirts",
    price: 76.00,
    originalPrice: 95.00,
    badge: "SALE",
    badgeType: "sale",
    rating: 4.9,
    reviewsCount: 65,
    image: "assets/images/prod-6.jpg",
    altImage: "assets/images/prod-7.jpg",
    colors: [
      { name: "Sage Mist", hex: "#cbd8cd", default: true },
      { name: "Optic White", hex: "#ffffff" },
      { name: "Striped Olive", hex: "#9fa792" }
    ],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    isNew: false,
    isPopular: true,
    isFeatured: true,
    sku: "CRISP-TP-002",
    shortDesc: "Breezy dropped-shoulder linen shirt crafted for effortless summer layering and chic sun cover.",
    description: "An iconic Crisp wardrobe essential. Designed with an oversized camp collar, rolled cuffs, and a curved hem that sits cleanly both tucked into high-rise denim or left billowy over linen shorts.",
    fabric: "100% Pure European Flax Linen. Pre-shrunk and garment dyed."
  },
  {
    id: 7,
    name: "Pleated A-Line High-Rise Midi Skirt",
    category: "skirts",
    categoryLabel: "Skirts & Bottoms",
    price: 88.00,
    originalPrice: null,
    badge: null,
    badgeType: null,
    rating: 4.8,
    reviewsCount: 29,
    image: "assets/images/prod-7.jpg",
    altImage: "assets/images/prod-8.jpg",
    colors: [
      { name: "Mocha Brown", hex: "#4a3c31", default: true },
      { name: "Warm Khaki", hex: "#b8a892" },
      { name: "Black Satin", hex: "#161616" }
    ],
    sizes: ["XS", "S", "M", "L"],
    inStock: true,
    isNew: false,
    isPopular: false,
    isFeatured: true,
    sku: "CRISP-SK-001",
    shortDesc: "Accordion pleated midi skirt featuring a contoured waist yoke and fluid architectural movement.",
    description: "Combining geometric precision with feminine grace. The permanent knife pleating catches the breeze effortlessly while the smooth waistband ensures all-day comfort.",
    fabric: "100% Recycled Poly-Crepe with smooth silk-touch lining."
  },
  {
    id: 8,
    name: "Tailored Wide-Leg Linen Trousers",
    category: "skirts",
    categoryLabel: "Pants & Trousers",
    price: 98.00,
    originalPrice: 120.00,
    badge: "-18%",
    badgeType: "sale",
    rating: 5.0,
    reviewsCount: 41,
    image: "assets/images/prod-8.jpg",
    altImage: "assets/images/prod-9.jpg",
    colors: [
      { name: "Oatmeal", hex: "#ded6c7", default: true },
      { name: "Charcoal", hex: "#2b2c30" },
      { name: "Bone White", hex: "#f7f6f2" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true,
    isNew: false,
    isPopular: true,
    isFeatured: true,
    sku: "CRISP-TR-001",
    shortDesc: "High-waisted trousers tailored with front pleats, slant pockets, and a dramatic wide leg.",
    description: "The ultimate modern wardrobe foundation. Elongates the leg and moves with relaxed poise, making it effortless to transition from breakfast meetings to dinner reservations.",
    fabric: "100% Belgian Linen. Gentle dry clean or cold soak."
  },
  {
    id: 9,
    name: "Handwoven Straw Boater Hat",
    category: "accessories",
    categoryLabel: "Hats & Accessories",
    price: 49.00,
    originalPrice: null,
    badge: "HOT",
    badgeType: "hot",
    rating: 4.9,
    reviewsCount: 33,
    image: "assets/images/prod-9.jpg",
    altImage: "assets/images/promo-hat.jpg",
    colors: [
      { name: "Natural Wheat", hex: "#d8c29d", default: true },
      { name: "Toasted Honey", hex: "#ba9f72" }
    ],
    sizes: ["One Size"],
    inStock: true,
    isNew: false,
    isPopular: true,
    isFeatured: true,
    sku: "CRISP-AC-001",
    shortDesc: "Artisanal handwoven toquilla straw hat featuring an internal grosgrain sweatband and UPF 50+ rating.",
    description: "Handcrafted by master milliners using sustainably harvested natural straw. Shields your skin while adding an instant touch of Riviera nostalgia to any summer look.",
    fabric: "100% Toquilla Straw with Black Grosgrain Ribbon."
  },
  {
    id: 10,
    name: "Woven Raffia Shoulder Tote Bag",
    category: "accessories",
    categoryLabel: "Bags & Totes",
    price: 75.00,
    originalPrice: 95.00,
    badge: "SALE",
    badgeType: "sale",
    rating: 4.8,
    reviewsCount: 19,
    image: "assets/images/prod-10.jpg",
    altImage: "assets/images/prod-11.jpg",
    colors: [
      { name: "Natural Straw & Tan", hex: "#c7b28f", default: true },
      { name: "Natural Straw & Black", hex: "#2b2b2b" }
    ],
    sizes: ["One Size"],
    inStock: true,
    isNew: false,
    isPopular: false,
    isFeatured: false,
    sku: "CRISP-AC-002",
    shortDesc: "Roomy summer tote crafted from woven raffia with genuine Italian leather handles and canvas pouch.",
    description: "Generously proportioned to hold your market finds, laptop, beach towel, and daily essentials. Includes an internal zippered compartment for valuables.",
    fabric: "Natural Madagascar Raffia with vegetable-tanned leather trim."
  },
  {
    id: 11,
    name: "Tortoise Shell Acetate Sunglasses",
    category: "accessories",
    categoryLabel: "Eyewear",
    price: 58.00,
    originalPrice: null,
    badge: "NEW",
    badgeType: "new",
    rating: 4.9,
    reviewsCount: 56,
    image: "assets/images/prod-11.jpg",
    altImage: "assets/images/prod-12.jpg",
    colors: [
      { name: "Classic Havana Tortoise", hex: "#5c3e21", default: true },
      { name: "Glossy Jet Black", hex: "#111111" }
    ],
    sizes: ["Standard"],
    inStock: true,
    isNew: true,
    isPopular: true,
    isFeatured: false,
    sku: "CRISP-AC-003",
    shortDesc: "Hand-polished Italian acetate frames with 100% UV400 polarized Category 3 green-tint lenses.",
    description: "Timeless squared cat-eye silhouette designed to flatter every face shape. Features five-barrel stainless steel hinges and comes with a protective vegan leather case.",
    fabric: "Mazzucchelli Cellulose Acetate & Scratch-Resistant Polarized Lenses."
  },
  {
    id: 12,
    name: "Botanical Silk Scarf & Hair Ribbon",
    category: "accessories",
    categoryLabel: "Scarves & Silk",
    price: 36.00,
    originalPrice: 45.00,
    badge: "-20%",
    badgeType: "sale",
    rating: 4.9,
    reviewsCount: 27,
    image: "assets/images/prod-12.jpg",
    altImage: "assets/images/prod-1.jpg",
    colors: [
      { name: "Olive Flora", hex: "#636e52", default: true },
      { name: "Blush Garden", hex: "#d8a69e" }
    ],
    sizes: ["70cm x 70cm"],
    inStock: true,
    isNew: false,
    isPopular: false,
    isFeatured: false,
    sku: "CRISP-AC-004",
    shortDesc: "Square Mulberry silk twill scarf decorated with hand-illustrated botanical line art.",
    description: "Tie it loosely around your neck, loop it through a ponytail, or wrap it around the handle of your favorite tote bag. Hand-rolled edges provide a luxurious artisanal finish.",
    fabric: "100% Mulberry Silk Twill (16 Momme). Hand-rolled edges."
  }
];

// Helper functions for catalog queries
function getAllProducts() {
  return CRISP_PRODUCTS;
}

function getProductById(id) {
  return CRISP_PRODUCTS.find(p => p.id === parseInt(id, 10)) || null;
}

function getFeaturedProducts() {
  return CRISP_PRODUCTS.filter(p => p.isFeatured);
}

function getPopularProducts() {
  return CRISP_PRODUCTS.filter(p => p.isPopular);
}

function getNewArrivals() {
  return CRISP_PRODUCTS.filter(p => p.isNew || p.badge === 'NEW');
}

function getProductsByCategory(category) {
  if (!category || category === 'all') return CRISP_PRODUCTS;
  return CRISP_PRODUCTS.filter(p => p.category.toLowerCase() === category.toLowerCase());
}
