// ********************************************************************************
// LINK A ESTE SCRIPT:
// https://code.earthengine.google.com/f45316f088ddb6d80dcbcbf97f3ca675
// ********************************************************************************

// ********************************************************************************
// OPERACIONES CON IMÁGENES
// ********************************************************************************
// Existen funciones para realizar operaciones matemáticas con las imágenes
// ********************************************************************************

// Traemos un shape
var shape = ee.FeatureCollection('path/SHP');

// Opciones de visualización RGB
var s2_RGB = {
  bands: ["B4","B3","B2"],
  min: 0,
  max: 3000
};

// Imagen 2018 (Febrero 26)
var s2_2018 = ee.Image("COPERNICUS/S2/20180226T153609_20180226T153610_T18NUJ");
Map.addLayer(s2_2018,s2_RGB,"2018");
Map.centerObject(s2_2018);

// Imagen 2019 (Enero 2)
var s2_2019 = ee.Image("COPERNICUS/S2/20190102T153619_20190102T153616_T18NUJ");
Map.addLayer(s2_2019,s2_RGB,"2019");

// ********************************************************************************
// ÍNDICES DE VEGETACIÓN
// ********************************************************************************
// Los Índices de Vegetación (IV) se calculan sobre imágenes
// Hay varias maneras de calcularlos
// Calculadora Raster: usar funciones .add("Imagen"), .subtract("Imagen"), .divide("Imagen")...
// Expresiones: función .expression("Expresión matemática","Diccionario de expresión")
// Funciones predeterminadas: .normalizedDifference(["Primera Banda","Segunda Banda"])
// ********************************************************************************

// Opciones de visualización NDVI
var s2_NDVI = {
  min: 0,
  max: 1,
  palette: ["#C63819","#31C619","#00B6FF","#F000FF"]
};

// NDVI de la imagen 2018 usando calculadora raster
var rojo = s2_2018.select("B4");
var nir = s2_2018.select("B8");
var ndvi_calc = nir.subtract(rojo).divide(nir.add(rojo));

// NDVI de la imagen 2018 usando expresiones
var ndvi_exp = s2_2018.expression("(NIR - Red) / (NIR + Red)",{
  "NIR": s2_2018.select("B8"),
  "Red": s2_2018.select("B4")
});

// NDVI de la imagen 2018 usando funciones predeterminadas
var ndvi_2018 = s2_2018.normalizedDifference(["B8","B4"]);

// NDVI de la imagen 2019 usando funciones predeterminadas
var ndvi_2019 = s2_2019.normalizedDifference(["B8","B4"]);

// Mostrar en el mapa
Map.addLayer(ndvi_2018,s2_NDVI,"NDVI 2018");
Map.addLayer(ndvi_2019,s2_NDVI,"NDVI 2019");

// Diferencia entre ambos NDVI
var ndvi_diff = ndvi_2019.subtract(ndvi_2018);
Map.addLayer(ndvi_diff,s2_NDVI,"Diferencia NDVI");

// ********************************************************************************
// REDUCTORES
// ********************************************************************************
// Los reductores convierten una colección de imágenes a una sola imagen con una estadística
// Se pueden hacer con la imagen completa o por regiones
// Se utilizan las funciones .reducer("Reductor")
// En el "Reductor" se utiliza ee.Reducer."Estadística"()
// ee.Reducer.median()
// ee.Reducer.mean()
// ee.Reducer.max()
// ee.Reducer.min(), etc...
// ********************************************************************************

// Traemos una colección de Sentinel-2 filtrada por fecha, número de órbita, porcentaje de nubosidad y ubicación
var s2 = ee.ImageCollection("COPERNICUS/S2")
  .filterDate("2018-01-01","2018-12-31")
  .filter(ee.Filter.eq('SENSING_ORBIT_NUMBER',68))
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20))
  .filterBounds(shape);

// Reducimos la colección a una imagen correspondiente a la media y otra a la mediana
// Cada banda es reducida a estas estadísticas
var mean = s2.reduce(ee.Reducer.mean());
var median = s2.reduce(ee.Reducer.median());

// Se imprimen los nuevos nombres de las bandas
// Estos cambian y las opciones de visualización hay que cambiarlas
print("NUEVOS NOMBRES BANDAS MEDIA",mean.bandNames());
print("NUEVOS NOMBRES BANDAS MEDIANA",median.bandNames());

// Opciones de visualización RGB para la imagen reducida en media
var s2_RGB_mean = {
  bands: ["B4_mean","B3_mean","B2_mean"],
  min: 0,
  max: 3000
};

// Opciones de visualización RGB para la imagen reducida en mediana
var s2_RGB_median = {
  bands: ["B4_median","B3_median","B2_median"],
  min: 0,
  max: 3000
};

// Se agregan al mapa
Map.addLayer(mean,s2_RGB_mean,"Media 2018");
Map.addLayer(median,s2_RGB_median,"Median 2018");

// ********************************************************************************
// REDUCTORES POR REGION
// ********************************************************************************
// Funciona como Estadísticas Zonales
// Se realizan sobre una imagen y un shape base
// Se utilizan las funciones "Imagen".reduceRegions("Opciones de reducción")
// En las opciones de reducción se utiliza la variable "collection", la cual es el shape
// La variable "reducer", que es el reductor:
// ee.Reducer.median()
// ee.Reducer.mean()
// ee.Reducer.max()
// ee.Reducer.min(), etc...
// Y la variable "scale", que es el tamaño de pixel del cual se reduce
// ********************************************************************************

// Se reduce a la media la imagen NDVI del 2019 en las geometrías del shape "shape"
var mean_regions = ndvi_2019.reduceRegions({
  collection: shape,
  reducer: ee.Reducer.mean(),
  scale: 10,
});

// Se imprime en la consola el nuevo shape "mean_regions"
// Se agregan nuevas columnas (atributos) al shape con el valor medio
print("NUEVO SHAPE REDUCIDO",mean_regions);
