/*

-------------------
MasterGIS Days 2023

Taller: Procesamiento y Visualizacion de 
Datos Geoespaciales con Google Earth Engine

David Montero Loaiza

Link: https://code.earthengine.google.com/288b1ed55f55d5b2d89c736f1d413caf
--------------------


PARTE 1: COLECCIONES Y VISUALIZACION
====================================

Conocimientos a adquirir:

- Acceder a colecciones vectoriales y raster
- Filtrar colecciones
- Mostrar en consola metadatos
- Agregar capas al mapa
- Opciones de visualizacion basicas

*/

// Accedemos a las areas administrativas de nivel 2 de la FAO
var MUN = ee.FeatureCollection("FAO/GAUL_SIMPLIFIED_500m/2015/level2");

// Filtramos la coleccion de acuerdo al pais
var ECU = MUN.filter(ee.Filter.eq("ADM0_NAME","Ecuador"));

// Imprimimos en consola los items de la coleccion
print("Municipios de Ecuador:",ECU);

// Agregamos al mapa los items de la coleccion
Map.addLayer(ECU,{color:"black"},"Municipios de Ecuador");

// Centramos el mapa en los items filtrados
Map.centerObject(ECU);

// Volvemos a filtrar la coleccion de acuerdo al municipio
var URI = ECU.filter(ee.Filter.eq("ADM1_NAME","Galapagos"));

// Imprimimos en consola los items
print("Galapagos, Ecuador:",URI);

// Agregamos al mapa los nuevos items con otra visualizacion
Map.addLayer(URI,{color:"yellow"},"Galapagos, Ecuador");

// Centramos el mapa en los items filtrados
Map.centerObject(URI);

// Accedemos a la coleccion de Sentinel-2 L2A Harmonizada
// Esto es importante, ya que con la nueva Processing Baseline
// Se debe hacer un shift de los datos antes de procesarlos
var S2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(URI) // Filtramos de acuerdo a vectores
  .filterDate("2020-01-01","2021-01-01") // Filtramos por fechas
  .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE",5)); // Filtramos por metadatos

// Imprimirmos en consola los items filtrados
print("Sentinel-2 L2A Harmonizado:",S2);

// Reducimos la coleccion a una sola imagen usando la mediana
var S2 = S2.median();

// Agregamos al mapa una composicion RGB
Map.addLayer(S2,{min:0,max:2000,bands: ["B4","B3","B2"]},"S2 RGB");

// Agregamos al mapa una composicion VNIR
Map.addLayer(S2,{min:0,max:6000,bands: ["B8","B4","B3"]},"S2 NRG");

// Agregamos al mapa una composicion SWIR
Map.addLayer(S2,{min:0,max:6000,bands: ["B11","B8","B4"]},"S2 SNR");

// Agregamos al mapa una composicion Red Edge
Map.addLayer(S2,{min:0,max:6000,bands: ["B7","B6","B5"]},"S2 RED EDGE");


/*

PARTE 2: PROCESAMIENTO RASTER
=============================

Conocimientos a adquirir:

- Crear geometrias
- Matematicas de bandas
- Convoluciones
- Opciones de visualizacion intermedias

*/

// Creamos una geometria
var IBB = ee.Geometry.Point([-90.95321, -0.94467]);

// Accedemos a la coleccion de Sentinel-1 GRD
var S1 = ee.ImageCollection("COPERNICUS/S1_GRD")
  .filterBounds(IBB) // Filtramos por vectores
  .filterDate("2020-01-01","2021-01-01") // Filtramos por fechas
  .filter("orbitProperties_pass == 'DESCENDING'") // Filtramos por metadatos
  .filter("instrumentMode == 'IW'"); // Filtramos por metadatos

// Imprimimos en consola los items filtrados
print("Sentinel-1 GRD:",S1);

// Reducimos la coleccion a la primera imagen
var S1 = S1.first();

// Calculamos el ratio VV/VH, lo renombramos y lo agregamos como nueva banda
var S1 = S1.addBands(S1.select("VV").divide(S1.select("VH")).rename("RATIO"));

// Definimos opciones de visualizacion por cada banda
var viz = {
  min: [-30,-30,0.3],
  max: [-5,-5,0.8],
  bands: ["VV","VH","RATIO"]
};

// Centramos el mapa con un zoom especifico
Map.centerObject(IBB,8);

// Agregamos la imagen al mapa
Map.addLayer(S1,viz,"S1 (VV,VH,VV/VH)");

// Reducimos el ruido con un filtro de mediana
var S1_median = S1.focalMedian();

// Agregamos la imagen al mapa
Map.addLayer(S1_median,viz,"S1 (VV,VH,VV/VH) MEDIAN FILTER");

// Reducimos el ruido con un filtro gaussiano
var S1_gauss = S1.convolve(ee.Kernel.gaussian(1.5));

// Agregamos la imagen al mapa
Map.addLayer(S1_gauss,viz,"S1 (VV,VH,VV/VH) GAUSSIAN FILTER");


/*

PARTE 3: PROCESAMIENTO RASTER + VECTORIAL
=========================================

Conocimientos a adquirir:

- Crear features
- Geoprocesos vectoriales
- Requerir modulos
- Usar funciones de terceros
- Paletas de colores
- Crear funciones
- Mapear sobre una coleccion
- Crear graficos

*/

// Importamos un modulo de un tercero: snazzy
var snazzy = require("users/aazuspan/snazzy:styles");

// Añadimos un nuevo estilo de mapa de Snazzy
snazzy.addStyle("https://snazzymaps.com/style/235815/retro", "Retro");
snazzy.addStyle("https://snazzymaps.com/style/6376/masik-www", "Masik");
snazzy.addStyle("https://snazzymaps.com/style/126378/vintage-old-golden-brown", "Vintage");

// Creamos una coleccion de vectores con buffers a partir de puntos
var pivots = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([44.930303, 19.907245]).buffer(500),{pivot: 1}),
  ee.Feature(ee.Geometry.Point([44.921185, 19.909337]).buffer(450),{pivot: 2})
]);

// Imprimimos en consola la coleccion
print("Pivotes:",pivots);

// Centramos el mapa en la coleccion
Map.centerObject(pivots);

// Agregamos la coleccion al mapa
Map.addLayer(pivots,{},"Pivots");

// Requerimos un modulo de un tercero: spectral
var spectral = require("users/dmlmont/spectral:spectral");

// Imprimimos los indices disponibles en el modulo
print("Spectral Indices",spectral.indices);

// Accedemos a la coleccion de Sentinel-2 L2A
var S2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(pivots); // Filtramos por vectores

// Escalamos la primera imagen de la coleccion
var S2_scaled = spectral.scale(S2.first(),"COPERNICUS/S2_SR_HARMONIZED"); 

// Definimos los parametros para calcular el NDVI
var params = {
  N: S2_scaled.select("B8"),
  R: S2_scaled.select("B4")
};

// Calculamos el NDVI
var S2_NDVI = spectral.computeIndex(S2_scaled,"NDVI",params);

// Imprimimos la image en consola
print("Imagen Sentinel-2 con NDVI:",S2_NDVI);

// Requerimos un modulo de un tercero: ee-palettes
var palettes = require('users/gena/packages:palettes');

// Usamos la paleta de colores viridis
var Speed = palettes.cmocean.Speed[7];

// Agregamos la image al mapa
Map.addLayer(S2_NDVI,{min:0,max:1,bands:"NDVI",palette:Speed},"S2 NDVI");

// Creamos una funcion para mapear la coleccion
function addIndices(img) {
  
  // Escalamos la imagen
  img = spectral.scale(img,"COPERNICUS/S2_SR_HARMONIZED");
  
  // Definimos los parametros para cada imagen
  var parameters = {
    "N": img.select("B8"),
    "R": img.select("B4"),
    "RE1": img.select("B5"),
    "N2": img.select("B8A"),
    "L": 0.5
  };
  
  // Calculamos multiples indices
  return spectral.computeIndex(img,["NDVI","CIRE","SAVI"],parameters);
  
}

// Mapeamos la funcion sobre la coleccion de imagenes
var S2 = S2.map(addIndices);

// Creamos una funcion para generar un grafico de series de tiempo por indice
function indexSeries(index) {
  
  // Creat una serie de tiempo por cada region en la coleccion de vectores
  return ui.Chart.image.seriesByRegion({
    imageCollection: S2, // Coleccion de imagenes
    regions: pivots, // Coleccion de vectores
    reducer: ee.Reducer.median(), // Reductor a usar
    band: index, // Banda a usar (Eje y)
    scale: 10, // Resolucion a usar
    xProperty: "system:time_start", // Fecha de captura (Eje x)
    seriesProperty: "pivot" // Nombre de la propiedad para identificar vectores
  });
  
}

// Mostramos en consola los graficos
print("NDVI Series:",indexSeries("NDVI"));
print("CIRE Series:",indexSeries("CIRE"));
print("SAVI Series:",indexSeries("SAVI"));