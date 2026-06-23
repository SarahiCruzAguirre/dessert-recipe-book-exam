/**
 * SIDE: Server-side
 * Description: Service responsible for querying recipes from the database, retrieving details,
 * and seeding initial dummy recipes when the database starts.
 */

import { connectDB } from "@/lib/db";
import Recipe from "@/models/Recipe";
import { IRecipe } from "@/types";

// ── Obtener todas las recetas (campos de listado) ────────────
/**
 * Retrieves all recipes stored in the database.
 * Returns a subset of fields optimized for catalog/grid views, sorted by creation date.
 */
export async function getAllRecipes(): Promise<IRecipe[]> {
  await connectDB();
  const recipes = await Recipe.find({})
    .select("name image prepTime difficulty description category createdAt")
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(recipes));
}

// ── Obtener receta por ID (campos completos para detalle) ────
/**
 * Retrieves the complete details of a single recipe by its ID.
 * Returns null if the recipe is not found.
 */
export async function getRecipeById(id: string): Promise<IRecipe | null> {
  await connectDB();
  const recipe = await Recipe.findById(id).lean();
  if (!recipe) return null;
  return JSON.parse(JSON.stringify(recipe));
}

// ── Seed de recetas iniciales ────────────────────────────────
/**
 * Seeds a default list of 15 sweet bakery, dessert, and drink recipes.
 * Checks first if there are already 15 or more recipes to avoid duplicate executions.
 */
export async function seedRecipes(): Promise<void> {
  await connectDB();
  
  // Buscar si ya existe la cantidad completa de recetas (15 o similar) y no hay enlaces rotos de la base anterior
  const count = await Recipe.countDocuments({});
  const hasBroken = await Recipe.findOne({ image: /photo-tODGldWfHiU/ });
  if (count >= 15 && !hasBroken) return;

  console.log("Seeding 15 cute bakery and sweet drink recipes...");
  // Limpiar recetas viejas para forzar el re-seed con la nueva temática completa
  await Recipe.deleteMany({});


  const recipes = [
    {
      name: "Limonada Rosa de Fresa",
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800",
      prepTime: 10,
      difficulty: "Fácil",
      description: "Una refrescante limonada rosa infusionada con fresas frescas y un toque sutil de agua de rosas. ¡Decorada con fresas en forma de corazón!",
      category: "Bebidas",
      servings: 2,
      ingredients: [
        "1 taza de fresas frescas cortadas en rodajas",
        "4 limones grandes (su jugo)",
        "3 cucharadas de jarabe simple o miel",
        "3 tazas de agua fría con gas",
        "1 cucharadita de agua de rosas (opcional)",
        "Hielo al gusto",
      ],
      steps: [
        "Machaca las fresas con el jarabe simple en una jarra hasta liberar todo su jugo.",
        "Exprime los limones e integra el jugo con las fresas.",
        "Agrega el agua fría con gas y el agua de rosas.",
        "Revuelve bien y sirve en vasos altos con mucho hielo.",
        "Decora el borde del vaso con una fresa cortada en forma de corazón.",
      ],
    },
    {
      name: "Barista Cat Latte de Vainilla",
      image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800",
      prepTime: 15,
      difficulty: "Medio",
      description: "Un cremoso café latte con jarabe de vainilla artesanal y espuma de leche decorada con un tierno arte de gatito.",
      category: "Bebidas",
      servings: 1,
      ingredients: [
        "1 carga de café expreso doble",
        "¾ taza de leche de tu preferencia (avena o entera recomendado)",
        "1 cucharada de jarabe de vainilla de alta calidad",
        "Polvo de cocoa o canela para decorar",
      ],
      steps: [
        "Prepara la carga doble de expreso y sírvela en tu taza favorita.",
        "Agrega el jarabe de vainilla al expreso y mezcla bien.",
        "Texturiza la leche caliente hasta obtener una espuma microburbuja sedosa.",
        "Vierte la leche lentamente en el café para formar la base blanca en la superficie.",
        "Usa un palillo limpio y un poco de espuma del café para dibujar la carita y orejas de un gatito.",
        "Finaliza con dos toques de cocoa para los ojos del gatito.",
      ],
    },
    {
      name: "Croissant de Chocolate Caliente",
      image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800",
      prepTime: 120,
      difficulty: "Difícil",
      description: "Croissants hojaldrados y crujientes recién horneados, rellenos con un suave chocolate fundido y espolvoreados con azúcar glass.",
      category: "Panadería",
      servings: 6,
      ingredients: [
        "250g de masa de hojaldre casera o preparada",
        "100g de chocolate semi-amargo en barra",
        "1 huevo (para barnizar)",
        "Azúcar glass para espolvorear",
      ],
      steps: [
        "Estira la masa de hojaldre sobre una superficie enharinada hasta tener un grosor de 3mm.",
        "Corta la masa en triángulos alargados.",
        "Coloca dos bastones de chocolate en la base ancha de cada triángulo.",
        "Enrolla desde la base hasta la punta y dobla ligeramente los extremos hacia adentro.",
        "Coloca en una bandeja para hornear y deja fermentar por 1 hora.",
        "Barniza con huevo batido y hornea a 190°C por 20 minutos hasta que estén dorados.",
        "Deja enfriar y espolvorea con azúcar glass antes de servir.",
      ],
    },
    {
      name: "Teddy Bear Strawberry Macarons",
      image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800",
      prepTime: 90,

      difficulty: "Difícil",
      description: "Delicados macarons franceses rellenos de ganache de fresa silvestre, decorados a mano con tiernas caritas de osito.",
      category: "Postres",
      servings: 12,
      ingredients: [
        "100g de harina de almendras fina",
        "100g de azúcar glass",
        "2 claras de huevo a temperatura ambiente",
        "80g de azúcar blanca",
        "100g de chocolate blanco y crema de fresa para el relleno",
        "Marcador comestible negro para los ojos",
      ],
      steps: [
        "Tamiza la harina de almendras con el azúcar glass en un tazón.",
        "Bate las claras de huevo a punto de nieve agregando el azúcar blanca poco a poco.",
        "Integra suavemente los secos con las claras haciendo movimientos envolventes (macaronage).",
        "Coloca la masa en una manga pastelera con boquilla redonda.",
        "Forma círculos en un tapete de silicón, agregando dos pequeños círculos arriba para las orejitas del oso.",
        "Deja secar a temperatura ambiente por 45 minutos hasta que se forme una piel.",
        "Hornea a 150°C durante 14 minutos. Deja enfriar por completo.",
        "Rellena con la ganache de fresa, tapa el macaron y dibuja los ojitos del osito con el marcador comestible.",
      ],
    },
    {
      name: "Batido de Fresa y Malvaviscos",
      image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800",
      prepTime: 10,
      difficulty: "Fácil",
      description: "Batido cremoso de fresas con helado de vainilla, coronado con una generosa nube de crema batida, chispas de colores y mini malvaviscos.",
      category: "Bebidas",
      servings: 2,
      ingredients: [
        "2 tazas de helado de vainilla cremoso",
        "1 taza de fresas congeladas",
        "½ taza de leche fría",
        "Crema batida en aerosol o casera",
        "Mini malvaviscos y chispas de colores",
      ],
      steps: [
        "Coloca el helado de vainilla, las fresas congeladas y la leche en la licuadora.",
        "Licúa a velocidad alta hasta obtener una consistencia suave y espesa.",
        "Vierte el batido en vasos decorados previamente con jarabe de fresa en las paredes.",
        "Corona con abundante crema batida.",
        "Decora por encima con mini malvaviscos, chispas de colores y una fresa entera.",
      ],
    },
    {
      name: "Muffins de Arándano con Crumble",
      image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=800",
      prepTime: 35,
      difficulty: "Fácil",
      description: "Muffins esponjosos repletos de arándanos frescos, con un toque cítrico de limón y un crujiente crumble de mantequilla y canela.",
      category: "Panadería",
      servings: 6,
      ingredients: [
        "1½ tazas de harina de trigo",
        "¾ taza de azúcar",
        "2 cucharaditas de polvo de hornear",
        "⅓ taza de aceite vegetal",
        "1 huevo",
        "½ taza de leche",
        "1 taza de arándanos frescos",
        "Ralladura de 1 limón",
        "Para el crumble: 2 cucharadas de harina, 2 cucharadas de azúcar, 1 cucharada de mantequilla fría, canela",
      ],
      steps: [
        "Precalienta el horno a 200°C y engrasa un molde para muffins.",
        "En un tazón, mezcla la harina, el azúcar, el polvo de hornear y la ralladura de limón.",
        "En otro recipiente, bate el aceite, el huevo y la leche. Integra con los secos sin sobremezclar.",
        "Envuelve suavemente los arándanos frescos en la mezcla.",
        "Reparte la masa en los moldes.",
        "Prepara el crumble mezclando los ingredientes con los dedos hasta obtener migas. Espolvorea sobre los muffins.",
        "Hornea por 20 minutos o hasta que al insertar un palillo salga limpio.",
      ],
    },
    {
      name: "Bingsu de Mango y Matcha",
      image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800",
      prepTime: 15,

      difficulty: "Fácil",
      description: "Granizado de leche coreano ultrafino con rodajas de mango fresco, jarabe de matcha y una bola de helado de vainilla.",
      category: "Postres",
      servings: 2,
      ingredients: [
        "2 tazas de leche de almendras o entera",
        "1 taza de mango fresco picado",
        "1 cucharada de polvo de matcha disuelto en 2 cucharadas de agua caliente",
        "1 bola de helado de vainilla",
        "Leche condensada al gusto",
      ],
      steps: [
        "Congela la leche en moldes de hielo.",
        "Tritura la leche congelada en una licuadora de alta potencia hasta obtener una textura de nieve.",
        "Sirve en un tazón frío.",
        "Coloca los mangos picados sobre la nieve de leche.",
        "Rocía con el jarabe de matcha y decora con la bola de helado de vainilla y leche condensada.",
      ],
    },
    {
      name: "Korean Souffle Pancakes",
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800",
      prepTime: 30,
      difficulty: "Medio",
      description: "Pancakes coreanos tipo suflé ultra esponjosos, servidos con crema batida fresca y fresas dulces.",
      category: "Postres",
      servings: 2,
      ingredients: [
        "2 yemas de huevo",
        "3 claras de huevo a temperatura ambiente",
        "¼ taza de leche",
        "½ taza de harina de trigo",
        "3 cucharadas de azúcar",
        "1 cucharadita de extracto de vainilla",
        "Crema batida y fresas para decorar",
      ],
      steps: [
        "Bate las yemas con la leche, vainilla y harina hasta obtener una mezcla suave.",
        "Bate las claras de huevo a punto de nieve firme, agregando el azúcar poco a poco.",
        "Integra suavemente el merengue en la mezcla de yemas en tres partes, con movimientos envolventes.",
        "Cocina cucharadas altas de masa en una sartén antiadherente a fuego muy bajo con una tapa por 5 minutos.",
        "Voltea con cuidado y cocina por otros 4 minutos.",
        "Sirve inmediatamente con crema batida y fresas frescas.",
      ],
    },
    {
      name: "Korean Milk Bread (Pan de Leche)",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
      prepTime: 150,
      difficulty: "Medio",
      description: "Pan de molde coreano súper suave y tierno hecho con la técnica Tangzhong, ideal para tostadas dulces.",
      category: "Panadería",
      servings: 8,
      ingredients: [
        "Para el Tangzhong: 2 cucharadas de harina, ½ taza de agua",
        "Para la masa: 2½ tazas de harina de fuerza",
        "¼ taza de azúcar",
        "1 cucharadita de sal",
        "2 cucharaditas de levadura seca",
        "½ taza de leche tibia",
        "1 huevo grande",
        "4 cucharadas de mantequilla a temperatura ambiente",
      ],
      steps: [
        "Cocina los ingredientes del Tangzhong a fuego bajo en una olla pequeña hasta que espese y se forme una pasta. Deja enfriar.",
        "Mezcla la harina, azúcar, sal y levadura en un tazón.",
        "Agrega la leche tibia, el huevo y el Tangzhong frío. Amasa por 10 minutos.",
        "Añade la mantequilla poco a poco y amasa hasta tener una masa lisa y elástica.",
        "Deja fermentar por 1.5 horas hasta que duplique su tamaño.",
        "Divide en tres partes, aplana y enrolla cada una, colócalas en un molde para pan.",
        "Fermenta por 45 minutos. Hornea a 180°C por 30 minutos.",
      ],
    },
    {
      name: "Taro Bubble Milk Tea",
      image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=800",
      prepTime: 15,

      difficulty: "Fácil",
      description: "Una bebida de té de leche morada con taro y perlas de tapioca masticables caramelizadas con azúcar morena.",
      category: "Bebidas",
      servings: 2,
      ingredients: [
        "4 cucharadas de polvo de taro natural",
        "1 taza de agua caliente",
        "1 taza de leche tibia",
        "½ taza de perlas de tapioca cocidas",
        "2 cucharadas de azúcar morena o jarabe de maple",
        "Hielo",
      ],
      steps: [
        "Disuelve el polvo de taro en el agua caliente hasta que no tenga grumos.",
        "Mezcla las perlas de tapioca calientes con el azúcar morena para caramelizarlas.",
        "Coloca las perlas caramelizadas en el fondo del vaso.",
        "Agrega hielo hasta la mitad.",
        "Vierte la leche y luego el té de taro disuelto. Mezcla antes de tomar.",
      ],
    },
    {
      name: "Dalgona Coffee Batido",
      image: "https://images.unsplash.com/photo-1594911774802-8822a707cbb3?w=800",
      prepTime: 10,

      difficulty: "Fácil",
      description: "El famoso café coreano batido hasta formar una crema densa y dulce, servido sobre leche fría con hielo.",
      category: "Bebidas",
      servings: 1,
      ingredients: [
        "2 cucharadas de café instantáneo",
        "2 cucharadas de azúcar",
        "2 cucharadas de agua caliente",
        "1 taza de leche fría",
        "Hielo",
      ],
      steps: [
        "En un tazón, mezcla el café instantáneo, el azúcar y el agua caliente.",
        "Bate vigorosamente por 5 minutos hasta que la mezcla esté muy cremosa y de color marrón claro.",
        "Llena un vaso con hielo y agrega la leche fría.",
        "Corona con la crema de café batida y sirve.",
      ],
    },
    {
      name: "Bungeoppang de Nutella",
      image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800",
      prepTime: 30,

      difficulty: "Medio",
      description: "Gofres coreanos tradicionales con forma de pececito dorado, crujientes por fuera y rellenos de Nutella cremosa.",
      category: "Postres",
      servings: 4,
      ingredients: [
        "1 taza de harina de trigo",
        "2 cucharaditas de polvo de hornear",
        "½ cucharadita de sal",
        "1 taza de agua",
        "2 cucharadas de azúcar",
        "4 cucharadas de Nutella",
        "Aceite vegetal para engrasar",
      ],
      steps: [
        "Tamiza la harina, polvo de hornear y sal en un tazón.",
        "Bate el azúcar y el agua e integra con los secos hasta tener una masa líquida.",
        "Precalienta y engrasa el molde para bungeoppang (con forma de pez).",
        "Vierte masa cubriendo la mitad del molde.",
        "Agrega una cucharada de Nutella en el centro y cubre con más masa.",
        "Cierra el molde y cocina a fuego medio-bajo por 3 minutos de cada lado hasta que estén dorados.",
      ],
    },
    {
      name: "Peach Cream Mochi",
      image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800",
      prepTime: 40,

      difficulty: "Medio",
      description: "Pastelitos de arroz glutinoso coreanos súper suaves rellenos de crema batida de durazno y trocitos de fruta.",
      category: "Postres",
      servings: 6,
      ingredients: [
        "1 taza de harina de arroz glutinoso (Mochiko)",
        "¼ taza de azúcar",
        "¾ taza de agua",
        "Crema batida firme",
        "½ taza de durazno en almíbar picado",
        "Fécula de maíz para espolvorear",
      ],
      steps: [
        "Mezcla la harina de arroz, el azúcar y el agua en un tazón apto para microondas. Cubre con plástico.",
        "Calienta en el microondas por 1 minuto, revuelve, y calienta por 1 minuto más hasta que esté traslúcido.",
        "Espolvorea abundante fécula de maíz en la mesa y estira la masa caliente.",
        "Corta la masa en círculos planos.",
        "Coloca una cucharada de crema batida y trocitos de durazno en el centro.",
        "Cierra los bordes pellizcando la masa para formar una bolita. Enfría antes de servir.",
      ],
    },
    {
      name: "Pink Rose Latte",
      image: "https://i.pinimg.com/736x/48/40/5f/48405f6e60406eae3a7f4dc9da1e1b5b.jpg",
      prepTime: 10,
      difficulty: "Fácil",
      description: "Un café con leche rosa con jarabe de hibisco y agua de rosas, cubierto con pétalos de rosa secos comestibles.",
      category: "Bebidas",
      servings: 1,
      ingredients: [
        "1 taza de leche de avena",
        "1 cucharada de jarabe de hibisco",
        "1 cucharadita de agua de rosas",
        "1 carga de café expreso",
        "Pétalos de rosa deshidratados comestibles",
      ],
      steps: [
        "Calienta y espuma la leche de avena con el jarabe de hibisco y el agua de rosas.",
        "Vierte la mezcla rosa en una taza.",
        "Agrega lentamente la carga de expreso por el centro.",
        "Decora con pétalos de rosa deshidratados comestibles.",
      ],
    },
    {
      name: "Sweet Potato Bread (Goguma Ppang)",
      image: "https://images.unsplash.com/photo-1647891940244-k0MigzUz-vI?w=800",
      prepTime: 60,

      difficulty: "Medio",
      description: "Panecillos coreanos horneados con forma de camote dulce (boniato), hechos con una masa masticable de tapioca y rellenos de camote cremoso.",
      category: "Panadería",
      servings: 6,
      ingredients: [
        "1 taza de almidón de tapioca",
        "2 cucharadas de harina de trigo",
        "1 huevo grande",
        "2 cucharadas de aceite",
        "½ taza de leche",
        "1 camote dulce cocido y hecho puré",
        "1 cucharada de miel",
        "Polvo de camote morado para rebozar",
      ],
      steps: [
        "Mezcla el almidón de tapioca, harina, huevo, aceite y leche hasta formar una masa elástica.",
        "Mezcla el puré de camote dulce con la miel.",
        "Divide la masa en 6 porciones y estíralas.",
        "Rellena cada porción con el puré de camote dulce y dales forma alargada.",
        "Reboza los panecillos en polvo de camote morado.",
        "Hornea a 170°C por 18 minutos.",
      ],
    },
  ];

  await Recipe.insertMany(recipes);
  console.log("15 cute recipes seeded successfully!");
}
